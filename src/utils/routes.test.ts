import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getPoolPath } from './routes';

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
