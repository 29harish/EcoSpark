export type AssessmentTopic =
  | 'Biodiversity'
  | 'Water'
  | 'Waste'
  | 'Energy'
  | 'Soil'
  | 'Climate & Pollution';

export type AssessmentDifficulty = 'Beginner' | 'Intermediate';

export interface AssessmentQuestion {
  id: string;
  topic: AssessmentTopic;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: AssessmentDifficulty;
  explanation: string;
  icon: string;
}

export interface AssessmentResult {
  overallScore: number;
  topicScores: Record<AssessmentTopic, number>;
  strengths: AssessmentTopic[];
  weakTopics: AssessmentTopic[];
  knowledgeLevel: string;
  recommendedTopics: AssessmentTopic[];
  answers: Record<string, string>;
  completedAt: string;
}

export const assessmentTopics: AssessmentTopic[] = [
  'Biodiversity',
  'Water',
  'Waste',
  'Energy',
  'Soil',
  'Climate & Pollution',
];

export const topicDetails: Record<AssessmentTopic, { icon: string; color: string; summary: string }> = {
  Biodiversity: { icon: '🌳', color: '#2d8b55', summary: 'Life and habitats' },
  Water: { icon: '💧', color: '#168da2', summary: 'Conservation and quality' },
  Waste: { icon: '♻️', color: '#b2761b', summary: 'Reuse and recycling' },
  Energy: { icon: '☀️', color: '#d58118', summary: 'Clean power and efficiency' },
  Soil: { icon: '🌱', color: '#8a5734', summary: 'Healthy growing systems' },
  'Climate & Pollution': { icon: '🌍', color: '#5671a4', summary: 'Climate and clean air' },
};

