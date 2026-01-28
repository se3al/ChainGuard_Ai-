import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, XCircle } from "lucide-react";

type RiskLevel = "low" | "medium" | "high";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const riskConfig = {
  low: {
    label: "Low Risk",
    className: "bg-success/10 text-success border-success/30 glow-success",
    icon: Shield,
  },
  medium: {
    label: "Medium Risk",
    className: "bg-warning/10 text-warning border-warning/30 glow-warning",
    icon: AlertTriangle,
  },
  high: {
    label: "High Risk",
    className: "bg-destructive/10 text-destructive border-destructive/30 glow-danger",
    icon: XCircle,
  },
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export function RiskBadge({ level, size = "md", showIcon = true }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.className,
        sizeStyles[size]
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </span>
  );
}
