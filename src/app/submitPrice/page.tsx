import type { Metadata } from "next";
import { Suspense } from "react";
import SubmitPriceClient from "./SubmitPriceClient";

export const metadata: Metadata = {
  title: "Submit Price",
  description:
    "Submit price observations to the Karma oracle. Your influence is weighted by the economic neutrality of your bull/bear holdings in the linked prediction pool.",
  alternates: {
    canonical: "/submitPrice",
  },
  openGraph: {
    title: "Submit Price | Karma Protocol",
    description:
      "Submit price observations to the Karma oracle weighted by your bull/bear neutrality.",
    url: "/submitPrice",
    type: "website",
    images: [
      {
        url: "https://karma.stability.nexus/og-image.png",
        width: 1200,
        height: 630,
        alt: "Karma Protocol - Submit Price",
      },
    ],
  },
  twitter: {
    title: "Submit Price | Karma Protocol",
    description:
      "Submit price observations to the Karma oracle weighted by your bull/bear neutrality.",
    images: ["https://karma.stability.nexus/og-image.png"],
  },
};

export default function SubmitPricePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              Loading...
            </div>
          }
        >
          <SubmitPriceClient />
        </Suspense>
      </main>
    </div>
  );
}
