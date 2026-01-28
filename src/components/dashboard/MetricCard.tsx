import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: {
    icon: "text-primary bg-primary/10",
    glow: "glow-primary",
  },
  success: {
    icon: "text-success bg-success/10",
    glow: "glow-success",
  },
  warning: {
    icon: "text-warning bg-warning/10",
    glow: "glow-warning",
  },
  danger: {
    icon: "text-destructive bg-destructive/10",
    glow: "glow-danger",
  },
};

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  variant = "default",
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p
              className={cn(
                "text-sm font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
            styles.icon
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
