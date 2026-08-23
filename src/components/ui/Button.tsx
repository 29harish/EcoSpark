import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'coral';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-leaf-500 to-leaf-600 text-white shadow-soft hover:shadow-soft-lg hover:from-leaf-600 hover:to-leaf-700',
  secondary: 'bg-gradient-to-r from-lagoon-500 to-lagoon-600 text-white shadow-soft hover:shadow-soft-lg hover:from-lagoon-600 hover:to-lagoon-700',
  accent: 'bg-gradient-to-r from-sun-400 to-sun-500 text-white shadow-soft hover:shadow-soft-lg hover:from-sun-500 hover:to-sun-600',
  coral: 'bg-gradient-to-r from-coral-400 to-coral-500 text-white shadow-soft hover:shadow-soft-lg hover:from-coral-500 hover:to-coral-600',
  ghost: 'bg-transparent text-leaf-700 hover:bg-leaf-50',
  outline: 'bg-white/80 backdrop-blur border-2 border-leaf-200 text-leaf-700 hover:border-leaf-400 hover:bg-leaf-50',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
