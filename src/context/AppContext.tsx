
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
  user: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;

  currentPage: PageId;
  activeLessonId: string | null;
  navigate: (page: PageId) => void;
  openLesson: (lessonId: string) => void;
  closeLesson: () => void;

  level: number;
  xp: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  coins: number;
  streak: number;
  impactScore: number;
  gardenLevel: number;
  gardenRank: string;

  lessons: Lesson[];
  missions: Mission[];
  completedLessons: number;
  completedMissions: number;

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
  const safeXp = Math.max(
    0,
    Math.floor(Number(xp) || 0),
  );

  const level =
    Math.floor(safeXp / XP_PER_LEVEL) + 1;

  const xpInCurrentLevel =
    safeXp % XP_PER_LEVEL;

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

  const [
    lastActivityDate,
    setLastActivityDate,
  ] = useState<string | null>(null);

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

  /*
   * Keep the latest coin balance available
   * synchronously for async operations.
   */
  const coinsRef = useRef(0);

  /*
   * Keep the latest profile reference as well.
   * This prevents stale async operations from
   * accidentally restoring an older balance.
   */
  const profileRef =
    useRef<UserProfile | null>(null);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

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

  /*
   * Central function for applying an authoritative
   * profile received from the backend.
   *
   * Whenever Supabase gives us a profile, ALL
   * relevant local state is synchronized from it.
   */
  const applyRemoteProfile =
    useCallback(
      (remoteProfile: UserProfile | null) => {
        if (!remoteProfile) {
          return;
        }

        const nextXp =
          Math.max(
            0,
            Math.floor(
              Number(remoteProfile.xp) || 0,
            ),
          );

        const nextCoins =
          Math.max(
            0,
            Math.floor(
              Number(
                remoteProfile.ecoCoins,
              ) || 0,
            ),
          );

        const nextImpact =
          Math.max(
            0,
            Number(
              remoteProfile.impactScore,
            ) || 0,
          );

        setProfile(remoteProfile);

        setXp(nextXp);
        setCoins(nextCoins);
        coinsRef.current = nextCoins;

        setImpactScore(nextImpact);
      },
      [],
    );

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

      setXp((prev) =>
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
   * Rewards.tsx should use redeemReward()
   * instead of this function.
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

        if (!savedProfile) {
          return false;
        }

        const currentProfile =
          profileRef.current;

        const nextXp =
          Number(savedProfile.xp) || 0;

        const nextCoins =
          Math.max(
            0,
            Number(
              savedProfile.eco_coins,
            ) || 0,
          );

        const nextImpact =
          Number(
            savedProfile.impact_score,
          ) || 0;

        setXp(nextXp);
        setCoins(nextCoins);
        coinsRef.current = nextCoins;
        setImpactScore(nextImpact);

        if (currentProfile) {
          const updatedProfile: UserProfile = {
            ...currentProfile,
            xp: nextXp,
            ecoCoins: nextCoins,
            impactScore: nextImpact,
            lessonsCompleted:
              Number(
                savedProfile.lessons_completed,
              ) ||
              currentProfile.lessonsCompleted ||
              0,
            missionsCompleted:
              Number(
                savedProfile.missions_completed,
              ) ||
              currentProfile.missionsCompleted ||
              0,
            learningProgress:
              Number(
                savedProfile.learning_progress,
              ) ||
              currentProfile.learningProgress ||
              0,
          };

          setProfile(updatedProfile);
          profileRef.current =
            updatedProfile;
        }

        return true;
      } catch (error) {
        console.error(
          'Coin spending failed:',
          error,
        );

        return false;
      }
    },
    [],
  );

  /*
   * Secure reward redemption.
   *
   * Only rewardId is sent to the backend.
   * Supabase is the authoritative source.
   */
  const redeemReward = useCallback(
    async (rewardId: string) => {
      if (
        !rewardId ||
        !rewardId.trim()
      ) {
        return false;
      }

      try {
        const response =
          await redeemRewardApi(
            rewardId.trim(),
          );

        const savedProfile =
          response?.profile;

        if (!savedProfile) {
          console.error(
            'Reward redemption returned no profile.',
          );

          return false;
        }

        /*
         * IMPORTANT:
         *
         * Never calculate the new balance
         * locally here.
         *
         * The backend has already deducted the
         * correct amount in Supabase.
         */
        const currentProfile =
          profileRef.current;

        const nextXp =
          Math.max(
            0,
            Math.floor(
              Number(savedProfile.xp) || 0,
            ),
          );

        const nextCoins =
          Math.max(
            0,
            Math.floor(
              Number(
                savedProfile.eco_coins,
              ) || 0,
            ),
          );

        const nextImpact =
          Math.max(
            0,
            Number(
              savedProfile.impact_score,
            ) || 0,
          );

        setXp(nextXp);
        setCoins(nextCoins);
        coinsRef.current = nextCoins;
        setImpactScore(nextImpact);

        if (currentProfile) {
          const updatedProfile: UserProfile = {
            ...currentProfile,

            xp: nextXp,
            ecoCoins: nextCoins,
            impactScore: nextImpact,

            lessonsCompleted:
              Number(
                savedProfile.lessons_completed,
              ) ||
              currentProfile.lessonsCompleted ||
              0,

            missionsCompleted:
              Number(
                savedProfile.missions_completed,
              ) ||
              currentProfile.missionsCompleted ||
              0,

            learningProgress:
              Number(
                savedProfile.learning_progress,
              ) ||
              currentProfile.learningProgress ||
              0,
          };

          setProfile(updatedProfile);
          profileRef.current =
            updatedProfile;
        }

        /*
         * Do one authoritative profile reload
         * after redemption.
         *
         * This confirms that the value currently
         * displayed by the UI also exists in the
         * database.
         */
        try {
          const verifiedProfile =
            await loadProfile(
              savedProfile.firebase_uid ??
                user?.uid ??
                '',
            );

          if (verifiedProfile) {
            applyRemoteProfile(
              verifiedProfile,
            );
          }
        } catch (verificationError) {
          /*
           * Do not fail an already successful
           * redemption because the verification
           * request failed.
           */
          console.warn(
            'Post-redemption profile verification failed:',
            verificationError,
          );
        }

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
    [
      applyRemoteProfile,
      user,
    ],
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

  /*
   * Earn XP / Eco Coins.
   *
   * The backend calculates the new balance
   * from the existing database balance.
   */
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

      if (!savedProfile) {
        throw new Error(
          'Reward was not saved.',
        );
      }

      const currentProfile =
        profileRef.current;

      const nextXp =
        Math.max(
          0,
          Math.floor(
            Number(savedProfile.xp) || 0,
          ),
        );

      const nextCoins =
        Math.max(
          0,
          Math.floor(
            Number(
              savedProfile.eco_coins,
            ) || 0,
          ),
        );

      const nextImpact =
        Math.max(
          0,
          Number(
            savedProfile.impact_score,
          ) || 0,
        );

      setXp(nextXp);
      setCoins(nextCoins);
      coinsRef.current = nextCoins;
      setImpactScore(nextImpact);

      if (currentProfile) {
        const updatedProfile: UserProfile = {
          ...currentProfile,
          xp: nextXp,
          ecoCoins: nextCoins,
          impactScore: nextImpact,
          lessonsCompleted:
            Number(
              savedProfile.lessons_completed,
            ) ||
            currentProfile.lessonsCompleted ||
            0,
          missionsCompleted:
            Number(
              savedProfile.missions_completed,
            ) ||
            currentProfile.missionsCompleted ||
            0,
          learningProgress:
            Number(
              savedProfile.learning_progress,
            ) ||
            currentProfile.learningProgress ||
            0,
        };

        setProfile(updatedProfile);
        profileRef.current =
          updatedProfile;
      }

      const remoteProgress =
        await loadProgress();

      applyProgressSnapshot(
        remoteProgress,
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
        const savedProgress =
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
          });

        applyProgressSnapshot(
          savedProgress,
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
        const safeProgress =
          Math.max(
            0,
            Math.min(
              100,
              Number(progress) || 0,
            ),
          );

        const nextMissions =
          missions.map((mission) =>
            mission.id === missionId
              ? {
                  ...mission,
                  progress:
                    safeProgress,
                  completed:
                    safeProgress >= 100,
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

  /*
   * Authentication / profile restoration.
   *
   * IMPORTANT:
   * We reset temporary UI state first, then
   * immediately replace it with the authoritative
   * Supabase profile.
   */
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          setUser(firebaseUser);

          if (!firebaseUser) {
            setProfile(null);
            profileRef.current = null;

            setAssessmentResult(null);

            setXp(0);
            setCoins(0);
            coinsRef.current = 0;

            setStreak(0);
            setLastActivityDate(null);
            setImpactScore(0);

            setAuthLoading(false);

            setCurrentPage(
              (currentPage) =>
                currentPage !==
                  'landing' &&
                currentPage !== 'login' &&
                currentPage !== 'signup'
                  ? 'landing'
                  : currentPage,
            );

            return;
          }

          /*
           * Temporary loading state.
           * These values MUST be replaced by the
           * remote profile below.
           */
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
          profileRef.current = null;

          let remoteProfile:
            | UserProfile
            | null = null;

          let profileLoadSucceeded =
            false;

          try {
            /*
             * First load the profile from Supabase.
             *
             * This is the authoritative source for:
             * XP
             * Eco Coins
             * Impact Score
             * assessment
             */
            remoteProfile =
              await loadProfile(
                firebaseUser.uid,
              );

            if (remoteProfile) {
              applyRemoteProfile(
                remoteProfile,
              );

              setAssessmentResult({
                overallScore:
                  remoteProfile.ecoScore,

                topicScores:
                  remoteProfile.topicScores,

                strengths:
                  remoteProfile.strengths,

                weakTopics:
                  remoteProfile.knowledgeGaps,

                knowledgeLevel:
                  remoteProfile.ecoLevel,

                recommendedTopics:
                  remoteProfile.recommendedTopics,

                answers: {},

                completedAt:
                  remoteProfile.assessmentCompletedAt,
              });
            }

            /*
             * Progress is loaded separately.
             *
             * It must NOT overwrite coins or XP.
             */
            const remoteProgress =
              await loadProgress();

            applyProgressSnapshot(
              remoteProgress,
            );

            /*
             * Re-load the profile after progress
             * loading so that the final state is
             * definitely the latest profile state.
             */
            const verifiedProfile =
              await loadProfile(
                firebaseUser.uid,
              );

            if (verifiedProfile) {
              applyRemoteProfile(
                verifiedProfile,
              );

              if (
                verifiedProfile.assessmentCompleted
              ) {
                setAssessmentResult(
                  (current) =>
                    current ?? {
                      overallScore:
                        verifiedProfile.ecoScore,

                      topicScores:
                        verifiedProfile.topicScores,

                      strengths:
                        verifiedProfile.strengths,

                      weakTopics:
                        verifiedProfile.knowledgeGaps,

                      knowledgeLevel:
                        verifiedProfile.ecoLevel,

                      recommendedTopics:
                        verifiedProfile.recommendedTopics,

                      answers: {},

                      completedAt:
                        verifiedProfile.assessmentCompletedAt,
                    },
                );
              }

              remoteProfile =
                verifiedProfile;
            }

            profileLoadSucceeded = true;
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
        },
      );

    return unsubscribe;
  }, [
    applyProgressSnapshot,
    applyRemoteProfile,
  ]);

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

        if (!user) {
          return;
        }

        const nextProfile: UserProfile = {
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

          /*
           * Do NOT send local XP/coins here.
           * The backend protects those fields.
           */
        };

        const savedProfile =
          await saveAssessmentProfile(
            nextProfile,
            result,
          );

        /*
         * Preserve the server-authoritative
         * progression values returned by Supabase.
         */
        applyRemoteProfile(
          savedProfile,
        );
      },
      [
        user,
        applyRemoteProfile,
      ],
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
        profileRef.current = null;

        setAssessmentResult(null);

        setXp(0);
        setCoins(0);
        coinsRef.current = 0;

        setStreak(0);
        setLastActivityDate(null);
        setImpactScore(0);

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
  
