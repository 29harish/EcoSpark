import 'dotenv/config';

import express, {
  type Response,
  type NextFunction,
} from 'express';

import cors from 'cors';

import { askEcoGuide, type ChatMessage } from './ai';

import { supabaseAdmin } from './db';

import {
  AuthenticatedRequest,
  requireAuth,
} from './authMiddleware';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 20;
const MAX_ARRAY_ITEMS = 20;
const MAX_PROOF_LENGTH = 200_000;

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
/* SECURE REWARD CATALOG                                                      */
/* -------------------------------------------------------------------------- */

const REWARD_CATALOG = {
  r1: {
    title: 'Eco Hero Badge',
    cost: 100,
  },
  r2: {
    title: 'Custom Avatar Frame',
    cost: 250,
  },
  r3: {
    title: 'Garden Theme: Sunset',
    cost: 300,
  },
  r4: {
    title: 'Reusable Water Bottle',
    cost: 500,
  },
  r5: {
    title: 'Seed Kit',
    cost: 750,
  },
  r6: {
    title: 'Eco T-Shirt',
    cost: 1000,
  },
  r7: {
    title: 'Tree Planted in Your Name',
    cost: 1500,
  },
  r8: {
    title: 'Golden Garden',
    cost: 2000,
  },
} as const;

type RewardId = keyof typeof REWARD_CATALOG;

/* -------------------------------------------------------------------------- */
/* CORS                                                                      */
/* -------------------------------------------------------------------------- */

const configuredOrigins = (
  process.env.CORS_ORIGINS || ''
)
  .split(',')
  .map((origin) =>
    origin.trim().replace(/\/$/, ''),
  )
  .filter(Boolean);

const developmentOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

function isAllowedVercelOrigin(
  origin: string,
): boolean {
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

function isAllowedOrigin(
  origin: string,
): boolean {
  const normalizedOrigin = origin.replace(
    /\/$/,
    '',
  );

  if (
    configuredOrigins.includes(
      normalizedOrigin,
    )
  ) {
    return true;
  }

  if (
    developmentOrigins.includes(
      normalizedOrigin,
    )
  ) {
    return true;
  }

  if (
    isAllowedVercelOrigin(
      normalizedOrigin,
    )
  ) {
    return true;
  }

  return false;
}

if (
  process.env.NODE_ENV === 'production' &&
  configuredOrigins.length === 0
) {
  console.warn(
    'CORS_ORIGINS is not configured. Vercel domains are allowed automatically; custom domains must be added to CORS_ORIGINS.',
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      console.error(
        'Blocked CORS origin:',
        origin,
      );

      callback(
        new Error('Origin is not allowed.'),
      );
    },
  }),
);

app.use(
  express.json({
    limit: '256kb',
  }),
);

/* -------------------------------------------------------------------------- */
/* AI RATE LIMITING                                                           */
/* -------------------------------------------------------------------------- */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const aiRateLimits =
  new Map<string, RateLimitEntry>();

const AI_RATE_LIMIT = 20;
const AI_RATE_WINDOW_MS = 60_000;

function aiRateLimit(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const key =
    req.user?.uid ||
    req.ip ||
    'unknown';

  const now = Date.now();

  const entry = aiRateLimits.get(key);

  if (
    !entry ||
    entry.resetAt <= now
  ) {
    aiRateLimits.set(key, {
      count: 1,
      resetAt:
        now + AI_RATE_WINDOW_MS,
    });

    next();
    return;
  }

  if (
    entry.count >= AI_RATE_LIMIT
  ) {
    res.setHeader(
      'Retry-After',
      Math.ceil(
        (entry.resetAt - now) / 1000,
      ),
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

function isStringArray(
  value: unknown,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= MAX_ARRAY_ITEMS &&
    value.every(
      (item) =>
        typeof item === 'string' &&
        item.length <= 120,
    )
  );
}

function isNumberInRange(
  value: unknown,
  min: number,
  max: number,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  );
}

function isTopicScores(
  value: unknown,
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
        topic as (typeof PROFILE_TOPICS)[number],
      ) &&
      isNumberInRange(
        scores[topic],
        0,
        100,
      ),
  );
}

