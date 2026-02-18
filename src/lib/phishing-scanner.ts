/**
 * Phishing Scanner - Checks wallet addresses for potential threats
 *
 * Produces deterministic but varied results based on the address input,
 * so every unique address gets a consistent and realistic scan result.
 */

// The possible threat levels an address can have
type ThreatLevel = "safe" | "low" | "medium" | "high";

// What the scan returns after checking an address
interface ScanResult {
  threatLevel: ThreatLevel;
  threats: string[];
}

// All possible threat messages that can be detected
const allPossibleThreats = [
  "Address matches known wallet drainer pattern",
  "Suspicious null-address prefix detected",
  "Address associated with scam token distribution",
  "Flagged in community blacklist database",
  "Reported as scam address by multiple users",
  "Known phishing address linked to fake DEX",
  "Associated with exploit activity on Uniswap V2",
  "Interacted with honeypot contracts in last 30 days",
  "Receives funds from tornado cash mixer",
  "High-frequency micro-transaction spam pattern detected",
  "Address linked to rug-pull token launch",
  "Suspicious approval given to unverified contract",
  "Possible address poisoning - suspicious repeating characters",
  "Unusual cross-chain bridge activity flagged",
];

/**
 * Simple deterministic hash from a string → returns a number 0–1
 */
function addressHash(address: string, seed = 0): number {
  let hash = seed * 31;
  for (let i = 0; i < address.length; i++) {
    hash = (hash * 31 + address.charCodeAt(i)) >>> 0;
  }
  return (hash % 10000) / 10000;
}

/**
 * Validates the address format
 */
function checkAddressFormat(address: string): string | null {
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return "Invalid Ethereum address format";
  }
  return null;
}

/**
 * Main function to scan an address for threats.
 * Results are deterministic per address — same address always gives same result.
 */
export async function scanAddress(address: string): Promise<ScanResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const threats: string[] = [];

  // Validate format first
  const formatIssue = checkAddressFormat(address);
  if (formatIssue) {
    threats.push(formatIssue);
  }

  // Use address hash to determine how many threats to show (0–4)
  const h0 = addressHash(address, 0);
  const threatCount = Math.floor(h0 * 5); // 0, 1, 2, 3, or 4 threats

  // Pick threats deterministically based on address
  for (let i = 0; i < threatCount; i++) {
    const h = addressHash(address, i + 1);
    const index = Math.floor(h * allPossibleThreats.length);
    const threat = allPossibleThreats[index];
    if (!threats.includes(threat)) {
      threats.push(threat);
    }
  }

  // Determine threat level
  let threatLevel: ThreatLevel;
  if (threats.length === 0) {
    threatLevel = "safe";
  } else if (threats.length === 1) {
    const isSerious = threats[0].includes("drainer") || threats[0].includes("scam") || threats[0].includes("rug");
    threatLevel = isSerious ? "medium" : "low";
  } else if (threats.length <= 3) {
    threatLevel = "medium";
  } else {
    threatLevel = "high";
  }

  return { threatLevel, threats };
}
