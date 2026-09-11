import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { useApp } from '@/context/AppContext';
import { useFeedback } from '@/components/ui/FeedbackToast';
import {
  CheckCircle2,
  Zap,
  Coins,
  Target,
  PartyPopper,
} from 'lucide-react';

export function Missions() {
  const {
    missions,
    completeMission,
    updateMissionProgress,
    addXP,
    addCoins,
    completedMissions,
  } = useApp();

  const { showXP, showCoin } = useFeedback();

  const [showCelebration, setShowCelebration] = useState<string | null>(null);
  const [completingMission, setCompletingMission] = useState<string | null>(null);

  const handleComplete = async (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);

    if (!mission || mission.completed || completingMission === missionId) {
      return;
    }

    try {
      setCompletingMission(missionId);

      // Mark mission as completed
      completeMission(missionId);

      // Save XP first, then coins
      await addXP(mission.xpReward);
      await addCoins(mission.coinReward);

      // Show reward notifications
      showXP(mission.xpReward);
      showCoin(mission.coinReward);

      // Show celebration
      setShowCelebration(missionId);

      setTimeout(() => {
        setShowCelebration(null);
      }, 2000);
    } catch (error) {
      console.error('Mission completion error:', error);
    } finally {
      setCompletingMission(null);
    }
  };

  const handleProgress = async (
    missionId: string,
    progress: number
  ) => {
    updateMissionProgress(missionId, progress);

    if (progress >= 100) {
      await handleComplete(missionId);
    }
  };

  const activeMissions = missions.filter(
    (mission) => !mission.completed
  );

  const doneMissions = missions.filter(
    (mission) => mission.completed
  );

  const totalXpEarned = missions.reduce(
    (sum, mission) =>
      sum + (mission.completed ? mission.xpReward : 0),
    0
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Missions"
        icon={<Target className="w-5 h-5" />}
        subtitle="Complete real-world eco actions to earn XP and coins. Every small action makes a difference!"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-5 text-center animate-slide-up stagger-1">
          <div className="text-3xl font-extrabold text-leaf-600">
            {completedMissions}
          </div>

          <div className="text-sm text-leaf-600/60 font-medium">
            Completed
          </div>
        </Card>

        <Card className="p-5 text-center animate-slide-up stagger-2">
          <div className="text-3xl font-extrabold text-coral-600">
            {activeMissions.length}
          </div>

          <div className="text-sm text-leaf-600/60 font-medium">
            In Progress
          </div>
        </Card>

        <Card className="p-5 text-center animate-slide-up stagger-3">
          <div className="text-3xl font-extrabold text-sun-600">
            {totalXpEarned}
          </div>

          <div className="text-sm text-leaf-600/60 font-medium">
            XP Earned
          </div>
        </Card>
      </div>

      {/* Active Missions */}
      <h3 className="text-xl font-extrabold text-leaf-800 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-coral-400" />
        Active Missions
      </h3>

      {activeMissions.length === 0 ? (
        <Card className="p-10 text-center mb-10">
          <Target className="w-12 h-12 text-leaf-200 mx-auto mb-3" />

          <h4 className="font-extrabold text-leaf-800">
            No missions yet
          </h4>

          <p className="text-sm text-leaf-600/60 mt-1">
            Check back soon for new eco challenges!
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {activeMissions.map((mission, i) => {
            const isCompleting =
              completingMission === mission.id;

            return (
              <Card
                key={mission.id}
                className={`p-6 animate-slide-up stagger-${Math.min(
                  i + 1,
                  8
                )} relative overflow-hidden`}
              >
                {/* Celebration */}
                {showCelebration === mission.id && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur rounded-3xl animate-pop-in">
                    <div className="text-center">
                      <PartyPopper className="w-12 h-12 text-sun-400 mx-auto mb-2 animate-bounce-soft" />

                      <div className="text-2xl font-extrabold gradient-text">
                        Mission Complete!
                      </div>

                      <div className="flex items-center justify-center gap-3 mt-2">
                        <Badge variant="green" size="md">
                          +{mission.xpReward} XP
                        </Badge>

                        <Badge variant="gold" size="md">
                          +{mission.coinReward} 🪙
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mission Header */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${
                      mission.color
                    } flex items-center justify-center text-3xl shadow-soft flex-shrink-0`}
                  >
                    {mission.emoji}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          mission.difficulty === 'Beginner'
                            ? 'green'
                            : mission.difficulty === 'Intermediate'
                            ? 'gold'
                            : 'coral'
                        }
                        size="sm"
                      >
                        {mission.difficulty}
                      </Badge>
                    </div>

                    <h4 className="font-extrabold text-leaf-800">
                      {mission.title}
                    </h4>

                    <p className="text-sm text-leaf-600/70 mt-1">
                      {mission.description}
                    </p>
                  </div>
                </div>

                {/* Rewards */}
                <div className="mt-4 flex items-center gap-3">
                  <Badge
                    variant="green"
                    size="sm"
                    icon={<Zap className="w-3 h-3" />}
                  >
                    +{mission.xpReward} XP
                  </Badge>

                  <Badge
                    variant="gold"
                    size="sm"
                    icon={<Coins className="w-3 h-3" />}
                  >
                    +{mission.coinReward} 🪙
                  </Badge>
                </div>

                {/* Progress */}
                {mission.progress > 0 &&
                  mission.progress < 100 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-leaf-600/60 mb-1">
                        <span>Progress</span>
                        <span>{mission.progress}%</span>
                      </div>

                      <ProgressBar
                        value={mission.progress}
                        gradient="from-coral-400 to-sun-400"
                      />
                    </div>
                  )}

                {/* Actions */}
                <div className="mt-5 flex gap-2">
                  {mission.progress === 0 && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isCompleting}
                        onClick={() =>
                          handleProgress(mission.id, 50)
                        }
                      >
                        Mark 50% Done
                      </Button>

                      <Button
                        size="sm"
                        disabled={isCompleting}
                        onClick={() =>
                          handleComplete(mission.id)
                        }
                        icon={
                          <CheckCircle2 className="w-4 h-4" />
                        }
                      >
                        {isCompleting
                          ? 'Saving...'
                          : 'Complete'}
                      </Button>
                    </>
                  )}

                  {mission.progress > 0 &&
                    mission.progress < 100 && (
                      <Button
                        size="sm"
                        fullWidth
                        disabled={isCompleting}
                        onClick={() =>
                          handleComplete(mission.id)
                        }
                        icon={
                          <CheckCircle2 className="w-4 h-4" />
                        }
                      >
                        {isCompleting
                          ? 'Saving...'
                          : 'Mark Complete'}
                      </Button>
                    )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Completed Missions */}
      {doneMissions.length > 0 && (
        <>
          <h3 className="text-xl font-extrabold text-leaf-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-leaf-500" />
            Completed Missions
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doneMissions.map((mission) => (
              <Card
                key={mission.id}
                className="p-5 animate-slide-up opacity-75 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                      mission.color
                    } flex items-center justify-center text-2xl flex-shrink-0`}
                  >
                    {mission.emoji}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-leaf-800 flex items-center gap-2">
                      {mission.title}

                      <CheckCircle2 className="w-4 h-4 text-leaf-500" />
                    </h4>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="green" size="sm">
                        +{mission.xpReward} XP
                      </Badge>

                      <Badge variant="gold" size="sm">
                        +{mission.coinReward} 🪙
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
