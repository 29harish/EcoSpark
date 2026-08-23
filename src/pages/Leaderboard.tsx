import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { useApp } from '@/context/AppContext';
import { leaderboardSchool, leaderboardFriends, leaderboardGlobal, type LeaderboardEntry } from '@/data/mockData';
import { Trophy, Flame, Target, Zap, TrendingUp, Crown, Medal, Award } from 'lucide-react';

type Scope = 'friends' | 'school' | 'global';
type Metric = 'xp' | 'missions' | 'streak' | 'impact';

export function Leaderboard() {
  const [scope, setScope] = useState<Scope>('school');
  const [metric, setMetric] = useState<Metric>('xp');

  const data: Record<Scope, LeaderboardEntry[]> = {
    friends: leaderboardFriends,
    school: leaderboardSchool,
    global: leaderboardGlobal,
  };

  const sorted = [...data[scope]].sort((a, b) => {
    const valA = metric === 'xp' ? a.xp : metric === 'missions' ? a.missions : metric === 'streak' ? a.streak : a.impact;
    const valB = metric === 'xp' ? b.xp : metric === 'missions' ? b.missions : metric === 'streak' ? b.streak : b.impact;
    return valB - valA;
  });

  const scopes: { id: Scope; label: string; icon: string }[] = [
    { id: 'friends', label: 'Friends', icon: '👥' },
    { id: 'school', label: 'School', icon: '🏫' },
    { id: 'global', label: 'Global', icon: '🌍' },
  ];

  const metrics: { id: Metric; label: string; icon: React.ReactNode }[] = [
    { id: 'xp', label: 'XP', icon: <Zap className="w-4 h-4" /> },
    { id: 'missions', label: 'Missions', icon: <Target className="w-4 h-4" /> },
    { id: 'streak', label: 'Streak', icon: <Flame className="w-4 h-4" /> },
    { id: 'impact', label: 'Impact', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const getMetricValue = (entry: LeaderboardEntry) => {
    return metric === 'xp' ? entry.xp : metric === 'missions' ? entry.missions : metric === 'streak' ? entry.streak : entry.impact;
  };

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Leaderboard"
        icon={<Trophy className="w-5 h-5" />}
        subtitle="See how you rank against friends, your school, and the world. Keep learning to climb higher!"
      />

      {/* Scope tabs */}
      <div className="flex gap-3 mb-6">
        {scopes.map((s) => (
          <button
            key={s.id}
            onClick={() => setScope(s.id)}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              scope === s.id
                ? 'bg-gradient-to-r from-leaf-500 to-lagoon-500 text-white shadow-soft'
                : 'bg-white text-leaf-700 border border-leaf-100 hover:bg-leaf-50'
            }`}
          >
            <span className="text-lg">{s.icon}</span> {s.label}
          </button>
        ))}
      </div>

      {/* Metric tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {metrics.map((m) => (
          <button
            key={m.id}
            onClick={() => setMetric(m.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              metric === m.id
                ? 'bg-sun-400 text-white shadow-soft'
                : 'bg-white text-leaf-700 border border-leaf-100 hover:bg-leaf-50'
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <Card className="p-10 text-center">
          <Trophy className="w-12 h-12 text-leaf-200 mx-auto mb-3" />
          <h4 className="font-extrabold text-leaf-800">No rankings yet</h4>
          <p className="text-sm text-leaf-600/60 mt-1">Complete lessons and missions to appear on the board!</p>
        </Card>
      ) : (
      <>
      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {top3.map((entry, i) => {
          const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd
          const podiumIndex = podiumOrder.indexOf(i);
          const isFirst = i === 0;
          const heights = ['h-32', 'h-40', 'h-28'];
          const medalColors = [
            'from-sun-400 to-sun-500', // gold
            'from-gray-300 to-gray-400', // silver
            'from-coral-300 to-coral-400', // bronze
          ];
          const medalIcons = [<Crown className="w-5 h-5" />, <Medal className="w-5 h-5" />, <Award className="w-5 h-5" />];

          return (
            <div key={entry.id} className={`flex flex-col items-center ${podiumIndex === 0 ? 'order-2' : podiumIndex === 1 ? 'order-1' : 'order-3'}`}>
              <div className={`relative ${isFirst ? 'mb-2' : 'mb-1'}`}>
                {isFirst && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce-soft">👑</div>}
                <div className={`w-16 h-16 ${isFirst ? 'md:w-20 md:h-20' : ''} rounded-3xl bg-leaf-50 flex items-center justify-center text-3xl ${isFirst ? 'md:text-4xl' : ''} border-2 border-leaf-100 ${entry.isCurrentUser ? 'ring-2 ring-leaf-400' : ''}`}>
                  {entry.avatar}
                </div>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br ${medalColors[i]} flex items-center justify-center text-white shadow-soft`}>
                  {medalIcons[i]}
                </div>
              </div>
              <div className="text-center mt-3">
                <div className={`font-bold text-sm ${entry.isCurrentUser ? 'text-leaf-600' : 'text-leaf-800'}`}>
                  {entry.name}
                </div>
                <div className="text-xs text-leaf-600/60">Lv {entry.level}</div>
                <div className={`text-lg font-extrabold ${isFirst ? 'gradient-text' : 'text-leaf-600'}`}>
                  {getMetricValue(entry).toLocaleString()}
                </div>
              </div>
              <div className={`w-full ${heights[podiumIndex]} bg-gradient-to-t ${medalColors[i]} opacity-20 rounded-t-2xl mt-2`} />
            </div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div className="space-y-2">
        {rest.map((entry, index) => {
          const rank = index + 4;
          return (
            <Card
              key={entry.id}
              className={`p-4 flex items-center gap-4 transition-all ${entry.isCurrentUser ? 'bg-leaf-50 border-leaf-200 shadow-soft' : 'hover:bg-cream-50'}`}
            >
              <div className="w-8 h-8 rounded-full bg-leaf-100 flex items-center justify-center text-sm font-extrabold text-leaf-600 flex-shrink-0">
                {rank}
              </div>
              <div className="w-11 h-11 rounded-2xl bg-leaf-50 flex items-center justify-center text-xl flex-shrink-0">
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold truncate ${entry.isCurrentUser ? 'text-leaf-700' : 'text-leaf-800'}`}>
                  {entry.name} {entry.isCurrentUser && <Badge variant="green" size="sm" className="ml-1">You</Badge>}
                </div>
                <div className="flex items-center gap-3 text-xs text-leaf-600/60">
                  <span>Lv {entry.level}</span>
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {entry.streak}</span>
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {entry.missions}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-leaf-600">{getMetricValue(entry).toLocaleString()}</div>
                <div className="text-xs text-leaf-600/50">{metric === 'xp' ? 'XP' : metric === 'missions' ? 'missions' : metric === 'streak' ? 'days' : 'points'}</div>
              </div>
            </Card>
          );
        })}
      </div>
      </>
      )}
    </div>
  );
}
