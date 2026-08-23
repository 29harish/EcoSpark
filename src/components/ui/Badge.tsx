import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'green' | 'teal' | 'gold' | 'coral' | 'lavender' | 'sky' | 'gray';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  className?: string;
}

const variants = {
  green: 'bg-leaf-100 text-leaf-700',
  teal: 'bg-lagoon-100 text-lagoon-700',
  gold: 'bg-sun-100 text-sun-700',
  coral: 'bg-coral-100 text-coral-700',
  lavender: 'bg-lavender-100 text-lavender-700',
  sky: 'bg-sky2-100 text-sky2-700',
  gray: 'bg-gray-100 text-gray-600',
};

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export function Badge({ children, variant = 'green', size = 'sm', icon, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon}
      {children}
    </span>
  );
}
