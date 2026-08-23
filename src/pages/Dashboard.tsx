import { useEffect, useState } from 'react';
import { Card, GradientCard, GlassCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { PageHeader } from '@/components/layout/PageHeader';
import { useApp } from '@/context/AppContext';
import { missions, leaderboardSchool, gardenRanks } from '@/data/mockData';
import {
  Flame,
  Coins,
  Zap,
  Target,
  Sprout,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Circle,
  Star,
  TrendingUp,
  Award,
  Sparkles,
  Play,
} from 'lucide-react';

export function Dashboard() {
  const { level, xp, xpInCurrentLevel, xpForNextLevel, coins, streak, gardenLevel, gardenRank, lessons, missions: userMissions, completedLessons, completedMissions, navigate, openLesson } = useApp();

  // Brief simulated load so the first paint doesn't feel like an
  // instant flash — real data-fetching apps have this naturally,
  // ours is local-only so we fake a short delay on mount.
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const xpProgress = (xpInCurrentLevel / xpForNextLevel) * 100;
  const currentRank = gardenRanks.find(r => r.name === gardenRank) || gardenRanks[0];
  const nextRank = gardenRanks.find(r => r.minLevel > level) || gardenRanks[gardenRanks.length - 1];

  const todaysMissions = userMissions.slice(0, 3);
  const continueLessons = lessons.filter(l => !l.completed).slice(0, 3);
  const myRank = leaderboardSchool.find(e => e.isCurrentUser);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader title={`${greeting}!`} icon={<Sprout className="w-5 h-5" />} subtitle="Ready to make a difference today? Here's your eco journey at a glance.">
        <Button size="sm" onClick={() => {
          const firstLesson = lessons.find(l => !l.completed);
          if (firstLesson) openLesson(firstLesson.id);
          else navigate('learn');
        }} icon={<Play className="w-4 h-4" />}>
          Continue Learning
        </Button>
      </PageHeader>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GradientCard gradient="from-leaf-500 to-lagoon-500" className="p-5 animate-slide-up stagger-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-6 h-6 text-white/80" />
            <Badge variant="green" size="sm" className="!bg-white/20 !text-white">Level {level}</Badge>
          </div>
          <div className="text-3xl font-extrabold text-white">{xp.toLocaleString()}</div>
          <div className="text-sm text-white/70 font-medium">Total XP</div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>{xpInCurrentLevel} XP</span>
              <span>{xpForNextLevel} XP</span>
            </div>
            <ProgressBar value={xpProgress} gradient="from-white to-white" height="h-2" />
          </div>
        </GradientCard>

        <Card className="p-5 animate-slide-up stagger-2" hover>
          <div className="flex items-center justify-between mb-2">
            <Coins className="w-6 h-6 text-sun-500" />
            <Badge variant="gold" size="sm">Eco Coins</Badge>
          </div>
          <div className="text-3xl font-extrabold text-sun-600">{coins}</div>
          <div className="text-sm text-leaf-600/60 font-medium">Spend on rewards</div>
          <button onClick={() => navigate('rewards')} className="mt-3 text-xs font-bold text-sun-600 hover:text-sun-700 flex items-center gap-1">
            Visit shop <ArrowRight className="w-3 h-3" />
          </button>
        </Card>

        <Card className="p-5 animate-slide-up stagger-3" hover>
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-6 h-6 text-coral-500" />
            <Badge variant="coral" size="sm">Streak</Badge>
          </div>
          <div className="text-3xl font-extrabold text-coral-600">{streak} days</div>
          <div className="text-sm text-leaf-600/60 font-medium">Keep it going!</div>
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${i < streak % 7 || (streak % 7 === 0 && streak > 0) ? 'bg-coral-400' : 'bg-coral-100'}`} />
            ))}
          </div>
        </Card>

        <Card className="p-5 animate-slide-up stagger-4 col-span-2 lg:col-span-4 flex items-center justify-between" hover>
          <div className="flex items-center gap-4">
            <Trophy className="w-6 h-6 text-sun-500 flex-shrink-0" />
            <div>
              <div className="text-sm text-leaf-600/60 font-medium">School Rank</div>
              <div className="text-lg font-extrabold text-leaf-700">#{myRank?.rank || 3} <span className="text-sm font-medium text-leaf-600/60">· {myRank?.xp.toLocaleString() || '2,450'} XP</span></div>
            </div>
          </div>
          <button onClick={() => navigate('leaderboard')} className="text-xs font-bold text-leaf-600 hover:text-leaf-700 flex items-center gap-1 flex-shrink-0">
            View leaderboard <ArrowRight className="w-3 h-3" />
          </button>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Continue learning + Today's missions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue learning */}
          <Card className="p-6 animate-slide-up stagger-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-leaf-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sun-400" />
                Continue Learning
              </h3>
              <button onClick={() => navigate('learn')} className="text-sm font-bold text-leaf-600 hover:text-leaf-700 flex items-center gap-1">
                All lessons <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {continueLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => openLesson(lesson.id)}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-leaf-50 transition-colors cursor-pointer group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lesson.color} flex items-center justify-center text-2xl shadow-soft flex-shrink-0`}>
                    {lesson.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-leaf-800 truncate group-hover:text-leaf-600 transition-colors">{lesson.title}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-leaf-600/60">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {lesson.difficulty}</span>
                      <span>{lesson.duration} min</span>
                      <Badge variant="gold" size="sm">+{lesson.xpReward} XP</Badge>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-leaf-100 flex items-center justify-center text-leaf-600 group-hover:bg-leaf-500 group-hover:text-white transition-all">
                    <Play className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Today's missions */}
          <Card className="p-6 animate-slide-up stagger-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-leaf-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-coral-400" />
                Today's Missions
              </h3>
              <button onClick={() => navigate('missions')} className="text-sm font-bold text-leaf-600 hover:text-leaf-700 flex items-center gap-1">
                All missions <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {todaysMissions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => navigate('missions')}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-cream-50 border border-leaf-100/30 hover:bg-leaf-50 hover:border-leaf-200 transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mission.color} flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    {mission.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-leaf-800">{mission.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="green" size="sm">+{mission.xpReward} XP</Badge>
                      <Badge variant="gold" size="sm">+{mission.coinReward} 🪙</Badge>
                    </div>
                    {mission.progress > 0 && mission.progress < 100 && (
                      <div className="mt-2">
                        <ProgressBar value={mission.progress} gradient="from-coral-400 to-sun-400" height="h-1.5" />
                      </div>
                    )}
                  </div>
                  {mission.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-leaf-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-leaf-200 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Garden preview + Leaderboard */}
        <div className="space-y-6">
          {/* Garden preview */}
          <Card className="p-0 animate-slide-up stagger-5 relative overflow-hidden">
            <img
              src="/ecogarden.png"
              alt="Your eco garden preview"
              className="w-full h-32 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-extrabold text-leaf-800 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-leaf-500" /> Eco Garden
                </h3>
                <Badge variant="green" size="sm">Lv {gardenLevel}</Badge>
              </div>

              <div className="mb-4">
                <div className="text-lg font-extrabold text-leaf-800">{gardenRank}</div>
                <div className="text-xs text-leaf-600/60 mt-1">{currentRank.description}</div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-leaf-600/60 mb-1">
                  <span>Next: {nextRank.name}</span>
                  <span>Lv {nextRank.minLevel}</span>
                </div>
                <ProgressBar value={xpProgress} gradient="from-leaf-400 to-lagoon-400" height="h-2" />
              </div>

              <Button variant="accent" fullWidth size="sm" onClick={() => navigate('garden')} icon={<Sprout className="w-4 h-4" />}>
                Visit Garden
              </Button>
            </div>
          </Card>

          {/* Leaderboard mini */}
          <Card className="p-6 animate-slide-up stagger-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-leaf-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-sun-400" />
                School Rankings
              </h3>
              <button onClick={() => navigate('leaderboard')} className="text-xs font-bold text-leaf-600 hover:text-leaf-700">
                View all
              </button>
            </div>

            <div className="space-y-2">
              {leaderboardSchool.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => navigate('leaderboard')}
                  className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all cursor-pointer ${
                    entry.isCurrentUser ? 'bg-leaf-50 border border-leaf-200' : 'hover:bg-cream-50 hover:scale-[1.02]'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                    entry.rank === 1 ? 'bg-sun-400 text-white' :
                    entry.rank === 2 ? 'bg-gray-300 text-white' :
                    entry.rank === 3 ? 'bg-coral-300 text-white' :
                    'bg-leaf-100 text-leaf-600'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-leaf-50 flex items-center justify-center text-lg flex-shrink-0">
                    {entry.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold truncate ${entry.isCurrentUser ? 'text-leaf-700' : 'text-leaf-800'}`}>
                      {entry.name}
                    </div>
                    <div className="text-xs text-leaf-600/60">Lv {entry.level} · {entry.streak}🔥</div>
                  </div>
                  <div className="text-sm font-bold text-leaf-600">{entry.xp.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
