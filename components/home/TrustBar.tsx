import React from "react";
import { Star, Truck, Leaf, Clock } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Star,
    value: "4.9 / 5",
    label: "From 2,400+ reviews",
    accent: true,
  },
  {
    icon: Leaf,
    value: "Cruelty-Free",
    label: "Vegan formulas only",
    accent: false,
  },
  {
    icon: Clock,
    value: "Handmade",
    label: "Small batch production",
    accent: false,
  },
  {
    icon: Truck,
    value: "Ships in 2–3 days",
    label: "Free over $60",
    accent: false,
  },
];

export function TrustBar() {
  return (
    <section
      className="border-y py-5"
      style={{ borderColor: "var(--color-chrome)" }}
      aria-label="Trust signals"
    >
      <ul className="container-site flex flex-wrap items-center justify-between gap-6 sm:gap-4">
        {TRUST_ITEMS.map(({ icon: Icon, value, label, accent }) => (
          <li key={value} className="flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: accent ? "var(--color-lacquer-tint)" : "var(--color-mist)",
              }}
              aria-hidden="true"
            >
              <Icon
                size={15}
                style={{ color: accent ? "var(--color-lacquer)" : "var(--color-ink)" }}
                strokeWidth={1.5}
              />
            </span>
            <div>
              <p
                className="text-sm font-semibold leading-none mb-0.5"
                style={{ color: "var(--color-obsidian)" }}
              >
                {value}
              </p>
              <p
                className="text-xs leading-none"
                style={{ color: "var(--color-ink)" }}
              >
                {label}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
