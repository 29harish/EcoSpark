import { useEffect, useState } from 'react';
import { Card, GradientCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { PageHeader } from '@/components/layout/PageHeader';
import { useApp } from '@/context/AppContext';
import { categories, quizQuestions } from '@/data/mockData';
import { useFeedback } from '@/components/ui/FeedbackToast';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Zap,
  Coins,
  Play,
  Trophy,
  Brain,
} from 'lucide-react';

export function LearnHub() {
  const { lessons, openLesson, completedLessons } = useApp();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredLessons = activeCategory
    ? lessons.filter((lesson) => lesson.categoryId === activeCategory)
    : lessons;

  const selectedQuizData = quizQuestions.find(
    (quiz) => quiz.id === selectedQuiz
  );

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (selectedQuizData) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <QuizPlayer
          quiz={selectedQuizData}
          onExit={() => setSelectedQuiz(null)}
        />
      </div>
    );
  }

  const learningPercentage =
    lessons.length > 0
      ? Math.round((completedLessons / lessons.length) * 100)
      : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Learn"
        icon={<BookOpen className="w-5 h-5" />}
        subtitle="Learn something new, test your knowledge, and earn rewards along the way."
      />

      {/* Learning Progress */}
      <GradientCard
        gradient="from-leaf-500 to-lagoon-500"
        className="p-6 mb-8 animate-slide-up"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-white">
              Your Learning Journey
            </h3>

            <p className="text-white/80 text-sm mt-1">
              {completedLessons} of {lessons.length} lessons completed
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-extrabold text-white">
                {learningPercentage}%
              </div>

              <div className="text-xs text-white/70">
                Complete
              </div>
            </div>

            <div className="w-40">
              <ProgressBar
                value={learningPercentage}
                gradient="from-white to-sun-200"
                height="h-3"
              />
            </div>
          </div>
        </div>
      </GradientCard>

      {/* Topic Filters */}
      <div className="mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeCategory === null
                ? 'bg-gradient-to-r from-leaf-500 to-lagoon-500 text-white shadow-soft'
                : 'bg-white text-leaf-700 border border-leaf-100 hover:bg-leaf-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              All Topics
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeCategory === cat.id
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-soft`
                  : 'bg-white text-leaf-700 border border-leaf-100 hover:bg-leaf-50'
              }`}
            >
              <span className="flex items-center gap-2">
                {cat.emoji} {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Topic Cards */}
      {!activeCategory && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {categories.map((cat) => {
            const catLessons = lessons.filter(
              (lesson) => lesson.categoryId === cat.id
            );

            const catCompleted = catLessons.filter(
              (lesson) => lesson.completed
            ).length;

            const categoryProgress =
              catLessons.length > 0
                ? (catCompleted / catLessons.length) * 100
                : 0;

            return (
              <GradientCard
                key={cat.id}
                gradient={cat.gradient}
                className="p-6 animate-slide-up relative overflow-hidden group"
                hover
                onClick={() => setActiveCategory(cat.id)}
              >
                <div className="absolute -top-4 -right-4 text-8xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-300">
                  {cat.emoji}
                </div>

                <div className="relative z-10">
                  <div className="text-5xl mb-4">
                    {cat.emoji}
                  </div>

                  <h3 className="text-xl font-extrabold mb-1">
                    {cat.name}
                  </h3>

                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/20 backdrop-blur rounded-full px-3 py-1 text-xs font-bold">
                      {catCompleted}/{cat.lessonsCount} done
                    </span>
                  </div>

                  <ProgressBar
                    value={categoryProgress}
                    gradient="from-white to-white"
                    height="h-2"
                  />
                </div>
              </GradientCard>
            );
          })}
        </div>
      )}

      {/* Lessons */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-leaf-800">
              {activeCategory
                ? 'Lessons in this topic'
                : 'Explore Lessons'}
            </h2>

            <p className="text-sm text-leaf-600/60 mt-1">
              Learn at your own pace and complete lessons to earn XP.
            </p>
          </div>

          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm font-bold text-leaf-600 hover:text-leaf-700"
            >
              View all
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, i) => (
            <Card
              key={lesson.id}
              className={`overflow-hidden animate-slide-up stagger-${Math.min(
                i + 1,
                8
              )} group cursor-pointer ${
                lesson.completed
                  ? 'ring-1 ring-leaf-200'
                  : ''
              }`}
              hover
              onClick={() => openLesson(lesson.id)}
            >
              {/* Thumbnail */}
              <div
                className={`h-32 bg-gradient-to-br ${lesson.color} relative flex items-center justify-center`}
              >
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {lesson.emoji}
                </div>

                {lesson.completed && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center animate-pop-in">
                    <CheckCircle2 className="w-5 h-5 text-leaf-500" />
                  </div>
                )}

                <div className="absolute bottom-3 left-3">
                  <Badge
                    variant="gray"
                    size="sm"
                    className="!bg-white/80 !backdrop-blur !text-leaf-700"
                  >
                    <Clock className="w-3 h-3" />
                    {lesson.duration} min
                  </Badge>
                </div>

                <div className="absolute top-3 left-3">
                  {lesson.completed ? (
                    <span className="bg-leaf-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  ) : (
                    <span className="bg-white/90 backdrop-blur text-leaf-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      Not Started
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      lesson.difficulty === 'Beginner'
                        ? 'green'
                        : lesson.difficulty === 'Intermediate'
                        ? 'gold'
                        : 'coral'
                    }
                    size="sm"
                  >
                    {lesson.difficulty}
                  </Badge>

                  <Badge variant="gold" size="sm">
                    +{lesson.xpReward} XP
                  </Badge>
                </div>

                <h3 className="font-extrabold text-leaf-800 mb-1 group-hover:text-leaf-600 transition-colors">
                  {lesson.title}
                </h3>

                <p className="text-sm text-leaf-600/70 leading-relaxed line-clamp-2">
                  {lesson.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-leaf-500 flex items-center gap-1 group-hover:text-leaf-600">
                    {lesson.completed
                      ? 'Review lesson'
                      : 'Start lesson'}

                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>

                  <div className="flex items-center gap-1">
                    {lesson.slides.length > 0 && (
                      <span className="text-xs text-leaf-600/50 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {lesson.slides.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Knowledge Checks */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-400 to-sun-400 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-leaf-800">
              Knowledge Checks
            </h2>

            <p className="text-sm text-leaf-600/60">
              Test what you've learned and earn bonus XP.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {quizQuestions.map((quiz, i) => (
            <Card
              key={quiz.id}
              className={`overflow-hidden animate-slide-up stagger-${Math.min(
                i + 1,
                8
              )} group`}
              hover
            >
              <div
                className={`h-28 bg-gradient-to-br ${quiz.color} relative flex items-center justify-center`}
              >
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {quiz.emoji}
                </div>

                {quiz.completed && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2.5 py-1 text-xs font-bold text-leaf-600">
                    <Trophy className="w-3 h-3" />
                    {quiz.bestScore}%
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      quiz.difficulty === 'Beginner'
                        ? 'green'
                        : quiz.difficulty === 'Intermediate'
                        ? 'gold'
                        : 'coral'
                    }
                    size="sm"
                  >
                    {quiz.difficulty}
                  </Badge>

                  <Badge variant="gold" size="sm">
                    +{quiz.xpReward} XP
                  </Badge>
                </div>

                <h3 className="font-extrabold text-leaf-800 mb-1 group-hover:text-leaf-600 transition-colors">
                  {quiz.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-leaf-600/60 mt-2">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    {quiz.questions} questions
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{quiz.questions} min
                  </span>
                </div>

                <div className="mt-4">
                  <Button
                    size="sm"
                    fullWidth
                    variant={quiz.completed ? 'outline' : 'primary'}
                    icon={<Play className="w-4 h-4" />}
                    onClick={() => setSelectedQuiz(quiz.id)}
                  >
                    {quiz.completed
                      ? 'Retake Quiz'
                      : 'Start Quiz'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   QUIZ PLAYER
   ========================================================= */

function QuizPlayer({
  quiz,
  onExit,
}: {
  quiz: typeof quizQuestions[0];
  onExit: () => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const { showXP, showCoin, showInfo } = useFeedback();
  const { grantReward } = useApp();

  const questions = [
    {
      q: 'What is the main greenhouse gas?',
      options: ['Oxygen', 'CO₂', 'Nitrogen', 'Helium'],
      correct: 1,
    },
    {
      q: 'Which R comes first?',
      options: ['Recycle', 'Reuse', 'Reduce', 'Remove'],
      correct: 2,
    },
    {
      q: 'What do pollinators do?',
      options: [
        'Make honey',
        'Pollinate plants',
        'Eat leaves',
        'Build nests',
      ],
      correct: 1,
    },
    {
      q: 'How long does plastic take to break down?',
      options: [
        'A few days',
        'A year',
        'Hundreds of years',
        'Never',
      ],
      correct: 2,
    },
    {
      q: 'What does solar energy use?',
      options: ['Wind', 'Sunlight', 'Water', 'Coal'],
      correct: 1,
    },
  ];

  useEffect(() => {
    if (!finished || rewarded) return;

    const percentage = Math.round(
      (score / questions.length) * 100
    );

    const xpEarned = Math.round(
      quiz.xpReward * (percentage / 100)
    );

    const coinsEarned = Math.round(xpEarned * 0.2);

    void grantReward(
      'quiz',
      xpEarned,
      coinsEarned
    )
      .then(() => {
        showXP(xpEarned);
        showCoin(coinsEarned);
        setRewarded(true);
      })
      .catch((error: unknown) => {
        showInfo(
          error instanceof Error
            ? error.message
            : 'Unable to save your quiz reward.'
        );

        setRewarded(false);
      });
  }, [
    finished,
    rewarded,
    score,
    quiz.xpReward,
    grantReward,
    showXP,
    showCoin,
    showInfo,
    questions.length,
  ]);

  if (finished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    const xpEarned = Math.round(
      quiz.xpReward * (percentage / 100)
    );

    const coinsEarned = Math.round(xpEarned * 0.2);

    return (
      <Card className="p-8 md:p-12 text-center animate-pop-in">
        <div className="text-6xl mb-4 animate-bounce-soft">
          {percentage === 100
            ? '🎉'
            : percentage >= 60
            ? '🌟'
            : '🌱'}
        </div>

        <h2 className="text-3xl font-extrabold text-leaf-800 mb-2">
          {percentage === 100
            ? 'Perfect Score!'
            : percentage >= 60
            ? 'Well Done!'
            : 'Keep Learning!'}
        </h2>

        <p className="text-leaf-600/70 mb-6">
          You scored {score} out of {questions.length} (
          {percentage}%)
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className="bg-leaf-50 rounded-2xl px-6 py-4 flex items-center gap-2 animate-pop-in"
            style={{ animationDelay: '0.2s' }}
          >
            <Zap className="w-6 h-6 text-leaf-500" />

            <div>
              <div className="text-2xl font-extrabold text-leaf-600">
                +{xpEarned}
              </div>

              <div className="text-xs text-leaf-600/60">
                XP earned
              </div>
            </div>
          </div>

          <div
            className="bg-sun-50 rounded-2xl px-6 py-4 flex items-center gap-2 animate-pop-in"
            style={{ animationDelay: '0.4s' }}
          >
            <Coins className="w-6 h-6 text-sun-500" />

            <div>
              <div className="text-2xl font-extrabold text-sun-600">
                +{coinsEarned}
              </div>

              <div className="text-xs text-sun-600/60">
                Eco Coins
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setFinished(false);
              setCurrentQ(0);
              setScore(0);
              setSelected(null);
              setShowResult(false);
              setRewarded(false);
            }}
          >
            Retake
          </Button>

          <Button onClick={onExit}>
            Back to Learn
          </Button>
        </div>
      </Card>
    );
  }

  const question = questions[currentQ];

  return (
    <Card className="p-8 md:p-12 animate-pop-in">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="coral" size="md">
          Question {currentQ + 1} of {questions.length}
        </Badge>

        <button
          onClick={onExit}
          className="text-sm font-bold text-leaf-600 hover:text-leaf-700 transition-colors"
        >
          Exit
        </button>
      </div>

      {/* Quiz progress */}
      <div className="mb-6">
        <ProgressBar
          value={
            ((currentQ + (showResult ? 1 : 0)) /
              questions.length) *
            100
          }
          gradient="from-coral-400 to-sun-400"
          height="h-1.5"
          showGlow
        />
      </div>

      <div
        key={currentQ}
        className="text-center mb-8 animate-quiz-enter"
      >
        <div className="text-4xl mb-3">
          {quiz.emoji}
        </div>

        <h2 className="text-2xl font-extrabold text-leaf-800">
          {question.q}
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          let className =
            'border-leaf-100 hover:border-leaf-300 hover:bg-leaf-50';

          if (showResult) {
            if (index === question.correct) {
              className =
                'border-leaf-500 bg-leaf-50 animate-answer-reveal';
            } else if (index === selected) {
              className =
                'border-coral-400 bg-coral-50 animate-answer-reveal';
            } else {
              className =
                'border-leaf-100 opacity-50';
            }
          }

          return (
            <button
              key={index}
              onClick={() => {
                if (!showResult) {
                  setSelected(index);
                  setShowResult(true);

                  if (index === question.correct) {
                    setScore((currentScore) => currentScore + 1);
                  }
                }
              }}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 font-semibold text-leaf-800 ${className} ${
                !showResult
                  ? 'hover:-translate-y-0.5 active:scale-[0.99]'
                  : ''
              }`}
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              {option}

              {showResult &&
                index === question.correct && (
                  <CheckCircle2 className="w-5 h-5 text-leaf-500 inline ml-2" />
                )}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              if (currentQ < questions.length - 1) {
                setCurrentQ((current) => current + 1);
                setSelected(null);
                setShowResult(false);
              } else {
                setFinished(true);
              }
            }}
          >
            {currentQ < questions.length - 1
              ? 'Next Question'
              : 'See Results'}
          </Button>
        </div>
      )}
    </Card>
  );
}