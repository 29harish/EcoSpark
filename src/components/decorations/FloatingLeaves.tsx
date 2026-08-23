import { useMemo } from 'react';

interface FloatingLeavesProps {
  count?: number;
  className?: string;
}

export function FloatingLeaves({ count = 8, className = '' }: FloatingLeavesProps) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 16 + Math.random() * 24,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 6,
        emoji: ['🍃', '🌿', '🍂', '🌱'][Math.floor(Math.random() * 4)],
      })),
    [count]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute animate-float-slow opacity-30"
          style={{
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            fontSize: `${leaf.size}px`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
          }}
        >
          {leaf.emoji}
        </div>
      ))}
    </div>
  );
}
