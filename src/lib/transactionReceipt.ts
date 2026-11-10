import type { Hash, ReplacementReason, TransactionReceipt } from "viem";

// Only the part of the viem client this needs. Tests pass a small fake.
type ReceiptClient = {
  waitForTransactionReceipt(args: {
    hash: Hash;
    onReplaced?: (replacement: { reason: ReplacementReason }) => void;
  }): Promise<TransactionReceipt>;
};

// viem does not throw when a transaction reverts. After a cancel in the wallet it returns the
// receipt of the other transaction. So only a real success counts here. A resend with more gas is fine.
export async function waitForSuccessfulReceipt(
  client: ReceiptClient,
  hash: Hash,
): Promise<TransactionReceipt> {
  let replacement: ReplacementReason | undefined;
  const receipt = await client.waitForTransactionReceipt({
    hash,
    onReplaced: ({ reason }) => {
      if (reason !== "repriced") replacement = reason;
    },
  });
  if (replacement) throw new Error(`Transaction was ${replacement}`);
  if (receipt.status !== "success") throw new Error("Transaction reverted");
  return receipt;
}
