import { isAddressEqual, type Address } from "viem";

export type PoolCheck = "verified" | "checking" | "unregistered" | "error";

// Is this address a pool the Karma factory created? The page opens only verified pools.
// The factory only adds pools, so a pool found in any loaded list stays verified.
export const checkPool = (
  poolId: Address,
  factoryPools: readonly Address[] | undefined,
  { isError, isFetching }: { isError: boolean; isFetching: boolean },
): PoolCheck => {
  if (factoryPools?.some((pool) => isAddressEqual(pool, poolId))) return "verified";
  if (isFetching) return "checking";
  if (isError) return "error";
  return factoryPools === undefined ? "checking" : "unregistered";
};
