import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

import {
  onAuthStateChanged,
  signOut,
  type User,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';

import {
  lessons as initialLessons,
  missions as initialMissions,
  type Lesson,
  type Mission,
} from '@/data/mockData';

import type { AssessmentResult } from '@/data/assessment';

import {
  loadProfile,
  loadProgress,
  saveAssessmentProfile,
  saveProgress,
  saveReward,
  spendCoins as spendCoinsApi,
  redeemReward as redeemRewardApi,
  type ProgressSnapshot,
} from '@/lib/profileStore';

export type PageId =
  | 'dashboard'
  | 'learn'
  | 'lesson'
  | 'quizzes'
  | 'missions'
  | 'garden'
  | 'leaderboard'
  | 'challenges'
  | 'landing'
  | 'ai-guide'
  | 'rewards'
  | 'profile'
  | 'login'
  | 'signup'
  | 'assessment';

interface AppState {
  // Authentication
  user: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;

  // Navigation
  currentPage: PageId;
  activeLessonId: string | null;
  navigate: (page: PageId) => void;
  openLesson: (lessonId: string) => void;
  closeLesson: () => void;

  // User stats
  level: number;
  xp: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  coins: number;
  streak: number;
  impactScore: number;
  gardenLevel: number;
  gardenRank: string;

  // Data
  lessons: Lesson[];
  missions: Mission[];
  completedLessons: number;
  completedMissions: number;

  // Actions
  completeLesson: (lessonId: string) => Promise<void>;
  completeMission: (missionId: string) => Promise<void>;
  updateMissionProgress: (
    missionId: string,
    progress: number,
  ) => Promise<void>;

  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;

  spendCoins: (
    amount: number,
  ) => Promise<boolean>;

  redeemReward: (
    rewardId: string,
  ) => Promise<boolean>;

  assessmentCompleted: boolean;
  assessmentResult: AssessmentResult | null;
  profile: UserProfile | null;

  hasCompletedAssessment: (
    uid: string,
  ) => boolean;

  completeAssessment: (
    result: AssessmentResult,
  ) => Promise<void>;

  grantReward: (
    activity: 'lesson' | 'quiz' | 'mission',
    xp: number,
    coins: number,
  ) => Promise<void>;
}

const XP_PER_LEVEL = 250;

function calculateLevel(xp: number): {
  level: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
} {
  const level =
    Math.floor(xp / XP_PER_LEVEL) + 1;

  const xpInCurrentLevel =
    xp % XP_PER_LEVEL;

  return {
    level,
    xpInCurrentLevel,
    xpForNextLevel: XP_PER_LEVEL,
  };
}

const AppContext =
  createContext<AppState | null>(null);

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  ecoLevel: string;
  ecoScore: number;
  topicScores: AssessmentResult['topicScores'];
  strengths: AssessmentResult['strengths'];
  knowledgeGaps: AssessmentResult['weakTopics'];
  recommendedTopics: AssessmentResult['recommendedTopics'];
  assessmentCompleted: boolean;
  assessmentCompletedAt: string;
  xp?: number;
  ecoCoins?: number;
  impactScore?: number;
  lessonsCompleted?: number;
  missionsCompleted?: number;
  learningProgress?: number;
}

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentPage, setCurrentPage] =
    useState<PageId>('landing');

  const [user, setUser] =
    useState<User | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [activeLessonId, setActiveLessonId] =
    useState<string | null>(null);

  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActivityDate, setLastActivityDate] =
    useState<string | null>(null);

  const [impactScore, setImpactScore] =
    useState(0);

  const [gardenLevel, setGardenLevel] =
    useState(3);

  const [lessons, setLessons] =
    useState<Lesson[]>(
      initialLessons.map((lesson) => ({
        ...lesson,
        completed: false,
      })),
    );

  const [missions, setMissions] =
    useState<Mission[]>(
      initialMissions.map((mission) => ({
        ...mission,
        completed: false,
        progress: 0,
      })),
    );

  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const coinsRef = useRef(coins);

  const assessmentCompleted = Boolean(
    profile?.assessmentCompleted &&
      (!user || profile.uid === user.uid),
  );

  const {
    level,
    xpInCurrentLevel,
    xpForNextLevel,
  } = calculateLevel(xp);

  const gardenRank =
    level >= 12
      ? 'Earth Guardian'
      : level >= 5
        ? 'Forest Explorer'
        : 'Seedling';

  const navigate = useCallback(
    (page: PageId) => {
      setCurrentPage(page);
      setActiveLessonId(null);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    [],
  );

  const openLesson = useCallback(
    (lessonId: string) => {
      setActiveLessonId(lessonId);
      setCurrentPage('lesson');

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    [],
  );

  const closeLesson = useCallback(() => {
    setActiveLessonId(null);
    setCurrentPage('learn');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const addXP = useCallback(
    (amount: number) => {
      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        amount > 1000
      ) {
        return;
      }

      setXp(
        (prev) =>
          prev + Math.floor(amount),
      );
    },
    [],
  );

  const addCoins = useCallback(
    (amount: number) => {
      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        amount > 1000
      ) {
        return;
      }

      setCoins((prev) => {
        const next =
          prev + Math.floor(amount);

        coinsRef.current = next;

        return next;
      });
    },
    [],
  );

  /*
   * Legacy generic coin spending.
   *
   * Rewards.tsx should NOT use this.
   * Reward purchases must use redeemReward()
   * so the backend validates the reward and
   * performs the transactional deduction.
   */
  const spendCoins = useCallback(
    async (amount: number) => {
      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return false;
      }

      try {
        const savedProfile =
          await spendCoinsApi(
            Math.floor(amount),
          );

        const nextXp =
          Number(savedProfile.xp) || 0;

        const nextCoins =
          Number(savedProfile.eco_coins) || 0;

        setXp(nextXp);
        setCoins(nextCoins);

        coinsRef.current = nextCoins;

        setProfile((current) =>
          current
            ? {
                ...current,
                xp: nextXp,
                ecoCoins: nextCoins,
                impactScore:
                  Number(
                    savedProfile.impact_score,
                  ) ||
                  current.impactScore ||
                  0,
              }
            : current,
        );

        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  /*
   * Secure reward redemption.
   *
   * The frontend sends ONLY the reward ID.
   * The backend decides the actual price/title
   * and performs the Supabase transaction.
   */
  const redeemReward = useCallback(
    async (rewardId: string) => {
      if (!rewardId.trim()) {
        return false;
      }

      try {
        const response =
          await redeemRewardApi(
            rewardId,
          );

        const savedProfile =
          response.profile;

        if (!savedProfile) {
          return false;
        }

        const nextXp =
          Number(savedProfile.xp) || 0;

        const nextCoins =
          Number(savedProfile.eco_coins) || 0;

        const nextImpact =
          Number(
            savedProfile.impact_score,
          ) || 0;

        setXp(nextXp);
        setCoins(nextCoins);

        coinsRef.current = nextCoins;

        setImpactScore(nextImpact);

        setProfile((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            xp: nextXp,
            ecoCoins: nextCoins,
            impactScore: nextImpact,
            lessonsCompleted:
              Number(
                savedProfile.lessons_completed,
              ) ||
              current.lessonsCompleted ||
              0,
            missionsCompleted:
              Number(
                savedProfile.missions_completed,
              ) ||
              current.missionsCompleted ||
              0,
            learningProgress:
              Number(
                savedProfile.learning_progress,
              ) ||
              current.learningProgress ||
              0,
          };
        });

        return true;
      } catch (error) {
        console.error(
          'Reward redemption failed:',
          error instanceof Error
            ? error.message
            : 'unknown error',
        );

        return false;
      }
    },
    [],
  );

  const applyProgressSnapshot =
    useCallback(
      (snapshot: ProgressSnapshot) => {
        setLessons((current) =>
          current.map((lesson) => ({
            ...lesson,
            completed:
              snapshot.lessons.find(
                (item) =>
                  item.id === lesson.id,
              )?.completed ??
              lesson.completed,
          })),
        );

        setMissions((current) =>
          current.map((mission) => {
            const saved =
              snapshot.missions.find(
                (item) =>
                  item.id === mission.id,
              );

            return saved
              ? {
                  ...mission,
                  progress:
                    saved.progress,
                  completed:
                    saved.completed,
                }
              : mission;
          }),
        );

        setStreak(
          snapshot.streak,
        );

        setLastActivityDate(
          snapshot.lastActivityDate,
        );

        setImpactScore(
          snapshot.impactScore,
        );
      },
      [],
    );

  const grantReward = useCallback(
    async (
      activity:
        | 'lesson'
        | 'quiz'
        | 'mission',
      rewardXp: number,
      rewardCoins: number,
    ) => {
      const savedProfile =
        await saveReward(
          activity,
          rewardXp,
          rewardCoins,
        );

      const nextXp =
        Number(savedProfile.xp) || 0;

      const nextCoins =
        Number(
          savedProfile.eco_coins,
        ) || 0;

      setXp(nextXp);
      setCoins(nextCoins);

      coinsRef.current =
        nextCoins;

      setProfile((current) =>
        current
          ? {
              ...current,
              xp: nextXp,
              ecoCoins: nextCoins,
              impactScore:
                Number(
                  savedProfile.impact_score,
                ) ||
                current.impactScore ||
                0,
            }
          : current,
      );

      applyProgressSnapshot(
        await loadProgress(),
      );
    },
    [applyProgressSnapshot],
  );

  const persistProgress =
    useCallback(
      async (
        nextLessons: Lesson[],
        nextMissions: Mission[],
      ) => {
        applyProgressSnapshot(
          await saveProgress({
            lessons:
              nextLessons.map(
                ({
                  id,
                  completed,
                }) => ({
                  id,
                  completed,
                }),
              ),

            missions:
              nextMissions.map(
                ({
                  id,
                  progress,
                  completed,
                }) => ({
                  id,
                  progress,
                  completed,
                }),
              ),
          }),
        );
      },
      [applyProgressSnapshot],
    );

  const completeLesson =
    useCallback(
      async (lessonId: string) => {
        const nextLessons =
          lessons.map((lesson) =>
            lesson.id === lessonId
              ? {
                  ...lesson,
                  completed: true,
                }
              : lesson,
          );

        setLessons(nextLessons);

        await persistProgress(
          nextLessons,
          missions,
        );
      },
      [
        lessons,
        missions,
        persistProgress,
      ],
    );

  const completeMission =
    useCallback(
      async (missionId: string) => {
        const nextMissions =
          missions.map((mission) =>
            mission.id === missionId
              ? {
                  ...mission,
                  completed: true,
                  progress: 100,
                }
              : mission,
          );

        setMissions(nextMissions);

        await persistProgress(
          lessons,
          nextMissions,
        );
      },
      [
        lessons,
        missions,
        persistProgress,
      ],
    );

  const updateMissionProgress =
    useCallback(
      async (
        missionId: string,
        progress: number,
      ) => {
        const nextMissions =
          missions.map((mission) =>
            mission.id === missionId
              ? {
                  ...mission,
                  progress: Math.min(
                    100,
                    progress,
                  ),
                  completed:
                    progress >= 100,
                }
              : mission,
          );

        setMissions(nextMissions);

        await persistProgress(
          lessons,
          nextMissions,
        );
      },
      [
        lessons,
        missions,
        persistProgress,
      ],
    );

  const completedLessons =
    lessons.filter(
      (lesson) => lesson.completed,
    ).length;

  const completedMissions =
    missions.filter(
      (mission) => mission.completed,
    ).length;

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          setUser(firebaseUser);

          if (!firebaseUser) {
            setProfile(null);
            setAssessmentResult(null);
            setAuthLoading(false);
          }

          if (firebaseUser) {
            setXp(0);
            setCoins(0);
            coinsRef.current = 0;

            setStreak(0);
            setLastActivityDate(null);
            setImpactScore(0);
            setGardenLevel(3);

            setLessons(
              initialLessons.map(
                (lesson) => ({
                  ...lesson,
                  completed: false,
                }),
              ),
            );

            setMissions(
              initialMissions.map(
                (mission) => ({
                  ...mission,
                  completed: false,
                  progress: 0,
                }),
              ),
            );

            setAssessmentResult(null);
            setProfile(null);

            let remoteProfile:
              | UserProfile
              | null = null;

            let profileLoadSucceeded =
              false;

            try {
              remoteProfile =
                await loadProfile(
                  firebaseUser.uid,
                );

              const remoteProgress =
                await loadProgress();

              applyProgressSnapshot(
                remoteProgress,
              );

              profileLoadSucceeded = true;

              if (remoteProfile) {
                const loadedProfile =
                  remoteProfile;

                setProfile(
                  loadedProfile,
                );

                const loadedXp =
                  Number(
                    loadedProfile.xp,
                  ) || 0;

                const loadedCoins =
                  Number(
                    loadedProfile.ecoCoins,
                  ) || 0;

                setXp(loadedXp);
                setCoins(
                  loadedCoins,
                );

                coinsRef.current =
                  loadedCoins;

                setAssessmentResult(
                  (current) =>
                    current ?? {
                      overallScore:
                        loadedProfile.ecoScore,

                      topicScores:
                        loadedProfile.topicScores,

                      strengths:
                        loadedProfile.strengths,

                      weakTopics:
                        loadedProfile.knowledgeGaps,

                      knowledgeLevel:
                        loadedProfile.ecoLevel,

                      recommendedTopics:
                        loadedProfile.recommendedTopics,

                      answers: {},

                      completedAt:
                        loadedProfile.assessmentCompletedAt,
                    },
                );
              }
            } catch (error) {
              console.error(
                'Unable to load profile:',
                error instanceof Error
                  ? error.message
                  : 'unknown error',
              );
            }

            setAuthLoading(false);

            setCurrentPage(
              (currentPage) => {
                if (
                  firebaseUser &&
                  [
                    'landing',
                    'login',
                    'signup',
                  ].includes(
                    currentPage,
                  )
                ) {
                  const completedForUser =
                    remoteProfile?.uid ===
                      firebaseUser.uid &&
                    remoteProfile.assessmentCompleted;

                  return completedForUser ||
                    !profileLoadSucceeded
                    ? 'dashboard'
                    : 'assessment';
                }

                return currentPage;
              },
            );
          } else {
            setCurrentPage(
              (currentPage) =>
                currentPage !==
                  'landing' &&
                currentPage !== 'login' &&
                currentPage !== 'signup'
                  ? 'landing'
                  : currentPage,
            );
          }
        },
      );

    return unsubscribe;
  }, [applyProgressSnapshot]);

  useEffect(() => {
    if (level !== gardenLevel) {
      setGardenLevel(level);
    }
  }, [level, gardenLevel]);

  const completeAssessment =
    useCallback(
      async (
        result: AssessmentResult,
      ) => {
        setAssessmentResult(result);

        if (user) {
          const nextProfile: UserProfile =
            {
              uid: user.uid,
              email: user.email,
              displayName:
                user.displayName,

              ecoLevel:
                result.knowledgeLevel,

              ecoScore:
                result.overallScore,

              topicScores:
                result.topicScores,

              strengths:
                result.strengths,

              knowledgeGaps:
                result.weakTopics,

              recommendedTopics:
                result.recommendedTopics,

              assessmentCompleted:
                true,

              assessmentCompletedAt:
                result.completedAt,
            };

          const savedProfile =
            await saveAssessmentProfile(
              nextProfile,
              result,
            );

          setProfile(savedProfile);
        }
      },
      [user],
    );

  const hasCompletedAssessment =
    useCallback(
      (uid: string) =>
        profile?.uid === uid &&
        profile.assessmentCompleted,
      [profile],
    );

  const logout = useCallback(
    async () => {
      try {
        await signOut(auth);

        setUser(null);
        setProfile(null);
        setAssessmentResult(null);

        navigate('landing');
      } catch (error) {
        console.error(
          'Logout failed:',
          error,
        );
      }
    },
    [navigate],
  );

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        logout,

        currentPage,
        activeLessonId,

        navigate,
        openLesson,
        closeLesson,

        level,
        xp,
        xpInCurrentLevel,
        xpForNextLevel,

        coins,
        streak,
        impactScore,

        gardenLevel,
        gardenRank,

        lessons,
        missions,

        completedLessons,
        completedMissions,

        completeLesson,
        completeMission,
        updateMissionProgress,

        addXP,
        addCoins,

        spendCoins,
        redeemReward,

        assessmentCompleted,
        assessmentResult,
        profile,

        hasCompletedAssessment,
        completeAssessment,

        grantReward,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error(
      'useApp must be used within AppProvider',
    );
  }

  return ctx;
}