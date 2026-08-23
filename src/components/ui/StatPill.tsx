interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

export function StatPill({ icon, label, value, color = 'text-leaf-600' }: StatPillProps) {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-2xl px-4 py-2.5 shadow-soft border border-leaf-100/50">
      <span className="text-xl">{icon}</span>
      <div>
        <div className={`text-lg font-extrabold ${color}`}>{value}</div>
        <div className="text-xs text-leaf-600/60 font-medium">{label}</div>
      </div>
    </div>
  );
}
