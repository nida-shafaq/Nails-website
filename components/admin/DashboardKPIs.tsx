"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Paintbrush, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { LowStockAlerts } from "@/components/admin/LowStockAlerts";

export function DashboardKPIs() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch is proxied by Next.js rewrites to the Cloudflare Worker.
        // Cookies are automatically sent by the browser.
        const res = await fetch("/api/v1/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading || !stats) {
    // Skeleton loader
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-chrome shadow-sm animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-mist" />
              <div className="w-16 h-6 rounded-full bg-mist" />
            </div>
            <div>
              <div className="w-24 h-4 bg-mist rounded mb-3" />
              <div className="w-32 h-8 bg-chrome rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const KPIs = [
    { 
      title: "Total Revenue", 
      value: stats.totalRevenue, 
      type: "currency", 
      change: "This month", 
      icon: TrendingUp,
      href: null 
    },
    { 
      title: "Pending Custom", 
      value: stats.pendingCustomOrders, 
      type: "number", 
      change: "Needs review", 
      icon: Paintbrush,
      href: "/admin/custom"
    },
    { 
      title: "Total Orders", 
      value: stats.totalOrders, 
      type: "number", 
      change: "All time", 
      icon: ShoppingBag,
      href: "/admin/orders" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {KPIs.map((kpi) => {
        const CardContent = (
          <>
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="p-2 rounded-xl bg-mist text-obsidian transition-colors">
                <kpi.icon size={20} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-mist text-obsidian">
                {kpi.change}
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-sm text-ink mb-1 group-hover:text-obsidian transition-colors">{kpi.title}</p>
              <h3 className="text-2xl font-display text-obsidian">
                {kpi.type === 'currency' ? formatPrice(kpi.value * 100) : kpi.value}
              </h3>
            </div>
          </>
        );

        const cardClasses = "bg-white rounded-2xl p-6 border border-chrome shadow-sm group relative overflow-hidden transition-all " + 
          (kpi.href ? "cursor-pointer hover:shadow-md hover:border-obsidian" : "");

        if (kpi.href) {
          return (
            <Link key={kpi.title} href={kpi.href} className={cardClasses}>
              {/* Subtle sheen on hover */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-50 group-hover:animate-shimmer transition-opacity" />
              {CardContent}
            </Link>
          );
        }

        return (
          <div key={kpi.title} className={cardClasses}>
            {CardContent}
          </div>
        );
      })}
      
      {/* Low Stock Client Component */}
      <LowStockAlerts count={stats.lowStockAlerts} products={stats.lowStockProducts} />
    </div>
  );
}
