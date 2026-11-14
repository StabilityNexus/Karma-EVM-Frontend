import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Track your prediction positions, performance, and portfolio analytics across supported chains with real-time pricing, P&L, and historical trade insights.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Portfolio",
    description:
      "Track your prediction positions, performance, and portfolio analytics across supported chains with real-time pricing, P&L, and historical trade insights.",
    url: "/portfolio",
    type: "website",
    images: [
      {
        url: "https://karma.stability.nexus/og-image.png",
        width: 1200,
        height: 630,
        alt: "Karma Protocol - Decentralized Oracle & Prediction Markets",
      },
    ],
  },
  twitter: {
    title: "Portfolio",
    description:
      "Track your prediction positions, performance, and portfolio analytics across supported chains with real-time pricing, P&L, and historical trade insights.",
    images: ["https://karma.stability.nexus/og-image.png"],
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
