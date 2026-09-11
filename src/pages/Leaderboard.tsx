import { useEffect, useState } from 'react';
import { Award, Crown, Medal, Target, Trophy, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useApp } from '@/context/AppContext';
import { loadLeaderboard, type LeaderboardEntry } from '@/lib/profileStore';

export function Leaderboard() {
  const { user, profile } = useApp();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      setEntries(await loadLeaderboard());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load the leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchEntries(); }, []);

  const currentUser = entries.find((entry) => entry.isCurrentUser) ?? {
    uid: user?.uid ?? 'current-user',
    name: profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Student',
    avatarUrl: null,
    xp: Number(profile?.xp) || 0,
    impactScore: Number(profile?.impactScore) || 0,
    ecoCoins: Number(profile?.ecoCoins) || 0,
    lessonsCompleted: Number(profile?.lessonsCompleted) || 0,
    missionsCompleted: Number(profile?.missionsCompleted) || 0,
    rank: entries.length + 1,
    isCurrentUser: true,
  };
  const topThree = entries.slice(0, 3);
  const visibleEntries = entries.slice(3);
  const currentIsVisible = currentUser.rank <= 10;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <PageHeader title="Eco Leaderboard" icon={<Trophy className="w-5 h-5" />} subtitle="Learn, take action and climb the ranks." />

      <div className="flex gap-2 mb-6">
        {(['weekly', 'monthly', 'all-time'] as const).map((value) => (
          <button key={value} disabled={value !== 'all-time'} onClick={() => setPeriod(value)} className={`px-4 py-2 rounded-xl text-sm font-bold ${period === value ? 'bg-gradient-to-r from-leaf-500 to-lagoon-500 text-white' : 'bg-white text-leaf-500 border border-leaf-100'} disabled:opacity-50`}>
            {value === 'all-time' ? 'All Time' : value[0].toUpperCase() + value.slice(1)}{value !== 'all-time' && ' (soon)'}
          </button>
        ))}
      </div>

      <Card className="p-5 mb-8 bg-leaf-50 border-leaf-200">
        <div className="flex flex-wrap items-center gap-5">
          <div><p className="text-xs font-bold uppercase tracking-wide text-leaf-600/60">Your position</p><div className="text-3xl font-extrabold text-leaf-700">#{currentUser.rank}</div></div>
          <Stat label="XP" value={currentUser.xp} icon={<Zap className="w-4 h-4" />} />
          <Stat label="Impact" value={currentUser.impactScore} />
          <Stat label="Missions" value={currentUser.missionsCompleted} icon={<Target className="w-4 h-4" />} />
        </div>
      </Card>

      {loading ? <div className="grid md:grid-cols-3 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div> : error ? <Card className="p-8 text-center"><p className="font-bold text-leaf-800">Unable to load the leaderboard.</p><Button className="mt-4" onClick={() => void fetchEntries()}>Try Again</Button></Card> : entries.length === 0 ? <Card className="p-10 text-center"><Trophy className="w-12 h-12 text-leaf-200 mx-auto mb-3" /><h3 className="font-extrabold text-leaf-800">Your eco journey starts here 🌱</h3><p className="text-sm text-leaf-600/60 mt-1">Complete your first lesson or eco mission to appear on the leaderboard.</p></Card> : <>
        <h2 className="text-xl font-extrabold text-leaf-800 mb-4">Top eco champions</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">{topThree.map((entry, index) => <Podium key={entry.uid} entry={entry} position={index} />)}</div>
        <h2 className="text-xl font-extrabold text-leaf-800 mb-4">All students</h2>
        <div className="space-y-2">{visibleEntries.map((entry) => <EntryRow key={entry.uid} entry={entry} />)}</div>
        {!currentIsVisible && <Card className="mt-4 p-4 ring-2 ring-leaf-300 bg-leaf-50"><EntryRow entry={currentUser} /></Card>}
      </>}

      <Card className="mt-8 p-6"><h2 className="font-extrabold text-leaf-800">How to climb the ranks</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-sm text-leaf-700"><span>🌱 Complete lessons</span><span>⚡ Take knowledge checks</span><span>♻️ Complete eco missions</span><span>📸 Submit real-world proof</span><span>✅ Get missions verified</span><span>🌍 Build environmental impact</span></div></Card>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return <div><p className="text-xs text-leaf-600/60 flex items-center gap-1">{icon}{label}</p><p className="text-xl font-extrabold text-leaf-700">{value.toLocaleString()}</p></div>;
}

function Avatar({ entry }: { entry: LeaderboardEntry }) {
  return entry.avatarUrl ? <img src={entry.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover" /> : <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-lg font-extrabold text-leaf-600">{entry.name.charAt(0).toUpperCase()}</div>;
}

function Podium({ entry, position }: { entry: LeaderboardEntry; position: number }) {
  const medals = [<Crown className="w-5 h-5" />, <Medal className="w-5 h-5" />, <Award className="w-5 h-5" />];
  return <Card className={`p-6 text-center ${position === 0 ? 'md:-translate-y-3 ring-2 ring-sun-300' : ''}`}><div className="text-2xl">{medals[position]}</div><div className="flex justify-center my-3"><Avatar entry={entry} /></div><h3 className="font-extrabold text-leaf-800 truncate">{entry.name}</h3><p className="text-lg font-extrabold text-leaf-600">{entry.xp.toLocaleString()} XP</p><p className="text-xs text-leaf-600/60">Impact {entry.impactScore} · {entry.missionsCompleted} missions</p></Card>;
}

function EntryRow({ entry }: { entry: LeaderboardEntry }) {
  return <div className="flex items-center gap-3"><div className="w-8 text-center font-extrabold text-leaf-600">#{entry.rank}</div><Avatar entry={entry} /><div className="flex-1 min-w-0"><p className="font-bold text-leaf-800 truncate">{entry.name} {entry.isCurrentUser && <Badge variant="green" size="sm">You</Badge>}</p><p className="text-xs text-leaf-600/60">{entry.lessonsCompleted} lessons · {entry.missionsCompleted} missions · Impact {entry.impactScore}</p></div><div className="text-right"><p className="font-extrabold text-leaf-600">{entry.xp.toLocaleString()} XP</p><p className="text-xs text-leaf-600/60">{entry.ecoCoins} coins</p></div></div>;
}
