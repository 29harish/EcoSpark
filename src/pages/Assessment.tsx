import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Leaf,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useApp } from '@/context/AppContext';
import {
  assessmentQuestions,
  assessmentTopics,
  buildAssessmentResult,
  topicDetails,
  type AssessmentResult,
  type AssessmentTopic,
} from '@/data/assessment';

type AssessmentView = 'welcome' | 'questions' | 'results' | 'review';

const recommendationCopy: Record<AssessmentTopic, { title: string; level: string; description: string }> = {
  Biodiversity: { title: 'Biodiversity Basics', level: 'Beginner', description: 'Build your foundation in habitats, species and protecting local wildlife.' },
  Water: { title: 'Water Conservation', level: 'Beginner', description: 'Learn practical ways to save, protect and share this precious resource.' },
  Waste: { title: 'Waste Wise', level: 'Beginner', description: 'Turn everyday choices into less waste through reuse, sorting and composting.' },
  Energy: { title: 'Renewable Energy', level: 'Beginner', description: 'Discover how clean energy and efficient habits reduce environmental impact.' },
  Soil: { title: 'Sustainable Soil', level: 'Intermediate', description: 'Explore the living world beneath our feet and how to help it flourish.' },
  'Climate & Pollution': { title: 'Climate & Clean Air', level: 'Beginner', description: 'Understand climate change and actions that create healthier air.' },
};

function TopicIcon({ topic }: { topic: AssessmentTopic }) {
  return <span className="text-xl">{topicDetails[topic].icon}</span>;
}

function ScoreBar({ topic, score }: { topic: AssessmentTopic; score: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm font-bold text-leaf-800">
        <span className="flex items-center gap-2"><TopicIcon topic={topic} /> {topic}</span>
        <span>{score}%</span>
      </div>
      <ProgressBar value={score} gradient="from-leaf-400 to-lagoon-500" height="h-2.5" />
    </div>
  );
}

function Results({ result, onDashboard, onReview }: { result: AssessmentResult; onDashboard: () => void; onReview: () => void }) {
  const strongest = result.strengths.map((topic) => topic).join(' & ');
  const improve = result.weakTopics.slice(0, 2).join(' and ');
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-leaf-400 to-lagoon-500 text-3xl shadow-soft">🌱</div>
        <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-leaf-600">Assessment complete</p>
        <h1 className="text-3xl font-black text-leaf-950 sm:text-4xl">Your Eco Profile 🌱</h1>
        <p className="mx-auto mt-3 max-w-xl text-leaf-600/75">Your results help EcoSpark shape a learning journey around what you already know.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-leaf-600 to-lagoon-600 p-7 text-center text-white">
          <div className="mb-3 text-sm font-bold text-white/75">Overall Eco Knowledge</div>
          <div className="flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-white/25 bg-white/10 text-5xl font-black">{result.overallScore}%</div>
          <div className="mt-5 rounded-full bg-white/15 px-4 py-2 text-sm font-black">{result.knowledgeLevel}</div>
        </Card>
        <Card className="p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2"><Target className="h-5 w-5 text-lagoon-500" /><h2 className="text-xl font-black text-leaf-900">Your topic scores</h2></div>
          <div className="grid gap-4 sm:grid-cols-2">{assessmentTopics.map((topic) => <ScoreBar key={topic} topic={topic} score={result.topicScores[topic]} />)}</div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Card className="p-6"><div className="mb-3 flex items-center gap-2 text-leaf-700"><Sparkles className="h-5 w-5 text-sun-500" /><h2 className="font-black">Your strengths</h2></div><p className="text-sm leading-relaxed text-leaf-600">You&apos;re strongest in <strong className="text-leaf-900">{strongest}</strong>. Keep using that curiosity to connect ideas across the environment.</p></Card>
        <Card className="p-6"><div className="mb-3 flex items-center gap-2 text-leaf-700"><BookOpen className="h-5 w-5 text-lagoon-500" /><h2 className="font-black">Improve next</h2></div><p className="text-sm leading-relaxed text-leaf-600">Let&apos;s improve your <strong className="text-leaf-900">{improve}</strong> knowledge with short, practical lessons.</p></Card>
      </div>

      <Card className="mt-5 p-6 sm:p-8">
        <div className="mb-5"><p className="text-xs font-black uppercase tracking-wider text-leaf-500">Made for you</p><h2 className="mt-1 text-2xl font-black text-leaf-900">Your Personalized Path</h2><p className="mt-1 text-sm text-leaf-600">Start with the topics where a little learning will make the biggest difference.</p></div>
        <div className="grid gap-3 md:grid-cols-3">{result.recommendedTopics.map((topic, index) => { const recommendation = recommendationCopy[topic]; return <div key={topic} className="rounded-2xl bg-leaf-50 p-4"><div className="mb-3 flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm"><TopicIcon topic={topic} /></span><span className="text-xs font-black text-leaf-400">0{index + 1}</span></div><h3 className="font-black text-leaf-900">{recommendation.title}</h3><span className="mt-1 inline-block rounded-full bg-white px-2 py-1 text-[10px] font-black text-leaf-600">{recommendation.level}</span><p className="mt-3 text-xs leading-relaxed text-leaf-600">{recommendation.description}</p></div>; })}</div>
      </Card>

      <div className="mt-6 flex flex-col-reverse justify-center gap-3 sm:flex-row"><Button variant="outline" onClick={onReview} icon={<RotateCcw className="h-4 w-4" />}>Review Answers</Button><Button onClick={onDashboard} icon={<ArrowRight className="h-4 w-4" />}>Go to My Dashboard</Button></div>
    </div>
  );
}

