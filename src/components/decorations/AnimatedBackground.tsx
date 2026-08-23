interface AnimatedBackgroundProps {
  variant?: 'default' | 'warm' | 'cool' | 'garden';
}

export function AnimatedBackground({ variant = 'default' }: AnimatedBackgroundProps) {
  const gradients = {
    default: 'from-cream-50 via-leaf-50/30 to-lagoon-50/40',
    warm: 'from-cream-50 via-sun-50/30 to-coral-50/30',
    cool: 'from-sky2-50/40 via-lagoon-50/30 to-leaf-50/30',
    garden: 'from-leaf-50/40 via-lagoon-50/30 to-sky2-50/40',
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]}`} />
      {/* Soft blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-leaf-200/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-lagoon-200/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-sun-200/15 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute -bottom-20 right-1/3 w-64 h-64 bg-lavender-200/15 rounded-full blur-3xl animate-float" />
    </div>
  );
}
