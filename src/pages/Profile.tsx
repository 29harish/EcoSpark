import {
  Award,
  BookOpen,
  CheckCircle2,
  Coins,
  Flame,
  GraduationCap,
  Sprout,
  Target,
  TreePine,
  User,
  Zap,
} from 'lucide-react';

import { Card, GradientCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { PageHeader } from '@/components/layout/PageHeader';
import { useApp } from '@/context/AppContext';

export function Profile() {
  const {
    level,
    xp,
    xpInCurrentLevel,
    xpForNextLevel,
    coins,
    streak,
    impactScore,
    gardenLevel,
    gardenRank,
    completedLessons,
    completedMissions,
    lessons,
    missions,
    profile,
  } = useApp();

  const learningProgress =
    lessons.length > 0
      ? Math.round(
          (completedLessons / lessons.length) * 100,
        )
      : 0;

  const missionProgress =
    missions.length > 0
      ? Math.round(
          (completedMissions / missions.length) * 100,
        )
      : 0;

  const xpProgress =
    xpForNextLevel > 0
      ? Math.min(
          100,
          Math.round(
            (xpInCurrentLevel / xpForNextLevel) * 100,
          ),
        )
      : 0;

  const displayName =
    profile?.displayName?.trim() ||
    'Eco Explorer';

  const email = profile?.email || '';

  const ecoLevel =
    profile?.ecoLevel || gardenRank;

  const ecoScore =
    Number(profile?.ecoScore) || 0;

  const strengths =
    profile?.strengths ?? [];

  const knowledgeGaps =
    profile?.knowledgeGaps ?? [];

  const topicScores =
    profile?.topicScores ?? {};

  const topicEntries =
    Object.entries(topicScores);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="My Eco Profile"
        icon={<User className="w-5 h-5" />}
        subtitle="Track your learning, environmental impact and EcoSpark journey."
      />

      {/* =========================================================
          PROFILE HERO
      ========================================================= */}
      <GradientCard
        gradient="from-leaf-600 via-lagoon-500 to-leaf-500"
        className="relative overflow-hidden p-6 md:p-8 mb-8 animate-slide-up"
      >
        <div className="absolute -right-12 -top-16 text-[170px] opacity-[0.08]">
          🌍
        </div>

        <div className="absolute -left-10 -bottom-20 text-[150px] opacity-[0.06]">
          🌿
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-7">
          {/* Avatar */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] bg-white/15 backdrop-blur-md border border-white/25 shadow-soft-lg flex items-center justify-center">
              <Sprout className="w-16 h-16 md:w-20 md:h-20 text-white" />
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2">
              <Badge
                variant="gray"
                size="sm"
                className="!bg-white/15 !text-white !border-white/20"
              >
                <Sprout className="w-3 h-3 mr-1" />
                {ecoLevel}
              </Badge>

              <Badge
                variant="gray"
                size="sm"
                className="!bg-white/15 !text-white !border-white/20"
              >
                Level {level}
              </Badge>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {displayName}
            </h2>

            {email && (
              <p className="text-sm text-white/65 mt-1">
                {email}
              </p>
            )}

            <p className="text-white/80 mt-3 max-w-xl text-sm md:text-base">
              Keep learning, complete eco missions
              and turn your knowledge into real-world
              environmental action.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mt-5">
              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-2.5 text-white">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="font-extrabold">
                    {xp.toLocaleString()}
                  </span>
                  <span className="text-white/60 text-xs">
                    XP
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-2.5 text-white">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  <span className="font-extrabold">
                    {coins.toLocaleString()}
                  </span>
                  <span className="text-white/60 text-xs">
                    Eco Coins
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-2.5 text-white">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span className="font-extrabold">
                    {streak}
                  </span>
                  <span className="text-white/60 text-xs">
                    day streak
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Level */}
          <div className="flex flex-col items-center min-w-[130px]">
            <ProgressRing
              progress={xpProgress}
              size={112}
              strokeWidth={9}
              colorFrom="#ffffff"
              colorTo="#fcb816"
            >
              <div className="text-center">
                <div className="text-2xl font-extrabold text-white">
                  {level}
                </div>

                <div className="text-[11px] text-white/65">
                  LEVEL
                </div>
              </div>
            </ProgressRing>

            <div className="text-xs text-white/70 mt-2">
              {xpInCurrentLevel} / {xpForNextLevel} XP
            </div>

            <div className="text-xs text-white/50 mt-1">
              to next level
            </div>
          </div>
        </div>
      </GradientCard>

      {/* =========================================================
          CORE STATS
      ========================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-2xl bg-leaf-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-leaf-600" />
            </div>

            <span className="text-xs font-bold text-leaf-500">
              {learningProgress}%
            </span>
          </div>

          <div className="mt-4">
            <div className="text-2xl font-extrabold text-leaf-800">
              {completedLessons}
            </div>

            <p className="text-sm text-leaf-600/60">
              Lessons completed
            </p>
          </div>
        </Card>

        <Card className="p-5 hover:shadow-soft-lg transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-coral-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-coral-500" />
          </div>

          <div className="mt-4">
            <div className="text-2xl font-extrabold text-leaf-800">
              {completedMissions}
            </div>

            <p className="text-sm text-leaf-600/60">
              Missions completed
            </p>
          </div>
        </Card>

        <Card className="p-5 hover:shadow-soft-lg transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-lagoon-50 flex items-center justify-center">
            <Zap className="w-5 h-5 text-lagoon-600" />
          </div>

          <div className="mt-4">
            <div className="text-2xl font-extrabold text-leaf-800">
              {impactScore.toLocaleString()}
            </div>

            <p className="text-sm text-leaf-600/60">
              Impact score
            </p>
          </div>
        </Card>

        <Card className="p-5 hover:shadow-soft-lg transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-sun-50 flex items-center justify-center">
            <TreePine className="w-5 h-5 text-sun-600" />
          </div>

          <div className="mt-4">
            <div className="text-2xl font-extrabold text-leaf-800">
              {gardenLevel}
            </div>

            <p className="text-sm text-leaf-600/60">
              Garden level
            </p>
          </div>
        </Card>
      </div>

      {/* =========================================================
          LEARNING + ECO IMPACT
      ========================================================= */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Learning */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-leaf-800">
                Learning journey
              </h3>

              <p className="text-sm text-leaf-600/60 mt-1">
                Your progress through EcoSpark lessons.
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-leaf-50 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-leaf-600" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ProgressRing
              progress={learningProgress}
              size={92}
              strokeWidth={8}
              colorFrom="#57b87c"
              colorTo="#1b9fb6"
            >
              <div className="text-center">
                <div className="text-xl font-extrabold text-leaf-800">
                  {learningProgress}%
                </div>
              </div>
            </ProgressRing>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-leaf-700">
                  Lessons
                </span>

                <span className="text-sm font-extrabold text-leaf-800">
                  {completedLessons}/{lessons.length}
                </span>
              </div>

              <div className="h-2.5 bg-leaf-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-leaf-500 to-lagoon-500 rounded-full transition-all"
                  style={{
                    width: `${learningProgress}%`,
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-leaf-600/60">
                <CheckCircle2 className="w-4 h-4 text-leaf-500" />
                Keep completing lessons to increase your level.
              </div>
            </div>
          </div>
        </Card>

        {/* Missions */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-leaf-800">
                Real-world action
              </h3>

              <p className="text-sm text-leaf-600/60 mt-1">
                Your progress beyond the classroom.
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-coral-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-coral-500" />
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-leaf-700">
              Missions
            </span>

            <span className="text-sm font-extrabold text-leaf-800">
              {completedMissions}/{missions.length}
            </span>
          </div>

          <div className="h-3 bg-leaf-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-coral-400 to-sun-400 rounded-full transition-all"
              style={{
                width: `${missionProgress}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl bg-leaf-50 p-4">
              <div className="text-lg font-extrabold text-leaf-800">
                {impactScore}
              </div>

              <div className="text-xs text-leaf-600/60 mt-1">
                Impact points
              </div>
            </div>

            <div className="rounded-2xl bg-sun-50 p-4">
              <div className="text-lg font-extrabold text-leaf-800">
                {coins.toLocaleString()}
              </div>

              <div className="text-xs text-leaf-600/60 mt-1">
                Eco Coins
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* =========================================================
          ASSESSMENT
      ========================================================= */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-sun-500" />

              <h3 className="text-lg font-extrabold text-leaf-800">
                Eco assessment
              </h3>
            </div>

            <p className="text-sm text-leaf-600/60 mt-1">
              Your environmental knowledge profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-extrabold text-leaf-800">
                {ecoScore}
              </div>

              <div className="text-xs text-leaf-600/60">
                Overall score
              </div>
            </div>

            <div className="w-px h-10 bg-leaf-100" />

            <Badge variant="green" size="md">
              {ecoLevel}
            </Badge>
          </div>
        </div>

        {/* Topic performance */}
        {topicEntries.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-extrabold text-leaf-700 mb-3">
              Topic performance
            </h4>

            <div className="grid sm:grid-cols-2 gap-3">
              {topicEntries.map(
                ([topicName, rawScore]) => {
                  const score =
                    Number(rawScore) || 0;

                  return (
                    <div
                      key={topicName}
                      className="rounded-2xl bg-leaf-50/70 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-leaf-700 truncate">
                          {topicName}
                        </span>

                        <span className="text-xs font-extrabold text-leaf-600">
                          {score}%
                        </span>
                      </div>

                      <div className="h-1.5 bg-white rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-leaf-500 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, score),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {/* Strengths */}
          <div className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-5">
            <h4 className="text-sm font-extrabold text-leaf-800 mb-3">
              Your strengths
            </h4>

            {strengths.length > 0 ? (
              <div className="space-y-2">
                {strengths.map(
                  (strength, index) => (
                    <div
                      key={`${strength}-${index}`}
                      className="flex items-start gap-2 text-sm text-leaf-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-leaf-500 mt-0.5 shrink-0" />

                      <span>
                        {strength}
                      </span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-leaf-600/50">
                Complete your assessment to discover your strengths.
              </p>
            )}
          </div>

          {/* Knowledge gaps */}
          <div className="rounded-2xl border border-sun-100 bg-sun-50/40 p-5">
            <h4 className="text-sm font-extrabold text-leaf-800 mb-3">
              Areas to improve
            </h4>

            {knowledgeGaps.length > 0 ? (
              <div className="space-y-2">
                {knowledgeGaps.map(
                  (gap, index) => (
                    <div
                      key={`${gap}-${index}`}
                      className="flex items-start gap-2 text-sm text-leaf-700"
                    >
                      <Target className="w-4 h-4 text-sun-500 mt-0.5 shrink-0" />

                      <span>
                        {gap}
                      </span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-leaf-600/50">
                Your improvement areas will appear after assessment.
              </p>
            )}
          </div>
        </div>
      </Card>

      
    </div>
  );
}