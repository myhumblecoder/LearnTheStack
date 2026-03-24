type BadgeVariant = "default" | "success" | "warning" | "info" | "muted";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-zinc-700 text-zinc-200",
  success: "bg-green-900/50 text-green-400 border border-green-800",
  warning: "bg-yellow-900/50 text-yellow-400 border border-yellow-800",
  info: "bg-blue-900/50 text-blue-400 border border-blue-800",
  muted: "bg-zinc-800 text-zinc-400",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
