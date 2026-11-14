import { describe, expect, it } from 'vitest';
import { validateTransactionInput } from './validation';

const input = {
  poolId: `0x${'1'.repeat(40)}`,
  chainId: 11155111,
  userAddress: `0x${'2'.repeat(40)}`,
};

describe('validateTransactionInput', () => {
  it('limits the amount to the base token decimals', () => {
    expect(() => validateTransactionInput({ ...input, amount: '0.0000001', decimals: 6 }))
      .toThrow('Amount cannot have more than 6 decimal places');
    expect(validateTransactionInput({ ...input, amount: '0.000001', decimals: 6 }).amount).toBe('0.000001');
  });
});