function validateChatInput(
  body: unknown,
): {
  message: string;
  history: ChatMessage[];
} | null {
  if (
    !body ||
    typeof body !== 'object'
  ) {
    return null;
  }

  const input = body as {
    message?: unknown;
    history?: unknown;
  };

  if (
    typeof input.message !== 'string' ||
    input.message.trim().length === 0 ||
    input.message.length >
      MAX_MESSAGE_LENGTH
  ) {
    return null;
  }

  const history =
    input.history ?? [];

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
        (
          message.role === 'user' ||
          message.role === 'assistant'
        ) &&
        typeof message.content ===
          'string' &&
        message.content.length <=
          MAX_MESSAGE_LENGTH
      );
    })
  ) {
    return null;
  }

  return {
    message: input.message.trim(),
    history:
      history as ChatMessage[],
  };
}

/* -------------------------------------------------------------------------- */
/* HEALTH                                                                     */
/* -------------------------------------------------------------------------- */

app.get(
  '/api/health',
  (_req, res) => {
    res.json({
      success: true,
      message:
        'EcoSpark AI backend is running.',
    });
  },
);

/* -------------------------------------------------------------------------- */
/* PROFILE - GET                                                              */
/* -------------------------------------------------------------------------- */

app.get(
  '/api/profile',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
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
          req.user!.uid,
        )
        .maybeSingle();

      if (error) {
        console.error(
          'Profile fetch failed:',
          error.message,
        );

        return res.status(500).json({
          success: false,
          error:
            'Unable to fetch profile.',
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
          : 'unknown error',
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to fetch profile.',
      });
    }
  },
);

/* -------------------------------------------------------------------------- */
/* PROFILE - UPDATE                                                           */
/* -------------------------------------------------------------------------- */

app.put(
  '/api/profile',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    try {
      const body =
        req.body as Record<
          string,
          unknown
        >;

      const protectedFields = [
        'xp',
        'eco_coins',
        'level',
        'garden_level',
      ];

      if (
        protectedFields.some(
          (field) => field in body,
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
            !allowedFields.includes(
              field,
            ),
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Unsupported profile field.',
        });
      }

      if (
        body.full_name !==
          undefined &&
        (
          typeof body.full_name !==
            'string' ||
          body.full_name.length > 120
        )
      ) {
        return res.status(400).json({
          success: false,
          error: 'Invalid name.',
        });
      }

      if (
        body.eco_level !==
          undefined &&
        (
          typeof body.eco_level !==
            'string' ||
          body.eco_level.length > 80
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Invalid eco level.',
        });
      }

      if (
        body.eco_score !==
          undefined &&
        !isNumberInRange(
          body.eco_score,
          0,
          100,
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Invalid eco score.',
        });
      }

      for (const field of [
        'interests',
        'goals',
        'strengths',
        'knowledge_gaps',
      ]) {
        if (
          body[field] !==
            undefined &&
          !isStringArray(
            body[field],
          )
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
        body.topic_scores !==
          undefined &&
        !isTopicScores(
          body.topic_scores,
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
          updates[field] =
            body[field];
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
          req.user!.uid,
        )
        .maybeSingle();

      if (findError) {
        console.error(
          'Profile lookup failed:',
          findError.message,
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
              existingProfile.id,
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
          error.message,
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
          : 'unknown error',
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to save profile.',
      });
    }
  },
);

/* -------------------------------------------------------------------------- */
/* RESET PROGRESS                                                             */
/* -------------------------------------------------------------------------- */

app.post(
  '/api/profile/reset-progress',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
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
        req.user!.uid,
      )
      .select('*')
      .maybeSingle();

    if (error) {
      console.error(
        'Progress reset failed:',
        error.message,
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
  },
);

/* -------------------------------------------------------------------------- */
/* REWARD - EARN                                                              */
/* -------------------------------------------------------------------------- */

