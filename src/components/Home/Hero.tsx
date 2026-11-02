"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAddress } from "viem";
import { 
  ArrowRight, 
  Search, 
  Send, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  X,
  CheckCircle2
} from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oracleAddress, setOracleAddress] = useState("");

  // Interactive Neutrality Simulator state
  const [balanceRatio, setBalanceRatio] = useState(50); // 0 = 100% Bull, 100 = 100% Bear, 50 = 50/50

  const isOracleAddressValid = isAddress(oracleAddress.trim());

  const closeModal = () => {
    setIsModalOpen(false);
    setOracleAddress("");
  };

  const handleContinue = () => {
    if (!isOracleAddressValid) return;
    router.push(`/submitPrice?id=${oracleAddress.trim()}`);
    closeModal();
  };

  // Compute simulated neutrality weight
  // 50 => bull 50, bear 50 => weight = min(50, 50) = 50 (or normalized to 100%)
  const bullHoldings = 100 - balanceRatio;
  const bearHoldings = balanceRatio;
  const simulatedWeight = Math.min(bullHoldings, bearHoldings) * 2; // scale 0-100%

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Premium Ambient Background Glows */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center"
      >
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl animate-ambient-glow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl animate-ambient-glow [animation-delay:4s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-amber-500/10 via-yellow-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-stone-900 dark:text-stone-50 leading-[1.08] mb-6">
          Karma <span className="text-gradient-gold">Protocol</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl md:text-3xl font-medium text-stone-700 dark:text-stone-300 max-w-3xl mb-4 leading-relaxed">
          The permissionless on-chain oracle where market participants discover truth.
        </p>

        <p className="text-sm sm:text-base md:text-lg text-stone-600 dark:text-stone-400 max-w-2xl mb-10 leading-normal">
          Zero external reliance. Submissions are weighted by the participant&apos;s economic neutrality between Bull and Bear outcomes — making manipulation provably unprofitable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 w-full max-w-md">
          <Link
            href="/explorePools"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-500 text-white font-bold text-base shadow-lg shadow-amber-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search className="w-4 h-4" />
            <span>Explore Pools</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href="/submitPrice"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-stone-900 text-stone-50 dark:bg-stone-800/80 dark:text-stone-100 dark:border dark:border-amber-500/30 hover:bg-stone-800 dark:hover:bg-stone-700/80 font-bold text-base shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send className="w-4 h-4 text-amber-500" />
            <span>Submit Price</span>
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-stone-300 dark:border-stone-700 hover:border-amber-500 dark:hover:border-amber-400 bg-white/70 dark:bg-[#121622]/70 text-stone-700 dark:text-stone-200 font-semibold text-sm backdrop-blur-md transition-all duration-200"
          >
            <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Query Oracle by Address</span>
          </button>
        </div>

        {/* Interactive Neutrality Simulator Card */}
        <div className="w-full max-w-2xl bg-white/80 dark:bg-[#121622]/90 border border-amber-500/20 dark:border-amber-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl karma-glow text-left transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800/60 mb-5">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                How Neutrality Weighting Works
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold text-stone-600 dark:text-stone-300">
              Formula: min(Bull, Bear)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            Drag the position slider to see how your balance between Bull &amp; Bear holdings determines your consensus power in the oracle:
          </p>

          {/* Slider */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                {bullHoldings}% Bull
              </span>
              <span className="text-stone-500 text-[11px] font-normal">
                {balanceRatio === 50 ? "✦ Optimal 50/50 Neutrality" : "Drag to test balance"}
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <TrendingDown className="w-3.5 h-3.5" />
                {bearHoldings}% Bear
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={balanceRatio}
              onChange={(e) => setBalanceRatio(Number(e.target.value))}
              aria-label="Bull vs Bear exposure balance slider"
              className="w-full h-3 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
            />
          </div>

          {/* Live Weight Gauge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-stone-50/80 dark:bg-[#0a0d14]/70 border border-stone-200/70 dark:border-stone-800/80 rounded-2xl p-4">
            <div>
              <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-1">
                Your Oracle Consensus Weight
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black ${
                  simulatedWeight > 75 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : simulatedWeight > 25 
                      ? "text-amber-600 dark:text-amber-400" 
                      : "text-rose-600 dark:text-rose-400"
                }`}>
                  {simulatedWeight.toFixed(0)}%
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  {simulatedWeight === 100 
                    ? "Maximum Influence" 
                    : simulatedWeight === 0 
                      ? "Zero Weight (One-sided)" 
                      : "Partial Influence"}
                </span>
              </div>
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>One-sided holders gain <strong>0 weight</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Balanced exposure gives <strong>100% weight</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mt-12 w-full max-w-4xl text-left">
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#121622]/60 border border-stone-200/60 dark:border-amber-900/20 backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">100% On-Chain</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">No off-chain signers or relays</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#121622]/60 border border-stone-200/60 dark:border-amber-900/20 backdrop-blur-md">
            <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">Sybil Immune</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Splitting wallets yields 0 gain</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#121622]/60 border border-stone-200/60 dark:border-amber-900/20 backdrop-blur-md">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">Exponential Decay</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Fresh consensus continually tracks</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#121622]/60 border border-stone-200/60 dark:border-amber-900/20 backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mb-2" />
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">Ownerless &amp; Fair</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Immutable parameters at deploy</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <OracleAddressModal
        open={isModalOpen}
        value={oracleAddress}
        isValid={isOracleAddressValid}
        onValueChange={setOracleAddress}
        onClose={closeModal}
        onSubmit={handleContinue}
      />
    </div>
  );
}

type OracleAddressModalProps = {
  open: boolean;
  value: string;
  isValid: boolean;
  onValueChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const OracleAddressModal = ({
  open,
  value,
  isValid,
  onValueChange,
  onClose,
  onSubmit,
}: OracleAddressModalProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="oracle-address-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#131722] p-6 sm:p-7 rounded-3xl shadow-2xl w-full max-w-md border border-amber-500/20 dark:border-amber-500/25 relative animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 id="oracle-address-modal-title" className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Query Karma Oracle
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              View live price observations and weight consensus
            </p>
          </div>
        </div>

        <div className="mt-4 mb-5">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Karma Oracle Contract Address
          </label>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValid) onSubmit();
            }}
            className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 rounded-xl dark:bg-[#0a0d14] dark:text-stone-100 font-mono text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-stone-400"
            placeholder="0x..."
            aria-label="Karma oracle address"
          />
          {value && !isValid && (
            <p className="text-xs text-rose-500 mt-1.5 font-medium">
              Please enter a valid EVM contract address (0x...)
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!isValid}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            View Oracle
          </button>
        </div>
      </div>
    </div>
  );
};
