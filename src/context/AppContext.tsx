import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  lessons as initialLessons,
  missions as initialMissions,
  type Lesson,
  type Mission,
} from '@/data/mockData';
import type { AssessmentResult } from '@/data/assessment';
import { loadProfile, saveAssessmentProfile, saveReward } from '@/lib/profileStore';

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
  completeLesson: (lessonId: string) => void;
  completeMission: (missionId: string) => void;
  updateMissionProgress: (missionId: string, progress: number) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  assessmentCompleted: boolean;
  assessmentResult: AssessmentResult | null;
  profile: UserProfile | null;
  hasCompletedAssessment: (uid: string) => boolean;
  completeAssessment: (result: AssessmentResult) => Promise<void>;
  grantReward: (activity: 'lesson' | 'quiz' | 'mission', xp: number, coins: number) => Promise<void>;
}

const XP_PER_LEVEL = 250;

function calculateLevel(xp: number): { level: number; xpInCurrentLevel: number; xpForNextLevel: number } {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  return { level, xpInCurrentLevel, xpForNextLevel: XP_PER_LEVEL };
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = 'ecospark_state_v1';

interface PersistedState {
  xp: number;
  coins: number;
  gardenLevel: number;
  lessons: Lesson[];
  missions: Mission[];
  assessmentCompleted?: boolean;
  assessmentResult?: AssessmentResult | null;
  profile?: UserProfile | null;
  streak?: number;
  lastActivityDate?: string | null;
}

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
}

