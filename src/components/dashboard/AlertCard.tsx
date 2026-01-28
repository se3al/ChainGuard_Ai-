import { AlertTriangle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AlertCardProps {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
  address?: string;
}

const severityStyles = {
  low: "border-l-success bg-success/5",
  medium: "border-l-warning bg-warning/5",
  high: "border-l-destructive bg-destructive/5 animate-pulse",
};

export function AlertCard({
  title,
  description,
  severity,
  timestamp,
  address,
}: AlertCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-4 border-l-4 transition-all duration-300 hover:border-l-primary",
        severityStyles[severity]
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={cn(
            "h-5 w-5 mt-0.5 shrink-0",
            severity === "high" && "text-destructive",
            severity === "medium" && "text-warning",
            severity === "low" && "text-success"
          )}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {address && (
            <p className="font-mono text-xs text-primary mt-2 truncate">
              {address}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2">{timestamp}</p>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
