import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Source checks for the pool page. Every read and write must use the pool's chain.
// Without it wagmi uses the wallet's chain or mainnet with no wallet.
const source = readFileSync(fileURLToPath(new URL('../app/[pool]/InteractionClient.tsx', import.meta.url)), 'utf8');
// Skip commented out code. Line numbers stay the same.
const lines = source.split('\n')
  .map((line, i) => ({ line: /^\s*\/\//.test(line) ? '' : line, at: `InteractionClient.tsx:${i + 1}` }));

// The names that hold the pool's chain on this page.
const POOL_CHAIN = /chainId: (readChainId|poolChainId|poolData\.chainId)\b/;

// The full text of each call up to its closing brace.
const callBodies = (opener: string): { body: string; at: string }[] =>
  lines.flatMap(({ line, at }, i) => {
    if (!line.includes(opener)) return [];
    let depth = 0;
    const body: string[] = [];
    for (const { line: next } of lines.slice(i)) {
      body.push(next);
      depth += (next.match(/[{(]/g) ?? []).length - (next.match(/[})]/g) ?? []).length;
      if (depth <= 0) break;
    }
    return [{ body: body.join('\n'), at }];
  });

const missingPoolChain = (calls: { body: string; at: string }[]) =>
  calls.filter(({ body }) => !POOL_CHAIN.test(body)).map(({ at }) => at);

describe('pool page chain', () => {
  it('reads every contract on the pool chain', () => {
    const reads = lines.filter(({ line }) => /\{ address: .*functionName: '/.test(line));
    expect(reads.length).toBeGreaterThan(0);
    expect(missingPoolChain(reads.map(({ line, at }) => ({ body: line, at })))).toEqual([]);
  });

  it('writes, waits and builds clients on the pool chain', () => {
    const calls = [
      ...callBodies('writeContractAsync({'),
      ...callBodies('writeOracleUpdate({'),
      ...callBodies('useWaitForTransactionReceipt('),
      ...callBodies('usePublicClient('),
    ];
    expect(calls.length).toBeGreaterThan(0);
    expect(missingPoolChain(calls)).toEqual([]);
  });

  // viem does not throw on a revert or a cancel. So the page must use the checked helper.
  it('confirms the oracle update only on a successful receipt', () => {
    expect(source).toContain('await waitForSuccessfulReceipt(poolClient, oracleHash)');
    expect(source).not.toMatch(/poolClient\.waitForTransactionReceipt\(/);
  });

  it('never takes the pool chain from the wallet', () => {
    const fromWallet = /chain\?\.id\s*\|\||walletClient\??\.chain\b|updateOracle\(walletClient/;
    expect(lines.filter(({ line }) => fromWallet.test(line)).map(({ at }) => at)).toEqual([]);
  });
});