app.post(
  '/api/profile/reward',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    const body =
      req.body as {
        activity?: unknown;
        xp?: unknown;
        coins?: unknown;
      };

    const activity =
      body.activity;

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
        limits.maxXp,
      ) ||
      !isNumberInRange(
        body.coins,
        0,
        limits.maxCoins,
      ) ||
      (
        body.xp === 0 &&
        body.coins === 0
      )
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
      .select(
        'xp, eco_coins',
      )
      .eq(
        'firebase_uid',
        req.user!.uid,
      )
      .maybeSingle();

    if (
      findError ||
      !current
    ) {
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
            Number(current.xp) || 0,
          ) +
          Math.floor(
            body.xp as number,
          ),

        eco_coins:
          Math.floor(
            Number(
              current.eco_coins,
            ) || 0,
          ) +
          Math.floor(
            body.coins as number,
          ),

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        'firebase_uid',
        req.user!.uid,
      )
      .select('*')
      .single();

    if (error) {
      console.error(
        'Reward update failed:',
        error.message,
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to save reward.',
      });
    }

    const today =
      new Date()
        .toISOString()
        .slice(0, 10);

    const {
      data: activityProgress,
    } = await supabaseAdmin
      .from('user_progress')
      .select(
        'lessons, missions, streak, last_activity_date',
      )
      .eq(
        'firebase_uid',
        req.user!.uid,
      )
      .maybeSingle();

    const previousDate =
      activityProgress?.last_activity_date;

    const yesterday =
      new Date();

    yesterday.setUTCDate(
      yesterday.getUTCDate() - 1,
    );

    const yesterdayValue =
      yesterday
        .toISOString()
        .slice(0, 10);

    const nextStreak =
      previousDate === today
        ? Number(
            activityProgress?.streak,
          ) || 0
        : previousDate ===
            yesterdayValue
          ? (
              Number(
                activityProgress?.streak,
              ) || 0
            ) + 1
          : 1;

    const {
      error: activityError,
    } = await supabaseAdmin
      .from('user_progress')
      .upsert(
        {
          firebase_uid:
            req.user!.uid,

          lessons:
            activityProgress?.lessons ??
            [],

          missions:
            activityProgress?.missions ??
            [],

          streak:
            nextStreak,

          last_activity_date:
            today,

          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            'firebase_uid',
        },
      );

    if (activityError) {
      console.error(
        'Activity progress update failed:',
        activityError.message,
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to save activity progress.',
      });
    }

    return res.json({
      success: true,
      profile: data,
    });
  },
);

/* -------------------------------------------------------------------------- */
/* REWARDS - SECURE REDEEM                                                    */
/* -------------------------------------------------------------------------- */

