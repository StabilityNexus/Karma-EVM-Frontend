import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/layout/Layout";
import Navbar from "@/components/layout/Navbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";


const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Karma Protocol",
    template: "%s | Karma Protocol",
  },
  description:
    "Karma Protocol — a permissionless on-chain oracle for prediction pools. Submit price observations weighted by your bull/bear neutrality. Decentralized consensus pricing powered by community wisdom.",
  keywords: [
    "DeFi",
    "prediction markets", 
    "Karma Protocol",
    "Karma Oracle",
    "blockchain oracle",
    "price submission",
    "decentralized oracle",
    "decentralized finance",
    "cryptocurrency trading",
    "perpetual pools",
    "community oracle",
    "Ethereum",
    "Polygon",
    "BSC",
    "Base"
  ],
  authors: [{ name: "Karma Protocol Team" }],
  creator: "Karma Protocol",
  publisher: "Karma Protocol",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://karma.stability.nexus"),
  openGraph: {
    title: "Karma Protocol | Decentralized Oracle for Prediction Markets",
    description: "Submit price observations to Karma — the permissionless on-chain oracle for prediction pools. Your influence is weighted by your bull/bear neutrality.",
    url: "https://karma.stability.nexus",
    siteName: "Karma Protocol",
    images: [
      {
        url: "https://karma.stability.nexus/og-image.png",
        width: 1200,
        height: 630,
        alt: "Karma Protocol - Decentralized Oracle for Prediction Markets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karma Protocol | Decentralized Oracle for Prediction Markets",
    description: "Submit price observations to Karma — the permissionless on-chain oracle for prediction pools.",
    images: ["https://karma.stability.nexus/og-image.png"],
    creator: "@StabilityNexus",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var finalTheme = theme === 'system' ? systemTheme : theme;
                  
                  if (finalTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Karma Protocol",
              "description": "Permissionless on-chain oracle for prediction pools. Submit price observations weighted by bull/bear neutrality for decentralized consensus pricing.",
              "url": "https://karma.stability.nexus",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Stability Nexus",
                "url": "https://stability.nexus"
              },
              "featureList": [
                "Permissionless on-chain oracle",
                "Price observation submission",
                "Neutrality-weighted consensus",
                "Chainlink-compatible price feed",
                "Integration with prediction pools",
                "Time-decayed price averaging",
                "Community-driven price discovery"
              ],
              "screenshot": "https://karma.stability.nexus/og-image.png",
              "softwareVersion": "1.0.0",
              "datePublished": "2026-10-01",
              "dateModified": new Date().toISOString().split('T')[0]
            })
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d97706" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased`}>
        <ErrorBoundary>
          <ClientProviders>
          {/* Absolute positioned navbar to avoid affecting hero positioning */}
          <Navbar className="fixed top-0 left-0 right-0 z-50 bg-[#fcfaf6]/80 dark:bg-[#090c14]/80 backdrop-blur-md border-b border-stone-200/40 dark:border-amber-900/20" />
          
          <main>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          
          <FooterWrapper className="pb-4" />
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
