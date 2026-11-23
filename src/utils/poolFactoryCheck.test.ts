import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Source checks for the pool page. It must open only pools the Karma factory created.
// Any contract can answer the pool reads, so the page cannot trust the address in the link.
const source = readFileSync(fileURLToPath(new URL('../app/[pool]/InteractionClient.tsx', import.meta.url)), 'utf8');
// Skip commented out code.
const code = source.split('\n').map((line) => (/^\s*\/\//.test(line) ? '' : line)).join('\n');

// The text of a function from its name to the next top level function.
const functionBody = (name: string): string => {
  const start = code.indexOf(`function ${name}(`);
  expect(start).toBeGreaterThan(-1);
  const next = code.slice(start + 1).search(/\n(export default )?function /);
  return next === -1 ? code.slice(start) : code.slice(start, start + 1 + next);
};

// The full text of each call up to its closing brace.
const callBodies = (opener: string): string[] =>
  code.split(opener).slice(1).map((rest) => {
    let depth = 1;
    let i = 0;
    while (depth > 0 && i < rest.length) {
      if (rest[i] === '{' || rest[i] === '(') depth++;
      if (rest[i] === '}' || rest[i] === ')') depth--;
      i++;
    }
    return rest.slice(0, i);
  });

describe('pool page factory check', () => {
  it('reads the pool list from the Karma factory on the page chain', () => {
    const verified = functionBody('VerifiedPool');
    expect(verified).toContain("functionName: 'getAllPools'");
    expect(verified).toMatch(/address: factory,[\s\S]*chainId,/);
    expect(functionBody('InteractionClient')).toContain('KarmaPoolFactories[chainId]');
  });

  it('shows the pool only after the factory lists it', () => {
    expect(code.match(/<PoolPageContent\b/g)).toHaveLength(1);
    const verified = functionBody('VerifiedPool');
    const render = verified.indexOf('<PoolPageContent');
    for (const status of ['"checking"', '"error"', '"unregistered"']) {
      const refused = verified.indexOf(`status === ${status}) return`);
      expect(refused).toBeGreaterThan(-1);
      expect(refused).toBeLessThan(render);
    }
    expect(verified).toContain('checkPool(poolId, factoryPools');
  });

  it('reads the pool address from the link in one place only', () => {
    expect(code.match(/useSearchParams\(/g)).toHaveLength(1);
    expect(functionBody('InteractionClient')).toContain('useSearchParams()');
  });

  it('remounts and checks again when the chain changes', () => {
    expect(functionBody('InteractionClient')).toContain('key={`${chainId}:${poolIdParam}`}');
  });

  // A write without a chain goes to the wallet's chain, which may not be the checked one.
  it('sends every write on the checked chain', () => {
    const writes = callBodies('writeContractAsync(');
    expect(writes.length).toBeGreaterThan(0);
    expect(writes.filter((body) => !/chainId: (poolData\.chainId|poolChainId)\b/.test(body))).toEqual([]);
  });

  it('never takes the pool chain from the wallet', () => {
    expect(code).not.toMatch(/chain\?\.id\s*\|\|/);
    expect(functionBody('PoolPageContent')).toContain('usePool(poolId, poolChainId, isConnected)');
  });
});