export const assessmentQuestions: AssessmentQuestion[] = [
  { id: 'biodiversity-1', topic: 'Biodiversity', icon: '🌳', question: 'What is biodiversity?', options: ['The variety of living things in an area', 'The amount of rainfall in a year', 'A type of renewable energy', 'A method of recycling'], correctAnswer: 'The variety of living things in an area', difficulty: 'Beginner', explanation: 'Biodiversity means the variety of plants, animals, fungi and microorganisms, along with the ecosystems they form.' },
  { id: 'biodiversity-2', topic: 'Biodiversity', icon: '🦋', question: 'Which action helps protect biodiversity?', options: ['Planting native species', 'Removing all insects', 'Replacing habitats with concrete', 'Releasing pets into the wild'], correctAnswer: 'Planting native species', difficulty: 'Beginner', explanation: 'Native plants support local food webs and provide shelter for wildlife adapted to the area.' },
  { id: 'water-1', topic: 'Water', icon: '💧', question: 'Which action saves the most water at home?', options: ['Fixing a leaking tap', 'Running the tap while brushing', 'Taking longer showers', 'Washing half-full loads'], correctAnswer: 'Fixing a leaking tap', difficulty: 'Beginner', explanation: 'A small leak can waste many litres over time, so repairing it prevents waste every day.' },
  { id: 'water-2', topic: 'Water', icon: '🌊', question: 'Why is groundwater important?', options: ['It supplies wells and supports ecosystems', 'It is always salty', 'It only exists in oceans', 'It cannot be used by people'], correctAnswer: 'It supplies wells and supports ecosystems', difficulty: 'Intermediate', explanation: 'Groundwater stored below the surface supplies drinking water, farming and many wetlands and streams.' },
  { id: 'waste-1', topic: 'Waste', icon: '♻️', question: 'Which item can usually be recycled?', options: ['A clean glass bottle', 'A used tissue', 'A food-covered wrapper', 'A broken light bulb'], correctAnswer: 'A clean glass bottle', difficulty: 'Beginner', explanation: 'Clean glass bottles are accepted by many recycling systems, while contaminated or specialist items need other disposal routes.' },
  { id: 'waste-2', topic: 'Waste', icon: '🍂', question: 'What is composting?', options: ['Turning organic waste into nutrient-rich material', 'Burning all household rubbish', 'Storing plastic underground', 'Pouring waste into a drain'], correctAnswer: 'Turning organic waste into nutrient-rich material', difficulty: 'Beginner', explanation: 'Composting lets microorganisms break down food scraps and plant material into a useful soil conditioner.' },
  { id: 'energy-1', topic: 'Energy', icon: '☀️', question: 'Which is a renewable source of energy?', options: ['Solar power', 'Coal', 'Petrol', 'Natural gas'], correctAnswer: 'Solar power', difficulty: 'Beginner', explanation: 'Sunlight is naturally replenished, unlike fossil fuels that take millions of years to form.' },
  { id: 'energy-2', topic: 'Energy', icon: '🔌', question: 'Which action can reduce electricity consumption?', options: ['Switching off unused lights', 'Leaving devices on standby forever', 'Opening windows with the heater on', 'Using brighter lights in empty rooms'], correctAnswer: 'Switching off unused lights', difficulty: 'Beginner', explanation: 'Turning off lights and devices when they are not needed reduces energy use without reducing comfort.' },
  { id: 'soil-1', topic: 'Soil', icon: '🌱', question: 'Why is healthy soil important?', options: ['It supports plants, food and ecosystems', 'It prevents every kind of flood', 'It is made only of plastic', 'It cannot hold water'], correctAnswer: 'It supports plants, food and ecosystems', difficulty: 'Beginner', explanation: 'Healthy soil stores water and nutrients, supports plant roots and provides habitat for countless organisms.' },
  { id: 'soil-2', topic: 'Soil', icon: '🪱', question: 'Which practice helps improve soil health?', options: ['Adding compost', 'Leaving soil bare all year', 'Removing all organic matter', 'Pouring chemicals onto crops'], correctAnswer: 'Adding compost', difficulty: 'Intermediate', explanation: 'Compost adds organic matter and nutrients while helping soil hold water and support beneficial life.' },
  { id: 'climate-1', topic: 'Climate & Pollution', icon: '🌍', question: 'Which gas is a major contributor to global warming?', options: ['Carbon dioxide', 'Oxygen', 'Helium', 'Neon'], correctAnswer: 'Carbon dioxide', difficulty: 'Beginner', explanation: 'Carbon dioxide traps heat in the atmosphere and is released in large amounts by burning fossil fuels.' },
  { id: 'climate-2', topic: 'Climate & Pollution', icon: '🚲', question: 'Which action can help reduce air pollution?', options: ['Walking or cycling for short trips', 'Burning rubbish outdoors', 'Idling a car for long periods', 'Using more single-use fuel'], correctAnswer: 'Walking or cycling for short trips', difficulty: 'Beginner', explanation: 'Active travel produces no tailpipe emissions and can replace short car journeys.' },
];

export function getKnowledgeLevel(score: number) {
  if (score < 40) return 'Eco Beginner';
  if (score < 60) return 'Eco Explorer';
  if (score < 80) return 'Eco Learner';
  if (score < 90) return 'Eco Guardian';
  return 'Eco Champion';
}

export function buildAssessmentResult(answers: Record<string, string>): AssessmentResult {
  const topicScores = Object.fromEntries(assessmentTopics.map((topic) => {
    const topicQuestions = assessmentQuestions.filter((question) => question.topic === topic);
    const correct = topicQuestions.filter((question) => answers[question.id] === question.correctAnswer).length;
    return [topic, Math.round((correct / topicQuestions.length) * 100)];
  })) as Record<AssessmentTopic, number>;
  const overallScore = Math.round(Object.values(topicScores).reduce((sum, score) => sum + score, 0) / assessmentTopics.length);
  const ordered = [...assessmentTopics].sort((a, b) => topicScores[b] - topicScores[a]);
  const weakTopics = [...assessmentTopics].sort((a, b) => topicScores[a] - topicScores[b]);
  return {
    overallScore,
    topicScores,
    strengths: ordered.filter((topic) => topicScores[topic] === topicScores[ordered[0]]).slice(0, 2),
    weakTopics: weakTopics.slice(0, 3),
    knowledgeLevel: getKnowledgeLevel(overallScore),
    recommendedTopics: weakTopics.slice(0, 3),
    answers,
    completedAt: new Date().toISOString(),
  };
}