app.post(
  '/api/rewards/redeem',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    const body =
      req.body as {
        rewardId?: unknown;
      };

    /*
     * IMPORTANT:
     *
     * The frontend is allowed to send ONLY rewardId.
     *
     * We intentionally DO NOT accept:
     * - title
     * - cost
     * - coins
     *
     * The backend determines those values from
     * REWARD_CATALOG.
     */

    if (
      typeof body.rewardId !==
      'string'
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid reward ID.',
      });
    }

    const rewardId =
      body.rewardId as RewardId;

    if (
      !Object.prototype.hasOwnProperty.call(
        REWARD_CATALOG,
        rewardId,
      )
    ) {
      return res.status(404).json({
        success: false,
        error:
          'Reward not found.',
      });
    }

    const reward =
      REWARD_CATALOG[rewardId];

    try {
      /*
       * The Supabase RPC performs:
       *
       * 1. Lock profile row
       * 2. Check profile exists
       * 3. Check duplicate redemption
       * 4. Check coin balance
       * 5. Deduct coins
       * 6. Insert redemption record
       *
       * All of this happens atomically.
       */

      const {
        data: redemption,
        error: redemptionError,
      } = await supabaseAdmin.rpc(
        'redeem_reward',
        {
          p_firebase_uid:
            req.user!.uid,

          p_reward_id:
            rewardId,

          p_reward_title:
            reward.title,

          p_coins_spent:
            reward.cost,
        },
      );

      if (redemptionError) {
        const message =
          redemptionError.message ||
          '';

        console.error(
          'Reward redemption RPC failed:',
          message,
        );

        if (
          message.includes(
            'PROFILE_NOT_FOUND',
          )
        ) {
          return res.status(404).json({
            success: false,
            error:
              'Profile not found.',
          });
        }

        if (
          message.includes(
            'ALREADY_REDEEMED',
          )
        ) {
          return res.status(409).json({
            success: false,
            error:
              'You have already redeemed this reward.',
          });
        }

        if (
          message.includes(
            'INSUFFICIENT_COINS',
          )
        ) {
          return res.status(400).json({
            success: false,
            error:
              'Not enough Eco Coins.',
          });
        }

        return res.status(500).json({
          success: false,
          error:
            'Unable to redeem reward.',
        });
      }

      /*
       * Fetch the complete updated profile
       * so the frontend receives the authoritative
       * balance and all other profile fields.
       */

      const {
        data: profile,
        error: profileError,
      } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq(
          'firebase_uid',
          req.user!.uid,
        )
        .single();

      if (
        profileError ||
        !profile
      ) {
        console.error(
          'Updated profile fetch after redemption failed:',
          profileError?.message,
        );

        return res.status(500).json({
          success: false,
          error:
            'Reward was redeemed, but the updated profile could not be loaded.',
        });
      }

      return res.status(200).json({
        success: true,

        redemption: {
          id:
            redemption?.redemption_id ??
            null,

          rewardId,

          rewardTitle:
            reward.title,

          coinsSpent:
            reward.cost,

          ecoCoins:
            Number(
              redemption?.eco_coins,
            ) ||
            Number(
              profile.eco_coins,
            ) ||
            0,
        },

        profile,
      });
    } catch (error) {
      console.error(
        'Reward redemption failed:',
        error instanceof Error
          ? error.message
          : 'unknown error',
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to redeem reward.',
      });
    }
  },
);

/* -------------------------------------------------------------------------- */
/* REWARDS - REDEMPTION HISTORY                                               */
/* -------------------------------------------------------------------------- */

app.get(
  '/api/rewards/redemptions',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    try {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from(
          'reward_redemptions',
        )
        .select(
          'id, reward_id, reward_title, coins_spent, status, redeemed_at',
        )
        .eq(
          'firebase_uid',
          req.user!.uid,
        )
        .order(
          'redeemed_at',
          {
            ascending: false,
          },
        );

      if (error) {
        console.error(
          'Reward redemption history fetch failed:',
          error.message,
        );

        return res.status(500).json({
          success: false,
          error:
            'Unable to load redemption history.',
        });
      }

      return res.json({
        success: true,

        redemptions:
          (data ?? []).map(
            (item) => ({
              id: item.id,

              rewardId:
                item.reward_id,

              rewardTitle:
                item.reward_title,

              coinsSpent:
                Number(
                  item.coins_spent,
                ) || 0,

              status:
                item.status,

              redeemedAt:
                item.redeemed_at,
            }),
          ),
      });
    } catch (error) {
      console.error(
        'Redemption history API failed:',
        error instanceof Error
          ? error.message
          : 'unknown error',
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to load redemption history.',
      });
    }
  },
);

/* -------------------------------------------------------------------------- */
/* SPEND ECO COINS                                                            */
/* -------------------------------------------------------------------------- */

app.post(
  '/api/profile/spend-coins',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    const amount = (
      req.body as {
        amount?: unknown;
      }
    ).amount;

    if (
      !isNumberInRange(
        amount,
        1,
        10000,
      ) ||
      !Number.isInteger(amount)
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid coin amount.',
      });
    }

    const {
      data: current,
      error: findError,
    } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq(
        'firebase_uid',
        req.user!.uid,
      )
      .maybeSingle();

    if (
      findError ||
      !current
    ) {
      return res.status(404).json({
        success: false,
        error:
          'Profile not found.',
      });
    }

    const balance =
      Math.floor(
        Number(
          current.eco_coins,
        ) || 0,
      );

    if (
      balance < amount
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Not enough Eco Coins.',
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from('profiles')
      .update({
        eco_coins:
          balance - amount,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        'firebase_uid',
        req.user!.uid,
      )
      .select('*')
      .single();

    if (
      error ||
      !data
    ) {
      return res.status(500).json({
        success: false,
        error:
          'Unable to spend Eco Coins.',
      });
    }

    return res.json({
      success: true,
      profile: data,
    });
  },
);

