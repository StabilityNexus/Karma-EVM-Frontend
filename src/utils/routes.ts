// The static export builds only /pool (see app/[pool]/page.tsx), and the page reads ?id=.
// A path like /0x... has no exported page: 404 in production, 500 in next dev.
export const getPoolPath = (pool: string): string => `/pool?id=${pool}`;
