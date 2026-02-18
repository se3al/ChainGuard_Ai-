import { useState } from "react";
import { Search, Wallet, Shield, AlertTriangle, Activity, Clock, ExternalLink, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  address: string;
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  factors: {
    label: string;
    status: "safe" | "warning" | "danger";
    detail: string;
  }[];
  transactionCount: number;
  firstSeen: string;
  balance: string;
  isRealData: boolean;
}

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function fetchWalletData(address: string): Promise<AnalysisResult> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/etherscan-proxy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ address, action: "wallet" }),
    }
  );

  if (!response.ok) throw new Error(`Edge function error: ${response.status}`);
  const data = await response.json();

  const { balance, firstSeen, transactionCount, recentTxs = [], isNewWallet } = data;

  // Derive risk factors from real data
  const factors: AnalysisResult["factors"] = [];

  // Factor 1: Wallet age
  const isOldWallet = firstSeen !== "Unknown" && !firstSeen.includes("2024") && !firstSeen.includes("2025");
  factors.push({
    label: "Wallet Age",
    status: isNewWallet ? "danger" : isOldWallet ? "safe" : "warning",
    detail: isNewWallet ? "No transaction history (brand new wallet)" : `First activity: ${firstSeen}`,
  });

  // Factor 2: Transaction volume
  factors.push({
    label: "Transaction Volume",
    status: transactionCount > 500 ? "safe" : transactionCount > 50 ? "warning" : "danger",
    detail:
      transactionCount === 0
        ? "No transactions found"
        : `${transactionCount.toLocaleString()} total transactions`,
  });

  // Factor 3: Failed transactions
  const failedTxs = recentTxs.filter((tx: Record<string, string>) => tx.isError === "1");
  const failRate = recentTxs.length > 0 ? failedTxs.length / recentTxs.length : 0;
  factors.push({
    label: "Transaction Success Rate",
    status: failRate > 0.3 ? "danger" : failRate > 0.1 ? "warning" : "safe",
    detail:
      recentTxs.length === 0
        ? "No recent transactions to evaluate"
        : failRate === 0
        ? "All recent transactions successful"
        : `${(failRate * 100).toFixed(0)}% failure rate in recent transactions`,
  });

  // Factor 4: Balance relative to activity
  const balanceNum = parseFloat(balance);
  factors.push({
    label: "Balance",
    status: balanceNum > 0.01 ? "safe" : "warning",
    detail: balance === "0.0000 ETH" ? "Empty wallet" : balance,
  });

  // Factor 5: Contract interactions (from recent txs)
  const contractInteractions = recentTxs.filter(
    (tx: Record<string, string>) => tx.input && tx.input !== "0x"
  ).length;
  factors.push({
    label: "Contract Interactions",
    status:
      contractInteractions > 10 ? "warning" : contractInteractions > 0 ? "safe" : "safe",
    detail:
      recentTxs.length === 0
        ? "No recent transactions"
        : `${contractInteractions} contract calls in recent transactions`,
  });

  // Calculate risk score from factors
  const dangerCount = factors.filter((f) => f.status === "danger").length;
  const warningCount = factors.filter((f) => f.status === "warning").length;
  let riskScore = 15 + dangerCount * 20 + warningCount * 10;
  if (isNewWallet) riskScore += 15;
  riskScore = Math.min(Math.max(riskScore, 5), 98);

  const riskLevel: "low" | "medium" | "high" =
    riskScore >= 70 ? "high" : riskScore >= 35 ? "medium" : "low";

  return {
    address,
    riskLevel,
    riskScore,
    factors,
    transactionCount,
    firstSeen: firstSeen || "Unknown",
    balance,
    isRealData: true,
  };
}

export default function WalletAnalyzer() {
  const [address, setAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!address) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const analysis = await fetchWalletData(address);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch on-chain data. Please check the address and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 35) return "text-success";
    if (score < 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Wallet <span className="gradient-text">Risk Analyzer</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time on-chain risk assessment powered by Etherscan
        </p>
      </div>

      {/* Search Section */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Enter wallet address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !address}
            className="min-w-[140px]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>

      {/* Analysis Result */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Real data badge */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            Live data fetched from Etherscan
          </div>

          {/* Risk Overview */}
          <div className="glass-card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Score Circle */}
              <div className="relative w-32 h-32 mx-auto lg:mx-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-secondary"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${result.riskScore * 2.83} 283`}
                    strokeLinecap="round"
                    className={cn("transition-all duration-1000", getScoreColor(result.riskScore))}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className={cn("text-3xl font-bold", getScoreColor(result.riskScore))}>
                      {result.riskScore}
                    </span>
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <RiskBadge level={result.riskLevel} size="lg" />
                  <Button variant="ghost" size="sm" className="font-mono text-xs" asChild>
                    <a
                      href={`https://etherscan.io/address/${result.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.address.slice(0, 10)}...{result.address.slice(-8)}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Activity className="h-4 w-4" />
                      Transactions
                    </div>
                    <p className="text-xl font-bold mt-1">
                      {result.transactionCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      First Seen
                    </div>
                    <p className="text-xl font-bold mt-1">{result.firstSeen}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Wallet className="h-4 w-4" />
                      Balance
                    </div>
                    <p className="text-xl font-bold mt-1">{result.balance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              On-Chain Risk Analysis
            </h3>
            <div className="space-y-3">
              {result.factors.map((factor, index) => (
                <div
                  key={factor.label}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full shrink-0",
                      factor.status === "safe" && "bg-success",
                      factor.status === "warning" && "bg-warning",
                      factor.status === "danger" && "bg-destructive"
                    )}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{factor.label}</p>
                    <p className="text-sm text-muted-foreground">{factor.detail}</p>
                  </div>
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium shrink-0",
                      factor.status === "safe" && "bg-success/10 text-success",
                      factor.status === "warning" && "bg-warning/10 text-warning",
                      factor.status === "danger" && "bg-destructive/10 text-destructive"
                    )}
                  >
                    {factor.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !isAnalyzing && !error && (
        <div className="glass-card p-12 text-center">
          <div className="relative inline-block">
            <Wallet className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
          </div>
          <h3 className="text-xl font-semibold mt-6">Enter a Wallet Address</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Analyzes real on-chain data — balance, transaction history, failure rates, and
            contract interactions via Etherscan.
          </p>
        </div>
      )}
    </div>
  );
}