/* -------------------------------------------------------------------------- */
/* PROGRESS - HELPERS                                                         */
/* -------------------------------------------------------------------------- */

function normalizeProgress(
  row: {
    lessons?: unknown;
    missions?: unknown;
    streak?: unknown;
    last_activity_date?: unknown;
    impact_score?: unknown;
  },
) {
  const lessons =
    Array.isArray(row.lessons)
      ? row.lessons
      : [];

  const missions =
    Array.isArray(row.missions)
      ? row.missions
      : [];

  const streak =
    Math.max(
      0,
      Math.floor(
        Number(row.streak) || 0,
      ),
    );

  return {
    lessons,
    missions,

    streak,

    lastActivityDate:
      typeof row.last_activity_date ===
      'string'
        ? row.last_activity_date
        : null,

    impactScore:
      Number(
        row.impact_score,
      ) || 0,
  };
}

/* -------------------------------------------------------------------------- */
/* PROGRESS - GET                                                             */
/* -------------------------------------------------------------------------- */

app.get(
  '/api/progress',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    const [
      {
        data: progress,
        error: progressError,
      },
      {
        data: profile,
        error: profileError,
      },
    ] = await Promise.all([
      supabaseAdmin
        .from('user_progress')
        .select(
          'lessons, missions, lessons_completed, missions_completed, learning_progress, streak, last_activity_date',
        )
        .eq(
          'firebase_uid',
          req.user!.uid,
        )
        .maybeSingle(),

      supabaseAdmin
        .from('profiles')
        .select(
          'xp, eco_coins, impact_score',
        )
        .eq(
          'firebase_uid',
          req.user!.uid,
        )
        .maybeSingle(),
    ]);

    if (
      progressError ||
      profileError
    ) {
      console.error(
        'Progress fetch failed:',
        progressError?.message ||
          profileError?.message,
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to fetch progress.',
      });
    }

    return res.json({
      success: true,

      progress:
        normalizeProgress({
          ...(progress ?? {}),
          impact_score:
            profile?.impact_score,
        }),
    });
  },
);

/* -------------------------------------------------------------------------- */
/* LEADERBOARD                                                                */
/* -------------------------------------------------------------------------- */

type LeaderboardSort =
  | 'xp'
  | 'impact'
  | 'coins'
  | 'lessons'
  | 'missions';

const leaderboardSortFields: Record<
  LeaderboardSort,
  string
> = {
  xp: 'xp',
  impact: 'impact_score',
  coins: 'eco_coins',
  lessons:
    'lessons_completed',
  missions:
    'missions_completed',
};

