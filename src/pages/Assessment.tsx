import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { auth } from '@/lib/firebase';
import { apiRequest } from '@/lib/api';

type Topic =
  | 'Biodiversity'
  | 'Water'
  | 'Waste'
  | 'Energy'
  | 'Soil'
  | 'Climate & Pollution';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

type Question = {
  id: number;
  topic: Topic;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  explanation: string;
};

type AnswerRecord = {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  topic: Topic;
};

const topics: Topic[] = [
  'Biodiversity',
  'Water',
  'Waste',
  'Energy',
  'Soil',
  'Climate & Pollution',
];

const topicIcons: Record<Topic, string> = {
  Biodiversity: '🌳',
  Water: '💧',
  Waste: '♻️',
  Energy: '☀️',
  Soil: '🌱',
  'Climate & Pollution': '🌍',
};

const questions: Question[] = [
  {
    id: 1,
    topic: 'Biodiversity',
    question: 'What does biodiversity mean?',
    options: [
      'The variety of living organisms in an area',
      'The number of buildings in an area',
      'The amount of rainfall in a region',
      'The number of people in a city',
    ],
    correctAnswer: 'The variety of living organisms in an area',
    difficulty: 'Easy',
    explanation:
      'Biodiversity means the variety of plants, animals and other living organisms found in an ecosystem.',
  },

  {
    id: 2,
    topic: 'Water',
    question: 'Which action can help save water at home?',
    options: [
      'Leaving the tap running',
      'Turning off the tap while brushing',
      'Taking longer showers',
      'Washing clothes unnecessarily',
    ],
    correctAnswer: 'Turning off the tap while brushing',
    difficulty: 'Easy',
    explanation:
      'Turning off the tap while brushing prevents unnecessary water wastage.',
  },

  {
    id: 3,
    topic: 'Waste',
    question: 'Which item can usually be recycled?',
    options: [
      'Clean cardboard',
      'Used tissue paper',
      'Food mixed with plastic',
      'Contaminated medical waste',
    ],
    correctAnswer: 'Clean cardboard',
    difficulty: 'Easy',
    explanation:
      'Clean cardboard can usually be collected and processed for recycling.',
  },

  {
    id: 4,
    topic: 'Energy',
    question: 'Which is a renewable source of energy?',
    options: [
      'Coal',
      'Petroleum',
      'Solar energy',
      'Natural gas',
    ],
    correctAnswer: 'Solar energy',
    difficulty: 'Easy',
    explanation:
      'Solar energy comes from the Sun and is a renewable source of energy.',
  },

  {
    id: 5,
    topic: 'Soil',
    question: 'Why is healthy soil important?',
    options: [
      'It supports healthy plant growth',
      'It increases plastic pollution',
      'It prevents all rainfall',
      'It produces fossil fuels',
    ],
    correctAnswer: 'It supports healthy plant growth',
    difficulty: 'Medium',
    explanation:
      'Healthy soil provides plants with nutrients, water and physical support.',
  },

  {
    id: 6,
    topic: 'Climate & Pollution',
    question:
      'Which gas is a major greenhouse gas contributing to global warming?',
    options: [
      'Carbon dioxide',
      'Oxygen',
      'Helium',
      'Neon',
    ],
    correctAnswer: 'Carbon dioxide',
    difficulty: 'Medium',
    explanation:
      'Carbon dioxide is an important greenhouse gas that contributes to global warming.',
  },

  {
    id: 7,
    topic: 'Biodiversity',
    question: 'Which action best helps protect biodiversity?',
    options: [
      'Destroying natural habitats',
      'Protecting forests and wetlands',
      'Increasing illegal hunting',
      'Removing native plants',
    ],
    correctAnswer: 'Protecting forests and wetlands',
    difficulty: 'Medium',
    explanation:
      'Protecting natural habitats gives plants and animals places to live and reproduce.',
  },

  {
    id: 8,
    topic: 'Water',
    question: 'Why is groundwater important?',
    options: [
      'It provides freshwater for people, agriculture and ecosystems',
      'It is only used by marine animals',
      'It increases air pollution',
      'It is a type of renewable electricity',
    ],
    correctAnswer:
      'It provides freshwater for people, agriculture and ecosystems',
    difficulty: 'Medium',
    explanation:
      'Groundwater is an important source of freshwater for people, agriculture and ecosystems.',
  },

  {
    id: 9,
    topic: 'Waste',
    question: 'What is the main purpose of composting organic waste?',
    options: [
      'To turn organic waste into nutrient-rich material',
      'To create more plastic',
      'To increase landfill waste',
      'To produce toxic chemicals',
    ],
    correctAnswer:
      'To turn organic waste into nutrient-rich material',
    difficulty: 'Hard',
    explanation:
      'Composting breaks down organic materials and creates useful nutrient-rich compost.',
  },

  {
    id: 10,
    topic: 'Energy',
    question:
      'Which combination would generally help reduce household energy consumption?',
    options: [
      'Efficient appliances and switching off unused devices',
      'Leaving appliances running continuously',
      'Using inefficient bulbs throughout the day',
      'Keeping electronics on standby unnecessarily',
    ],
    correctAnswer:
      'Efficient appliances and switching off unused devices',
    difficulty: 'Hard',
    explanation:
      'Efficient appliances and responsible electricity use can reduce unnecessary energy consumption.',
  },

  {
    id: 11,
    topic: 'Soil',
    question: 'Which practice is most beneficial for long-term soil health?',
    options: [
      'Adding organic matter such as compost',
      'Removing all plant cover',
      'Dumping plastic waste into soil',
      'Using excessive chemicals without consideration',
    ],
    correctAnswer: 'Adding organic matter such as compost',
    difficulty: 'Hard',
    explanation:
      'Organic matter can improve soil structure, nutrient availability and biological activity.',
  },

  {
    id: 12,
    topic: 'Climate & Pollution',
    question: 'Which action can help reduce urban air pollution?',
    options: [
      'Using public transport or walking when practical',
      'Burning plastic waste',
      'Keeping vehicles running while parked',
      'Increasing unnecessary vehicle trips',
    ],
    correctAnswer:
      'Using public transport or walking when practical',
    difficulty: 'Hard',
    explanation:
      'Using alternatives to individual vehicle travel can help reduce transport-related emissions.',
  },
];