function loadPersistedState(uid: string): Partial<PersistedState> | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${uid}`);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActivityDate, setLastActivityDate] = useState<string | null>(null);
  const [gardenLevel, setGardenLevel] = useState(3);

  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stateHydrated, setStateHydrated] = useState(false);
  const coinsRef = useRef(coins);
  const assessmentCompleted = Boolean(
    profile?.assessmentCompleted &&
    (!user || profile.uid === user.uid)
  );

  const { level, xpInCurrentLevel, xpForNextLevel } = calculateLevel(xp);

  const gardenRank =
    level >= 12 ? 'Earth Guardian' : level >= 5 ? 'Forest Explorer' : 'Seedling';
  const impactScore = Math.round(xp * 0.1 + coins * 0.05 + streak * 5);

  const navigate = useCallback((page: PageId) => {
    setCurrentPage(page);
    setActiveLessonId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentPage('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeLesson = useCallback(() => {
    setActiveLessonId(null);
    setCurrentPage('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addXP = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1000) return;
    setXp((prev) => prev + Math.floor(amount));
  }, []);

  const addCoins = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1000) return;
    setCoins((prev) => {
      const next = prev + Math.floor(amount);
      coinsRef.current = next;
      return next;
    });
  }, []);

  const spendCoins = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0 || amount > coinsRef.current) return false;
    coinsRef.current -= Math.floor(amount);
    setCoins(coinsRef.current);
    return true;
  }, []);

  const grantReward = useCallback(async (activity: 'lesson' | 'quiz' | 'mission', rewardXp: number, rewardCoins: number) => {
    const savedProfile = await saveReward(activity, rewardXp, rewardCoins);
    setXp(Number(savedProfile.xp) || 0);
    setCoins(Number(savedProfile.eco_coins) || 0);
    coinsRef.current = Number(savedProfile.eco_coins) || 0;
    const today = new Date().toISOString().slice(0, 10);
    setStreak((current) => {
      if (lastActivityDate === today) return current;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return lastActivityDate === yesterday.toISOString().slice(0, 10) ? current + 1 : 1;
    });
    setLastActivityDate(today);
  }, [lastActivityDate]);

  const completeLesson = useCallback((lessonId: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, completed: true } : l))
    );
  }, []);

  const completeMission = useCallback((missionId: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? { ...m, completed: true, progress: 100 }
          : m
      )
    );
  }, []);

  const updateMissionProgress = useCallback((missionId: string, progress: number) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? { ...m, progress: Math.min(100, progress), completed: progress >= 100 }
          : m
      )
    );
  }, []);

  const completedLessons = lessons.filter((l) => l.completed).length;
  const completedMissions = missions.filter((m) => m.completed).length;

  // Update garden level based on completed actions. This runs the
  // XP-driven `level` value into gardenLevel so the two systems never
  // disagree — previously this was capped at 3 while gardenRank could
  // reach 12 ("Earth Guardian"), leaving high-XP users visually stuck.
  
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    setUser(firebaseUser);
    if (!firebaseUser) {
      setProfile(null);
      setAssessmentResult(null);
      setStateHydrated(false);
      setAuthLoading(false);
    }

    if (firebaseUser) {
      const persisted = loadPersistedState(firebaseUser.uid);
      setXp(0);
      setCoins(0);
      coinsRef.current = 0;
      setStreak(persisted?.streak ?? 0);
      setLastActivityDate(persisted?.lastActivityDate ?? null);
      setGardenLevel(persisted?.gardenLevel ?? 3);
      setLessons(persisted?.lessons ?? initialLessons);
      setMissions(persisted?.missions ?? initialMissions);
      setAssessmentResult(persisted?.assessmentResult ?? null);
      setProfile(persisted?.profile?.uid === firebaseUser.uid ? persisted.profile : null);
      setStateHydrated(true);
      let remoteProfile: UserProfile | null = null;
      let profileLoadSucceeded = false;
      try {
        remoteProfile = await loadProfile(firebaseUser.uid);
        profileLoadSucceeded = true;
        if (remoteProfile) {
          const loadedProfile = remoteProfile;
          setProfile(loadedProfile);
          setXp(Number(loadedProfile.xp) || 0);
          setCoins(Number(loadedProfile.ecoCoins) || 0);
          coinsRef.current = Number(loadedProfile.ecoCoins) || 0;
          setAssessmentResult((current) => current ?? {
            overallScore: loadedProfile.ecoScore,
            topicScores: loadedProfile.topicScores,
            strengths: loadedProfile.strengths,
            weakTopics: loadedProfile.knowledgeGaps,
            knowledgeLevel: loadedProfile.ecoLevel,
            recommendedTopics: loadedProfile.recommendedTopics,
            answers: {},
            completedAt: loadedProfile.assessmentCompletedAt,
          });
        }
      } catch (error) {
        console.error('Unable to load profile:', error instanceof Error ? error.message : 'unknown error');
      }

      setAuthLoading(false);
      setCurrentPage((currentPage) => {
      // Firebase restored a logged-in user after refresh
      if (firebaseUser && ['landing', 'login', 'signup'].includes(currentPage)) {
        const completedForUser =
          remoteProfile?.uid === firebaseUser.uid && remoteProfile.assessmentCompleted;
        return completedForUser || !profileLoadSucceeded ? 'dashboard' : 'assessment';
      }

      return currentPage;
      });
    } else {
      setCurrentPage((currentPage) => (
        currentPage !== 'landing' &&
        currentPage !== 'login' &&
        currentPage !== 'signup'
          ? 'landing'
          : currentPage
      ));
    }
  });

  return unsubscribe;
}, []);

  useEffect(() => {
    if (level !== gardenLevel) {
      setGardenLevel(level);
    }
  }, [level, gardenLevel]);

  // Persist state to localStorage
  useEffect(() => {
    const state: PersistedState = {
      xp,
      coins,
      gardenLevel,
      lessons,
      missions,
      assessmentCompleted,
      assessmentResult,
      profile,
      streak,
      lastActivityDate,
    };
    if (!user || !stateHydrated) return;
    try {
      localStorage.setItem(`${STORAGE_KEY}:${user.uid}`, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [user, stateHydrated, xp, coins, gardenLevel, lessons, missions, assessmentCompleted, assessmentResult, profile, streak, lastActivityDate]);

  const completeAssessment = useCallback(async (result: AssessmentResult) => {
    setAssessmentResult(result);
    if (user) {
      const nextProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ecoLevel: result.knowledgeLevel,
        ecoScore: result.overallScore,
        topicScores: result.topicScores,
        strengths: result.strengths,
        knowledgeGaps: result.weakTopics,
        recommendedTopics: result.recommendedTopics,
        assessmentCompleted: true,
        assessmentCompletedAt: result.completedAt,
      };
      const savedProfile = await saveAssessmentProfile(nextProfile, result);
      setProfile(savedProfile);
    }
  }, [user]);

  const hasCompletedAssessment = useCallback(
    (uid: string) => profile?.uid === uid && profile.assessmentCompleted,
    [profile]
  );

  const logout = useCallback(async () => {
  try {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setAssessmentResult(null);
    setStateHydrated(false);
    navigate('landing');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}, [navigate]);

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
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