app.get(
  '/api/leaderboard',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    const period =
      String(
        req.query.period ||
          'all-time',
      );

    if (
      period !== 'all-time'
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Only all-time rankings are currently available.',
      });
    }

    const requestedSort =
      String(
        req.query.sort || 'xp',
      ) as LeaderboardSort;

    if (
      !Object.prototype.hasOwnProperty.call(
        leaderboardSortFields,
        requestedSort,
      )
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid leaderboard ranking option.',
      });
    }

    const primaryField =
      leaderboardSortFields[
        requestedSort
      ];

    try {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from('profiles')
        .select(
          'firebase_uid, full_name, xp, eco_coins, impact_score, lessons_completed, missions_completed',
        )
        .order(
          primaryField,
          {
            ascending: false,
            nullsFirst: false,
          },
        )
        .order(
          'xp',
          {
            ascending: false,
            nullsFirst: false,
          },
        )
        .order(
          'impact_score',
          {
            ascending: false,
            nullsFirst: false,
          },
        )
        .order(
          'missions_completed',
          {
            ascending: false,
            nullsFirst: false,
          },
        )
        .order(
          'full_name',
          {
            ascending: true,
            nullsFirst: false,
          },
        )
        .limit(50);

      if (error) {
        console.error(
          'Leaderboard fetch failed:',
          error.message,
        );

        return res.status(500).json({
          success: false,
          error:
            'Unable to load the leaderboard.',
        });
      }

      const entries =
        (data ?? []).map(
          (row, index) => ({
            uid:
              row.firebase_uid,

            name:
              typeof row.full_name ===
                'string' &&
              row.full_name.trim()
                ? row.full_name.trim()
                : 'Eco learner',

            avatarUrl:
              null,

            xp:
              Number(row.xp) || 0,

            impactScore:
              Number(
                row.impact_score,
              ) || 0,

            ecoCoins:
              Number(
                row.eco_coins,
              ) || 0,

            lessonsCompleted:
              Number(
                row.lessons_completed,
              ) || 0,

            missionsCompleted:
              Number(
                row.missions_completed,
              ) || 0,

            rank:
              index + 1,

            isCurrentUser:
              row.firebase_uid ===
              req.user!.uid,
          }),
        );

      return res.json({
        success: true,
        sort:
          requestedSort,
        period,
        entries,
      });
    } catch (error) {
      console.error(
        'Leaderboard API failed:',
        error instanceof Error
          ? error.message
          : 'unknown error',
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to load the leaderboard.',
      });
    }
  },
);

/* -------------------------------------------------------------------------- */
/* PROGRESS - UPDATE                                                          */
/* -------------------------------------------------------------------------- */

app.put(
  '/api/progress',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    const body =
      req.body as {
        lessons?: unknown;
        missions?: unknown;
      };

    const validItems = (
      items: unknown,
      type:
        | 'lesson'
        | 'mission',
    ) =>
      Array.isArray(items) &&
      items.length <= 100 &&
      items.every((item) => {
        if (
          !item ||
          typeof item !==
            'object'
        ) {
          return false;
        }

        const value =
          item as Record<
            string,
            unknown
          >;

        if (
          typeof value.id !==
            'string' ||
          !/^[a-z0-9-]{1,64}$/.test(
            value.id,
          ) ||
          typeof value.completed !==
            'boolean'
        ) {
          return false;
        }

        return (
          type === 'lesson' ||
          (
            typeof value.progress ===
              'number' &&
            isNumberInRange(
              value.progress,
              0,
              100,
            )
          )
        );
      });

    if (
      !validItems(
        body.lessons,
        'lesson',
      ) ||
      !validItems(
        body.missions,
        'mission',
      )
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid progress payload.',
      });
    }

    const lessons =
      body.lessons as Array<{
        completed: boolean;
      }>;

    const missions =
      body.missions as Array<{
        completed: boolean;
      }>;

    const lessonsCompleted =
      lessons.filter(
        (lesson) =>
          lesson.completed,
      ).length;

    const missionsCompleted =
      missions.filter(
        (mission) =>
          mission.completed,
      ).length;

    const learningProgress =
      lessons.length > 0
        ? Math.round(
            (
              lessonsCompleted /
              lessons.length
            ) * 100,
          )
        : 0;

    const {
      data,
      error,
    } = await supabaseAdmin
      .from('user_progress')
      .upsert(
        {
          firebase_uid:
            req.user!.uid,

          lessons:
            body.lessons,

          missions:
            body.missions,

          lessons_completed:
            lessonsCompleted,

          missions_completed:
            missionsCompleted,

          learning_progress:
            learningProgress,

          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            'firebase_uid',
        },
      )
      .select(
        'lessons, missions, lessons_completed, missions_completed, learning_progress, streak, last_activity_date',
      )
      .single();

    if (
      error ||
      !data
    ) {
      console.error(
        'Progress save failed:',
        error?.message,
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to save progress.',
      });
    }

    const {
      data: profile,
    } = await supabaseAdmin
      .from('profiles')
      .select(
        'xp, eco_coins, impact_score',
      )
      .eq(
        'firebase_uid',
        req.user!.uid,
      )
      .maybeSingle();

    return res.json({
      success: true,

      progress:
        normalizeProgress(
          {
            ...data,

            impact_score:
              profile?.impact_score,
          },


        ),
    });
  },
);

