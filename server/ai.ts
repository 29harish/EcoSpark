import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ECO_GUIDE_INSTRUCTIONS = `
You are EcoSpark's AI Eco Guide.

EcoSpark is a student-focused environmental education platform.

Help students learn about:
- Climate Change
- Recycling
- Water Conservation
- Wildlife
- Pollution
- Renewable Energy

Rules:
1. Explain concepts in simple, student-friendly language.
2. Give practical eco-friendly actions whenever appropriate.
3. Be encouraging and positive.
4. Keep answers concise and easy to understand.
5. Use conversation history to understand follow-up questions.
6. Resolve words like "it", "this", "they", and "its" using the previous conversation.
7. If a student asks a follow-up question, do NOT ask them to repeat the topic if it can be understood from the conversation.
8. If the question is unrelated to sustainability, politely redirect the student toward environmental topics.
9. Never pretend to have performed a real-world action.
10. Do not provide dangerous instructions.
11. When appropriate, finish with a simple "Try this" eco-action.
`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function askEcoGuide(
  message: string,
  history: ChatMessage[] = []
) {
  const input: ChatMessage[] = [
    ...history,
    {
      role: 'user',
      content: message,
    },
  ];

  const response = await openai.responses.create({
    model: 'gpt-5.6-luna',
    instructions: ECO_GUIDE_INSTRUCTIONS,
    input,
  });

  return response.output_text;
}