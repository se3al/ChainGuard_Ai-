import { useState } from "react";
import { Search, Wallet, Shield, AlertTriangle, Activity, Clock, ExternalLink, Loader2 } from "lucide-react";
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
}

const mockAnalysis: AnalysisResult = {
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f3e0Ab",
  riskLevel: "medium",
  riskScore: 62,
  factors: [
    { label: "Wallet Age", status: "safe", detail: "Created 2+ years ago" },
    { label: "Transaction Pattern", status: "warning", detail: "Unusual frequency detected" },
    { label: "Connected Contracts", status: "safe", detail: "All verified contracts" },
    { label: "Known Associations", status: "danger", detail: "1 flagged address interaction" },
    { label: "Fund Sources", status: "safe", detail: "Legitimate exchanges only" },
  ],
  transactionCount: 1247,
  firstSeen: "March 2022",
  balance: "24.85 ETH",
};

export default function WalletAnalyzer() {
  const [address, setAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!address) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setResult({ ...mockAnalysis, address });
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
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
          AI-powered wallet risk assessment and threat detection
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
      </div>

      {/* Analysis Result */}
      {result && (
        <div className="space-y-6 animate-fade-in">
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
                    className={cn(
                      "transition-all duration-1000",
                      getScoreColor(result.riskScore)
                    )}
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
                  <Button variant="ghost" size="sm" className="font-mono text-xs">
                    {result.address.slice(0, 10)}...{result.address.slice(-8)}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Activity className="h-4 w-4" />
                      Transactions
                    </div>
                    <p className="text-xl font-bold mt-1">{result.transactionCount.toLocaleString()}</p>
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
              AI Risk Analysis
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
                      "w-3 h-3 rounded-full",
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
                      "px-2 py-0.5 rounded text-xs font-medium",
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
      {!result && !isAnalyzing && (
        <div className="glass-card p-12 text-center">
          <div className="relative inline-block">
            <Wallet className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
          </div>
          <h3 className="text-xl font-semibold mt-6">Enter a Wallet Address</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Our AI model analyzes wallet behavior, transaction patterns, and network
            associations to assess risk levels.
          </p>
        </div>
      )}
    </div>
  );
}
