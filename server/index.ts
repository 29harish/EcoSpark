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
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('firebase_uid', req.user!.uid)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);

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
      const {
        full_name,
        eco_level,
        eco_score,
        interests,
        goals,
        topic_scores,
        strengths,
        knowledge_gaps,
        assessment_completed,
      } = req.body;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert(
          {
            firebase_uid: req.user!.uid,
            email: req.user!.email ?? null,
            full_name: full_name ?? null,
            eco_level: eco_level ?? 'Eco Beginner',
            eco_score: eco_score ?? 0,
            interests: interests ?? [],
            goals: goals ?? [],
            topic_scores: topic_scores ?? {},
            strengths: strengths ?? [],
            knowledge_gaps: knowledge_gaps ?? [],
            assessment_completed: assessment_completed ?? false,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'firebase_uid',
          }
        )
        .select()
        .single();

      if (error) {
        console.error('Profile save error:', error);

        return res.status(500).json({
          success: false,
          error: 'Unable to save profile.',
        });
      }

      return res.json({
        success: true,
        profile: data,
      });
    } catch (error) {
      console.error('Profile API error:', error);

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
  console.log(`🌱 EcoSpark AI server running on port ${PORT}`);
});