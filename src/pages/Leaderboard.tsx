import { useEffect, useState, type ReactNode } from 'react';
import {
  Award,
  BookOpen,
  Coins,
  Crown,
  Leaf,
  RefreshCw,
  Target,
  Trophy,
  TrendingUp,
  Users,
  Zap,
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
  type LeaderboardSort,
} from '@/lib/profileStore';

const SORT_OPTIONS: Array<{
  value: LeaderboardSort;
  label: string;
  icon: ReactNode;
}> = [
  {
    value: 'xp',
    label: 'XP',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    value: 'impact',
    label: 'Impact Score',
    icon: <Leaf className="w-4 h-4" />,
  },
  {
    value: 'coins',
    label: 'Eco Coins',
    icon: <Coins className="w-4 h-4" />,
  },
  {
    value: 'lessons',
    label: 'Lessons Completed',
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    value: 'missions',
    label: 'Missions Completed',
    icon: <Target className="w-4 h-4" />,
  },
];

function getSortLabel(sort: LeaderboardSort) {
  return (
    SORT_OPTIONS.find((option) => option.value === sort)
      ?.label ?? 'XP'
  );
}

function getPrimaryValue(
  entry: LeaderboardEntry,
  sort: LeaderboardSort,
) {
  switch (sort) {
    case 'impact':
      return entry.impactScore;

    case 'coins':
      return entry.ecoCoins;

    case 'lessons':
      return entry.lessonsCompleted;

    case 'missions':
      return entry.missionsCompleted;

    case 'xp':
    default:
      return entry.xp;
  }
}

