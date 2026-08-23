import { useState } from 'react';
import { Card, GradientCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { quizQuestions } from '@/data/mockData';
import { useFeedback } from '@/components/ui/FeedbackToast';
import { HelpCircle, Star, Clock, Zap, Coins, CheckCircle2, Play, Trophy, Brain } from 'lucide-react';

export function Quizzes() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const quiz = quizQuestions.find(q => q.id === selectedQuiz);

  if (quiz) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <QuizPlayer quiz={quiz} onExit={() => setSelectedQuiz(null)} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Quizzes"
        icon={<Brain className="w-5 h-5" />}
        subtitle="Test your knowledge and earn bonus XP. Each quiz covers a different sustainability topic!"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizQuestions.map((q, i) => (
          <Card key={q.id} className={`overflow-hidden animate-slide-up stagger-${Math.min(i + 1, 8)} group cursor-pointer`} hover onClick={() => setSelectedQuiz(q.id)}>
            <div className={`h-28 bg-gradient-to-br ${q.color} relative flex items-center justify-center`}>
              <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{q.emoji}</div>
              {q.completed && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2.5 py-1 text-xs font-bold text-leaf-600">
                  <Trophy className="w-3 h-3" /> {q.bestScore}%
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={q.difficulty === 'Beginner' ? 'green' : q.difficulty === 'Intermediate' ? 'gold' : 'coral'} size="sm">
                  {q.difficulty}
                </Badge>
                <Badge variant="gold" size="sm">+{q.xpReward} XP</Badge>
              </div>
              <h3 className="font-extrabold text-leaf-800 mb-1 group-hover:text-leaf-600 transition-colors">{q.title}</h3>
              <div className="flex items-center gap-3 text-xs text-leaf-600/60 mt-2">
                <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /> {q.questions} questions</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~{q.questions} min</span>
              </div>
              <div className="mt-4">
                <Button size="sm" fullWidth variant={q.completed ? 'outline' : 'primary'} icon={<Play className="w-4 h-4" />}>
                  {q.completed ? 'Retake Quiz' : 'Start Quiz'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function QuizPlayer({ quiz, onExit }: { quiz: typeof quizQuestions[0]; onExit: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const { showXP, showCoin } = useFeedback();

  const questions = [
    { q: 'What is the main greenhouse gas?', options: ['Oxygen', 'CO₂', 'Nitrogen', 'Helium'], correct: 1 },
    { q: 'Which R comes first?', options: ['Recycle', 'Reuse', 'Reduce', 'Remove'], correct: 2 },
    { q: 'What do pollinators do?', options: ['Make honey', 'Pollinate plants', 'Eat leaves', 'Build nests'], correct: 1 },
    { q: 'How long does plastic take to break down?', options: ['A few days', 'A year', 'Hundreds of years', 'Never'], correct: 2 },
    { q: 'What does solar energy use?', options: ['Wind', 'Sunlight', 'Water', 'Coal'], correct: 1 },
  ];

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const xpEarned = Math.round(quiz.xpReward * (percentage / 100));
    const coinsEarned = Math.round(xpEarned * 0.2);

    if (!rewarded) {
      showXP(xpEarned);
      showCoin(coinsEarned);
      setRewarded(true);
    }

    return (
      <Card className="p-8 md:p-12 text-center animate-pop-in">
        <div className="text-6xl mb-4 animate-bounce-soft">{percentage === 100 ? '🎉' : percentage >= 60 ? '🌟' : '🌱'}</div>
        <h2 className="text-3xl font-extrabold text-leaf-800 mb-2">{percentage === 100 ? 'Perfect Score!' : percentage >= 60 ? 'Well Done!' : 'Keep Learning!'}</h2>
        <p className="text-leaf-600/70 mb-6">You scored {score} out of {questions.length} ({percentage}%)</p>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="bg-leaf-50 rounded-2xl px-6 py-4 flex items-center gap-2 animate-pop-in" style={{ animationDelay: '0.2s' }}>
            <Zap className="w-6 h-6 text-leaf-500" />
            <div>
              <div className="text-2xl font-extrabold text-leaf-600">+{xpEarned}</div>
              <div className="text-xs text-leaf-600/60">XP earned</div>
            </div>
          </div>
          <div className="bg-sun-50 rounded-2xl px-6 py-4 flex items-center gap-2 animate-pop-in" style={{ animationDelay: '0.4s' }}>
            <Coins className="w-6 h-6 text-sun-500" />
            <div>
              <div className="text-2xl font-extrabold text-sun-600">+{coinsEarned}</div>
              <div className="text-xs text-sun-600/60">Eco Coins</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => { setFinished(false); setCurrentQ(0); setScore(0); setSelected(null); setShowResult(false); setRewarded(false); }}>
            Retake
          </Button>
          <Button onClick={onExit}>Back to Quizzes</Button>
        </div>
      </Card>
    );
  }

  const question = questions[currentQ];

  return (
    <Card className="p-8 md:p-12 animate-pop-in">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="coral" size="md">Question {currentQ + 1} of {questions.length}</Badge>
        <button onClick={onExit} className="text-sm font-bold text-leaf-600 hover:text-leaf-700 transition-colors">Exit</button>
      </div>

      {/* Quiz progress bar */}
      <div className="mb-6">
        <ProgressBar value={((currentQ + (showResult ? 1 : 0)) / questions.length) * 100} gradient="from-coral-400 to-sun-400" height="h-1.5" showGlow />
      </div>

      <div key={currentQ} className="text-center mb-8 animate-quiz-enter">
        <div className="text-4xl mb-3">{quiz.emoji}</div>
        <h2 className="text-2xl font-extrabold text-leaf-800">{question.q}</h2>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, idx) => {
          let cls = 'border-leaf-100 hover:border-leaf-300 hover:bg-leaf-50';
          if (showResult) {
            if (idx === question.correct) cls = 'border-leaf-500 bg-leaf-50 animate-answer-reveal';
            else if (idx === selected) cls = 'border-coral-400 bg-coral-50 animate-answer-reveal';
            else cls = 'border-leaf-100 opacity-50';
          }
          return (
            <button
              key={idx}
              onClick={() => { if (!showResult) { setSelected(idx); setShowResult(true); if (idx === question.correct) setScore(s => s + 1); } }}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 font-semibold text-leaf-800 ${cls} ${!showResult ? 'hover:-translate-y-0.5 active:scale-[0.99]' : ''}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {opt}
              {showResult && idx === question.correct && <CheckCircle2 className="w-5 h-5 text-leaf-500 inline ml-2" />}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="flex justify-end">
          <Button onClick={() => {
            if (currentQ < questions.length - 1) { setCurrentQ(c => c + 1); setSelected(null); setShowResult(false); }
            else setFinished(true);
          }}>
            {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        </div>
      )}
    </Card>
  );
}
