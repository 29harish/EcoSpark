import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { askEcoGuide } from './ai';
import { supabaseAdmin } from './db';
import {
  AuthenticatedRequest,
  requireAuth,
} from './authMiddleware';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase profile persistence is not configured; profile routes will fail until it is set.');
}

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.warn('Firebase Admin verification is not configured; authenticated routes will reject requests.');
}

app.use(cors());
app.use(express.json());


// ===============================
// HEALTH CHECK
// ===============================

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'EcoSpark AI backend is running 🌱',
  });
});


// ===============================
// GET PROFILE
// ===============================

app.get(
  '/api/profile',
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const firebaseUid = req.user!.uid;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('firebase_uid', firebaseUid)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);

        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }

      console.log('Profile loaded:', {
        firebase_uid: firebaseUid,
        profile_id: data?.id,
        xp: data?.xp,
        eco_coins: data?.eco_coins,
      });

      return res.json({
        success: true,
        profile: data,
      });
    } catch (error) {
      console.error('Profile API error:', error);

      return res.status(500).json({
        success: false,
        error: 'Unable to fetch profile.',
      });
    }
  }
);


// ===============================
// SAVE / UPDATE PROFILE
// ===============================

app.put(
  '/api/profile',
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const firebaseUid = req.user!.uid;

      console.log('PROFILE UPDATE');
      console.log('Firebase UID:', firebaseUid);
      console.log('Request body:', req.body);

      // --------------------------------
      // Find existing profile
      // --------------------------------

      const {
        data: existingProfile,
        error: findError,
      } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('firebase_uid', firebaseUid)
        .maybeSingle();

      if (findError) {
        console.error('Find profile error:', findError);

        return res.status(500).json({
          success: false,
          error: findError.message,
        });
      }

      // --------------------------------
      // Prepare only supplied fields
      // --------------------------------

      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (req.user!.email) {
        updates.email = req.user!.email;
      }

      if (req.body.full_name !== undefined) {
        updates.full_name = req.body.full_name;
      }

      if (req.body.eco_level !== undefined) {
        updates.eco_level = req.body.eco_level;
      }

      if (req.body.eco_score !== undefined) {
        updates.eco_score = Number(req.body.eco_score);
      }

      if (req.body.xp !== undefined) {
        updates.xp = Number(req.body.xp);
      }

      if (req.body.eco_coins !== undefined) {
        updates.eco_coins = Number(req.body.eco_coins);
      }

      if (req.body.interests !== undefined) {
        updates.interests = req.body.interests;
      }

      if (req.body.goals !== undefined) {
        updates.goals = req.body.goals;
      }

      if (req.body.topic_scores !== undefined) {
        updates.topic_scores = req.body.topic_scores;
      }

      if (req.body.strengths !== undefined) {
        updates.strengths = req.body.strengths;
      }

      if (req.body.knowledge_gaps !== undefined) {
        updates.knowledge_gaps = req.body.knowledge_gaps;
      }

      if (req.body.assessment_completed !== undefined) {
        updates.assessment_completed =
          req.body.assessment_completed;
      }


      // =====================================
      // EXISTING PROFILE → UPDATE
      // =====================================

      if (existingProfile) {
        const {
          data: updatedProfile,
          error: updateError,
        } = await supabaseAdmin
          .from('profiles')
          .update(updates)
          .eq('id', existingProfile.id)
          .select('*')
          .single();

        if (updateError) {
          console.error(
            'SUPABASE UPDATE ERROR:',
            updateError
          );

          return res.status(500).json({
            success: false,
            error: updateError.message,
          });
        }

        console.log('PROFILE SAVED:', {
          id: updatedProfile.id,
          firebase_uid: updatedProfile.firebase_uid,
          xp: updatedProfile.xp,
          eco_coins: updatedProfile.eco_coins,
          full_name: updatedProfile.full_name,
          assessment_completed:
            updatedProfile.assessment_completed,
        });

        return res.json({
          success: true,
          profile: updatedProfile,
        });
      }


      // =====================================
      // NO PROFILE → CREATE
      // =====================================

      const {
        data: newProfile,
        error: insertError,
      } = await supabaseAdmin
        .from('profiles')
        .insert({
          firebase_uid: firebaseUid,
          email: req.user!.email ?? null,
          full_name: req.body.full_name ?? null,
          eco_level: req.body.eco_level ?? 'Eco Beginner',
          eco_score: Number(req.body.eco_score ?? 0),
          xp: Number(req.body.xp ?? 0),
          eco_coins: Number(req.body.eco_coins ?? 0),
          interests: req.body.interests ?? [],
          goals: req.body.goals ?? [],
          topic_scores: req.body.topic_scores ?? {},
          strengths: req.body.strengths ?? [],
          knowledge_gaps: req.body.knowledge_gaps ?? [],
          assessment_completed:
            req.body.assessment_completed ?? false,
        })
        .select('*')
        .single();

      if (insertError) {
        console.error(
          'SUPABASE INSERT ERROR:',
          insertError
        );

        return res.status(500).json({
          success: false,
          error: insertError.message,
        });
      }

      console.log('PROFILE CREATED:', {
        id: newProfile.id,
        firebase_uid: newProfile.firebase_uid,
        xp: newProfile.xp,
        eco_coins: newProfile.eco_coins,
      });

      return res.json({
        success: true,
        profile: newProfile,
      });

    } catch (error) {
      console.error('PROFILE API ERROR:', error);

      return res.status(500).json({
        success: false,
        error: 'Unable to save profile.',
      });
    }
  }
);


// ===============================
// AI ECO GUIDE
// ===============================

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required.',
      });
    }

    const reply = await askEcoGuide(message, history);

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('AI Eco Guide error:', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to generate an AI response.',
    });
  }
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `🌱 EcoSpark AI server running on port ${PORT}`
  );
});