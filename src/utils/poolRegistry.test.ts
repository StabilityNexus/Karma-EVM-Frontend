import { describe, expect, it } from "vitest";
import { checkPool } from "@/utils/poolRegistry";

// getAllPools() of the Sepolia factory in src/utils/addresses.ts on 2026-11-21.
const REAL_POOL = "0x0395FbC8D55E94b5D44aE9304a844311EA331554";
const FACTORY_POOLS = [
  "0xED1fc758e807DcD9FDAAF52Ef756E709074ff242",
  REAL_POOL,
  "0xB10066b2e45C308369c27AC84306c187d0c2bb67",
] as const;
// Sepolia WETH. A real contract but not a pool the factory created.
const NOT_A_POOL = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";

const settled = { isError: false, isFetching: false };

describe("checkPool", () => {
  it("refuses an address the factory did not create", () => {
    expect(checkPool(NOT_A_POOL, FACTORY_POOLS, settled)).toBe("unregistered");
  });

  it("opens a pool from the factory list", () => {
    expect(checkPool(REAL_POOL, FACTORY_POOLS, settled)).toBe("verified");
  });

  it("matches the address in any letter case", () => {
    expect(checkPool(REAL_POOL.toLowerCase() as `0x${string}`, FACTORY_POOLS, settled)).toBe("verified");
  });

  it("keeps a verified pool open while the list refreshes", () => {
    expect(checkPool(REAL_POOL, FACTORY_POOLS, { isError: false, isFetching: true })).toBe("verified");
  });

  it("keeps a verified pool open when a later refresh fails", () => {
    expect(checkPool(REAL_POOL, FACTORY_POOLS, { isError: true, isFetching: false })).toBe("verified");
  });

  it("waits while the list loads or refreshes", () => {
    expect(checkPool(NOT_A_POOL, undefined, { isError: false, isFetching: true })).toBe("checking");
    expect(checkPool(NOT_A_POOL, FACTORY_POOLS, { isError: false, isFetching: true })).toBe("checking");
  });

  it("waits when no list has arrived yet", () => {
    expect(checkPool(NOT_A_POOL, undefined, settled)).toBe("checking");
  });

  it("waits while a failed read is retried", () => {
    expect(checkPool(REAL_POOL, undefined, { isError: true, isFetching: true })).toBe("checking");
  });

  it("refuses when the factory cannot be read", () => {
    expect(checkPool(REAL_POOL, undefined, { isError: true, isFetching: false })).toBe("error");
    expect(checkPool(NOT_A_POOL, FACTORY_POOLS, { isError: true, isFetching: false })).toBe("error");
  });
});
