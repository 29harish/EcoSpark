import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
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
  | 'admin-verification'
  | 'login'
  | 'signup';

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
}

const LEVEL_XP_BASE = 250;
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
}

function loadPersistedState(): Partial<PersistedState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    return null;
  }
}

const persisted = loadPersistedState();

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const [xp, setXp] = useState(persisted?.xp ?? 2450);
  const [coins, setCoins] = useState(persisted?.coins ?? 340);
  const [streak] = useState(12);
  const [gardenLevel, setGardenLevel] = useState(persisted?.gardenLevel ?? 3);

  const [lessons, setLessons] = useState<Lesson[]>(persisted?.lessons ?? initialLessons);
  const [missions, setMissions] = useState<Mission[]>(persisted?.missions ?? initialMissions);

  const { level, xpInCurrentLevel, xpForNextLevel } = calculateLevel(xp);

  const gardenRank =
    level >= 12 ? 'Earth Guardian' : level >= 5 ? 'Forest Explorer' : 'Seedling';

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
    setXp((prev) => prev + amount);
  }, []);

  const addCoins = useCallback((amount: number) => {
    setCoins((prev) => prev + amount);
  }, []);

  const spendCoins = useCallback((amount: number) => {
    let success = false;
    setCoins((prev) => {
      if (prev >= amount) {
        success = true;
        return prev - amount;
      }
      return prev;
    });
    return success;
  }, []);

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
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser);
    setAuthLoading(false);

    setCurrentPage((currentPage) => {
      // Firebase restored a logged-in user after refresh
      if (firebaseUser && currentPage === 'landing') {
        return 'dashboard';
      }

      // User is logged out while trying to access the app
      if (
        !firebaseUser &&
        currentPage !== 'landing' &&
        currentPage !== 'login' &&
        currentPage !== 'signup'
      ) {
        return 'landing';
      }

      return currentPage;
    });
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
    const state: PersistedState = { xp, coins, gardenLevel, lessons, missions };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [xp, coins, gardenLevel, lessons, missions]);

  const logout = useCallback(async () => {
  try {
    await signOut(auth);
    setUser(null);
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
