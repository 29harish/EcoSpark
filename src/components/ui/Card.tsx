import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl shadow-soft border border-leaf-100/50 transition-all duration-300 ${
        hover ? 'hover:shadow-soft-lg hover:-translate-y-1 hover:border-leaf-200 cursor-pointer active:translate-y-0 active:scale-[0.99]' : 'hover:shadow-soft'
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface GradientCardProps {
  children: ReactNode;
  gradient: string;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function GradientCard({ children, gradient, className = '', onClick, hover = false }: GradientCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} rounded-3xl shadow-soft text-white transition-all duration-300 ${
        hover ? 'hover:shadow-soft-lg hover:-translate-y-1 cursor-pointer active:translate-y-0 active:scale-[0.99]' : 'hover:shadow-soft'
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function GlassCard({ children, className = '', onClick, hover = false }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-3xl shadow-soft transition-all duration-300 ${
        hover ? 'hover:shadow-soft-lg hover:-translate-y-1 cursor-pointer active:translate-y-0 active:scale-[0.99]' : 'hover:shadow-soft'
      } ${className}`}
    >
      {children}
    </div>
  );
}
