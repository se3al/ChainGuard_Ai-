import { Shield, Wallet, AlertTriangle, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TransactionItem } from "@/components/dashboard/TransactionItem";
import { AlertCard } from "@/components/dashboard/AlertCard";

const metrics = [
  {
    title: "Wallets Analyzed",
    value: "12,847",
    change: "+12.5% from last week",
    trend: "up" as const,
    icon: Wallet,
    variant: "default" as const,
  },
  {
    title: "Threats Detected",
    value: "234",
    change: "-8.3% from last week",
    trend: "down" as const,
    icon: AlertTriangle,
    variant: "warning" as const,
  },
  {
    title: "Security Score",
    value: "94.2%",
    change: "+2.1% improvement",
    trend: "up" as const,
    icon: Shield,
    variant: "success" as const,
  },
  {
    title: "Active Monitors",
    value: "1,892",
    change: "Real-time tracking",
    trend: "neutral" as const,
    icon: Activity,
    variant: "default" as const,
  },
];

const recentTransactions = [
  {
    id: "1",
    hash: "0x7c3e...8f9d2a1b4c5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
    from: "0x1234...5678",
    to: "0x8765...4321",
    amount: "2.45",
    type: "incoming" as const,
    risk: "low" as const,
    timestamp: "2 min ago",
  },
  {
    id: "2",
    hash: "0x9d8e...7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d",
    from: "0xabcd...efgh",
    to: "0xijkl...mnop",
    amount: "0.89",
    type: "outgoing" as const,
    risk: "medium" as const,
    timestamp: "5 min ago",
  },
  {
    id: "3",
    hash: "0x2a3b...4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
    from: "0xqrst...uvwx",
    to: "0xyzab...cdef",
    amount: "15.72",
    type: "incoming" as const,
    risk: "high" as const,
    timestamp: "12 min ago",
  },
];

const recentAlerts = [
  {
    title: "Suspicious Wallet Pattern Detected",
    description: "Multiple rapid transactions from a newly created wallet with connections to known phishing addresses.",
    severity: "high" as const,
    timestamp: "3 minutes ago",
    address: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5678",
  },
  {
    title: "Unusual Transaction Volume",
    description: "Transaction volume 340% above normal for this time period.",
    severity: "medium" as const,
    timestamp: "15 minutes ago",
  },
  {
    title: "New Contract Interaction",
    description: "First-time interaction with unverified smart contract.",
    severity: "low" as const,
    timestamp: "1 hour ago",
    address: "0x1234567890abcdef1234567890abcdef12345678",
  },
];

export default function Overview() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Security <span className="gradient-text">Overview</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time blockchain security monitoring powered by AI
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.title}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <MetricCard {...metric} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Transactions
            </h2>
            <span className="text-sm text-muted-foreground">Last 24h</span>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        </div>

        {/* Security Alerts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Security Alerts
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
              3 Active
            </span>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <AlertCard key={index} {...alert} />
            ))}
          </div>
        </div>
      </div>

      {/* Network Stats */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Network Activity
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Gas Price", value: "32 Gwei", trend: "up" },
            { label: "Block Height", value: "18,945,231", trend: "up" },
            { label: "Pending Txns", value: "147,892", trend: "down" },
            { label: "Network Hash", value: "1.12 EH/s", trend: "up" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-lg bg-secondary/30">
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-xl font-bold mt-1 flex items-center justify-center gap-1">
                {stat.value}
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