export function Assessment() {
  const { navigate, completeAssessment, assessmentResult, profile, user } = useApp();
  const userAssessmentResult = profile?.uid === user?.uid ? assessmentResult : null;
  const [view, setView] = useState<AssessmentView>(userAssessmentResult ? 'results' : 'welcome');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(userAssessmentResult?.answers ?? {});
  const [result, setResult] = useState<AssessmentResult | null>(userAssessmentResult);

  const question = assessmentQuestions[questionIndex];
  const selectedAnswer = answers[question.id];
  const progress = ((questionIndex + 1) / assessmentQuestions.length) * 100;
  const unanswered = useMemo(() => assessmentQuestions.filter((item) => !answers[item.id]).length, [answers]);

  const finish = () => {
    const nextResult = buildAssessmentResult(answers);
    setResult(nextResult);
    completeAssessment(nextResult);
    setView('results');
  };

  if (view === 'results' && result) {
    return <Results result={result} onDashboard={() => navigate('dashboard')} onReview={() => setView('review')} />;
  }

  if (view === 'review' && result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <button onClick={() => setView('results')} className="mb-6 flex items-center gap-2 text-sm font-bold text-leaf-600 hover:text-leaf-800"><ArrowLeft className="h-4 w-4" /> Back to results</button>
        <div className="mb-8"><p className="text-sm font-black uppercase tracking-[0.18em] text-leaf-600">Answer review</p><h1 className="mt-2 text-3xl font-black text-leaf-950">See what you learned</h1></div>
        <div className="space-y-4">{assessmentQuestions.map((item, index) => { const answer = result.answers[item.id]; const correct = answer === item.correctAnswer; return <Card key={item.id} className="p-5 sm:p-6"><div className="mb-3 flex items-start justify-between gap-3"><div><div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wider" style={{ color: topicDetails[item.topic].color }}><TopicIcon topic={item.topic} /> {item.topic} · Question {index + 1}</div><h2 className="font-black text-leaf-900">{item.question}</h2></div>{correct ? <CheckCircle2 className="h-6 w-6 shrink-0 text-leaf-500" /> : <XCircle className="h-6 w-6 shrink-0 text-coral-500" />}</div><div className="grid gap-2 text-sm sm:grid-cols-2"><div className={`rounded-xl p-3 ${correct ? 'bg-leaf-50 text-leaf-800' : 'bg-coral-50 text-coral-800'}`}><span className="block text-xs font-bold opacity-70">Your answer</span>{answer || 'Not answered'}</div><div className="rounded-xl bg-lagoon-50 p-3 text-lagoon-900"><span className="block text-xs font-bold opacity-70">Correct answer</span>{item.correctAnswer}</div></div><p className="mt-3 text-sm leading-relaxed text-leaf-600">{item.explanation}</p></Card>; })}</div>
        <div className="mt-6 text-center"><Button onClick={() => navigate('dashboard')} icon={<ArrowRight className="h-4 w-4" />}>Go to My Dashboard</Button></div>
      </div>
    );
  }

  if (view === 'welcome') {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center px-4 py-10 sm:px-6">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-leaf-100 px-3 py-1.5 text-xs font-black text-leaf-700"><Leaf className="h-4 w-4" /> EcoSpark onboarding</div><h1 className="text-4xl font-black leading-tight text-leaf-950 sm:text-5xl">Discover Your Eco Knowledge <span className="whitespace-nowrap">🌱</span></h1><p className="mt-5 max-w-xl text-lg leading-relaxed text-leaf-600/80">Let&apos;s understand what you already know so EcoSpark can create a learning journey made for you.</p><div className="mt-7 flex flex-wrap gap-3 text-sm font-bold text-leaf-700"><span className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-leaf-100"><BookOpen className="h-4 w-4 text-lagoon-500" /> 12 questions</span><span className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-leaf-100"><Clock3 className="h-4 w-4 text-sun-500" /> 3–5 minutes</span><span className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-leaf-100">No negative marking</span></div><Button className="mt-8" size="lg" onClick={() => setView('questions')} icon={<ArrowRight className="h-5 w-5" />}>Start Assessment</Button></div>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-leaf-500 to-lagoon-600 p-8 text-white shadow-soft-lg sm:p-12"><div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" /><div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-sun-300/20" /><div className="relative text-center"><div className="mb-6 text-8xl drop-shadow-lg sm:text-9xl">🌍</div><div className="mx-auto max-w-xs rounded-3xl bg-white/15 p-5 text-left backdrop-blur"><div className="mb-3 text-sm font-black">We&apos;ll explore</div><div className="grid grid-cols-2 gap-2 text-sm font-bold text-white/90"><span>🌳 Biodiversity</span><span>💧 Water</span><span>♻️ Waste</span><span>☀️ Energy</span><span>🌱 Soil</span><span>🌍 Climate</span></div></div><p className="mt-5 text-sm font-medium text-white/75">There are no wrong places to start. Every answer helps us guide you.</p></div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-7 flex items-center justify-between"><div><p className="text-sm font-black uppercase tracking-[0.18em] text-leaf-600">EcoSpark Assessment</p><p className="mt-1 text-sm font-bold text-leaf-500">Question {questionIndex + 1} of {assessmentQuestions.length}</p></div><div className="rounded-full bg-leaf-100 px-3 py-1.5 text-xs font-black text-leaf-700">{Math.round(progress)}%</div></div>
      <ProgressBar value={progress} gradient="from-leaf-400 to-lagoon-500" height="h-3" showGlow />
      <Card className="mt-8 p-6 sm:p-10"><div className="mb-8 flex items-center justify-between gap-4"><span className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black" style={{ color: topicDetails[question.topic].color, backgroundColor: `${topicDetails[question.topic].color}18` }}><TopicIcon topic={question.topic} /> {question.topic}</span><span className="text-xs font-bold text-leaf-400">{question.difficulty}</span></div><div className="mb-8 text-center"><div className="mb-4 text-5xl">{question.icon}</div><h1 className="text-2xl font-black leading-snug text-leaf-950 sm:text-3xl">{question.question}</h1></div><div className="grid gap-3">{question.options.map((option, index) => { const selected = selectedAnswer === option; return <button key={option} onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))} className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left text-sm font-bold transition-all sm:p-5 sm:text-base ${selected ? 'border-leaf-500 bg-leaf-50 text-leaf-900 shadow-soft' : 'border-leaf-100 bg-white text-leaf-700 hover:-translate-y-0.5 hover:border-leaf-300 hover:bg-leaf-50/50'}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black ${selected ? 'bg-leaf-600 text-white' : 'bg-leaf-50 text-leaf-500'}`}>{String.fromCharCode(65 + index)}</span>{option}{selected && <CheckCircle2 className="ml-auto h-5 w-5 text-leaf-500" />}</button>; })}</div><div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row"><Button variant="ghost" disabled={questionIndex === 0} onClick={() => setQuestionIndex((current) => current - 1)} icon={<ArrowLeft className="h-4 w-4" />}>Previous</Button><div className="flex items-center justify-between gap-3 sm:ml-auto"><span className="text-xs font-bold text-leaf-500">You&apos;re doing great! 🌱</span><Button disabled={!selectedAnswer} onClick={() => questionIndex === assessmentQuestions.length - 1 ? finish() : setQuestionIndex((current) => current + 1)} icon={<ArrowRight className="h-4 w-4" />}>{questionIndex === assessmentQuestions.length - 1 ? 'See Results' : 'Next'}</Button></div></div></Card><p className="mt-4 text-center text-xs font-medium text-leaf-500">{unanswered} question{unanswered === 1 ? '' : 's'} remaining</p>
    </div>
  );
}
