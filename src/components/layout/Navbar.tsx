"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Activity, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { ModeToggle } from "../darkModeToggle";
import { SettingsButton } from "./SettingsButton";
import WalletButton from "../ui/walletButton";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { isAddress } from "viem";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const { resolvedTheme } = useTheme();
  
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOracleModalOpen, setIsOracleModalOpen] = useState(false);
  const [oracleAddress, setOracleAddress] = useState("");

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileMenuOpen]);

  const handleOracleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address = oracleAddress.trim();

    if (!address) {
      toast.error("Please enter an oracle address.");
      return;
    }

    if (!isAddress(address)) {
      toast.error("Invalid oracle address format.");
      return;
    }

    setIsOracleModalOpen(false);
    setOracleAddress("");
    router.push(`/submitPrice?id=${encodeURIComponent(address)}`);
  };

  const navItems = [
    { name: "Explore", href: "/explorePools" },
    { name: "Create", href: "/createPool" },
    { name: "Submit Price", href: "/submitPrice" },
    { name: "Portfolio", href: "/portfolio" },
  ];

  return (
    <>
      <header className={cn("justify-between z-50", className)}>
        <div className="mx-auto flex items-center justify-between relative dark:bg-[#0f1219] px-5 py-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="text-center">
                <Image
                  src="/logo.png"
                  alt="Karma Protocol bull and bear logo"
                  width={64}
                  height={64}
                  className="rounded-lg bg-[#fdfcee] p-1"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex min-[1200px]:hidden items-center gap-2">
            <WalletButton compact />
            <SettingsButton />
            <ModeToggle />
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 bg-[#faf8f5] text-stone-700 transition-colors hover:border-amber-500 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-stone-700 dark:bg-[#161924] dark:text-stone-300 dark:hover:border-amber-400 dark:hover:text-amber-400"
            >
              {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav
            className={cn(
              "hidden min-[1200px]:flex absolute left-1/2 transform -translate-x-1/2 space-x-8 text-sm md:text-base font-medium text-center px-8 py-2 rounded-xl",
              "bg-stone-100/90 dark:bg-[#161924]/90 text-stone-800 dark:text-stone-200 backdrop-blur-md border border-stone-200/70 dark:border-amber-900/25 shadow-sm",
            )}
          >
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative pb-1 transition-colors duration-200",
                    isActive
                      ? "text-amber-700 dark:text-amber-400 font-semibold"
                      : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200",
                  )}
                >
                  {item.name}

                  {/* Active underline indicator */}
                  {isActive && (
                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-amber-600 dark:bg-amber-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="hidden min-[1200px]:flex items-center space-x-4">
            <ModeToggle />
            <SettingsButton />
            <WalletButton />
          </div>

          {isMobileMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-x-0 bottom-0 top-20 z-40 bg-black/20 min-[1200px]:hidden"
              />
              <div
                id="mobile-navigation-menu"
                className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-stone-200 bg-[#fcfaf6] shadow-lg dark:border-amber-900/30 dark:bg-[#0f1219] min-[1200px]:hidden"
              >
                <nav aria-label="Mobile navigation" className="divide-y divide-stone-200/70 dark:divide-stone-800">
                  {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "block px-5 py-3.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-amber-500/10 text-amber-800 dark:text-amber-300"
                            : "text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800/60",
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsOracleModalOpen(true);
                  }}
                  className="flex w-full items-center gap-3 border-b border-stone-200/70 px-5 py-3.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:text-stone-200 dark:hover:bg-stone-800/60"
                >
                  <Activity size={18} />
                  Use Oracle by Address
                </button>
                <div className="border-t border-stone-200/70 p-4 dark:border-stone-800">
                  <WalletButton showNetworkStatus={false} />
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      <Dialog open={isOracleModalOpen} onOpenChange={setIsOracleModalOpen}>
        <DialogContent className="border-stone-700 bg-[#1c1917] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Use Oracle</DialogTitle>
            <DialogDescription className="text-stone-300">
              Enter a Karma Oracle contract address to view its details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOracleSubmit} className="space-y-4">
            <div>
              <label htmlFor="oracle-address" className="mb-2 block text-sm font-medium text-stone-300">
                Karma Oracle Address
              </label>
              <input
                id="oracle-address"
                type="text"
                value={oracleAddress}
                onChange={(event) => setOracleAddress(event.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-stone-600 bg-stone-800 px-4 py-3 text-stone-100 outline-none transition-colors placeholder:text-stone-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsOracleModalOpen(false)}
                className="flex-1 rounded-lg bg-stone-800 px-4 py-3 text-sm font-medium text-stone-300 transition-colors hover:bg-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-500"
              >
                Go to Oracle
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
