import { type ReactNode } from 'react';
import { Coins, Flame } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, icon, children }: PageHeaderProps) {
  const { level, xp, coins, streak } = useApp();

  return (
    <div className="mb-8 animate-slide-up">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-leaf-800 flex items-center gap-3">
            {icon && (
              <span className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-leaf-50 text-leaf-600 flex items-center justify-center flex-shrink-0">
                {icon}
              </span>
            )}
            {title}
          </h1>
          {subtitle && <p className="text-leaf-600/70 mt-2 text-base md:text-lg max-w-2xl">{subtitle}</p>}
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-soft border border-leaf-100/50">
            <span className="text-sm font-bold text-leaf-700">Lv {level}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-soft border border-leaf-100/50">
            <span className="text-sm font-bold text-leaf-600">{xp.toLocaleString()} XP</span>
          </div>
          <div className="flex items-center gap-1.5 bg-sun-50 px-4 py-2 rounded-2xl shadow-soft border border-sun-100/50">
            <Coins className="w-3.5 h-3.5 text-sun-600" />
            <span className="text-sm font-bold text-sun-700">{coins}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-coral-50 px-4 py-2 rounded-2xl shadow-soft border border-coral-100/50">
            <Flame className="w-3.5 h-3.5 text-coral-600" />
            <span className="text-sm font-bold text-coral-700">{streak}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
