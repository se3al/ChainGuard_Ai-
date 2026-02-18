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

/**
 * Deterministic hash: address + seed → number 0–1
 */
function addrHash(address: string, seed = 0): number {
  let hash = seed * 31;
  for (let i = 0; i < address.length; i++) {
    hash = (hash * 31 + address.charCodeAt(i)) >>> 0;
  }
  return (hash % 10000) / 10000;
}

const walletAgeOptions = ["3 months ago", "8 months ago", "1+ year ago", "2+ years ago", "3+ years ago"];
const firstSeenOptions = ["November 2024", "April 2024", "September 2023", "March 2022", "July 2021", "January 2020"];
const contractOptions = ["All verified contracts", "Mostly verified (2 unverified)", "Several unverified contracts", "Multiple high-risk contracts"];
const associationOptions = ["No flagged address interactions", "1 flagged address interaction", "3 flagged address interactions", "Multiple known bad actors"];
const fundSourceOptions = ["Legitimate exchanges only", "Mix of CEX and DEX", "Includes privacy mixer activity", "Unverifiable fund origins"];
const txPatternOptions = ["Normal transaction frequency", "Unusual frequency detected", "Burst pattern - possible bot", "High-volume wash trading signals"];

function generateAnalysis(address: string): AnalysisResult {
  const h = (seed: number) => addrHash(address, seed);

  const walletAgeStatus = h(1) > 0.6 ? "safe" : h(1) > 0.3 ? "warning" : "danger";
  const txPatternStatus = h(2) > 0.55 ? "safe" : h(2) > 0.25 ? "warning" : "danger";
  const contractStatus = h(3) > 0.65 ? "safe" : h(3) > 0.35 ? "warning" : "danger";
  const associationStatus = h(4) > 0.7 ? "safe" : h(4) > 0.4 ? "warning" : "danger";
  const fundStatus = h(5) > 0.6 ? "safe" : h(5) > 0.3 ? "warning" : "danger";

  const factors = [
    {
      label: "Wallet Age",
      status: walletAgeStatus as "safe" | "warning" | "danger",
      detail: walletAgeOptions[Math.floor(h(6) * walletAgeOptions.length)],
    },
    {
      label: "Transaction Pattern",
      status: txPatternStatus as "safe" | "warning" | "danger",
      detail: txPatternOptions[Math.floor(h(7) * txPatternOptions.length)],
    },
    {
      label: "Connected Contracts",
      status: contractStatus as "safe" | "warning" | "danger",
      detail: contractOptions[Math.floor(h(8) * contractOptions.length)],
    },
    {
      label: "Known Associations",
      status: associationStatus as "safe" | "warning" | "danger",
      detail: associationOptions[Math.floor(h(9) * associationOptions.length)],
    },
    {
      label: "Fund Sources",
      status: fundStatus as "safe" | "warning" | "danger",
      detail: fundSourceOptions[Math.floor(h(10) * fundSourceOptions.length)],
    },
  ];

  const dangerCount = factors.filter(f => f.status === "danger").length;
  const warningCount = factors.filter(f => f.status === "warning").length;
  const riskScore = Math.round(20 + h(11) * 15 + warningCount * 12 + dangerCount * 18);
  const clampedScore = Math.min(Math.max(riskScore, 5), 98);

  const riskLevel: "low" | "medium" | "high" =
    clampedScore >= 70 ? "high" : clampedScore >= 40 ? "medium" : "low";

  const transactionCount = Math.floor(50 + h(12) * 9950);
  const firstSeen = firstSeenOptions[Math.floor(h(13) * firstSeenOptions.length)];
  const balance = (h(14) * 120).toFixed(2) + " ETH";

  return { address, riskLevel, riskScore: clampedScore, factors, transactionCount, firstSeen, balance };
}

export default function WalletAnalyzer() {
  const [address, setAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!address) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setResult(generateAnalysis(address));
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
