import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  Box, 
  Paintbrush, 
  ShoppingBag, 
  Star, 
  LogOut,
  ChevronRight,
  ExternalLink
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Catalog", href: "/admin/catalog", icon: Box },
  { name: "Custom Orders", href: "/admin/custom", icon: Paintbrush },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  // Auth Guard
  if (token?.value !== "admin_secret_token_123") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[--color-mist]/30 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[--color-chrome] hidden md:flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2 border-b border-[--color-chrome]">
          <span className="w-3 h-3 bg-[--color-lacquer] rounded-full"></span>
          <span className="font-display text-xl text-[--color-obsidian] tracking-tight">NailVibe Admin</span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-[--color-obsidian] hover:bg-[--color-mist] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-[--color-ink] group-hover:text-[--color-lacquer] transition-colors" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[--color-ink]" />
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[--color-chrome]">
          <form action={async () => {
            "use server";
            (await cookies()).delete("admin_token");
            redirect("/admin/login");
          }}>
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[--color-ink] hover:bg-[--color-mist] hover:text-[--color-obsidian] transition-colors">
              <LogOut size={18} />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[--color-chrome] flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger could go here */}
            <h2 className="text-lg font-medium text-[--color-obsidian] capitalize">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/shop" 
              target="_blank"
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[--color-obsidian] bg-[--color-mist]/50 hover:bg-[--color-mist] rounded-lg transition-colors border border-[--color-chrome]/50"
            >
              ↗ View Live Store
            </Link>
            <div className="w-8 h-8 rounded-full bg-[--color-obsidian] flex items-center justify-center text-white font-mono text-xs shadow-sm">
              AD
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
