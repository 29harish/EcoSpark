interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  gradient?: string;
  height?: string;
  showGlow?: boolean;
  animated?: boolean;
  shimmer?: boolean;
}

export function ProgressBar({
  value,
  className = '',
  gradient = 'from-leaf-400 to-lagoon-400',
  height = 'h-3',
  showGlow = false,
  animated = true,
  shimmer = true,
}: ProgressBarProps) {
  return (
    <div className={`w-full ${height} bg-leaf-100/70 rounded-full overflow-hidden ${className}`}>
      <div
        className={`relative h-full bg-gradient-to-r ${gradient} rounded-full overflow-hidden ${
          animated ? 'transition-all duration-700 ease-out' : ''
        } ${
          showGlow ? 'shadow-[0_0_10px_rgba(87,184,124,0.5)]' : ''
        }`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      >
        {shimmer && value > 0 && (
          <div className="absolute inset-0 shimmer rounded-full" />
        )}
      </div>
    </div>
  );
}
