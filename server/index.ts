import 'dotenv/config';
import express, { type Response, type NextFunction } from 'express';
import cors from 'cors';
import { askEcoGuide, type ChatMessage } from './ai';
import { supabaseAdmin } from './db';
import { AuthenticatedRequest, requireAuth } from './authMiddleware';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 20;
const MAX_ARRAY_ITEMS = 20;

const REWARD_AMOUNTS = {
  lesson: { maxXp: 100, maxCoins: 20 },
  quiz: { maxXp: 100, maxCoins: 20 },
  mission: { maxXp: 200, maxCoins: 100 },
} as const;

const PROFILE_TOPICS = [
  'Biodiversity',
  'Water',
  'Waste',
  'Energy',
  'Soil',
  'Climate & Pollution',
] as const;

/* -------------------------------------------------------------------------- */
/* CORS                                                                       */
/* -------------------------------------------------------------------------- */

const configuredOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const developmentOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

function isAllowedVercelOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);

    return (
      url.protocol === 'https:' &&
      url.hostname.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
}

function isAllowedOrigin(origin: string): boolean {
  const normalizedOrigin = origin.replace(/\/$/, '');

  // Explicitly configured production/custom domains
  if (configuredOrigins.includes(normalizedOrigin)) {
    return true;
  }

  // Local development
  if (
    process.env.NODE_ENV !== 'production' &&
    developmentOrigins.includes(normalizedOrigin)
  ) {
    return true;
  }

  // Vercel deployment / preview domains
  if (isAllowedVercelOrigin(normalizedOrigin)) {
    return true;
  }

  return false;
}

if (
  process.env.NODE_ENV === 'production' &&
  configuredOrigins.length === 0
) {
  console.warn(
    'CORS_ORIGINS is not configured. Vercel domains are allowed automatically; custom domains must be added to CORS_ORIGINS.'
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin header
      // are allowed (health checks, server-to-server requests, etc.)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      console.error('Blocked CORS origin:', origin);

      callback(new Error('Origin is not allowed.'));
    },
  })
);

app.use(express.json({ limit: '32kb' }));

/* -------------------------------------------------------------------------- */
/* AI RATE LIMITING                                                           */
/* -------------------------------------------------------------------------- */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const aiRateLimits = new Map<string, RateLimitEntry>();

const AI_RATE_LIMIT = 20;
const AI_RATE_WINDOW_MS = 60_000;

function aiRateLimit(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const key = req.user?.uid || req.ip || 'unknown';

  const now = Date.now();

  const entry = aiRateLimits.get(key);

  if (!entry || entry.resetAt <= now) {
    aiRateLimits.set(key, {
      count: 1,
      resetAt: now + AI_RATE_WINDOW_MS,
    });

    next();
    return;
  }

  if (entry.count >= AI_RATE_LIMIT) {
    res.setHeader(
      'Retry-After',
      Math.ceil((entry.resetAt - now) / 1000)
    );

    res.status(429).json({
      success: false,
      error:
        'Too many AI requests. Please try again shortly.',
    });

    return;
  }

  entry.count += 1;

  next();
}

/* -------------------------------------------------------------------------- */
/* VALIDATION HELPERS                                                         */
/* -------------------------------------------------------------------------- */

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= MAX_ARRAY_ITEMS &&
    value.every(
      (item) =>
        typeof item === 'string' &&
        item.length <= 120
    )
  );
}

function isNumberInRange(
  value: unknown,
  min: number,
  max: number
): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  );
}

function isTopicScores(
  value: unknown
): value is Record<string, number> {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return false;
  }

  const scores =
    value as Record<string, unknown>;

  return Object.keys(scores).every(
    (topic) =>
      PROFILE_TOPICS.includes(
        topic as typeof PROFILE_TOPICS[number]
      ) &&
      isNumberInRange(
        scores[topic],
        0,
        100
      )
  );
}

