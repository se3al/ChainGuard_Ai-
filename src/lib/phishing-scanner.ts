/**
 * Phishing Scanner - Checks wallet addresses for potential threats
 * 
 * This module simulates scanning blockchain addresses to detect
 * known scam patterns, wallet drainers, and suspicious activity.
 */

// The possible threat levels an address can have
type ThreatLevel = "safe" | "low" | "medium" | "high";

// What the scan returns after checking an address
interface ScanResult {
  threatLevel: ThreatLevel;
  threats: string[];
}

// List of dangerous patterns to check against
// Each pattern has a regex to match and a message explaining the threat
const dangerousPatterns = [
  { 
    pattern: /^0xdead/i, 
    message: "Address matches known wallet drainer pattern" 
  },
  { 
    pattern: /^0x0000/i, 
    message: "Suspicious null-address prefix detected" 
  },
  { 
    pattern: /beef/i, 
    message: "Address associated with scam token distribution" 
  },
  { 
    pattern: /bad/i, 
    message: "Flagged in community blacklist database" 
  },
  { 
    pattern: /scam/i, 
    message: "Reported as scam address" 
  },
  { 
    pattern: /phish/i, 
    message: "Known phishing address" 
  },
  { 
    pattern: /hack/i, 
    message: "Associated with exploit activity" 
  },
];

/**
 * Checks if an address might be trying to impersonate another address
 * by using repeating characters (a common scam technique)
 */
function checkForAddressPoisoning(address: string): string | null {
  const suspiciousEndings = ["0000", "1111", "2222", "aaaa", "bbbb", "ffff"];
  const lowerAddress = address.toLowerCase();
  
  for (const ending of suspiciousEndings) {
    const hasRepeatingChars = lowerAddress.includes(ending.charAt(0).repeat(3));
    const endsWithPattern = lowerAddress.endsWith(ending);
    
    if (endsWithPattern && hasRepeatingChars) {
      return "Possible address poisoning - suspicious repeating characters";
    }
  }
  
  return null;
}

/**
 * Validates the address format
 */
function checkAddressFormat(address: string): string | null {
  // Ethereum addresses should be exactly 42 characters (0x + 40 hex chars)
  if (address.length > 42) {
    return "Invalid address format detected";
  }
  return null;
}

/**
 * Main function to scan an address for threats
 * Returns the threat level and list of detected issues
 */
export async function scanAddress(address: string): Promise<ScanResult> {
  // Simulate network delay (like calling a real API)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Collect all threats found
  const threats: string[] = [];

  // Check against each dangerous pattern
  for (const { pattern, message } of dangerousPatterns) {
    if (pattern.test(address)) {
      threats.push(message);
    }
  }

  // Check for address poisoning attempts
  const poisoningIssue = checkForAddressPoisoning(address);
  if (poisoningIssue) {
    threats.push(poisoningIssue);
  }

  // Validate address format
  const formatIssue = checkAddressFormat(address);
  if (formatIssue) {
    threats.push(formatIssue);
  }

  // Determine overall threat level based on what we found
  let threatLevel: ThreatLevel;
  
  if (threats.length === 0) {
    // No issues found
    threatLevel = "safe";
  } else if (threats.length === 1) {
    // One minor issue - check if it's a serious one
    const isSerious = threats[0].includes("drainer") || threats[0].includes("scam");
    threatLevel = isSerious ? "medium" : "low";
  } else if (threats.length === 2) {
    // Multiple issues
    threatLevel = "medium";
  } else {
    // Many issues - definitely dangerous
    threatLevel = "high";
  }

  return { threatLevel, threats };
}