const interestOptions = [
  {
    id: 'biodiversity',
    icon: '🌳',
    title: 'Wildlife & Biodiversity',
  },
  {
    id: 'climate',
    icon: '🌍',
    title: 'Climate Change',
  },
  {
    id: 'water',
    icon: '💧',
    title: 'Water Conservation',
  },
  {
    id: 'waste',
    icon: '♻️',
    title: 'Waste & Recycling',
  },
  {
    id: 'energy',
    icon: '☀️',
    title: 'Renewable Energy',
  },
  {
    id: 'soil',
    icon: '🌱',
    title: 'Soil & Agriculture',
  },
];

const goalOptions = [
  {
    id: 'knowledge',
    icon: '🧠',
    title: 'Improve my environmental knowledge',
  },
  {
    id: 'habits',
    icon: '🌱',
    title: 'Build better sustainable habits',
  },
  {
    id: 'community',
    icon: '🤝',
    title: 'Make an impact in my community',
  },
  {
    id: 'skills',
    icon: '🚀',
    title: 'Learn practical sustainability skills',
  },
];

function shuffle<T>(items: T[]): T[] {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function getLevel(score: number) {
  if (score < 40) return 'Eco Beginner';
  if (score < 60) return 'Eco Explorer';
  if (score < 80) return 'Eco Learner';
  if (score < 90) return 'Eco Guardian';

  return 'Eco Champion';
}

function getLevelDescription(level: string) {
  switch (level) {
    case 'Eco Beginner':
      return 'Every eco journey starts somewhere. Let’s build your foundation.';

    case 'Eco Explorer':
      return 'You have started your eco journey. There is plenty more to discover.';

    case 'Eco Learner':
      return 'You have a good foundation. Let’s strengthen your eco knowledge.';

    case 'Eco Guardian':
      return 'Great work! You understand many important environmental concepts.';

    case 'Eco Champion':
      return 'Excellent! Your environmental knowledge is already very strong.';

    default:
      return 'Keep learning and growing with EcoSpark.';
  }
}

function getScoreMessage(score: number) {
  if (score < 40)
    return 'Every great environmental journey starts with learning.';

  if (score < 60)
    return 'You have a foundation. Now let’s grow your knowledge.';

  if (score < 80)
    return 'Great foundation! A few areas can become even stronger.';

  if (score < 90)
    return 'Excellent environmental knowledge!';

  return 'Outstanding! You are an Eco Champion!';
}

export function Assessment() {
  const { navigate } = useApp();

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [showReview, setShowReview] = useState(false);

  const [profileStep, setProfileStep] = useState<
    'interests' | 'goals'
  >('interests');

  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);

  const [savingProfile, setSavingProfile] = useState(false);

  const [assessmentQuestions] = useState<Question[]>(() => {
    const easy = shuffle(
      questions.filter((q) => q.difficulty === 'Easy')
    );

    const medium = shuffle(
      questions.filter((q) => q.difficulty === 'Medium')
    );

    const hard = shuffle(
      questions.filter((q) => q.difficulty === 'Hard')
    );

    return [...easy, ...medium, ...hard].map((question) => ({
      ...question,
      options: shuffle(question.options),
    }));
  });

  const question = assessmentQuestions[currentQuestion];

  const selectedAnswer = question
    ? answers[question.id]
    : undefined;

  const progress = question
    ? ((currentQuestion + 1) / assessmentQuestions.length) * 100
    : 0;

  const selectAnswer = (answer: string) => {
    if (!question) return;

    setAnswers((previous) => ({
      ...previous,
      [question.id]: answer,
    }));
  };

  const nextQuestion = () => {
    if (!selectedAnswer) return;

    if (currentQuestion === assessmentQuestions.length - 1) {
      setProfileStep('interests');
      setStarted(false);
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((previous) =>
      previous.includes(interest)
        ? previous.filter((item) => item !== interest)
        : [...previous, interest]
    );
  };

  const toggleGoal = (goal: string) => {
    setGoals((previous) =>
      previous.includes(goal)
        ? previous.filter((item) => item !== goal)
        : [...previous, goal]
    );
  };

  const results = useMemo(() => {
    const answerRecords: AnswerRecord[] =
      assessmentQuestions.map((q) => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] ?? 'Not sure',
        correctAnswer: q.correctAnswer,
        topic: q.topic,
      }));

    const correctAnswers = answerRecords.filter(
      (answer) => answer.selectedAnswer === answer.correctAnswer
    );

    const overallScore = Math.round(
      (correctAnswers.length / assessmentQuestions.length) * 100
    );

    const topicScores = topics.reduce(
      (result, topic) => {
        const topicQuestions = assessmentQuestions.filter(
          (q) => q.topic === topic
        );

        const topicCorrect = topicQuestions.filter(
          (q) => answers[q.id] === q.correctAnswer
        ).length;

        result[topic] =
          topicQuestions.length > 0
            ? Math.round(
                (topicCorrect / topicQuestions.length) * 100
              )
            : 0;

        return result;
      },
      {} as Record<Topic, number>
    );

    const sortedTopics = [...topics].sort(
      (a, b) => topicScores[a] - topicScores[b]
    );

    const weakTopics = sortedTopics.slice(0, 3);

    const strengths = [...topics]
      .sort((a, b) => topicScores[b] - topicScores[a])
      .slice(0, 2);

    const knowledgeGaps = topics.filter(
      (topic) => topicScores[topic] < 60
    );

    const level = getLevel(overallScore);

    return {
      answerRecords,
      correct: correctAnswers.length,
      overallScore,
      topicScores,
      weakTopics,
      strengths,
      knowledgeGaps,
      level,
    };
  }, [answers, assessmentQuestions]);

  const finishProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error('No logged-in Firebase user found.');
      return;
    }

    if (savingProfile) return;

    setSavingProfile(true);

    const assessmentResult = {
      overallScore: results.overallScore,
      topicScores: results.topicScores,
      strengths: results.strengths,
      weakTopics: results.weakTopics,
      knowledgeGaps: results.knowledgeGaps,
      knowledgeLevel: results.level,
      interests,
      goals,
      recommendedTopics: results.weakTopics,
      answers: results.answerRecords,
      completedAt: new Date().toISOString(),
    };

    try {
      // Local backup
      localStorage.setItem(
        'ecospark-assessment-result',
        JSON.stringify(assessmentResult)
      );

      localStorage.setItem(
        'ecospark-assessment-completed',
        'true'
      );

      // Save profile through Firebase-authenticated backend
      await apiRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: user.displayName ?? '',
          eco_level: results.level,
          eco_score: results.overallScore,
          interests,
          goals,
          topic_scores: results.topicScores,
          strengths: results.strengths,
          knowledge_gaps: results.knowledgeGaps,
          assessment_completed: true,
        }),
      });

      // Show the newly created Eco Profile
      setFinished(true);
    } catch (error) {
      console.error('Unable to save Eco Profile:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  // =========================================================
  // INTERESTS
  // =========================================================

  if (!started && !finished && profileStep === 'interests') {
    if (Object.keys(answers).length === assessmentQuestions.length) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-4xl">
            <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-leaf-100 overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="text-center mb-10">
                  <div className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-leaf-100 flex items-center justify-center text-4xl">
                    🎯
                  </div>

                  <p className="text-sm font-bold text-leaf-600 mb-2">
                    Step 2 of 3
                  </p>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    What interests you?
                  </h1>

                  <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                    Choose the environmental topics you would enjoy
                    learning about. Select as many as you want.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {interestOptions.map((item) => {
                    const selected = interests.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleInterest(item.id)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all ${
                          selected
                            ? 'border-leaf-500 bg-leaf-50 shadow-sm'
                            : 'border-gray-100 hover:border-leaf-200 hover:bg-leaf-50/40'
                        }`}
                      >
                        <div className="text-3xl mb-3">
                          {item.icon}
                        </div>

                        <div className="font-bold text-gray-800">
                          {item.title}
                        </div>

                        <div className="mt-3">
                          <span
                            className={`text-xs font-bold ${
                              selected
                                ? 'text-leaf-700'
                                : 'text-gray-400'
                            }`}
                          >
                            {selected ? '✓ Selected' : 'Select'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                  <span className="text-sm text-gray-400">
                    {interests.length} selected
                  </span>

                  <button
                    disabled={interests.length === 0}
                    onClick={() => setProfileStep('goals')}
                    className="px-7 py-3 rounded-xl bg-leaf-600 text-white font-bold disabled:opacity-40 hover:bg-leaf-700 transition"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // =========================================================
  // GOALS
  // =========================================================

  if (!started && !finished && profileStep === 'goals') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-leaf-100 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-leaf-100 flex items-center justify-center text-4xl">
                  🚀
                </div>

                <p className="text-sm font-bold text-leaf-600 mb-2">
                  Step 3 of 3
                </p>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  What do you want to achieve?
                </h1>

                <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                  Your goals help EcoSpark recommend the right
                  learning and real-world activities.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {goalOptions.map((item) => {
                  const selected = goals.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleGoal(item.id)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                        selected
                          ? 'border-leaf-500 bg-leaf-50 shadow-sm'
                          : 'border-gray-100 hover:border-leaf-200 hover:bg-leaf-50/40'
                      }`}
                    >
                      <div className="text-3xl">
                        {item.icon}
                      </div>

                      <div className="flex-1">
                        <div className="font-bold text-gray-800">
                          {item.title}
                        </div>

                        <div
                          className={`text-xs font-bold mt-2 ${
                            selected
                              ? 'text-leaf-700'
                              : 'text-gray-400'
                          }`}
                        >
                          {selected ? '✓ Selected' : 'Select'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setProfileStep('interests')}
                  disabled={savingProfile}
                  className="px-5 py-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  ← Back
                </button>

                <button
                  disabled={goals.length === 0 || savingProfile}
                  onClick={finishProfile}
                  className="px-7 py-3 rounded-xl bg-leaf-600 text-white font-bold disabled:opacity-40 hover:bg-leaf-700 transition"
                >
                  {savingProfile
                    ? 'Creating Profile...'
                    : 'Create My Eco Profile →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // WELCOME
  // =========================================================

  if (!started && !finished) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-leaf-100 overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <div className="mx-auto mb-6 w-24 h-24 rounded-[2rem] bg-leaf-100 flex items-center justify-center text-5xl shadow-sm">
                🌱
              </div>

              <span className="inline-flex px-4 py-2 rounded-full bg-leaf-50 text-leaf-700 text-sm font-bold mb-5">
                Your EcoSpark Journey Starts Here
              </span>

              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
                Discover Your{' '}
                <span className="text-leaf-600">
                  Eco Knowledge
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-gray-600 text-base md:text-lg leading-relaxed">
                This isn't a test. It's the first step in creating a
                learning journey that's made for you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto my-10">
                <InfoCard
                  icon="🧠"
                  title="12 Questions"
                  subtitle="Across 6 eco topics"
                />

                <InfoCard
                  icon="🎯"
                  title="Your Interests"
                  subtitle="Choose what excites you"
                />

                <InfoCard
                  icon="🚀"
                  title="Your Goals"
                  subtitle="Shape your journey"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-4 py-2 rounded-full bg-cream-50 border border-gray-100 text-sm text-gray-700"
                  >
                    {topicIcons[topic]} {topic}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setStarted(true)}
                className="px-9 py-4 rounded-2xl bg-leaf-600 text-white font-bold text-lg shadow-lg shadow-leaf-600/20 hover:bg-leaf-700 hover:-translate-y-0.5 transition-all"
              >
                Start My Assessment →
              </button>

              <p className="text-xs text-gray-400 mt-5">
                Your answers help EcoSpark personalize your learning
                path.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // RESULTS
  // =========================================================

  if (finished) {
    return (
      <div className="min-h-screen px-4 py-8 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎉</div>

            <p className="text-leaf-600 font-bold mb-2">
              Assessment Complete
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Your Eco Profile 🌱
            </h1>

            <p className="text-gray-600 mt-3">
              {getScoreMessage(results.overallScore)}
            </p>
          </div>

          {/* Main score */}
          <div className="bg-white rounded-[2rem] border border-leaf-100 shadow-lg p-8 mb-6 text-center">
            <div className="w-36 h-36 mx-auto rounded-full bg-leaf-50 border-[10px] border-leaf-200 flex items-center justify-center mb-5">
              <div>
                <div className="text-4xl font-bold text-leaf-700">
                  {results.overallScore}%
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  Eco Knowledge
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              {results.level}
            </h2>

            <p className="text-gray-500 max-w-lg mx-auto mt-2">
              {getLevelDescription(results.level)}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-sm text-gray-600">
              ✅ {results.correct} / {assessmentQuestions.length}{' '}
              correct
            </div>
          </div>

          {/* Interests + Goals */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
              <div className="text-3xl mb-3">🎯</div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Your Interests
              </h2>

              <div className="flex flex-wrap gap-2 mt-4">
                {interests.map((interest) => {
                  const item = interestOptions.find(
                    (option) => option.id === interest
                  );

                  return (
                    <span
                      key={interest}
                      className="px-3 py-2 rounded-xl bg-leaf-50 text-leaf-700 text-sm font-semibold"
                    >
                      {item?.icon} {item?.title}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
              <div className="text-3xl mb-3">🚀</div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Your Goals
              </h2>

              <div className="space-y-2 mt-4">
                {goals.map((goal) => {
                  const item = goalOptions.find(
                    (option) => option.id === goal
                  );

                  return (
                    <div
                      key={goal}
                      className="p-3 rounded-xl bg-gray-50 text-sm font-semibold text-gray-700"
                    >
                      {item?.icon} {item?.title}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Topic scores */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Your Eco Knowledge
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Here's how you performed across different areas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {topics.map((topic) => {
                const score = results.topicScores[topic];

                return (
                  <div
                    key={topic}
                    className="p-4 rounded-2xl bg-gray-50"
                  >
                    <div className="flex justify-between mb-3">
                      <span className="font-semibold text-gray-700">
                        {topicIcons[topic]} {topic}
                      </span>

                      <span className="font-bold text-leaf-700">
                        {score}%
                      </span>
                    </div>

                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-leaf-500 rounded-full transition-all duration-700"
                        style={{
                          width: `${score}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths and gaps */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
              <div className="text-3xl mb-3">🏆</div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Your Strengths
              </h2>

              <p className="text-sm text-gray-500 mb-5">
                These are the areas where you're already doing well.
              </p>

              {results.strengths.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center justify-between p-4 bg-leaf-50 rounded-2xl mb-2"
                >
                  <span className="font-semibold text-gray-700">
                    {topicIcons[topic]} {topic}
                  </span>

                  <span className="text-leaf-700 font-bold">
                    {results.topicScores[topic]}%
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
              <div className="text-3xl mb-3">🎯</div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Knowledge Gaps
              </h2>

              <p className="text-sm text-gray-500 mb-5">
                These areas will shape your personalized journey.
              </p>

              {results.knowledgeGaps.length > 0 ? (
                results.knowledgeGaps.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl mb-2"
                  >
                    <span className="font-semibold text-gray-700">
                      {topicIcons[topic]} {topic}
                    </span>

                    <span className="text-amber-700 font-bold">
                      {results.topicScores[topic]}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-leaf-50 text-leaf-700 font-medium">
                  🌟 You don't have any major knowledge gaps!
                </div>
              )}
            </div>
          </div>

          {/* Personalized path */}
          <div className="bg-gradient-to-br from-leaf-700 to-leaf-600 rounded-[2rem] p-6 md:p-8 text-white mb-6">
            <p className="text-leaf-100 font-semibold mb-2">
              Your Personalized Learning Path
            </p>

            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Let's grow where it matters most 🌱
            </h2>

            <p className="text-leaf-50 mb-6 max-w-2xl">
              EcoSpark will prioritize these topics based on your
              assessment results and interests.
            </p>

            <div className="space-y-3">
              {results.weakTopics.map((topic, index) => (
                <div
                  key={topic}
                  className="bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="font-bold">
                      {topicIcons[topic]} {topic}
                    </div>

                    <div className="text-sm text-leaf-100">
                      {results.topicScores[topic] < 40
                        ? 'Start with the basics'
                        : results.topicScores[topic] < 60
                        ? 'Build your foundation'
                        : 'Strengthen your knowledge'}
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-leaf-100">
                    {results.topicScores[topic]}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowReview(!showReview)}
              className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              {showReview ? 'Hide Review' : 'Review Answers'}
            </button>

            <button
              onClick={() => navigate('dashboard')}
              className="px-7 py-3 rounded-xl bg-leaf-600 text-white font-bold hover:bg-leaf-700 transition shadow-lg"
            >
              Continue to Dashboard →
            </button>
          </div>

          {/* Review */}
          {showReview && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Assessment Review
              </h2>

              {assessmentQuestions.map((q, index) => {
                const selected = answers[q.id];

                const correct = selected === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl border border-gray-100 p-5"
                  >
                    <div className="flex gap-3 mb-4">
                      <span className="font-bold text-gray-400">
                        {index + 1}.
                      </span>

                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {q.question}
                        </div>

                        <div className="text-xs text-gray-400 mt-1">
                          {topicIcons[q.topic]} {q.topic}
                        </div>
                      </div>

                      <span>{correct ? '✅' : '❌'}</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      Your answer:{' '}
                      <strong>
                        {selected ?? 'Not answered'}
                      </strong>
                    </div>

                    {!correct && (
                      <div className="text-sm text-leaf-700 mt-2">
                        Correct answer:{' '}
                        <strong>{q.correctAnswer}</strong>
                      </div>
                    )}

                    <p className="text-sm text-gray-500 mt-3">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================
  // QUESTIONS
  // =========================================================

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold text-leaf-600">
              EcoSpark Assessment
            </p>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Discover your Eco Knowledge
            </h1>
          </div>

          <span className="text-sm font-bold text-gray-500">
            {currentQuestion + 1} / {assessmentQuestions.length}
          </span>
        </div>

        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-leaf-500 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf-50 text-leaf-700 text-sm font-bold">
              {topicIcons[question.topic]} {question.topic}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                question.difficulty === 'Easy'
                  ? 'bg-green-50 text-green-700'
                  : question.difficulty === 'Medium'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-purple-50 text-purple-700'
              }`}
            >
              {question.difficulty}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-8">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const selected = selectedAnswer === option;

              return (
                <button
                  key={option}
                  onClick={() => selectAnswer(option)}
                  className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    selected
                      ? 'border-leaf-500 bg-leaf-50 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-leaf-200 hover:bg-leaf-50/50'
                  }`}
                >
                  <span
                    className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold ${
                      selected
                        ? 'bg-leaf-600 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span
                    className={`font-medium ${
                      selected
                        ? 'text-leaf-800'
                        : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => selectAnswer('Not sure')}
              className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                selectedAnswer === 'Not sure'
                  ? 'border-gray-400 bg-gray-50 shadow-sm'
                  : 'border-dashed border-gray-200 bg-gray-50/50 hover:border-gray-300'
              }`}
            >
              <span
                className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold ${
                  selectedAnswer === 'Not sure'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                ?
              </span>

              <span
                className={`font-medium ${
                  selectedAnswer === 'Not sure'
                    ? 'text-gray-800'
                    : 'text-gray-500'
                }`}
              >
                I'm not sure
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-5 py-3 rounded-xl text-gray-600 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              ← Previous
            </button>

            <span className="hidden sm:block text-sm text-gray-400">
              {selectedAnswer
                ? 'Answer selected ✓'
                : 'Choose an answer to continue'}
            </span>

            <button
              onClick={nextQuestion}
              disabled={!selectedAnswer}
              className="px-6 py-3 rounded-xl bg-leaf-600 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-leaf-700 transition"
            >
              {currentQuestion === assessmentQuestions.length - 1
                ? 'Continue →'
                : 'Next →'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          🌱 There are no wrong journeys — every answer helps
          personalize yours.
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-cream-50 border border-gray-100">
      <div className="text-3xl mb-2">{icon}</div>

      <div className="text-sm font-bold text-gray-800">
        {title}
      </div>

      <div className="text-xs text-gray-500 mt-1">
        {subtitle}
      </div>
    </div>
  );
}