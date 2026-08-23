import { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  HelpCircle,
  Target,
  Sprout,
  Trophy,
  Swords,
  Bot,
  Gift,
  User,
  Leaf,
  Menu,
  X,
  Flame,
  Coins,
} from 'lucide-react';
import { useApp, type PageId } from '@/context/AppContext';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'learn', label: 'Learn', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 'quizzes', label: 'Quizzes', icon: <HelpCircle className="w-5 h-5" /> },
  { id: 'missions', label: 'Missions', icon: <Target className="w-5 h-5" /> },
  { id: 'garden', label: 'Eco Garden', icon: <Sprout className="w-5 h-5" /> },
  { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
  { id: 'challenges', label: 'Challenges', icon: <Swords className="w-5 h-5" /> },
  { id: 'ai-guide', label: 'AI Eco Guide', icon: <Bot className="w-5 h-5" /> },
  { id: 'rewards', label: 'Rewards', icon: <Gift className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
];

export function Sidebar() {
  const { currentPage, navigate, level, xp, coins, streak } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page: PageId) => {
    navigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-leaf-100/50 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => handleNavigate('dashboard')}
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-leaf-400 to-lagoon-500 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold gradient-text">EcoSpark</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-sun-50 px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4 text-sun-500" />
            <span className="text-sm font-bold text-sun-700">{coins}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-coral-50 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-coral-500" />
            <span className="text-sm font-bold text-coral-700">{streak}</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 rounded-xl bg-leaf-50 flex items-center justify-center text-leaf-700"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-leaf-950/30 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full glass border-r border-leaf-100/50 flex flex-col">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center gap-3 px-6 py-6 hover:bg-leaf-50/50 transition-colors"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-leaf-400 to-lagoon-500 flex items-center justify-center shadow-glow">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold gradient-text">EcoSpark</div>
              <div className="text-xs text-leaf-600/60 font-medium">Learn · Act · Grow</div>
            </div>
          </button>

          {/* User mini-profile */}
          <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-leaf-500 to-lagoon-500 rounded-2xl text-white shadow-soft">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
                🐼
              </div>
              <div>
                <div className="font-bold text-sm">Hey, Student!</div>
                <div className="text-xs text-white/80">Level {level} · {xp.toLocaleString()} XP</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
                <Coins className="w-3.5 h-3.5" />
                <span className="font-bold">{coins}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
                <Flame className="w-3.5 h-3.5" />
                <span className="font-bold">{streak} day</span>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide">
            {navItems.map((item) => {
              const isActive = currentPage === item.id || (currentPage === 'lesson' && item.id === 'learn');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-leaf-500 to-lagoon-500 text-white shadow-soft'
                      : 'text-leaf-700 hover:bg-leaf-50'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-leaf-500'}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-sun-400 to-coral-400 rounded-2xl p-4 text-white text-center shadow-soft">
              <div className="text-2xl mb-1">🌍</div>
              <div className="text-sm font-bold">Keep growing!</div>
              <div className="text-xs text-white/80 mt-0.5">Complete missions to level up</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
