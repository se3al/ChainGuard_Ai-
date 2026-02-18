import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ETHERSCAN_BASE = "https://api.etherscan.io/api";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const ETHERSCAN_API_KEY = Deno.env.get('ETHERSCAN_API_KEY');
  if (!ETHERSCAN_API_KEY) {
    return new Response(JSON.stringify({ error: 'ETHERSCAN_API_KEY is not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { address, action } = await req.json();

    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      return new Response(JSON.stringify({ error: 'Invalid Ethereum address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'wallet') {
      // Fetch balance + transaction list in parallel
      const [balanceRes, txRes, internalTxRes] = await Promise.all([
        fetch(`${ETHERSCAN_BASE}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`),
        fetch(`${ETHERSCAN_BASE}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${ETHERSCAN_API_KEY}`),
        fetch(`${ETHERSCAN_BASE}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc&apikey=${ETHERSCAN_API_KEY}`),
      ]);

      const [balanceData, txData, recentTxData] = await Promise.all([
        balanceRes.json(),
        txRes.json(),
        internalTxRes.json(),
      ]);

      // Balance in ETH
      const balanceWei = balanceData.result && balanceData.status === '1' ? BigInt(balanceData.result) : BigInt(0);
      const balanceEth = Number(balanceWei) / 1e18;

      // First transaction timestamp
      let firstSeen = "Unknown";
      let transactionCount = 0;
      if (txData.status === '1' && Array.isArray(txData.result) && txData.result.length > 0) {
        const firstTxTime = parseInt(txData.result[0].timeStamp) * 1000;
        firstSeen = new Date(firstTxTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }

      // Get total tx count via a separate call
      const txCountRes = await fetch(`${ETHERSCAN_BASE}?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`);
      const txCountData = await txCountRes.json();
      if (txCountData.result) {
        transactionCount = parseInt(txCountData.result, 16);
      }

      // Recent transactions for risk analysis
      const recentTxs = recentTxData.status === '1' && Array.isArray(recentTxData.result)
        ? recentTxData.result
        : [];

      return new Response(JSON.stringify({
        balance: balanceEth.toFixed(4) + ' ETH',
        firstSeen,
        transactionCount,
        recentTxs,
        isNewWallet: transactionCount === 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'phishing') {
      // Fetch recent tx list and check for suspicious patterns
      const [txRes, tokenRes] = await Promise.all([
        fetch(`${ETHERSCAN_BASE}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`),
        fetch(`${ETHERSCAN_BASE}?module=account&action=tokentx&address=${address}&page=1&offset=50&sort=desc&apikey=${ETHERSCAN_API_KEY}`),
      ]);

      const [txData, tokenData] = await Promise.all([
        txRes.json(),
        tokenRes.json(),
      ]);

      const txs = txData.status === '1' && Array.isArray(txData.result) ? txData.result : [];
      const tokenTxs = tokenData.status === '1' && Array.isArray(tokenData.result) ? tokenData.result : [];

      const threats: string[] = [];

      // Check: New wallet with no tx history (can't assess)
      if (txs.length === 0 && tokenTxs.length === 0) {
        return new Response(JSON.stringify({
          threats: [],
          threatLevel: 'safe',
          txCount: 0,
          note: 'No transaction history found for this address.',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check: High failure rate (possible honeypot interaction)
      const failedTxs = txs.filter((tx: Record<string, string>) => tx.isError === '1');
      if (txs.length > 5 && failedTxs.length / txs.length > 0.3) {
        threats.push('High transaction failure rate — possible honeypot contract interaction');
      }

      // Check: Rapid micro-transactions (spam / dust attack)
      const recentTxs = txs.slice(0, 20);
      if (recentTxs.length >= 10) {
        const timestamps = recentTxs.map((tx: Record<string, string>) => parseInt(tx.timeStamp));
        const timeSpan = timestamps[0] - timestamps[timestamps.length - 1];
        if (timeSpan < 3600 && recentTxs.length >= 10) {
          threats.push('Rapid micro-transaction pattern detected — possible dust attack or bot activity');
        }
      }

      // Check: Sending to zero address (burn address — sometimes used by scams)
      const zeroAddrTxs = txs.filter((tx: Record<string, string>) => tx.to === '0x0000000000000000000000000000000000000000');
      if (zeroAddrTxs.length > 2) {
        threats.push('Multiple transactions to zero/burn address detected');
      }

      // Check: Unsolicited token airdrops (received many different tokens)
      const uniqueTokens = new Set(tokenTxs.filter((tx: Record<string, string>) => tx.to?.toLowerCase() === address.toLowerCase()).map((tx: Record<string, string>) => tx.contractAddress));
      if (uniqueTokens.size > 10) {
        threats.push(`Received ${uniqueTokens.size} different token airdrops — possible airdrop phishing`);
      }

      // Check: Address poisoning — address has very similar first/last chars to another in tx history
      const allAddresses = [...new Set(txs.map((tx: Record<string, string>) => tx.to).filter(Boolean))];
      const prefix = address.slice(0, 6).toLowerCase();
      const suffix = address.slice(-4).toLowerCase();
      const lookalikes = allAddresses.filter((addr) => {
        const a = (addr as string).toLowerCase();
        return a !== address.toLowerCase() && a.startsWith(prefix) && a.endsWith(suffix);
      });
      if (lookalikes.length > 0) {
        threats.push('Address poisoning risk — similar-looking addresses detected in transaction history');
      }

      // Check: Very new wallet with high-value transactions
      const highValueTxs = txs.filter((tx: Record<string, string>) => {
        const eth = Number(BigInt(tx.value || '0')) / 1e18;
        return eth > 1;
      });
      if (txs.length < 10 && highValueTxs.length > 0) {
        threats.push('New wallet with large transactions — exercise caution');
      }

      // Determine threat level
      let threatLevel: string;
      if (threats.length === 0) threatLevel = 'safe';
      else if (threats.length === 1) threatLevel = 'low';
      else if (threats.length <= 3) threatLevel = 'medium';
      else threatLevel = 'high';

      return new Response(JSON.stringify({
        threats,
        threatLevel,
        txCount: txs.length,
        tokenTxCount: tokenTxs.length,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Etherscan proxy error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
