import type { Metadata } from "next";
import AboutSection from "@/components/Home/About";
import Hero from "@/components/Home/Hero";

export const metadata: Metadata = {
  title: "Decentralized Oracle for Prediction Markets",
  description:
    "Karma Protocol — a permissionless on-chain oracle for prediction pools. Submit price observations weighted by your bull/bear neutrality for decentralized consensus pricing.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Decentralized Oracle for Prediction Markets",
    description:
      "Karma Protocol — a permissionless on-chain oracle for prediction pools. Submit price observations weighted by your bull/bear neutrality.",
    url: "/",
    type: "website",
    images: [
      {
        url: "https://karma.stability.nexus/og-image.png",
        width: 1200,
        height: 630,
        alt: "Karma Protocol - Decentralized Oracle for Prediction Markets",
      },
    ],
  },
  twitter: {
    title: "Decentralized Oracle for Prediction Markets",
    description:
      "Karma Protocol — a permissionless on-chain oracle for prediction pools. Submit price observations weighted by your bull/bear neutrality.",
    images: ["https://karma.stability.nexus/og-image.png"],
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
    </>
  );
}