function validateChatInput(
  body: unknown
): {
  message: string;
  history: ChatMessage[];
} | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const input = body as {
    message?: unknown;
    history?: unknown;
  };

  if (
    typeof input.message !== 'string' ||
    input.message.trim().length === 0 ||
    input.message.length > MAX_MESSAGE_LENGTH
  ) {
    return null;
  }

  const history = input.history ?? [];

  if (
    !Array.isArray(history) ||
    history.length > MAX_HISTORY_ITEMS
  ) {
    return null;
  }

  if (
    !history.every((item) => {
      if (
        !item ||
        typeof item !== 'object'
      ) {
        return false;
      }

      const message = item as {
        role?: unknown;
        content?: unknown;
      };

      return (
        (message.role === 'user' ||
          message.role === 'assistant') &&
        typeof message.content === 'string' &&
        message.content.length <=
          MAX_MESSAGE_LENGTH
      );
    })
  ) {
    return null;
  }

  return {
    message: input.message.trim(),
    history: history as ChatMessage[],
  };
}

/* -------------------------------------------------------------------------- */
/* HEALTH                                                                     */
/* -------------------------------------------------------------------------- */

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'EcoSpark AI backend is running.',
  });
});

/* -------------------------------------------------------------------------- */
/* PROFILE - GET                                                              */
/* -------------------------------------------------------------------------- */

