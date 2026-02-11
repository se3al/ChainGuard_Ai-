import { useState } from "react";
import { 
  AlertTriangle, 
  Search, 
  Shield, 
  XCircle, 
  CheckCircle,
  ExternalLink,
  Clock,
  Users,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { ScanResult, ThreatLevel } from "@/components/phishing/ScanResult";
import { scanAddress } from "@/lib/phishing-scanner";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
const knownPhishingPatterns = [
  {
    pattern: "Rapid small transactions",
    description: "Multiple small transactions in quick succession to test wallet security",
    riskLevel: "high" as const,
    detections: 847,
  },
  {
    pattern: "Fake token airdrops",
    description: "Unsolicited tokens sent to bait users into interacting with malicious contracts",
    riskLevel: "high" as const,
    detections: 2341,
  },
  {
    pattern: "Wallet drainer contracts",
    description: "Smart contracts designed to drain wallet contents upon interaction",
    riskLevel: "high" as const,
    detections: 156,
  },
  {
    pattern: "Impersonation addresses",
    description: "Addresses designed to look similar to legitimate ones (address poisoning)",
    riskLevel: "medium" as const,
    detections: 3892,
  },
];

const recentDetections = [
  {
    title: "Wallet Drainer Detected",
    description: "Malicious contract attempting to drain ETH and ERC-20 tokens via approval exploit.",
    severity: "high" as const,
    timestamp: "12 minutes ago",
    address: "0xDEAD...BEEF",
  },
  {
    title: "Fake Uniswap Token",
    description: "Airdropped token mimicking UNI with hidden transfer fees and honeypot code.",
    severity: "high" as const,
    timestamp: "34 minutes ago",
    address: "0x1234...5678",
  },
  {
    title: "Address Poisoning Attempt",
    description: "Transaction from address designed to look like user's frequent contact.",
    severity: "medium" as const,
    timestamp: "2 hours ago",
    address: "0xABCD...WXYZ",
  },
];

const stats = [
  { label: "Threats Blocked Today", value: "1,247", icon: Shield, color: "text-success" },
  { label: "Active Threat Patterns", value: "89", icon: AlertTriangle, color: "text-warning" },
  { label: "Protected Wallets", value: "45.2K", icon: Users, color: "text-primary" },
  { label: "Detection Rate", value: "99.7%", icon: TrendingUp, color: "text-success" },
];

export default function PhishingDetection() {
  const { user } = useAuth();
  const [searchAddress, setSearchAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    address: string;
    threatLevel: ThreatLevel;
    threats: string[];
  } | null>(null);

  const handleScan = async () => {
    if (!searchAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter an address or contract to scan.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await scanAddress(searchAddress);
      setScanResult({
        address: searchAddress,
        ...result,
      });

      // Save to scan history
      if (user) {
        await supabase.from("scan_history").insert({
          user_id: user.id,
          address_scanned: searchAddress,
          threat_level: result.threatLevel,
          threats_found: result.threats,
        });
      }
      
      toast({
        title: "Scan Complete",
        description: `Threat level: ${result.threatLevel.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to complete the threat scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleClearResult = () => {
    setScanResult(null);
    setSearchAddress("");
  };
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Phishing <span className="gradient-text">Detection</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time detection of phishing attempts and suspicious wallet patterns
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="glass-card p-4 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <stat.icon className={cn("h-5 w-5 mb-2", stat.color)} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Check Address
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Enter address or contract to check..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            className="flex-1"
            disabled={isScanning}
          />
          <Button onClick={handleScan} disabled={isScanning}>
            {isScanning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            {isScanning ? "Scanning..." : "Scan for Threats"}
          </Button>
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <ScanResult
          address={scanResult.address}
          threatLevel={scanResult.threatLevel}
          threats={scanResult.threats}
          onClose={handleClearResult}
        />
      )}
      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Known Patterns */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Known Attack Patterns
          </h3>
          <div className="space-y-4">
            {knownPhishingPatterns.map((pattern, index) => (
              <div
                key={pattern.pattern}
                className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{pattern.pattern}</h4>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          pattern.riskLevel === "high"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/10 text-warning"
                        )}
                      >
                        {pattern.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {pattern.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold">{pattern.detections.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">detections</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Detections */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Detections
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium animate-pulse">
              Live
            </span>
          </div>
          <div className="space-y-3">
            {recentDetections.map((detection, index) => (
              <AlertCard key={index} {...detection} />
            ))}
          </div>
        </div>
      </div>

      {/* Protection Status */}
      <div className="glass-card p-6 gradient-border">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-4 rounded-xl bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div className="absolute inset-0 bg-success/20 blur-xl rounded-full" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Protection Active</h3>
            <p className="text-muted-foreground">
              AI-powered phishing detection is actively monitoring the blockchain for threats
            </p>
          </div>
          <Button variant="outline">
            View Full Report
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