/* -------------------------------------------------------------------------- */
/* MISSION SUBMISSIONS - GET                                                 */
/* -------------------------------------------------------------------------- */

app.get(
  '/api/missions/submissions',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        'mission_submissions',
      )
      .select(
        'id, mission_id, proof_name, proof_data, note, status, submitted_at, verified_at',
      )
      .eq(
        'firebase_uid',
        req.user!.uid,
      )
      .order(
        'submitted_at',
        {
          ascending: false,
        },
      );

    if (error) {
      console.error(
        'Mission submissions fetch failed:',
        error.message,
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to load mission submissions.',
      });
    }

    return res.json({
      success: true,

      submissions:
        (data ?? []).map(
          (submission) => ({
            id:
              submission.id,

            missionId:
              submission.mission_id,

            proofName:
              submission.proof_name,

            proofData:
              submission.proof_data,

            note:
              submission.note ?? '',

            status:
              submission.status,

            submittedAt:
              submission.submitted_at,

            verifiedAt:
              submission.verified_at ??
              undefined,
          }),
        ),
    });
  },
);

/* -------------------------------------------------------------------------- */
/* MISSION SUBMISSIONS - CREATE                                              */
/* -------------------------------------------------------------------------- */

app.post(
  '/api/missions/submissions',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    const body =
      req.body as {
        missionId?: unknown;
        proofName?: unknown;
        proofData?: unknown;
        note?: unknown;
      };

    if (
      typeof body.missionId !==
        'string' ||
      !/^[a-z0-9-]{1,64}$/.test(
        body.missionId,
      ) ||
      typeof body.proofName !==
        'string' ||
      body.proofName.length < 1 ||
      body.proofName.length > 160 ||
      typeof body.proofData !==
        'string' ||
      !body.proofData.startsWith(
        'data:image/',
      ) ||
      body.proofData.length >
        MAX_PROOF_LENGTH ||
      (
        body.note !==
          undefined &&
        (
          typeof body.note !==
            'string' ||
          body.note.length > 500
        )
      )
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Mission proof is invalid or too large.',
      });
    }

    const {
      data: existingSubmission,
      error: existingSubmissionError,
    } = await supabaseAdmin
      .from('mission_submissions')
      .select('id, status')
      .eq('firebase_uid', req.user!.uid)
      .eq('mission_id', body.missionId)
      .in('status', ['pending', 'verified'])
      .limit(1)
      .maybeSingle();

    if (existingSubmissionError) {
      console.error(
        'Mission submission lookup failed:',
        existingSubmissionError.message,
      );
      return res.status(500).json({
        success: false,
        error: 'Unable to check existing mission submissions.',
      });
    }

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        error:
          existingSubmission.status === 'verified'
            ? 'This mission has already been verified.'
            : 'This mission is already awaiting verification.',
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        'mission_submissions',
      )
      .insert({
        firebase_uid:
          req.user!.uid,

        mission_id:
          body.missionId,

        proof_name:
          body.proofName,

        proof_data:
          body.proofData,

        note:
          body.note ?? '',

        status:
          'pending',
      })
      .select(
        'id, mission_id, proof_name, proof_data, note, status, submitted_at, verified_at',
      )
      .single();

    if (
      error ||
      !data
    ) {
      console.error(
        'Mission submission failed:',
        error?.message,
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to submit mission proof.',
      });
    }

    return res.status(201).json({
      success: true,

      submission: {
        id:
          data.id,

        missionId:
          data.mission_id,

        proofName:
          data.proof_name,

        proofData:
          data.proof_data,

        note:
          data.note ?? '',

        status:
          data.status,

        submittedAt:
          data.submitted_at,

        verifiedAt:
          data.verified_at ??
          undefined,
      },
    });
  },
);

/* -------------------------------------------------------------------------- */
/* MISSION VERIFICATION                                                       */
/* -------------------------------------------------------------------------- */