app.get(
  '/api/profile',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq(
          'firebase_uid',
          req.user!.uid
        )
        .maybeSingle();

      if (error) {
        console.error(
          'Profile fetch failed:',
          error.message
        );

        return res.status(500).json({
          success: false,
          error: 'Unable to fetch profile.',
        });
      }

      return res.json({
        success: true,
        profile: data,
      });
    } catch (error) {
      console.error(
        'Profile API failed:',
        error instanceof Error
          ? error.message
          : 'unknown error'
      );

      return res.status(500).json({
        success: false,
        error: 'Unable to fetch profile.',
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/* PROFILE - UPDATE                                                           */
/* -------------------------------------------------------------------------- */

app.put(
  '/api/profile',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const body =
        req.body as Record<string, unknown>;

      /*
       * XP, coins, level and garden level
       * are controlled only by the reward API.
       */
      const protectedFields = [
        'xp',
        'eco_coins',
        'level',
        'garden_level',
      ];

      if (
        protectedFields.some(
          (field) => field in body
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Progression and currency are server-authoritative.',
        });
      }

      const allowedFields = [
        'full_name',
        'eco_level',
        'eco_score',
        'interests',
        'goals',
        'topic_scores',
        'strengths',
        'knowledge_gaps',
        'assessment_completed',
      ];

      if (
        Object.keys(body).some(
          (field) =>
            !allowedFields.includes(field)
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Unsupported profile field.',
        });
      }

      if (
        body.full_name !== undefined &&
        (typeof body.full_name !== 'string' ||
          body.full_name.length > 120)
      ) {
        return res.status(400).json({
          success: false,
          error: 'Invalid name.',
        });
      }

      if (
        body.eco_level !== undefined &&
        (typeof body.eco_level !== 'string' ||
          body.eco_level.length > 80)
      ) {
        return res.status(400).json({
          success: false,
          error: 'Invalid eco level.',
        });
      }

      if (
        body.eco_score !== undefined &&
        !isNumberInRange(
          body.eco_score,
          0,
          100
        )
      ) {
        return res.status(400).json({
          success: false,
          error: 'Invalid eco score.',
        });
      }

      for (const field of [
        'interests',
        'goals',
        'strengths',
        'knowledge_gaps',
      ]) {
        if (
          body[field] !== undefined &&
          !isStringArray(body[field])
        ) {
          return res.status(400).json({
            success: false,
            error: `Invalid ${field}.`,
          });
        }
      }

      if (
        body.assessment_completed !==
          undefined &&
        typeof body.assessment_completed !==
          'boolean'
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Invalid assessment status.',
        });
      }

      if (
        body.topic_scores !== undefined &&
        !isTopicScores(
          body.topic_scores
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Invalid topic scores.',
        });
      }

      const updates: Record<
        string,
        unknown
      > = {
        updated_at:
          new Date().toISOString(),
        email:
          req.user!.email ?? null,
      };

      for (const field of allowedFields) {
        if (field in body) {
          updates[field] = body[field];
        }
      }

      const {
        data: existingProfile,
        error: findError,
      } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq(
          'firebase_uid',
          req.user!.uid
        )
        .maybeSingle();

      if (findError) {
        console.error(
          'Profile lookup failed:',
          findError.message
        );

        return res.status(500).json({
          success: false,
          error:
            'Unable to save profile.',
        });
      }

      const query = existingProfile
        ? supabaseAdmin
            .from('profiles')
            .update(updates)
            .eq(
              'id',
              existingProfile.id
            )
        : supabaseAdmin
            .from('profiles')
            .insert({
              firebase_uid:
                req.user!.uid,
              role: 'student',
              xp: 0,
              eco_coins: 0,
              ...updates,
            });

      const {
        data,
        error,
      } = await query
        .select('*')
        .single();

      if (error) {
        console.error(
          'Profile save failed:',
          error.message
        );

        return res.status(500).json({
          success: false,
          error:
            'Unable to save profile.',
        });
      }

      return res.json({
        success: true,
        profile: data,
      });
    } catch (error) {
      console.error(
        'Profile update failed:',
        error instanceof Error
          ? error.message
          : 'unknown error'
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to save profile.',
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/* RESET PROGRESS                                                             */
/* -------------------------------------------------------------------------- */

app.post(
  '/api/profile/reset-progress',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from('profiles')
      .update({
        xp: 0,
        eco_coins: 0,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        'firebase_uid',
        req.user!.uid
      )
      .select('*')
      .maybeSingle();

    if (error) {
      console.error(
        'Progress reset failed:',
        error.message
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to reset progress.',
      });
    }

    return res.json({
      success: true,
      profile: data,
    });
  }
);

/* -------------------------------------------------------------------------- */
/* REWARD                                                                     */
/* -------------------------------------------------------------------------- */

app.post(
  '/api/profile/reward',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    const body = req.body as {
      activity?: unknown;
      xp?: unknown;
      coins?: unknown;
    };

    const activity = body.activity;

    const limits =
      activity === 'lesson' ||
      activity === 'quiz' ||
      activity === 'mission'
        ? REWARD_AMOUNTS[activity]
        : null;

    if (
      !limits ||
      !isNumberInRange(
        body.xp,
        0,
        limits.maxXp
      ) ||
      !isNumberInRange(
        body.coins,
        0,
        limits.maxCoins
      ) ||
      (body.xp === 0 &&
        body.coins === 0)
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid activity reward.',
      });
    }

    const {
      data: current,
      error: findError,
    } = await supabaseAdmin
      .from('profiles')
      .select('xp, eco_coins')
      .eq(
        'firebase_uid',
        req.user!.uid
      )
      .maybeSingle();

    if (findError || !current) {
      return res.status(404).json({
        success: false,
        error:
          'Profile not found.',
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from('profiles')
      .update({
        xp:
          Math.floor(
            Number(current.xp) || 0
          ) +
          Math.floor(
            body.xp as number
          ),

        eco_coins:
          Math.floor(
            Number(
              current.eco_coins
            ) || 0
          ) +
          Math.floor(
            body.coins as number
          ),

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        'firebase_uid',
        req.user!.uid
      )
      .select('*')
      .single();

    if (error) {
      console.error(
        'Reward update failed:',
        error.message
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to save reward.',
      });
    }

    return res.json({
      success: true,
      profile: data,
    });
  }
);

/* -------------------------------------------------------------------------- */
/* AI ECO GUIDE                                                               */
/* -------------------------------------------------------------------------- */

app.post(
  '/api/ai/chat',
  requireAuth,
  aiRateLimit,
  async (req, res) => {
    const input =
      validateChatInput(req.body);

    if (!input) {
      return res.status(400).json({
        success: false,
        error:
          'Message must be 1-2000 characters and history must contain at most 20 valid messages.',
      });
    }

    try {
      const reply =
        await askEcoGuide(
          input.message,
          input.history
        );

      return res.json({
        success: true,
        reply,
      });
    } catch (error) {
      console.error(
        'AI request failed:',
        error instanceof Error
          ? error.message
          : 'unknown error'
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to generate an AI response.',
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/* SERVER                                                                     */
/* -------------------------------------------------------------------------- */

app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `EcoSpark AI server running on port ${PORT}`
    );
  }
);