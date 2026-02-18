/**
 * Phishing Scanner - Checks wallet addresses for real on-chain threats via Etherscan
 */

type ThreatLevel = "safe" | "low" | "medium" | "high";

interface ScanResult {
  threatLevel: ThreatLevel;
  threats: string[];
}

function validateAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export async function scanAddress(address: string): Promise<ScanResult> {
  if (!validateAddress(address)) {
    return {
      threatLevel: "low",
      threats: ["Invalid Ethereum address format — must be 0x followed by 40 hex characters"],
    };
  }

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/etherscan-proxy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": anonKey,
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ address, action: "phishing" }),
      }
    );

    if (!response.ok) {
      throw new Error(`Edge function error: ${response.status}`);
    }

    const data = await response.json();

    return {
      threatLevel: data.threatLevel as ThreatLevel,
      threats: data.threats ?? [],
    };
  } catch (error) {
    console.error("Phishing scan failed:", error);
    throw error;
  }
}