app.post(
  '/api/missions/submissions/:id/verify',
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    const {
      data: reviewer,
    } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq(
        'firebase_uid',
        req.user!.uid,
      )
      .maybeSingle();

    if (
      !reviewer ||
      ![
        'teacher',
        'admin',
      ].includes(
        String(
          reviewer.role,
        ),
      )
    ) {
      return res.status(403).json({
        success: false,
        error:
          'Only an authorised reviewer can verify missions.',
      });
    }

    const {
      data: submission,
      error:
        submissionError,
    } = await supabaseAdmin
      .from(
        'mission_submissions',
      )
      .select(
        'id, firebase_uid, mission_id, status, rewarded_at',
      )
      .eq(
        'id',
        req.params.id,
      )
      .maybeSingle();

    if (
      submissionError ||
      !submission
    ) {
      return res.status(404).json({
        success: false,
        error:
          'Mission submission not found.',
      });
    }

    if (submission.rewarded_at) {
      return res.status(200).json({
        success: true,
        alreadyRewarded: true,
      });
    }

    if (submission.status !== 'pending') {
      return res.status(409).json({
        success: false,
        error: 'Only pending missions can be verified.',
      });
    }

    const {
      data: student,
      error:
        studentError,
    } = await supabaseAdmin
      .from('profiles')
      .select(
        'xp, eco_coins, impact_score, missions_completed',
      )
      .eq(
        'firebase_uid',
        submission.firebase_uid,
      )
      .single();

    if (
      studentError ||
      !student
    ) {
      return res.status(404).json({
        success: false,
        error:
          'Student profile not found.',
      });
    }

    const missionRewards: Record<
      string,
      {
        xp: number;
        coins: number;
        impact: number;
      }
    > = {
      m1: {
        xp: 30,
        coins: 15,
        impact: 20,
      },

      m2: {
        xp: 25,
        coins: 10,
        impact: 20,
      },

      m3: {
        xp: 20,
        coins: 10,
        impact: 20,
      },

      m4: {
        xp: 50,
        coins: 25,
        impact: 20,
      },

      m5: {
        xp: 40,
        coins: 20,
        impact: 20,
      },

      m6: {
        xp: 35,
        coins: 15,
        impact: 20,
      },
    };

    const reward =
      missionRewards[
        submission.mission_id
      ] ?? {
        xp: 0,
        coins: 0,
        impact: 0,
      };

    const {
      data: updatedProfile,
      error: rewardError,
    } = await supabaseAdmin
      .from('profiles')
      .update({
        xp:
          (
            Number(
              student.xp,
            ) || 0
          ) +
          reward.xp,

        eco_coins:
          (
            Number(
              student.eco_coins,
            ) || 0
          ) +
          reward.coins,

        impact_score:
          (
            Number(
              student.impact_score,
            ) || 0
          ) +
          reward.impact,

        missions_completed:
          (
            Number(
              student.missions_completed,
            ) || 0
          ) + 1,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        'firebase_uid',
        submission.firebase_uid,
      )
      .select('*')
      .single();

    if (
      rewardError ||
      !updatedProfile
    ) {
      return res.status(500).json({
        success: false,
        error:
          'Unable to apply mission reward.',
      });
    }

    const {
      data: verified,
      error: verifyError,
    } = await supabaseAdmin
      .from('mission_submissions')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString(),
        rewarded_at: new Date().toISOString(),
      })
      .eq('id', submission.id)
      .eq('status', 'pending')
      .is('rewarded_at', null)
      .select('id')
      .maybeSingle();

    if (verifyError || !verified) {
      console.error(
        'Mission verification finalization failed:',
        verifyError?.message,
      );
      return res.status(500).json({
        success: false,
        error:
          'Mission reward was applied, but verification status could not be finalized.',
      });
    }

    return res.json({
      success: true,
      profile:
        updatedProfile,
    });
  },
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
      validateChatInput(
        req.body,
      );

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
          input.history,
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
          : 'unknown error',
      );

      return res.status(500).json({
        success: false,
        error:
          'Unable to generate an AI response.',
      });
    }
  },
);

/* -------------------------------------------------------------------------- */
/* SERVER                                                                     */
/* -------------------------------------------------------------------------- */

app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `EcoSpark AI server running on port ${PORT}`,
    );
  },
);