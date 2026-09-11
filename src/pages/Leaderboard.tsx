import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
Award,
Crown,
Medal,
Target,
Trophy,
Zap,
Coins,
Leaf,
TrendingUp,
BookOpen,
Users,
RefreshCw,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useApp } from '@/context/AppContext';
import {
loadLeaderboard,
type LeaderboardEntry,
} from '@/lib/profileStore';

export function Leaderboard() {
const { user, profile } = useApp();

const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [period] = useState<'all-time'>('all-time');

const fetchEntries = async () => {
setLoading(true);
setError(null);

  
try {
  const data = await loadLeaderboard();
  setEntries(Array.isArray(data) ? data : []);
} catch (loadError) {
  console.error('Unable to load leaderboard:', loadError);

  setError(
    loadError instanceof Error
      ? loadError.message
      : 'Unable to load the leaderboard.'
  );
} finally {
  setLoading(false);
}
  

};

useEffect(() => {
void fetchEntries();
}, []);

const currentUser = useMemo<LeaderboardEntry>(() => {
const existingEntry = entries.find(
(entry) => entry.isCurrentUser || entry.uid === user?.uid
);

  
if (existingEntry) {
  return existingEntry;
}

const currentXP = Number(profile?.xp) || 0;
const currentImpact = Number(profile?.impactScore) || 0;
const currentCoins = Number(profile?.ecoCoins) || 0;
const currentLessons =
  Number(profile?.lessonsCompleted) || 0;
const currentMissions =
  Number(profile?.missionsCompleted) || 0;

/*
 * If the leaderboard API does not return the current user,
 * show the locally authenticated user's real profile values.
 *
 * This is only a display fallback. Ranking still comes from
 * the leaderboard data returned by the backend.
 */
return {
  uid: user?.uid ?? 'current-user',
  name:
    profile?.displayName?.trim() ||
    user?.displayName?.trim() ||
    user?.email?.split('@')[0] ||
    'Student',
  avatarUrl: null,
  xp: currentXP,
  impactScore: currentImpact,
  ecoCoins: currentCoins,
  lessonsCompleted: currentLessons,
  missionsCompleted: currentMissions,
  rank: entries.length + 1,
  isCurrentUser: true,
};
  

}, [entries, profile, user]);

const sortedEntries = useMemo(() => {
return [...entries].sort((a, b) => {
if (b.xp !== a.xp) {
return b.xp - a.xp;
}

  
  if (b.impactScore !== a.impactScore) {
    return b.impactScore - a.impactScore;
  }

  if (b.missionsCompleted !== a.missionsCompleted) {
    return (
      b.missionsCompleted -
      a.missionsCompleted
    );
  }

  return a.name.localeCompare(b.name);
});
  

}, [entries]);

const topThree = sortedEntries.slice(0, 3);

const visibleEntries = sortedEntries.slice(3, 13);

const currentUserInLeaderboard = sortedEntries.find(
(entry) =>
entry.isCurrentUser ||
entry.uid === currentUser.uid
);

const currentUserRank =
currentUserInLeaderboard?.rank ??
currentUser.rank ??
sortedEntries.length + 1;

const currentUserIsVisible =
currentUserRank <= 13 ||
visibleEntries.some(
(entry) =>
entry.isCurrentUser ||
entry.uid === currentUser.uid
);

return ( <div className="p-4 md:p-8 max-w-6xl mx-auto">
<PageHeader
title="Eco Leaderboard"
icon={<Trophy className="w-5 h-5" />}
subtitle="Learn, take action and climb the ranks."
/>

  
  {/* Period selector */}
  <div className="flex items-center gap-2 mb-6">
    <button
      type="button"
      className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-leaf-500 to-lagoon-500 text-white shadow-soft"
    >
      All Time
    </button>

    <button
      type="button"
      disabled
      className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-leaf-500 border border-leaf-100 opacity-50 cursor-not-allowed"
    >
      Weekly
      <span className="ml-1 text-[10px]">
        Soon
      </span>
    </button>

    <button
      type="button"
      disabled
      className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-leaf-500 border border-leaf-100 opacity-50 cursor-not-allowed"
    >
      Monthly
      <span className="ml-1 text-[10px]">
        Soon
      </span>
    </button>
  </div>

  {/* Current user summary */}
  <Card className="p-5 md:p-6 mb-8 overflow-hidden relative bg-gradient-to-br from-leaf-50 via-white to-lagoon-50 border-leaf-100">
    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-leaf-100/50 blur-2xl" />

    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-leaf-500 to-lagoon-500 flex items-center justify-center text-white shadow-soft">
          <Trophy className="w-7 h-7" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-leaf-600/60">
            Your position
          </p>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-leaf-800">
              #{currentUserRank}
            </span>

            <Badge
              variant="green"
              size="sm"
            >
              {period === 'all-time'
                ? 'All Time'
                : period}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat
          label="XP"
          value={currentUser.xp}
          icon={
            <Zap className="w-4 h-4" />
          }
        />

        <Stat
          label="Impact"
          value={currentUser.impactScore}
          icon={
            <TrendingUp className="w-4 h-4" />
          }
        />

        <Stat
          label="Missions"
          value={currentUser.missionsCompleted}
          icon={
            <Target className="w-4 h-4" />
          }
        />

        <Stat
          label="Eco Coins"
          value={currentUser.ecoCoins}
          icon={
            <Coins className="w-4 h-4" />
          }
        />
      </div>
    </div>
  </Card>

  {loading ? (
    <LeaderboardLoading />
  ) : error ? (
    <Card className="p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-coral-50 mx-auto mb-4 flex items-center justify-center">
        <Trophy className="w-7 h-7 text-coral-400" />
      </div>

      <h3 className="font-extrabold text-leaf-800">
        Unable to load the leaderboard
      </h3>

      <p className="text-sm text-leaf-600/60 mt-1">
        Something went wrong while loading
        the rankings.
      </p>

      <Button
        className="mt-5"
        onClick={() => void fetchEntries()}
        icon={
          <RefreshCw className="w-4 h-4" />
        }
      >
        Try Again
      </Button>
    </Card>
  ) : sortedEntries.length === 0 ? (
    <EmptyLeaderboard
      currentUser={currentUser}
      rank={currentUserRank}
    />
  ) : (
    <>
      {/* Top 3 */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-leaf-800">
              Top Eco Champions
            </h2>

            <p className="text-sm text-leaf-600/60 mt-1">
              The students leading the
              eco-journey.
            </p>
          </div>

          <Trophy className="w-6 h-6 text-sun-400" />
        </div>

        <div className="grid md:grid-cols-3 gap-4 items-end">
          {topThree.map((entry, index) => (
            <Podium
              key={entry.uid}
              entry={entry}
              position={index}
            />
          ))}
        </div>
      </section>

      {/* Rankings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-leaf-800">
              All Students
            </h2>

            <p className="text-sm text-leaf-600/60 mt-1">
              Rankings are based primarily
              on XP.
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-leaf-600/60">
            <Users className="w-4 h-4" />
            {sortedEntries.length}
          </div>
        </div>

        <div className="space-y-2">
          {visibleEntries.map((entry) => (
            <EntryRow
              key={entry.uid}
              entry={entry}
            />
          ))}
        </div>

        {!currentUserIsVisible && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2 px-2">
              <div className="h-px flex-1 bg-leaf-100" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-leaf-600/40">
                Your position
              </span>
              <div className="h-px flex-1 bg-leaf-100" />
            </div>

            <Card className="p-4 ring-2 ring-leaf-200 bg-leaf-50/70">
              <EntryRow
                entry={{
                  ...currentUser,
                  rank: currentUserRank,
                  isCurrentUser: true,
                }}
              />
            </Card>
          </div>
        )}
      </section>
    </>
  )}

  {/* Motivation */}
  <Card className="mt-10 p-6 bg-white border-leaf-100">
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-2xl bg-leaf-50 flex items-center justify-center flex-shrink-0">
        <Leaf className="w-5 h-5 text-leaf-500" />
      </div>

      <div className="flex-1">
        <h2 className="font-extrabold text-leaf-800">
          How to climb the ranks
        </h2>

        <p className="text-sm text-leaf-600/60 mt-1">
          Your ranking grows through real
          learning and environmental action.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
          <ActionTip
            icon="🌱"
            text="Complete lessons"
          />

          <ActionTip
            icon="⚡"
            text="Take knowledge checks"
          />

          <ActionTip
            icon="♻️"
            text="Complete eco missions"
          />

          <ActionTip
            icon="📸"
            text="Submit real-world proof"
          />

          <ActionTip
            icon="✅"
            text="Get missions verified"
          />

          <ActionTip
            icon="🌍"
            text="Build environmental impact"
          />
        </div>
      </div>
    </div>
  </Card>
</div>
  

);
}

function Stat({
label,
value,
icon,
}: {
label: string;
value: number;
icon?: ReactNode;
}) {
return ( <div className="min-w-[90px]"> <p className="text-xs text-leaf-600/60 flex items-center gap-1 mb-1">
{icon}
{label} </p>

  
  <p className="text-xl font-extrabold text-leaf-700">
    {Number(value || 0).toLocaleString()}
  </p>
</div>
  

);
}

function Avatar({
entry,
}: {
entry: LeaderboardEntry;
}) {
if (entry.avatarUrl) {
return (
<img
src={entry.avatarUrl}
alt={`${entry.name}'s avatar`}
className="w-12 h-12 rounded-2xl object-cover border border-leaf-100"
/>
);
}

return ( <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-leaf-100 to-lagoon-100 flex items-center justify-center text-lg font-extrabold text-leaf-600 flex-shrink-0">
{entry.name
.charAt(0)
.toUpperCase() || 'S'} </div>
);
}

function Podium({
entry,
position,
}: {
entry: LeaderboardEntry;
position: number;
}) {
const podiumData = [
{
icon: ( <Crown className="w-6 h-6" />
),
label: '1st',
wrapper:
'md:-translate-y-4 ring-2 ring-sun-300',
badge:
'bg-sun-100 text-sun-700',
},
{
icon: ( <Medal className="w-6 h-6" />
),
label: '2nd',
wrapper: '',
badge:
'bg-slate-100 text-slate-600',
},
{
icon: ( <Award className="w-6 h-6" />
),
label: '3rd',
wrapper: '',
badge:
'bg-orange-50 text-orange-600',
},
];

const data =
podiumData[position] ?? podiumData[2];

return (
<Card
className={`p-6 text-center transition-all hover:-translate-y-1 ${data.wrapper}`}
> <div className="flex items-center justify-between">
<span
className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${data.badge}`}
>
{data.label} </span>

  
    <span className="text-sun-400">
      {data.icon}
    </span>
  </div>

  <div className="flex justify-center my-5">
    <div className="relative">
      <Avatar entry={entry} />

      {entry.isCurrentUser && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <Badge
            variant="green"
            size="sm"
          >
            You
          </Badge>
        </span>
      )}
    </div>
  </div>

  <h3 className="font-extrabold text-leaf-800 truncate">
    {entry.name}
  </h3>

  <div className="mt-2">
    <p className="text-2xl font-extrabold text-leaf-600">
      {entry.xp.toLocaleString()}
    </p>

    <p className="text-xs font-semibold text-leaf-600/50">
      XP
    </p>
  </div>

  <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-leaf-100/70">
    <MiniStat
      icon={
        <TrendingUp className="w-3.5 h-3.5" />
      }
      value={entry.impactScore}
      label="Impact"
    />

    <MiniStat
      icon={
        <Target className="w-3.5 h-3.5" />
      }
      value={entry.missionsCompleted}
      label="Missions"
    />
  </div>
</Card>
  

);
}

function EntryRow({
entry,
}: {
entry: LeaderboardEntry;
}) {
const isCurrentUser = entry.isCurrentUser;

return (
<div
className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl border transition-all ${
        isCurrentUser
          ? 'bg-leaf-50 border-leaf-200 ring-1 ring-leaf-100'
          : 'bg-white border-leaf-100/70 hover:bg-leaf-50/50 hover:border-leaf-200'
      }`}
> <div className="w-9 text-center flex-shrink-0">
<span
className={`text-sm font-extrabold ${
            isCurrentUser
              ? 'text-leaf-700'
              : 'text-leaf-600/70'
          }`}
>
#{entry.rank} </span> </div>

  
  <Avatar entry={entry} />

  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 min-w-0">
      <p className="font-bold text-leaf-800 truncate">
        {entry.name}
      </p>

      {isCurrentUser && (
        <Badge
          variant="green"
          size="sm"
        >
          You
        </Badge>
      )}
    </div>

    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-leaf-600/60">
      <span className="flex items-center gap-1">
        <BookOpen className="w-3 h-3" />
        {entry.lessonsCompleted} lessons
      </span>

      <span className="flex items-center gap-1">
        <Target className="w-3 h-3" />
        {entry.missionsCompleted} missions
      </span>

      <span className="flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        {entry.impactScore} impact
      </span>
    </div>
  </div>

  <div className="text-right flex-shrink-0">
    <p className="font-extrabold text-leaf-600">
      {entry.xp.toLocaleString()} XP
    </p>

    <p className="text-xs text-leaf-600/50 flex items-center justify-end gap-1 mt-1">
      <Coins className="w-3 h-3" />
      {entry.ecoCoins.toLocaleString()}
    </p>
  </div>
</div>
  

);
}

function MiniStat({
icon,
value,
label,
}: {
icon: ReactNode;
value: number;
label: string;
}) {
return ( <div className="text-center"> <div className="flex items-center justify-center gap-1 text-xs text-leaf-600/60">
{icon}
{label} </div>

  
  <p className="font-extrabold text-leaf-700 mt-0.5">
    {Number(value || 0).toLocaleString()}
  </p>
</div>

);
}

function ActionTip({
icon,
text,
}: {
icon: string;
text: string;
}) {
return ( <div className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 border border-leaf-100/50"> <span className="text-lg">{icon}</span>


  <span className="text-sm font-semibold text-leaf-700">
    {text}
  </span>
</div>


);
}

function LeaderboardLoading() {
return ( <div className="space-y-8"> <div className="grid md:grid-cols-3 gap-4"> <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> </div>


  <div className="space-y-2">
    {Array.from({ length: 6 }).map(
      (_, index) => (
        <CardSkeleton key={index} />
      )
    )}
  </div>
</div>

);
}

function EmptyLeaderboard({
currentUser,
rank,
}: {
currentUser: LeaderboardEntry;
rank: number;
}) {
return ( <div className="space-y-6"> <Card className="p-8 md:p-10 text-center bg-gradient-to-br from-leaf-50 to-white"> <div className="w-16 h-16 rounded-3xl bg-white shadow-soft mx-auto mb-4 flex items-center justify-center"> <Leaf className="w-8 h-8 text-leaf-400" /> </div>

    <h3 className="text-xl font-extrabold text-leaf-800">
      Your eco journey starts here 🌱
    </h3>

    <p className="text-sm text-leaf-600/60 max-w-md mx-auto mt-2">
      Complete your first lesson or
      verified eco mission to start building
      your XP and environmental impact.
    </p>
  </Card>

  <Card className="p-4 ring-2 ring-leaf-200 bg-leaf-50/70">
    <EntryRow
      entry={{
        ...currentUser,
        rank,
        isCurrentUser: true,
      }}
    />
  </Card>
</div>


);
}
