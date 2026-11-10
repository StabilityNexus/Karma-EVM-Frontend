import { SUPPORTED_CHAINS } from "./supportedChainFeed";

// The static export builds only /pool (see app/[pool]/page.tsx), and the page reads ?id=.
// A path like /0x... has no exported page: 404 in production, 500 in next dev.
// Add ?chainId= when the caller knows the pool's chain. Then the page reads that chain and not the wallet's.
export const getPoolPath = (pool: string, chainId?: number): string =>
  chainId === undefined ? `/pool?id=${pool}` : `/pool?id=${pool}&chainId=${chainId}`;

// The chain a pool link points at. With no chain in the link it uses the only supported chain.
// A bad or unsupported chain gives null and the page shows an error.
export const resolvePoolChainId = (
  param: string | null,
  supported: readonly number[] = SUPPORTED_CHAINS,
): number | null => {
  if (!param) return supported.length === 1 ? supported[0] : null;
  const chainId = Number(param);
  return String(chainId) === param && supported.includes(chainId) ? chainId : null;
};

export const isWrongNetwork = (walletChainId: number | undefined, poolChainId: number): boolean =>
  walletChainId !== undefined && walletChainId !== poolChainId;
