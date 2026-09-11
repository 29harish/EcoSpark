import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Clock, Coins, GraduationCap, HelpCircle, Play, Target, Trophy, UserRound, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, GradientCard } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useApp } from '@/context/AppContext';
import { categories, quizQuestions, type Difficulty } from '@/data/mockData';
import { useFeedback } from '@/components/ui/FeedbackToast';

type Quiz = (typeof quizQuestions)[number];

export function LearnHub() {
  const { lessons, openLesson, completedLessons, level, xp, xpInCurrentLevel, xpForNextLevel, profile, user, navigate } = useApp();
  const [category, setCategory] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredLessons = useMemo(
    () => category ? lessons.filter((lesson) => lesson.categoryId === category) : lessons,
    [category, lessons],
  );
  const continueLesson = lessons.find((lesson) => !lesson.completed) ?? lessons[0];
  const completion = lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0;
  const displayName = profile?.displayName?.trim() || user?.displayName?.trim() || user?.email?.split('@')[0] || 'Eco learner';

  if (loading) {
    return <div className="p-4 md:p-8 max-w-7xl mx-auto"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div></div>;
  }

  if (quiz) {
    return <div className="p-4 md:p-8 max-w-3xl mx-auto"><QuizPlayer quiz={quiz} onExit={() => setQuiz(null)} /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Learn & Grow" icon={<GraduationCap className="w-5 h-5" />} subtitle="Build practical eco knowledge, take action, and grow your impact." />

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 mb-8">
        <GradientCard gradient="from-leaf-500 to-lagoon-500" className="p-6 animate-slide-up">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/75 flex items-center gap-2"><UserRound className="w-4 h-4" /> {displayName}</p>
              <h2 className="text-2xl font-extrabold mt-2">Keep growing your eco skills</h2>
              <p className="text-white/80 text-sm mt-1">{completedLessons} of {lessons.length} lessons completed</p>
            </div>
            <div className="text-right"><span className="text-3xl font-extrabold">{completion}%</span><p className="text-xs text-white/70">journey</p></div>
          </div>
          <ProgressBar value={completion} gradient="from-white to-sun-200" height="h-2.5" className="mt-5" />
          <div className="flex flex-wrap items-center gap-3 mt-5 text-sm text-white/85">
            <span className="bg-white/15 rounded-full px-3 py-1">Level {level}</span>
            <span>{xp.toLocaleString()} total XP · {xpInCurrentLevel}/{xpForNextLevel} XP to next level</span>
          </div>
        </GradientCard>
        <Card className="p-6 flex flex-col justify-between animate-slide-up">
          <div><Badge variant="teal" size="sm">Continue learning</Badge><h3 className="text-xl font-extrabold text-leaf-800 mt-3">{continueLesson?.title ?? 'All lessons complete!'}</h3><p className="text-sm text-leaf-600/65 mt-1">{continueLesson ? `${continueLesson.duration} minutes · ${continueLesson.completed ? 'Review any time' : 'Next in your journey'}` : 'Explore a knowledge check or mission.'}</p></div>
          <Button className="mt-5" onClick={() => continueLesson ? openLesson(continueLesson.id) : navigate('missions')} icon={<Play className="w-4 h-4" />}>{continueLesson?.completed ? 'Review lesson' : 'Resume lesson'}</Button>
        </Card>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        <FilterButton active={!category} onClick={() => setCategory(null)}>{<BookOpen className="w-4 h-4" />} All topics</FilterButton>
        {categories.map((item) => <FilterButton key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>{item.emoji} {item.name}</FilterButton>)}
      </div>

      {!category && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {categories.map((item) => {
          const topicLessons = lessons.filter((lesson) => lesson.categoryId === item.id);
          const done = topicLessons.filter((lesson) => lesson.completed).length;
          return <GradientCard key={item.id} gradient={item.gradient} hover onClick={() => setCategory(item.id)} className="p-5"><div className="text-3xl">{item.emoji}</div><h3 className="font-extrabold text-lg mt-3">{item.name}</h3><p className="text-sm text-white/80 mt-1 line-clamp-2">{item.description}</p><div className="flex justify-between text-xs font-bold mt-4"><span>{done}/{topicLessons.length} complete</span><span>{topicLessons.length ? Math.round(done / topicLessons.length * 100) : 0}%</span></div><ProgressBar value={topicLessons.length ? done / topicLessons.length * 100 : 0} gradient="from-white to-white" height="h-1.5" className="mt-2" /></GradientCard>;
        })}
      </div>}

      <section className="mb-10">
        <div className="flex items-end justify-between mb-4"><div><h2 className="text-2xl font-extrabold text-leaf-800">{category ? 'Lessons in this topic' : 'Explore lessons'}</h2><p className="text-sm text-leaf-600/60 mt-1">Every lesson includes a knowledge check and a reward.</p></div>{category && <button className="text-sm font-bold text-leaf-600" onClick={() => setCategory(null)}>View all</button>}</div>
        {filteredLessons.length === 0 ? <Card className="p-8 text-center"><p className="font-bold text-leaf-800">No lessons in this topic yet.</p></Card> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{filteredLessons.map((lesson) => <Card key={lesson.id} hover onClick={() => openLesson(lesson.id)} className="overflow-hidden"><div className={`h-28 bg-gradient-to-br ${lesson.color} flex items-center justify-center relative`}><span className="text-5xl">{lesson.emoji}</span><span className="absolute top-3 left-3 bg-white/90 text-leaf-700 text-xs font-bold rounded-full px-2 py-1">{lesson.completed ? 'Completed' : 'Not started'}</span>{lesson.completed && <CheckCircle2 className="absolute top-3 right-3 w-6 h-6 text-white" />}</div><div className="p-5"><div className="flex gap-2 flex-wrap"><DifficultyBadge difficulty={lesson.difficulty} /><Badge variant="gold" size="sm"><Zap className="w-3 h-3" /> +{lesson.xpReward} XP</Badge></div><h3 className="font-extrabold text-leaf-800 mt-3">{lesson.title}</h3><p className="text-sm text-leaf-600/70 mt-1 line-clamp-2">{lesson.description}</p><div className="flex justify-between items-center mt-4 text-xs text-leaf-600/60"><span className="flex gap-1 items-center"><Clock className="w-3 h-3" /> {lesson.duration} min</span><span className="font-bold text-leaf-500 flex items-center gap-1">{lesson.completed ? 'Review' : 'Start'} <ArrowRight className="w-3 h-3" /></span></div></div></Card>)}</div>}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4"><div><h2 className="text-2xl font-extrabold text-leaf-800 flex items-center gap-2"><Trophy className="w-5 h-5 text-sun-500" /> Knowledge checks</h2><p className="text-sm text-leaf-600/60 mt-1">Check your understanding and earn bonus XP.</p></div><Button variant="outline" size="sm" onClick={() => navigate('missions')} icon={<Target className="w-4 h-4" />}>Take action</Button></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{quizQuestions.filter((item) => !category || item.categoryId === category).map((item) => <Card key={item.id} className="p-5" hover><div className={`h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl`}>{item.emoji}</div><div className="flex gap-2 mt-4"><DifficultyBadge difficulty={item.difficulty} /><Badge variant="gold" size="sm"><Zap className="w-3 h-3" /> +{item.xpReward} XP</Badge></div><h3 className="font-extrabold text-leaf-800 mt-3">{item.title}</h3><p className="text-xs text-leaf-600/60 mt-1 flex items-center gap-1"><HelpCircle className="w-3 h-3" /> {item.questions} questions</p><Button fullWidth size="sm" className="mt-4" variant={item.completed ? 'outline' : 'primary'} onClick={() => setQuiz(item)} icon={<Play className="w-4 h-4" />}>{item.completed ? `Retake · ${item.bestScore}%` : 'Start check'}</Button></Card>)}</div>
      </section>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-2xl text-sm font-bold ${active ? 'bg-gradient-to-r from-leaf-500 to-lagoon-500 text-white shadow-soft' : 'bg-white text-leaf-700 border border-leaf-100 hover:bg-leaf-50'}`}>{children}</button>;
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <Badge variant={difficulty === 'Beginner' ? 'green' : difficulty === 'Intermediate' ? 'gold' : 'coral'} size="sm">{difficulty}</Badge>;
}

function QuizPlayer({ quiz, onExit }: { quiz: Quiz; onExit: () => void }) {
  const { grantReward } = useApp();
  const { showXP, showCoin, showInfo } = useFeedback();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const questions = [
    { q: 'What is the main greenhouse gas?', options: ['Oxygen', 'CO₂', 'Nitrogen', 'Helium'], correct: 1 },
    { q: 'Which R comes first?', options: ['Recycle', 'Reuse', 'Reduce', 'Remove'], correct: 2 },
    { q: 'What do pollinators do?', options: ['Make honey', 'Pollinate plants', 'Eat leaves', 'Build nests'], correct: 1 },
    { q: 'How long does plastic take to break down?', options: ['A few days', 'A year', 'Hundreds of years', 'Never'], correct: 2 },
    { q: 'What does solar energy use?', options: ['Wind', 'Sunlight', 'Water', 'Coal'], correct: 1 },
  ];
  const percentage = Math.round(score / questions.length * 100);
  const finish = async () => {
    const xpEarned = Math.round(quiz.xpReward * percentage / 100);
    const coinsEarned = Math.round(xpEarned * 0.2);
    setSaving(true);
    try { await grantReward('quiz', xpEarned, coinsEarned); showXP(xpEarned); showCoin(coinsEarned); setFinished(true); } catch (error) { showInfo(error instanceof Error ? error.message : 'Unable to save quiz reward.'); } finally { setSaving(false); }
  };
  if (finished) return <Card className="p-8 md:p-12 text-center"><div className="text-6xl mb-4">{percentage === 100 ? '🎉' : percentage >= 60 ? '🌟' : '🌱'}</div><h2 className="text-3xl font-extrabold text-leaf-800">Knowledge check complete</h2><p className="text-leaf-600/70 mt-2">You scored {score} of {questions.length} ({percentage}%).</p><div className="flex justify-center gap-3 mt-6"><Badge variant="green" size="md"><Zap className="w-4 h-4" /> +{Math.round(quiz.xpReward * percentage / 100)} XP</Badge><Badge variant="gold" size="md"><Coins className="w-4 h-4" /> +{Math.round(quiz.xpReward * percentage / 100 * 0.2)} coins</Badge></div><Button className="mt-8" onClick={onExit}>Back to Learn</Button></Card>;
  const question = questions[current];
  return <Card className="p-8 md:p-12"><div className="flex justify-between items-center"><Badge variant="coral" size="md">Question {current + 1} of {questions.length}</Badge><button onClick={onExit} className="text-sm font-bold text-leaf-600">Exit</button></div><ProgressBar value={(current + (selected !== null ? 1 : 0)) / questions.length * 100} gradient="from-coral-400 to-sun-400" height="h-1.5" className="mt-4" /><h2 className="text-2xl font-extrabold text-leaf-800 mt-8 mb-6">{question.q}</h2><div className="space-y-3">{question.options.map((option, index) => <button key={option} disabled={selected !== null} onClick={() => { setSelected(index); if (index === question.correct) setScore((value) => value + 1); }} className={`w-full text-left p-4 rounded-2xl border-2 font-semibold ${selected === null ? 'border-leaf-100 hover:bg-leaf-50' : index === question.correct ? 'border-leaf-500 bg-leaf-50' : index === selected ? 'border-coral-400 bg-coral-50' : 'border-leaf-100 opacity-50'}`}>{option}{selected !== null && index === question.correct && <CheckCircle2 className="inline ml-2 w-5 h-5 text-leaf-500" />}</button>)}</div>{selected !== null && <Button className="mt-6 ml-auto" disabled={saving} onClick={() => current < questions.length - 1 ? (setCurrent((value) => value + 1), setSelected(null)) : void finish()}>{saving ? 'Saving...' : current < questions.length - 1 ? 'Next question' : 'See results'}</Button>}</Card>;
}
