
import { useEffect, useState } from 'react';

import { Card, GradientCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useApp } from '@/context/AppContext';
import { apiRequest } from '@/lib/api';

import {
  Flame,
  Coins,
  Zap,
  Target,
  Sprout,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Play,
  Leaf,
  Star,
  ChevronRight,
  TreePine,
} from 'lucide-react';

import {
  leaderboardSchool,
  gardenRanks,
} from '@/data/mockData';


export function Dashboard() {
  const {
    user,
    authLoading,
    level,
    xp,
    xpInCurrentLevel,
    xpForNextLevel,
    coins,
    streak,
    gardenLevel,
    gardenRank,
    impactScore,
    lessons,
    missions: userMissions,
    openLesson,
    navigate,
  } = useApp();

  const [profile, setProfile] = useState<{
    full_name?: string | null;
    eco_level?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);


  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, []);


  // =====================================
  // LOAD PROFILE
  // =====================================

  useEffect(() => {
    if (authLoading || !user) return;

    const loadProfile = async () => {
      try {
        const data = await apiRequest('/api/profile');
        setProfile(data.profile);
      } catch (error) {
        console.error(
          'Unable to load profile:',
          error
        );
      }
    };

    loadProfile();
  }, [authLoading, user]);


  // =====================================
  // DISPLAY DATA
  // =====================================

  const displayName =
    profile?.full_name ||
    user?.displayName ||
    'Eco Learner';

  const displayScore = impactScore;

  const displayLevel =
    profile?.eco_level || level;

  const xpProgress =
    xpForNextLevel > 0
      ? Math.min(
          100,
          (xpInCurrentLevel /
            xpForNextLevel) *
            100
        )
      : 0;

  const currentRank =
    gardenRanks.find(
      (rank) =>
        rank.name === gardenRank
    ) || gardenRanks[0];

  const nextRank =
    gardenRanks.find(
      (rank) =>
        rank.minLevel > level
    ) ||
    gardenRanks[
      gardenRanks.length - 1
    ];

  const continueLessons =
    lessons
      .filter(
        (lesson) =>
          !lesson.completed
      )
      .slice(0, 3);

  const featuredMission =
    userMissions.find(
      (mission) =>
        !mission.completed
    ) ||
    userMissions[0];

  const myRank =
    leaderboardSchool.find(
      (entry) =>
        entry.isCurrentUser
    );

  const topStudents =
    leaderboardSchool.slice(0, 4);

  const hour =
    new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
      ? 'Good afternoon'
      : 'Good evening';


  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">

        <div className="mb-6">
          <CardSkeleton />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <CardSkeleton
              key={index}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>

          <CardSkeleton />
        </div>

      </div>
    );
  }


  // =====================================
  // DASHBOARD
  // =====================================

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-10">


      {/* =================================
          WELCOME
      ================================= */}

      <section className="mb-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

          <div>

            <div className="flex items-center gap-2 text-sm font-semibold text-leaf-500 mb-2">
              <Sprout className="w-4 h-4" />
              Your Eco Journey
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-leaf-900 tracking-tight">
              {greeting}, {displayName} 👋
            </h1>

            <p className="text-sm text-leaf-600/60 mt-1.5">
              Ready to make one small difference today?
            </p>

          </div>


          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-leaf-100">

              <div className="w-7 h-7 rounded-lg bg-leaf-50 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-leaf-500" />
              </div>

              <div>

                <div className="text-[10px] uppercase font-bold text-leaf-600/50">
                  Level
                </div>

                <div className="text-xs font-extrabold text-leaf-800">
                  {displayLevel}
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================
          DAILY HERO
      ================================= */}

      <GradientCard
        gradient="from-leaf-600 to-lagoon-500"
        className="relative overflow-hidden p-6 md:p-7 mb-6"
      >

        {/* Decorative background */}

        <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-white/10" />

        <div className="absolute right-20 -bottom-28 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">

          <div>

            <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              Today's Focus
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white">
              Learn something.
              <br />
              Do something good. 🌍
            </h2>

            <p className="text-sm text-white/70 max-w-md mt-3">
              Continue a lesson or complete today's
              eco mission to keep your journey moving.
            </p>

            <div className="flex items-center gap-3 mt-5">

              <button
                onClick={() => {
                  const lesson =
                    lessons.find(
                      (item) =>
                        !item.completed
                    );

                  if (lesson) {
                    openLesson(
                      lesson.id
                    );
                  } else {
                    navigate('learn');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-leaf-700 text-sm font-extrabold hover:bg-leaf-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <Play className="w-4 h-4" />
                Continue
              </button>

              <button
                onClick={() =>
                  navigate('missions')
                }
                className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition-all"
              >
                Explore mission
              </button>

            </div>

          </div>


          {/* IMPACT */}

          <div className="flex justify-center">

            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white/20 flex items-center justify-center">

              <div className="absolute inset-2 rounded-full border border-white/10" />

              <div className="text-center">

                <div className="text-4xl md:text-5xl font-black text-white">
                  {displayScore}
                </div>

                <div className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                  Impact
                </div>

              </div>

            </div>

          </div>

        </div>

      </GradientCard>


      {/* =================================
          CORE STATS
      ================================= */}

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">

        {/* XP */}

        <Card
          className="p-4 md:p-5"
          hover
        >

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-leaf-50 flex items-center justify-center">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-leaf-500" />
            </div>

            <div className="min-w-0">

              <div className="text-xl md:text-2xl font-black text-leaf-800">
                {xp.toLocaleString()}
              </div>

              <div className="text-[10px] md:text-xs font-semibold text-leaf-600/50">
                XP
              </div>

            </div>

          </div>

          <div className="mt-3">
            <ProgressBar
              value={xpProgress}
              gradient="from-leaf-400 to-lagoon-400"
              height="h-1.5"
            />
          </div>

        </Card>


        {/* STREAK */}

        <Card
          className="p-4 md:p-5"
          hover
        >

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-coral-50 flex items-center justify-center">
              <Flame className="w-4 h-4 md:w-5 md:h-5 text-coral-500" />
            </div>

            <div>

              <div className="text-xl md:text-2xl font-black text-coral-600">
                {streak}
              </div>

              <div className="text-[10px] md:text-xs font-semibold text-leaf-600/50">
                Day streak
              </div>

            </div>

          </div>

          <div className="flex gap-1 mt-3">

            {Array.from({
              length: 7,
            }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full ${
                  index <
                  Math.min(
                    streak,
                    7
                  )
                    ? 'bg-coral-400'
                    : 'bg-coral-100'
                }`}
              />
            ))}

          </div>

        </Card>


        {/* ECO COINS */}

        <Card
          className="p-4 md:p-5"
          hover
        >

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-sun-50 flex items-center justify-center">
              <Coins className="w-4 h-4 md:w-5 md:h-5 text-sun-500" />
            </div>

            <div>

              <div className="text-xl md:text-2xl font-black text-sun-600">
                {coins.toLocaleString()}
              </div>

              <div className="text-[10px] md:text-xs font-semibold text-leaf-600/50">
                Eco coins
              </div>

            </div>

          </div>

          <div className="text-[10px] font-semibold text-sun-600/60 mt-3">
            Keep earning 🪙
          </div>

        </Card>

      </div>


      {/* =================================
          MAIN CONTENT
      ================================= */}

      <div className="grid lg:grid-cols-[1.65fr_1fr] gap-6">


        {/* =================================
            LEFT
        ================================= */}

        <div className="space-y-6">


          {/* CONTINUE LEARNING */}

          <section>

            <div className="flex items-end justify-between mb-3">

              <div>

                <h2 className="text-lg font-black text-leaf-800">
                  Pick up where you left off
                </h2>

                <p className="text-xs text-leaf-600/50 mt-1">
                  Keep your learning streak alive
                </p>

              </div>

              <button
                onClick={() =>
                  navigate('learn')
                }
                className="text-xs font-bold text-leaf-600 hover:text-leaf-700"
              >
                See all
              </button>

            </div>


            <div className="grid md:grid-cols-3 gap-3">

              {continueLessons.length > 0 ? (

                continueLessons.map(
                  (lesson) => (

                    <button
                      key={lesson.id}
                      onClick={() =>
                        openLesson(
                          lesson.id
                        )
                      }
                      className="text-left group"
                    >

                      <Card
                        className="p-0 overflow-hidden h-full"
                        hover
                      >

                        <div
                          className={`h-24 bg-gradient-to-br ${lesson.color} flex items-center justify-center text-4xl`}
                        >
                          {lesson.emoji}
                        </div>

                        <div className="p-4">

                          <div className="text-sm font-extrabold text-leaf-800 line-clamp-2 min-h-[40px]">
                            {lesson.title}
                          </div>

                          <div className="flex items-center justify-between mt-3">

                            <span className="text-[10px] font-semibold text-leaf-600/50">
                              {lesson.duration} min
                            </span>

                            <span className="text-[10px] font-extrabold text-sun-600">
                              +{lesson.xpReward} XP
                            </span>

                          </div>

                          <div className="flex items-center justify-end mt-3 text-leaf-500">

                            <span className="text-[11px] font-bold group-hover:mr-1 transition-all">
                              Start
                            </span>

                            <ChevronRight className="w-3.5 h-3.5" />

                          </div>

                        </div>

                      </Card>

                    </button>

                  )
                )

              ) : (

                <Card className="md:col-span-3 p-8 text-center">

                  <CheckCircle2 className="w-8 h-8 text-leaf-500 mx-auto" />

                  <div className="font-bold text-leaf-800 mt-3">
                    You're all caught up! 🎉
                  </div>

                  <p className="text-xs text-leaf-600/50 mt-1">
                    Explore more lessons when you're ready.
                  </p>

                </Card>

              )}

            </div>

          </section>


          {/* FEATURED MISSION */}

          <section>

            <div className="mb-3">

              <h2 className="text-lg font-black text-leaf-800">
                Your next eco action
              </h2>

              <p className="text-xs text-leaf-600/50 mt-1">
                Take your learning into the real world
              </p>

            </div>


            {featuredMission ? (

              <button
                onClick={() =>
                  navigate('missions')
                }
                className="w-full text-left group"
              >

                <Card
                  className="relative overflow-hidden p-5 md:p-6"
                  hover
                >

                  <div className="flex items-center gap-5">

                    <div
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${featuredMission.color} flex items-center justify-center text-3xl md:text-4xl flex-shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      {featuredMission.emoji}
                    </div>


                    <div className="flex-1 min-w-0">

                      <div className="flex items-center gap-2 mb-1">

                        <Badge
                          variant="green"
                          size="sm"
                        >
                          ECO MISSION
                        </Badge>

                        {!featuredMission.completed &&
                          featuredMission.progress >
                            0 && (
                            <span className="text-[10px] font-semibold text-leaf-600/50">
                              {featuredMission.progress}%
                              complete
                            </span>
                          )}

                      </div>

                      <h3 className="font-extrabold text-leaf-800 text-base md:text-lg truncate">
                        {featuredMission.title}
                      </h3>

                      <div className="flex items-center gap-2 mt-2">

                        <span className="text-xs font-bold text-leaf-600">
                          +{featuredMission.xpReward} XP
                        </span>

                        <span className="text-xs text-leaf-600/40">
                          •
                        </span>

                        <span className="text-xs font-bold text-sun-600">
                          +{featuredMission.coinReward} 🪙
                        </span>

                      </div>

                    </div>


                    <div className="w-10 h-10 rounded-full bg-leaf-50 flex items-center justify-center text-leaf-500 group-hover:bg-leaf-500 group-hover:text-white transition-all flex-shrink-0">

                      <ArrowRight className="w-4 h-4" />

                    </div>

                  </div>


                  {featuredMission.progress > 0 &&
                    featuredMission.progress <
                      100 && (

                      <div className="mt-5">

                        <ProgressBar
                          value={
                            featuredMission.progress
                          }
                          gradient="from-leaf-400 to-lagoon-400"
                          height="h-1.5"
                        />

                      </div>

                    )}

                </Card>

              </button>

            ) : (

              <Card className="p-6 text-center">
                <Target className="w-7 h-7 text-leaf-400 mx-auto" />
                <p className="text-sm font-bold text-leaf-800 mt-2">
                  No missions available right now.
                </p>
              </Card>

            )}

          </section>

        </div>


        {/* =================================
            RIGHT
        ================================= */}

        <div className="space-y-6">


          {/* ECO GARDEN */}

          <Card className="overflow-hidden p-0">

            <div className="relative">

              <img
                src="/ecogarden.png"
                alt="Eco Garden"
                className="w-full h-36 object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute left-4 bottom-4">

                <div className="flex items-center gap-2 text-white">

                  <TreePine className="w-5 h-5" />

                  <span className="font-black">
                    Eco Garden
                  </span>

                </div>

              </div>

              <div className="absolute right-4 top-4">

                <Badge
                  variant="green"
                  size="sm"
                  className="!bg-white/90 !text-leaf-700"
                >
                  Lv {gardenLevel}
                </Badge>

              </div>

            </div>


            <div className="p-5">

              <div className="flex items-start justify-between gap-3">

                <div>

                  <div className="text-lg font-black text-leaf-800">
                    {gardenRank}
                  </div>

                  <p className="text-xs text-leaf-600/50 mt-1 leading-relaxed">
                    {currentRank.description}
                  </p>

                </div>

                <div className="text-right">

                  <div className="text-[10px] uppercase font-bold text-leaf-600/40">
                    Next
                  </div>

                  <div className="text-xs font-extrabold text-leaf-700">
                    {nextRank.name}
                  </div>

                </div>

              </div>


              <div className="mt-4">

                <div className="flex justify-between text-[10px] text-leaf-600/50 mb-1">

                  <span>
                    Garden progress
                  </span>

                  <span>
                    Lv {gardenLevel}
                  </span>

                </div>

                <ProgressBar
                  value={xpProgress}
                  gradient="from-leaf-400 to-lagoon-400"
                  height="h-2"
                />

              </div>


              <button
                onClick={() =>
                  navigate('garden')
                }
                className="w-full mt-4 py-2.5 rounded-xl bg-leaf-50 text-leaf-700 text-xs font-extrabold hover:bg-leaf-100 transition-colors"
              >
                Grow your garden
              </button>

            </div>

          </Card>


          {/* SCHOOL RANK */}

          <Card className="p-5">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-sun-50 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-sun-500" />
                </div>

                <div>

                  <h3 className="font-black text-leaf-800">
                    School leaderboard
                  </h3>

                  <p className="text-[10px] text-leaf-600/50">
                    Keep climbing
                  </p>

                </div>

              </div>

              <div className="text-right">

                <div className="text-lg font-black text-leaf-700">
                  #{myRank?.rank || 3}
                </div>

                <div className="text-[9px] text-leaf-600/40 font-semibold">
                  Your rank
                </div>

              </div>

            </div>


            <div className="space-y-1">

              {topStudents.map(
                (entry) => (

                  <div
                    key={entry.id}
                    className={`flex items-center gap-2.5 p-2 rounded-xl ${
                      entry.isCurrentUser
                        ? 'bg-leaf-50'
                        : ''
                    }`}
                  >

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                        entry.rank === 1
                          ? 'bg-sun-400 text-white'
                          : entry.rank === 2
                          ? 'bg-gray-300 text-white'
                          : entry.rank === 3
                          ? 'bg-coral-300 text-white'
                          : 'bg-leaf-100 text-leaf-600'
                      }`}
                    >
                      {entry.rank}
                    </div>


                    <div className="w-8 h-8 rounded-lg bg-leaf-50 flex items-center justify-center text-sm">
                      {entry.avatar}
                    </div>


                    <div className="flex-1 min-w-0">

                      <div className="text-xs font-bold text-leaf-800 truncate">
                        {entry.name}
                      </div>

                      <div className="text-[9px] text-leaf-600/40">
                        Level {entry.level}
                      </div>

                    </div>


                    <div className="text-[10px] font-black text-leaf-600">
                      {entry.xp.toLocaleString()}
                    </div>

                  </div>

                )
              )}

            </div>


            <button
              onClick={() =>
                navigate('leaderboard')
              }
              className="w-full mt-3 pt-3 border-t border-leaf-100 text-xs font-bold text-leaf-600 flex items-center justify-center gap-1 hover:text-leaf-700"
            >
              See leaderboard
              <ArrowRight className="w-3 h-3" />
            </button>

          </Card>


          {/* SMALL MOTIVATION */}

          <div className="rounded-2xl bg-cream-50 border border-leaf-100/50 p-5">

            <div className="flex items-start gap-3">

              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-sun-500" />
              </div>

              <div>

                <div className="text-xs font-black text-leaf-800">
                  Your impact matters
                </div>

                <p className="text-[11px] text-leaf-600/55 leading-relaxed mt-1">
                  Learn a little. Act a little.
                  Together, those small actions
                  create a greener future.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =================================
          FOOTER ACTION
      ================================= */}

      <div className="mt-6 flex items-center justify-center">

        <button
          onClick={() =>
            navigate('assessment')
          }
          className="text-xs font-bold text-leaf-500 hover:text-leaf-700 flex items-center gap-1.5 transition-colors"
        >
          <Leaf className="w-3.5 h-3.5" />
          Retake Eco Assessment
        </button>

      </div>

    </div>
  );
}
