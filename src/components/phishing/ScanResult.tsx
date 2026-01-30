/**
 * ScanResult Component
 * 
 * Displays the results of a phishing scan with visual indicators
 * for different threat levels (safe, low, medium, high)
 */

import { Shield, XCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// The possible threat levels
export type ThreatLevel = "safe" | "low" | "medium" | "high";

// Props this component accepts
interface ScanResultProps {
  address: string;        // The address that was scanned
  threatLevel: ThreatLevel;  // How dangerous is it?
  threats: string[];      // List of specific threats found
  onClose: () => void;    // Function to call when user closes this
}

// Configuration for each threat level's appearance
const threatStyles = {
  safe: {
    icon: CheckCircle,
    label: "Safe",
    description: "No threats detected. This address appears to be legitimate.",
    colors: "text-success bg-success/10 border-success/30",
  },
  low: {
    icon: Shield,
    label: "Low Risk",
    description: "Minor concerns detected. Exercise normal caution.",
    colors: "text-success bg-success/10 border-success/30",
  },
  medium: {
    icon: AlertTriangle,
    label: "Medium Risk",
    description: "Suspicious patterns detected. Proceed with caution.",
    colors: "text-warning bg-warning/10 border-warning/30",
  },
  high: {
    icon: XCircle,
    label: "High Risk",
    description: "Known threat detected! Do not interact with this address.",
    colors: "text-destructive bg-destructive/10 border-destructive/30",
  },
};

export function ScanResult({ address, threatLevel, threats, onClose }: ScanResultProps) {
  // Get the right styles for this threat level
  const style = threatStyles[threatLevel];
  const Icon = style.icon;

  return (
    <div className={cn("glass-card p-6 border-2 animate-fade-in", style.colors)}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("p-3 rounded-xl", style.colors)}>
          <Icon className={cn("h-8 w-8", style.colors.split(" ")[0])} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with label and badge */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{style.label}</h3>
            <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", style.colors)}>
              {threatLevel.toUpperCase()}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-3">{style.description}</p>

          {/* The scanned address */}
          <p className="font-mono text-sm text-primary truncate mb-4">
            {address}
          </p>

          {/* List of threats (if any) */}
          {threats.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">Detected Issues:</p>
              <ul className="space-y-1">
                {threats.map((threat, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
                    {threat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Close button */}
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Result
          </Button>
        </div>
      </div>
    </div>
  );
}
