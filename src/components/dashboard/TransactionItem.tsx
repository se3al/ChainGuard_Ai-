import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskBadge } from "./RiskBadge";

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  type: "incoming" | "outgoing";
  risk: "low" | "medium" | "high";
  timestamp: string;
}

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncoming = transaction.type === "incoming";

  return (
    <div className="glass-card p-4 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "p-2 rounded-lg",
            isIncoming ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
          )}
        >
          {isIncoming ? (
            <ArrowDownLeft className="h-5 w-5" />
          ) : (
            <ArrowUpRight className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm text-foreground truncate">
              {transaction.hash.slice(0, 10)}...{transaction.hash.slice(-8)}
            </span>
            <RiskBadge level={transaction.risk} size="sm" />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono truncate">
              {isIncoming ? "From: " : "To: "}
              {isIncoming ? transaction.from : transaction.to}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p
            className={cn(
              "font-semibold",
              isIncoming ? "text-success" : "text-foreground"
            )}
          >
            {isIncoming ? "+" : "-"}{transaction.amount} ETH
          </p>
          <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
        </div>
      </div>
    </div>
  );
}
