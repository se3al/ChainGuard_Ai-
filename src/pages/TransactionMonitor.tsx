import { useState, useEffect } from "react";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Pause, 
  Play,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionItem } from "@/components/dashboard/TransactionItem";
import { cn } from "@/lib/utils";

const generateTransaction = (id: number) => {
  const types = ["incoming", "outgoing"] as const;
  const risks = ["low", "medium", "high"] as const;
  const addresses = [
    "0x742d35Cc6634C0532925a3b844Bc9e7595f3e0Ab",
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  ];

  return {
    id: id.toString(),
    hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 18)}`,
    from: addresses[Math.floor(Math.random() * addresses.length)],
    to: addresses[Math.floor(Math.random() * addresses.length)],
    amount: (Math.random() * 10).toFixed(4),
    type: types[Math.floor(Math.random() * types.length)],
    risk: risks[Math.floor(Math.random() * risks.length)],
    timestamp: "Just now",
  };
};

const initialTransactions = Array.from({ length: 8 }, (_, i) => ({
  ...generateTransaction(i),
  timestamp: `${i * 2 + 1} min ago`,
}));

export default function TransactionMonitor() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [stats, setStats] = useState({
    total: 1247,
    anomalies: 23,
    safe: 1198,
  });

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setTransactions((prev) => {
        const newTx = generateTransaction(Date.now());
        const updated = [newTx, ...prev.slice(0, 9)].map((tx, i) => ({
          ...tx,
          timestamp: i === 0 ? "Just now" : `${i * 2} min ago`,
        }));
        return updated;
      });

      setStats((prev) => ({
        total: prev.total + 1,
        anomalies: Math.random() > 0.9 ? prev.anomalies + 1 : prev.anomalies,
        safe: prev.safe + 1,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredTransactions = transactions.filter(
    (tx) => filter === "all" || tx.risk === filter
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Transaction <span className="gradient-text">Monitor</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time blockchain transaction monitoring with anomaly detection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? "default" : "outline"}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Resume
              </>
            )}
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                isLive ? "bg-success animate-pulse" : "bg-muted"
              )}
            />
            {isLive && (
              <div className="absolute inset-0 rounded-full bg-success animate-pulse-ring" />
            )}
          </div>
          <span className="font-medium">
            {isLive ? "Monitoring Active" : "Monitoring Paused"}
          </span>
          <span className="text-muted-foreground text-sm">
            • Block #18,945,234
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>{stats.safe.toLocaleString()} Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span>{stats.anomalies} Anomalies</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Transactions",
            value: stats.total.toLocaleString(),
            icon: Activity,
            color: "text-primary",
          },
          {
            label: "Anomalies Detected",
            value: stats.anomalies.toString(),
            icon: AlertTriangle,
            color: "text-warning",
          },
          {
            label: "Safe Transactions",
            value: stats.safe.toLocaleString(),
            icon: CheckCircle,
            color: "text-success",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <stat.icon className={cn("h-5 w-5 mb-2", stat.color)} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        {(["all", "low", "medium", "high"] as const).map((level) => (
          <Button
            key={level}
            variant={filter === level ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(level)}
            className={cn(
              filter === level && level === "low" && "bg-success hover:bg-success/90",
              filter === level && level === "medium" && "bg-warning hover:bg-warning/90",
              filter === level && level === "high" && "bg-destructive hover:bg-destructive/90"
            )}
          >
            {level === "all" ? "All" : `${level.charAt(0).toUpperCase() + level.slice(1)} Risk`}
          </Button>
        ))}
        <Button variant="ghost" size="sm" className="ml-auto">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.map((tx, index) => (
          <div
            key={tx.id}
            className={cn(
              "animate-fade-in",
              index === 0 && isLive && "ring-2 ring-primary/30"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <TransactionItem transaction={tx} />
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold mt-4">No Transactions</h3>
          <p className="text-muted-foreground mt-2">
            No transactions match your current filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
