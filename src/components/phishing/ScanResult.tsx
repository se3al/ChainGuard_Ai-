import { Shield, XCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ThreatLevel = "safe" | "low" | "medium" | "high";

interface ScanResultProps {
  address: string;
  threatLevel: ThreatLevel;
  threats: string[];
  onClose: () => void;
}

const threatConfig = {
  safe: {
    icon: CheckCircle,
    label: "Safe",
    description: "No threats detected. This address appears to be legitimate.",
    className: "text-success bg-success/10 border-success/30",
    iconClass: "text-success",
  },
  low: {
    icon: Shield,
    label: "Low Risk",
    description: "Minor concerns detected. Exercise normal caution.",
    className: "text-success bg-success/10 border-success/30",
    iconClass: "text-success",
  },
  medium: {
    icon: AlertTriangle,
    label: "Medium Risk",
    description: "Suspicious patterns detected. Proceed with caution.",
    className: "text-warning bg-warning/10 border-warning/30",
    iconClass: "text-warning",
  },
  high: {
    icon: XCircle,
    label: "High Risk",
    description: "Known threat detected! Do not interact with this address.",
    className: "text-destructive bg-destructive/10 border-destructive/30",
    iconClass: "text-destructive",
  },
};

export function ScanResult({ address, threatLevel, threats, onClose }: ScanResultProps) {
  const config = threatConfig[threatLevel];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "glass-card p-6 border-2 animate-fade-in",
        config.className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-xl", config.className)}>
          <Icon className={cn("h-8 w-8", config.iconClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{config.label}</h3>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border",
                config.className
              )}
            >
              {threatLevel.toUpperCase()}
            </span>
          </div>
          <p className="text-muted-foreground mb-3">{config.description}</p>
          <p className="font-mono text-sm text-primary truncate mb-4">
            {address}
          </p>

          {threats.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">Detected Issues:</p>
              <ul className="space-y-1">
                {threats.map((threat, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
                    {threat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={onClose}>
            Close Result
          </Button>
        </div>
      </div>
    </div>
  );
}
