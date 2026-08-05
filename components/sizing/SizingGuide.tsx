"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSavedSize, NailSize } from "@/hooks/useSavedSize";
import { FadeUp } from "@/components/shared/MotionWrapper";

const COINS = [
  { label: "Dime", size: "17.91mm", image: "🪙" },
  { label: "Quarter", size: "24.26mm", image: "🪙" },
];

const SIZE_CHART = [
  { size: "XS", thumb: "14", index: "10", middle: "11", ring: "10", pinky: "7" },
  { size: "S", thumb: "15", index: "11", middle: "12", ring: "11", pinky: "8" },
  { size: "M", thumb: "16", index: "12", middle: "13", ring: "12", pinky: "9" },
  { size: "L", thumb: "17", index: "13", middle: "14", ring: "13", pinky: "10" },
  { size: "XL", thumb: "18", index: "14", middle: "15", ring: "14", pinky: "11" },
];

export function SizingGuide() {
  const { savedSizes, primarySize, savePrimarySize } = useSavedSize();
  const [selectedSize, setSelectedSize] = useState<NailSize | null>(primarySize);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveSize = (size: NailSize) => {
    setSelectedSize(size);
    savePrimarySize(size);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="container-site py-16 md:py-24 max-w-5xl">
      <FadeUp className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest font-mono text-[--color-ink] mb-4">
          The Perfect Fit
        </p>
        <h1 className="text-4xl md:text-5xl font-display text-[--color-obsidian] mb-6">
          Find Your Size
        </h1>
        <p className="max-w-2xl mx-auto text-[--color-ink] leading-relaxed">
          The right size means nails that look natural and last longer. Measure your natural nails at their widest point to find your perfect fit.
        </p>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left: Instructions */}
        <FadeUp delay={0.1} className="space-y-12">
          <div>
            <h2 className="text-2xl font-display text-[--color-obsidian] mb-6">How to Measure</h2>
            <ol className="space-y-6">
              {[
                "Place a piece of clear tape across the widest part of your natural nail.",
                "Use a pen to mark the edges of your nail on the tape.",
                "Remove the tape and measure the distance between the lines in millimeters (mm) with a ruler.",
                "Write down the measurements for all 10 fingers."
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[--color-mist] flex items-center justify-center font-mono text-sm text-[--color-obsidian]">
                    {i + 1}
                  </span>
                  <p className="text-[--color-ink] leading-relaxed pt-1">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-[--color-lacquer-tint] p-6 rounded-2xl">
            <h3 className="font-medium text-[--color-lacquer] mb-2">No ruler? No problem.</h3>
            <p className="text-sm text-[--color-lacquer-dark] leading-relaxed mb-4">
              We offer sizing kits for $5 (ships free). You can try on every size before you buy a full set to guarantee a flawless fit.
            </p>
            <button className="text-xs font-mono uppercase tracking-widest text-[--color-lacquer] hover:text-[--color-lacquer-dark] underline underline-offset-4">
              Order Sizing Kit
            </button>
          </div>
        </FadeUp>

        {/* Right: Chart & Selector */}
        <FadeUp delay={0.2} className="space-y-10">
          <div>
            <h2 className="text-2xl font-display text-[--color-obsidian] mb-6">Standard Sizes (mm)</h2>
            <div className="overflow-x-auto rounded-xl border border-[--color-chrome]">
              <table className="w-full text-sm text-left">
                <thead className="bg-[--color-mist] text-[--color-obsidian] font-mono text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 border-b border-[--color-chrome]">Size</th>
                    <th className="px-4 py-3 border-b border-[--color-chrome]">Thumb</th>
                    <th className="px-4 py-3 border-b border-[--color-chrome]">Index</th>
                    <th className="px-4 py-3 border-b border-[--color-chrome]">Middle</th>
                    <th className="px-4 py-3 border-b border-[--color-chrome]">Ring</th>
                    <th className="px-4 py-3 border-b border-[--color-chrome]">Pinky</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-chrome] font-mono text-[--color-ink]">
                  {SIZE_CHART.map((row) => (
                    <tr key={row.size} className="hover:bg-white/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-[--color-obsidian]">{row.size}</td>
                      <td className="px-4 py-3">{row.thumb}</td>
                      <td className="px-4 py-3">{row.index}</td>
                      <td className="px-4 py-3">{row.middle}</td>
                      <td className="px-4 py-3">{row.ring}</td>
                      <td className="px-4 py-3">{row.pinky}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[--color-ink] mt-3 italic">
              Between sizes? We recommend sizing up and gently filing the edges down for a custom fit.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-(--shadow-card) border border-transparent hover:border-[--color-lacquer-tint] transition-colors">
            <h3 className="font-display text-xl text-[--color-obsidian] mb-2">Save Your Size</h3>
            <p className="text-sm text-[--color-ink] mb-6">
              Select your size to save it to your profile. It will auto-populate when you add items to your bag.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {(["XS", "S", "M", "L", "XL"] as NailSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => handleSaveSize(size)}
                  className={`w-14 h-14 flex items-center justify-center rounded-full font-mono text-sm transition-all ${
                    selectedSize === size
                      ? "bg-[--color-obsidian] text-white shadow-md scale-105"
                      : "bg-[--color-mist] text-[--color-obsidian] hover:bg-[--color-chrome]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {showSavedToast && (
              <p className="text-xs font-mono text-green-700 animate-in fade-in slide-in-from-bottom-2">
                ✓ Size {selectedSize} saved to your device.
              </p>
            )}
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
