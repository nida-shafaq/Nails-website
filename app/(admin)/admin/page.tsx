import React from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Paintbrush, 
  ShoppingBag, 
  AlertCircle,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  Star
} from "lucide-react";
import { OverviewChart } from "@/components/admin/OverviewChart";
import { formatPrice } from "@/lib/utils";

// Mock Data for MVP
const KPIs = [
  { title: "Total Revenue", value: 1245000, type: "currency", change: "+12.5%", icon: TrendingUp },
  { title: "Pending Custom", value: 14, type: "number", change: "3 urgent", icon: Paintbrush },
  { title: "Total Orders", value: 342, type: "number", change: "+5.2%", icon: ShoppingBag },
  { title: "Low Stock", value: 3, type: "number", change: "Needs restock", icon: AlertCircle, alert: true },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "order", text: "New order #1042 placed by Sarah J.", time: "10 mins ago" },
  { id: 2, type: "custom", text: "Custom request submitted for 'Bridal Set'", time: "1 hour ago" },
  { id: 3, type: "review", text: "5-star review left on 'Cherry Noir'", time: "3 hours ago" },
  { id: 4, type: "order", text: "Order #1041 fulfilled", time: "5 hours ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-[--color-obsidian]">Welcome back, Nida.</h1>
          <p className="text-[--color-ink] mt-1">Here is what is happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/catalog?action=new" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[--color-chrome] text-[--color-obsidian] rounded-full text-sm font-medium hover:bg-[--color-mist] transition-colors">
            <Plus size={16} /> New Product
          </Link>
          <Link href="/admin/custom-orders" className="flex items-center gap-2 px-4 py-2.5 bg-[--color-obsidian] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-md">
            Review Custom <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPIs.map((kpi) => (
          <div key={kpi.title} className="bg-white rounded-2xl p-6 border border-[--color-chrome] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-xl ${kpi.alert ? 'bg-red-100 text-red-600' : 'bg-[--color-mist] text-[--color-obsidian]'}`}>
                <kpi.icon size={20} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${kpi.alert ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {kpi.change}
              </span>
            </div>
            <div>
              <p className="text-sm text-[--color-ink] mb-1">{kpi.title}</p>
              <h3 className="text-2xl font-display text-[--color-obsidian]">
                {kpi.type === 'currency' ? formatPrice(kpi.value) : kpi.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[--color-chrome] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-[--color-obsidian]">Revenue Overview</h3>
              <p className="text-sm text-[--color-ink]">Trailing 7 days</p>
            </div>
            <select className="text-sm border border-[--color-chrome] rounded-lg px-3 py-1.5 bg-white outline-none">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <OverviewChart />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-[--color-chrome] p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-[--color-obsidian]">Recent Activity</h3>
            <Link href="/admin/orders" className="text-sm text-[--color-lacquer] hover:underline">View all</Link>
          </div>
          <div className="flex-1 flex flex-col gap-6">
            {RECENT_ACTIVITY.map((activity, idx) => (
              <div key={activity.id} className="flex gap-4 relative">
                {idx !== RECENT_ACTIVITY.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-[--color-chrome]" />
                )}
                <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center relative z-10 ${
                  activity.type === 'order' ? 'bg-green-100 text-green-700' :
                  activity.type === 'custom' ? 'bg-purple-100 text-purple-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {activity.type === 'order' ? <CheckCircle2 size={16} /> :
                   activity.type === 'custom' ? <Paintbrush size={16} /> :
                   <Star size={16} />}
                </div>
                <div>
                  <p className="text-sm text-[--color-obsidian]">{activity.text}</p>
                  <p className="text-xs text-[--color-ink] mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
