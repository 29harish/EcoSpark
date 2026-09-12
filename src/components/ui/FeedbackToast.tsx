import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { Zap, Coins } from 'lucide-react';

interface ToastItem {
  id: number;
  type: 'xp' | 'coin' | 'info';
  amount?: number;
  message?: string;
}

interface FeedbackContextValue {
  showXP: (amount: number) => void;
  showCoin: (amount: number) => void;
  showInfo: (message: string) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

let toastId = 0;

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => dismiss(id), 2000);
  }, [dismiss]);

  const showXP = useCallback((amount: number) => push({ type: 'xp', amount }), [push]);
  const showCoin = useCallback((amount: number) => push({ type: 'coin', amount }), [push]);
  const showInfo = useCallback((message: string) => push({ type: 'info', message }), [push]);

  return (
    <FeedbackContext.Provider value={{ showXP, showCoin, showInfo }}>
      {children}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex flex-col items-center gap-2">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

function Toast({ toast }: { toast: ToastItem }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const baseClassName = `flex items-center gap-2 rounded-2xl px-5 py-3 shadow-soft-lg font-bold transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`;

  if (toast.type === 'xp') {
    return (
      <div
        className={`${baseClassName} bg-gradient-to-r from-leaf-500 to-lagoon-500 text-white animate-toast-rise`}
      >
        <Zap className="w-5 h-5" />
        <span className="text-lg">+{toast.amount} XP</span>
      </div>
    );
  }

  if (toast.type === 'coin') {
    return (
      <div
        className={`${baseClassName} bg-gradient-to-r from-sun-400 to-sun-500 text-white animate-toast-rise`}
      >
        <Coins className="w-5 h-5" />
        <span className="text-lg">+{toast.amount} Coins</span>
      </div>
    );
  }

  return (
    <div
      className={`${baseClassName} bg-leaf-700 text-white animate-toast-rise`}
    >
      {toast.message}
    </div>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
}

// Animated counter that bumps when the value changes
export function AnimatedCounter({ value, className = '' }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [bumping, setBumping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setBumping(true);
      const diff = value - displayValue;
      const steps = 20;
      const increment = diff / steps;
      let current = displayValue;
      const interval = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= value) || (increment < 0 && current <= value)) {
          setDisplayValue(value);
          clearInterval(interval);
          setTimeout(() => setBumping(false), 200);
        } else {
          setDisplayValue(Math.round(current));
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [value, displayValue]);

  return (
    <span className={`inline-block ${bumping ? 'animate-count-bump' : ''} ${className}`}>
      {displayValue.toLocaleString()}
    </span>
  );
}
