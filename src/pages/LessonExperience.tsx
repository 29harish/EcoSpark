import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useApp } from '@/context/AppContext';
import { useFeedback } from '@/components/ui/FeedbackToast';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Coins,
  Zap,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';

export function LessonExperience() {
  const { activeLessonId, lessons, closeLesson, completeLesson, grantReward, navigate } = useApp();
  const { showXP, showCoin, showInfo } = useFeedback();
  const lesson = lessons.find(l => l.id === activeLessonId);

  const [phase, setPhase] = useState<'intro' | 'slides' | 'quiz' | 'results'>('intro');
  const [slideIndex, setSlideIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [rewarded, setRewarded] = useState(false);

  if (!lesson) {
    return (
      <div className="p-8 text-center">
        <p>Lesson not found.</p>
        <Button onClick={closeLesson} className="mt-4">Back to Learn</Button>
      </div>
    );
  }

  const totalSteps = lesson.slides.length + lesson.quiz.length;
  const currentStep = phase === 'slides' ? slideIndex : phase === 'quiz' ? lesson.slides.length + quizIndex : phase === 'results' ? totalSteps : 0;
  const progress = phase === 'intro' ? 0 : (currentStep / totalSteps) * 100;

  const handleStart = () => {
    setPhase('slides');
    setSlideIndex(0);
  };

  const handleNextSlide = () => {
    if (slideIndex < lesson.slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setPhase('quiz');
      setQuizIndex(0);
    }
  };

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === lesson.quiz[quizIndex].correctIndex) {
      setCorrectCount(c => c + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (quizIndex < lesson.quiz.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Calculate rewards
      const accuracy = correctCount / lesson.quiz.length;
      const xpEarned = Math.round(lesson.xpReward * (0.5 + accuracy * 0.5));
      const coinsEarned = Math.round(lesson.xpReward * 0.2 * (0.5 + accuracy * 0.5));
      setEarnedXP(xpEarned);
      if (!rewarded) {
        try {
          await grantReward('lesson', xpEarned, coinsEarned);
          showXP(xpEarned);
          showCoin(coinsEarned);
          await completeLesson(lesson.id);
          setRewarded(true);
        } catch (error) {
          showInfo(error instanceof Error ? error.message : 'Unable to save your lesson reward.');
          return;
        }
      }
      setPhase('results');
    }
  };

  const handleRestart = () => {
    setPhase('intro');
    setSlideIndex(0);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCorrectCount(0);
    setEarnedXP(0);
    setRewarded(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={closeLesson}
          className="w-10 h-10 rounded-2xl bg-white shadow-soft border border-leaf-100/50 flex items-center justify-center text-leaf-600 hover:bg-leaf-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 mx-4 max-w-md">
          <ProgressBar value={progress} gradient="from-leaf-400 to-lagoon-400" height="h-2.5" showGlow />
        </div>
        <Badge variant="gold" size="md">+{lesson.xpReward} XP</Badge>
      </div>

      {/* INTRO PHASE */}
      {phase === 'intro' && (
        <Card className="p-8 md:p-12 text-center animate-pop-in">
          <div className={`w-24 h-24 rounded-4xl bg-gradient-to-br ${lesson.color} flex items-center justify-center text-5xl mx-auto mb-6 shadow-soft-lg`}>
            {lesson.emoji}
          </div>
          <Badge variant={
            lesson.difficulty === 'Beginner' ? 'green' :
            lesson.difficulty === 'Intermediate' ? 'gold' : 'coral'
          } size="md">
            {lesson.difficulty}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-leaf-800 mt-4 mb-3">{lesson.title}</h1>
          <p className="text-lg text-leaf-600/70 max-w-xl mx-auto mb-8">{lesson.description}</p>

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-leaf-600/70">
              <BookIcon /> {lesson.slides.length} slides
            </div>
            <div className="flex items-center gap-2 text-leaf-600/70">
              <Lightbulb className="w-5 h-5" /> {lesson.quiz.length} questions
            </div>
            <div className="flex items-center gap-2 text-leaf-600/70">
              ⏱️ {lesson.duration} min
            </div>
          </div>

          <Button size="lg" onClick={handleStart} icon={<ArrowRight className="w-5 h-5" />}>
            Start Lesson
          </Button>
        </Card>
      )}

      {/* SLIDES PHASE */}
      {phase === 'slides' && (
        <Card className="p-8 md:p-12 animate-pop-in min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <Badge variant="teal" size="md">Slide {slideIndex + 1} of {lesson.slides.length}</Badge>
            <span className="text-sm font-bold text-leaf-600/50">{lesson.title}</span>
          </div>

          <div key={slideIndex} className="flex-1 flex flex-col items-center justify-center text-center animate-quiz-enter">
            <div className="text-7xl mb-6 animate-bounce-soft">{lesson.slides[slideIndex].emoji}</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-leaf-800 mb-4">{lesson.slides[slideIndex].title}</h2>
            <p className="text-lg text-leaf-600/80 leading-relaxed max-w-xl">{lesson.slides[slideIndex].content}</p>

            {lesson.slides[slideIndex].fact && (
              <div className="mt-6 bg-sun-50 border border-sun-200/50 rounded-2xl p-4 max-w-lg flex items-start gap-3 animate-slide-up">
                <Lightbulb className="w-5 h-5 text-sun-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-sun-700 text-left font-medium">{lesson.slides[slideIndex].fact}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              size="md"
              onClick={() => slideIndex > 0 ? setSlideIndex(slideIndex - 1) : setPhase('intro')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button size="md" onClick={handleNextSlide} icon={<ArrowRight className="w-4 h-4" />} className={slideIndex >= lesson.slides.length - 1 ? 'animate-glow-pulse' : ''}>
              {slideIndex < lesson.slides.length - 1 ? 'Next' : 'Start Quiz'}
            </Button>
          </div>
        </Card>
      )}

      {/* QUIZ PHASE */}
      {phase === 'quiz' && (
        <Card className="p-8 md:p-12 animate-pop-in min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <Badge variant="coral" size="md">Question {quizIndex + 1} of {lesson.quiz.length}</Badge>
            <span className="text-sm font-bold text-leaf-600/50">Quiz Time!</span>
          </div>

          <div key={quizIndex} className="flex-1 animate-quiz-enter">
            <h2 className="text-2xl md:text-3xl font-extrabold text-leaf-800 mb-8">{lesson.quiz[quizIndex].question}</h2>

            <div className="space-y-3">
              {lesson.quiz[quizIndex].options.map((option, index) => {
                const isCorrect = index === lesson.quiz[quizIndex].correctIndex;
                const isSelected = index === selectedAnswer;
                let stateClass = 'border-leaf-100 hover:border-leaf-300 hover:bg-leaf-50';
                if (showExplanation) {
                  if (isCorrect) {
                    stateClass = 'border-leaf-500 bg-leaf-50 animate-answer-reveal';
                  } else if (isSelected) {
                    stateClass = 'border-coral-400 bg-coral-50 animate-answer-reveal';
                  } else {
                    stateClass = 'border-leaf-100 opacity-50';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${stateClass} ${!showExplanation ? 'cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]' : 'cursor-default'}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className="font-semibold text-leaf-800">{option}</span>
                    {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-leaf-500" />}
                    {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-coral-400" />}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 animate-slide-up">
                <div className={`rounded-2xl p-4 flex items-start gap-3 ${
                  selectedAnswer === lesson.quiz[quizIndex].correctIndex
                    ? 'bg-leaf-50 border border-leaf-200'
                    : 'bg-coral-50 border border-coral-200'
                }`}>
                  {selectedAnswer === lesson.quiz[quizIndex].correctIndex ? (
                    <CheckCircle2 className="w-5 h-5 text-leaf-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-coral-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-leaf-800">
                      {selectedAnswer === lesson.quiz[quizIndex].correctIndex ? 'Correct!' : 'Not quite!'}
                    </p>
                    <p className="text-sm text-leaf-600/70 mt-1">{lesson.quiz[quizIndex].explanation}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button size="md" onClick={handleNextQuestion} icon={<ArrowRight className="w-4 h-4" />}>
                    {quizIndex < lesson.quiz.length - 1 ? 'Next Question' : 'See Results'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* RESULTS PHASE */}
      {phase === 'results' && (
        <Card className="p-8 md:p-12 text-center animate-pop-in">
          <div className="text-6xl mb-4 animate-bounce-soft">
            {correctCount === lesson.quiz.length ? '🎉' : correctCount >= lesson.quiz.length / 2 ? '🌟' : '🌱'}
          </div>
          <h2 className="text-3xl font-extrabold text-leaf-800 mb-2">
            {correctCount === lesson.quiz.length ? 'Perfect!' : correctCount >= lesson.quiz.length / 2 ? 'Great job!' : 'Keep learning!'}
          </h2>
          <p className="text-leaf-600/70 mb-6">You got {correctCount} out of {lesson.quiz.length} correct</p>

          {/* Score ring */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg width="140" height="140" className="-rotate-90">
                <circle cx="70" cy="70" r="60" fill="none" stroke="#e8f5ee" strokeWidth="12" />
                <circle
                  cx="70" cy="70" r="60" fill="none" stroke="url(#score-grad)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - correctCount / lesson.quiz.length)}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#57b87c" />
                    <stop offset="100%" stopColor="#1b9fb6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-extrabold gradient-text">{Math.round((correctCount / lesson.quiz.length) * 100)}%</div>
              </div>
            </div>
          </div>

          {/* Lesson completion badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-leaf-50 border border-leaf-200 rounded-full px-5 py-2 animate-slide-up">
              <CheckCircle2 className="w-5 h-5 text-leaf-500" />
              <span className="font-bold text-leaf-700 text-sm">Lesson Complete!</span>
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-leaf-50 rounded-2xl px-6 py-4 flex items-center gap-2 animate-pop-in" style={{ animationDelay: '0.2s' }}>
              <Zap className="w-6 h-6 text-leaf-500" />
              <div>
                <div className="text-2xl font-extrabold text-leaf-600">+{earnedXP}</div>
                <div className="text-xs text-leaf-600/60">XP earned</div>
              </div>
            </div>
            <div className="bg-sun-50 rounded-2xl px-6 py-4 flex items-center gap-2 animate-pop-in" style={{ animationDelay: '0.4s' }}>
              <Coins className="w-6 h-6 text-sun-500" />
              <div>
                <div className="text-2xl font-extrabold text-sun-600">+{Math.round(earnedXP * 0.2)}</div>
                <div className="text-xs text-sun-600/60">Eco Coins</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={handleRestart} icon={<RotateCcw className="w-4 h-4" />}>
              Try Again
            </Button>
            <Button onClick={closeLesson} icon={<ArrowRight className="w-4 h-4" />}>
              Back to Lessons
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function BookIcon() {
  return <span className="text-lg">📖</span>;
}
