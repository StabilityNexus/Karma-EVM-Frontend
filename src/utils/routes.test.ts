import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getPoolPath, isWrongNetwork, resolvePoolChainId } from './routes';

describe('getPoolPath', () => {
  // The static export only builds /pool, and the pool page reads the address from ?id=.
  it('links to the exported /pool route with the address in ?id=', () => {
    const pool = `0x${'a'.repeat(40)}` as `0x${string}`;
    expect(getPoolPath(pool)).toBe(`/pool?id=${pool}`);
  });

  // The address must reach the pool page exactly as viem returned it.
  it('keeps a checksummed address unchanged', () => {
    const pool = '0x0395FbC8D55E94b5D44aE9304a844311EA331554';
    expect(getPoolPath(pool)).toBe(`/pool?id=${pool}`);
  });

  it('matches the only page app/[pool] exports', () => {
    const page = readFileSync(fileURLToPath(new URL('../app/[pool]/page.tsx', import.meta.url)), 'utf8');
    // Formatting-tolerant: quotes, spacing and trailing commas may change, the route name may not.
    expect(page).toMatch(/return\s*\[\s*\{\s*pool\s*:\s*["'`]pool["'`]\s*,?\s*\}\s*,?\s*\]/);
    expect(getPoolPath('0x0').startsWith('/pool?')).toBe(true);
  });
});

describe('pool chain', () => {
  const pool = '0x0395FbC8D55E94b5D44aE9304a844311EA331554';

  // Links carry the pool's chain so the page does not use the wallet's.
  it('puts the chain in the link when it is known', () => {
    expect(getPoolPath(pool, 11155111)).toBe(`/pool?id=${pool}&chainId=11155111`);
  });

  it('reads a supported chain from the link', () => {
    expect(resolvePoolChainId('11155111', [11155111])).toBe(11155111);
  });

  // Old links and the address search have no chainId. With one supported chain that is fine.
  it('falls back to the only supported chain when the link has none', () => {
    expect(resolvePoolChainId(null, [11155111])).toBe(11155111);
    expect(resolvePoolChainId('', [11155111])).toBe(11155111);
  });

  it('does not guess when several chains are supported and the link has none', () => {
    expect(resolvePoolChainId(null, [1, 11155111])).toBeNull();
  });

  it('rejects chains that are not supported or not plain numbers', () => {
    for (const bad of ['1', '137', 'abc', '011155111', ' 11155111', '11155111.0', '1e3']) {
      expect(resolvePoolChainId(bad, [11155111])).toBeNull();
    }
  });

  it('flags a connected wallet on another chain only', () => {
    expect(isWrongNetwork(undefined, 11155111)).toBe(false);
    expect(isWrongNetwork(11155111, 11155111)).toBe(false);
    expect(isWrongNetwork(1, 11155111)).toBe(true);
    // A wallet on a network the app does not know is still on the wrong network.
    expect(isWrongNetwork(137, 11155111)).toBe(true);
  });
});
