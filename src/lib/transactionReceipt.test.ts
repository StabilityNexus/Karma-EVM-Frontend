import { describe, expect, it } from 'vitest';
import type { ReplacementReason, TransactionReceipt } from 'viem';
import { waitForSuccessfulReceipt } from './transactionReceipt';

const hash = `0x${'1'.repeat(64)}` as const;

// A fake viem client. It can report a replacement and then returns a receipt.
const client = (status: 'success' | 'reverted', replacement?: ReplacementReason) => ({
  waitForTransactionReceipt: async ({ onReplaced }: { onReplaced?: (r: { reason: ReplacementReason }) => void }) => {
    if (replacement) onReplaced?.({ reason: replacement });
    return { status } as TransactionReceipt;
  },
});

describe('waitForSuccessfulReceipt', () => {
  it('returns the receipt when the transaction succeeds', async () => {
    await expect(waitForSuccessfulReceipt(client('success'), hash)).resolves.toMatchObject({ status: 'success' });
  });

  // viem returns a reverted receipt instead of throwing.
  it('throws when the transaction reverts', async () => {
    await expect(waitForSuccessfulReceipt(client('reverted'), hash)).rejects.toThrow('reverted');
  });

  // A cancel mines a different transaction. Its receipt says nothing about ours.
  it('throws when the transaction is cancelled or replaced', async () => {
    await expect(waitForSuccessfulReceipt(client('success', 'cancelled'), hash)).rejects.toThrow('cancelled');
    await expect(waitForSuccessfulReceipt(client('success', 'replaced'), hash)).rejects.toThrow('replaced');
  });

  it('accepts the same transaction sent again with more gas', async () => {
    await expect(waitForSuccessfulReceipt(client('success', 'repriced'), hash)).resolves.toMatchObject({ status: 'success' });
  });
});