export function Leaderboard() {
  const { user, profile } = useApp();

  const [entries, setEntries] = useState<
    LeaderboardEntry[]
  >([]);

  const [sort, setSort] =
    useState<LeaderboardSort>('xp');

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchEntries = async (
    selectedSort: LeaderboardSort = sort,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const leaderboard =
        await loadLeaderboard(selectedSort);

      setEntries(leaderboard);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load the leaderboard.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEntries(sort);
  }, [sort]);

  const currentUser =
    entries.find(
      (entry) => entry.isCurrentUser,
    ) ?? {
      uid: user?.uid ?? 'current-user',

      name:
        profile?.displayName ||
        user?.displayName ||
        user?.email?.split('@')[0] ||
        'Student',

      avatarUrl: null,

      xp: Number(profile?.xp) || 0,

      impactScore:
        Number(profile?.impactScore) || 0,

      ecoCoins:
        Number(profile?.ecoCoins) || 0,

      lessonsCompleted:
        Number(profile?.lessonsCompleted) || 0,

      missionsCompleted:
        Number(profile?.missionsCompleted) || 0,

      rank: entries.length + 1,

      isCurrentUser: true,
    };

  const currentMetric = getPrimaryValue(
    currentUser,
    sort,
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Eco Leaderboard"
        icon={<Trophy className="w-5 h-5" />}
        subtitle="Learn, take action and climb the ranks."
      />

      {/* Ranking controls */}
      <Card className="p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-leaf-600/60">
              Leaderboard
            </p>

            <h2 className="text-lg font-extrabold text-leaf-800 mt-1">
              Ranking students by {getSortLabel(sort)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="leaderboard-sort"
              className="text-sm font-bold text-leaf-700 whitespace-nowrap"
            >
              Rank by
            </label>

            <div className="relative">
              <select
                id="leaderboard-sort"
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value as LeaderboardSort,
                  )
                }
                className="appearance-none min-w-[190px] rounded-xl border border-leaf-200 bg-white px-4 py-2.5 pr-10 text-sm font-bold text-leaf-800 outline-none transition focus:border-leaf-400 focus:ring-2 focus:ring-leaf-100"
              >
                {SORT_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-leaf-500">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Current user */}
      <Card className="p-5 mb-8 bg-leaf-50 border-leaf-200">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-xl font-extrabold text-leaf-600 shadow-sm">
              #{currentUser.rank}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-leaf-600/60">
                Your position
              </p>

              <h2 className="text-lg font-extrabold text-leaf-800">
                {currentUser.name}
              </h2>

              <p className="text-sm text-leaf-600">
                {currentMetric.toLocaleString()}{' '}
                {getSortLabel(sort)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 lg:ml-auto">
            <MiniStat
              label="XP"
              value={currentUser.xp}
              icon={<Zap className="w-4 h-4" />}
            />

            <MiniStat
              label="Impact"
              value={currentUser.impactScore}
              icon={<Leaf className="w-4 h-4" />}
            />

            <MiniStat
              label="Eco Coins"
              value={currentUser.ecoCoins}
              icon={<Coins className="w-4 h-4" />}
            />

            <MiniStat
              label="Lessons"
              value={currentUser.lessonsCompleted}
              icon={<BookOpen className="w-4 h-4" />}
            />

            <MiniStat
              label="Missions"
              value={currentUser.missionsCompleted}
              icon={<Target className="w-4 h-4" />}
            />
          </div>
        </div>
      </Card>

      {/* Leaderboard */}
      {loading ? (
        <LeaderboardLoading />
      ) : error ? (
        <Card className="p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 mx-auto flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-red-400" />
          </div>

          <p className="font-bold text-leaf-800">
            Unable to load the leaderboard.
          </p>

          <p className="text-sm text-leaf-600/70 mt-1">
            {error}
          </p>

          <Button
            className="mt-4"
            onClick={() => void fetchEntries(sort)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </Card>
      ) : entries.length === 0 ? (
        <EmptyLeaderboard />
      ) : (
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-leaf-100 bg-leaf-50/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-leaf-800">
                  All students
                </h2>

                <p className="text-xs text-leaf-600/60 mt-1">
                  Ranked by {getSortLabel(sort)}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-leaf-600">
                <Users className="w-4 h-4" />
                {entries.length} students
              </div>
            </div>
          </div>

          <div>
            {entries.map((entry) => (
              <EntryRow
                key={entry.uid}
                entry={entry}
                sort={sort}
              />
            ))}

            {!entries.some(
              (entry) => entry.isCurrentUser,
            ) && (
              <>
                <div className="px-5 py-2 bg-leaf-50 border-t border-b border-leaf-100">
                  <p className="text-xs font-bold text-leaf-600">
                    Your position
                  </p>
                </div>

                <EntryRow
                  entry={currentUser}
                  sort={sort}
                />
              </>
            )}
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card className="mt-8 p-6">
        <h2 className="font-extrabold text-leaf-800">
          How to climb the ranks
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
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
      </Card>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 min-w-[105px]">
      <p className="text-xs text-leaf-600/60 flex items-center gap-1">
        {icon}
        {label}
      </p>

      <p className="text-lg font-extrabold text-leaf-700 mt-0.5">
        {value.toLocaleString()}
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
        alt=""
        className="w-11 h-11 rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="w-11 h-11 rounded-xl bg-leaf-50 flex items-center justify-center text-base font-extrabold text-leaf-600 shrink-0">
      {entry.name.charAt(0).toUpperCase()}
    </div>
  );
}

function EntryRow({
  entry,
  sort,
}: {
  entry: LeaderboardEntry;
  sort: LeaderboardSort;
}) {
  const primaryValue = getPrimaryValue(
    entry,
    sort,
  );

  const isTopThree = entry.rank <= 3;

  return (
    <div
      className={`flex items-center gap-3 px-4 md:px-5 py-4 border-b border-leaf-50 last:border-b-0 transition ${
        entry.isCurrentUser
          ? 'bg-leaf-50 ring-1 ring-inset ring-leaf-200'
          : isTopThree
            ? 'bg-sun-50/30'
            : 'bg-white'
      }`}
    >
      {/* Rank */}
      <div className="w-9 text-center shrink-0">
        {entry.rank === 1 ? (
          <Crown className="w-5 h-5 mx-auto text-sun-500" />
        ) : entry.rank === 2 ? (
          <Award className="w-5 h-5 mx-auto text-leaf-500" />
        ) : entry.rank === 3 ? (
          <Award className="w-5 h-5 mx-auto text-leaf-400" />
        ) : (
          <span className="font-extrabold text-leaf-600">
            #{entry.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <Avatar entry={entry} />

      {/* Student information */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-leaf-800 truncate">
            {entry.name}
          </p>

          {entry.isCurrentUser && (
            <Badge
              variant="green"
              size="sm"
            >
              You
            </Badge>
          )}
        </div>

        <p className="text-xs text-leaf-600/60 mt-1">
          {entry.lessonsCompleted} lessons
          {' · '}
          {entry.missionsCompleted} missions
          {' · '}
          Impact {entry.impactScore.toLocaleString()}
        </p>
      </div>

      {/* Main ranking value */}
      <div className="text-right shrink-0">
        <p className="font-extrabold text-leaf-600">
          {primaryValue.toLocaleString()}
        </p>

        <p className="text-xs text-leaf-600/60">
          {getSortLabel(sort)}
        </p>
      </div>
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
  return (
    <div className="flex items-center gap-3 rounded-xl bg-leaf-50 px-4 py-3 text-sm font-semibold text-leaf-700">
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function LeaderboardLoading() {
  return (
    <div className="space-y-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

function EmptyLeaderboard() {
  return (
    <Card className="p-10 text-center">
      <Trophy className="w-12 h-12 text-leaf-200 mx-auto mb-3" />

      <h3 className="font-extrabold text-leaf-800">
        Your eco journey starts here 🌱
      </h3>

      <p className="text-sm text-leaf-600/60 mt-1">
        Complete your first lesson or eco mission
        to appear on the leaderboard.
      </p>
    </Card>
  );
}