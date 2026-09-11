import { Card, GradientCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { PageHeader } from '@/components/layout/PageHeader';
import { useApp } from '@/context/AppContext';
import { achievements, gardenRanks } from '@/data/mockData';
import {
  Flame,
  Zap,
  Coins,
  Sprout,
  Trophy,
  Target,
  GraduationCap,
  Star,
  Lock,
  Award,
  TreePine,
  User,
} from 'lucide-react';

export function Profile() {
  const { level, xp, xpInCurrentLevel, xpForNextLevel, coins, streak, impactScore, gardenLevel, gardenRank, completedLessons, completedMissions, profile } = useApp();

  const xpProgress = (xpInCurrentLevel / xpForNextLevel) * 100;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <PageHeader title="Profile" icon={<User className="w-5 h-5" />} subtitle="Your eco journey at a glance. Keep learning and acting to grow!" />

      {/* Profile hero */}
      <GradientCard gradient="from-leaf-500 via-lagoon-500 to-leaf-600" className="p-8 mb-8 animate-slide-up relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-9xl opacity-10">🌍</div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 rounded-4xl bg-white/20 backdrop-blur flex items-center justify-center text-6xl shadow-soft-lg border-2 border-white/30">
            🐼
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-white">{profile?.displayName || 'Eco Explorer'}</h2>
            <p className="text-white/80 mt-1">Level {level} · {profile?.ecoLevel || gardenRank}</p>
            <div className="mt-3 flex items-center gap-3 justify-center md:justify-start">
              <div className="bg-white/20 backdrop-blur rounded-full px-3 py-1.5 text-sm font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> {xp.toLocaleString()} XP
              </div>
              <div className="bg-white/20 backdrop-blur rounded-full px-3 py-1.5 text-sm font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> {streak} days
              </div>
              <div className="bg-white/20 backdrop-blur rounded-full px-3 py-1.5 text-sm font-bold text-white flex items-center gap-1.5">
                <Coins className="w-4 h-4" /> {coins}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing progress={xpProgress} size={90} strokeWidth={8} colorFrom="#ffffff" colorTo="#fcb816">
              <div className="text-center">
                <div className="text-xl font-extrabold text-white">{level}</div>
                <div className="text-xs text-white/70">Level</div>
              </div>
            </ProgressRing>
            <div className="text-xs text-white/70 mt-1">{xpInCurrentLevel}/{xpForNextLevel} XP</div>
          </div>
        </div>
      </GradientCard>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="p-5 text-center animate-slide-up">
          <GraduationCap className="w-7 h-7 text-leaf-500 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-leaf-700">{completedLessons}</div>
          <div className="text-sm text-leaf-600/60 font-medium">Lessons Done</div>
        </Card>
        <Card className="p-5 text-center animate-slide-up">
          <Zap className="w-7 h-7 text-coral-400 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-leaf-700">{impactScore}</div>
          <div className="text-sm text-leaf-600/60 font-medium">Impact Score</div>
        </Card>
        <Card className="p-5 text-center animate-slide-up">
          <Target className="w-7 h-7 text-coral-400 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-leaf-700">{completedMissions}</div>
          <div className="text-sm text-leaf-600/60 font-medium">Missions Done</div>
        </Card>
        <Card className="p-5 text-center animate-slide-up">
          <Sprout className="w-7 h-7 text-lagoon-500 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-leaf-700">{gardenLevel}</div>
          <div className="text-sm text-leaf-600/60 font-medium">Garden Level</div>
        </Card>
        <Card className="p-5 text-center animate-slide-up">
          <Award className="w-7 h-7 text-sun-500 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-leaf-700">{unlockedAchievements}</div>
          <div className="text-sm text-leaf-600/60 font-medium">Badges Earned</div>
        </Card>
      </div>

      {/* Achievements */}
      <h3 className="text-xl font-extrabold text-leaf-800 mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-sun-400" /> Achievements
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {achievements.map((ach) => (
          <Card key={ach.id} className={`p-5 text-center transition-all ${ach.unlocked ? 'hover:shadow-soft-lg hover:-translate-y-1' : 'opacity-50'}`}>
            <div className={`text-4xl mb-2 ${ach.unlocked ? '' : 'grayscale'}`}>
              {ach.unlocked ? ach.emoji : '🔒'}
            </div>
            <div className={`font-bold text-sm ${ach.unlocked ? 'text-leaf-800' : 'text-leaf-400'}`}>{ach.title}</div>
            <div className="text-xs text-leaf-600/50 mt-1 leading-tight">{ach.description}</div>
            {ach.unlocked && ach.date && (
              <div className="mt-2">
                <Badge variant="green" size="sm" icon={<Star className="w-3 h-3" />}>{ach.date}</Badge>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Garden rank progression */}
      <h3 className="text-xl font-extrabold text-leaf-800 mb-4 flex items-center gap-2">
        <TreePine className="w-5 h-5 text-leaf-500" /> Garden Journey
      </h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {gardenRanks.map((rank, i) => {
          const isUnlocked = level >= rank.minLevel;
          const isCurrent = rank.name === gardenRank;
          return (
            <Card key={i} className={`p-6 text-center transition-all ${isCurrent ? 'ring-2 ring-leaf-400 shadow-soft-lg' : ''}`}>
              <div className={`text-5xl mb-3 ${isUnlocked ? '' : 'grayscale opacity-40'}`}>{rank.emoji}</div>
              <div className={`font-extrabold ${isUnlocked ? 'text-leaf-800' : 'text-leaf-400'}`}>{rank.name}</div>
              <div className="text-xs text-leaf-600/60 mt-1">{rank.description}</div>
              <div className="mt-3">
                {isUnlocked ? (
                  <Badge variant="green" size="sm" icon={<Star className="w-3 h-3" />}>Unlocked</Badge>
                ) : (
                  <Badge variant="gray" size="sm" icon={<Lock className="w-3 h-3" />}>Lv {rank.minLevel}+</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
