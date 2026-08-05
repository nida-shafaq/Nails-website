"use client";

import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", revenue: 400 },
  { name: "Tue", revenue: 300 },
  { name: "Wed", revenue: 550 },
  { name: "Thu", revenue: 450 },
  { name: "Fri", revenue: 700 },
  { name: "Sat", revenue: 850 },
  { name: "Sun", revenue: 650 },
];

export function OverviewChart() {
  return (
    <div className="h-75 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-lacquer)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-lacquer)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "var(--color-ink)" }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "var(--color-ink)" }} 
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "1px solid var(--color-chrome)", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            itemStyle={{ color: "var(--color-obsidian)", fontWeight: 500 }}
            formatter={(value: any) => [`$${value}`, "Revenue"]}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="var(--color-lacquer)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
