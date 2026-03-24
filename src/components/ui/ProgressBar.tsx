interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className = "",
  color = "bg-blue-600",
}: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`h-2 w-full rounded-full bg-zinc-800 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
