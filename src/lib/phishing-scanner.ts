import { ThreatLevel } from "@/components/phishing/ScanResult";

interface ScanResult {
  threatLevel: ThreatLevel;
  threats: string[];
}

// Known malicious patterns for simulation
const knownMaliciousPatterns = [
  { pattern: /^0xdead/i, threat: "Address matches known wallet drainer pattern" },
  { pattern: /^0x0000/i, threat: "Suspicious null-address prefix detected" },
  { pattern: /beef/i, threat: "Address associated with scam token distribution" },
  { pattern: /bad/i, threat: "Flagged in community blacklist database" },
  { pattern: /scam/i, threat: "Reported as scam address" },
  { pattern: /phish/i, threat: "Known phishing address" },
  { pattern: /hack/i, threat: "Associated with exploit activity" },
];

// Simulated address poisoning check
const checkAddressPoisoning = (address: string): string | null => {
  // Check for addresses that look like they're trying to impersonate others
  const suspiciousEndings = ["0000", "1111", "2222", "aaaa", "bbbb", "ffff"];
  const lowerAddress = address.toLowerCase();
  
  for (const ending of suspiciousEndings) {
    if (lowerAddress.endsWith(ending) && lowerAddress.includes(ending.charAt(0).repeat(3))) {
      return "Possible address poisoning attempt - address has suspicious repeating characters";
    }
  }
  return null;
};

// Simulated contract interaction check
const checkContractRisks = (address: string): string | null => {
  // Simulate checking for risky contract patterns
  if (address.length > 42) {
    return "Invalid address format detected";
  }
  return null;
};

export async function scanAddress(address: string): Promise<ScanResult> {
  // Simulate network delay for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const threats: string[] = [];

  // Check against known malicious patterns
  for (const { pattern, threat } of knownMaliciousPatterns) {
    if (pattern.test(address)) {
      threats.push(threat);
    }
  }

  // Check for address poisoning
  const poisoningThreat = checkAddressPoisoning(address);
  if (poisoningThreat) {
    threats.push(poisoningThreat);
  }

  // Check for contract risks
  const contractRisk = checkContractRisks(address);
  if (contractRisk) {
    threats.push(contractRisk);
  }

  // Determine threat level based on number and severity of threats
  let threatLevel: ThreatLevel;
  
  if (threats.length === 0) {
    threatLevel = "safe";
  } else if (threats.length === 1 && !threats[0].includes("drainer") && !threats[0].includes("scam")) {
    threatLevel = "low";
  } else if (threats.length <= 2) {
    threatLevel = "medium";
  } else {
    threatLevel = "high";
  }

  return { threatLevel, threats };
}
