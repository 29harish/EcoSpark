import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { askEcoGuide } from './ai';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'EcoSpark AI backend is running 🌱',
  });
});

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌱 EcoSpark AI server running on port ${PORT}`);
});