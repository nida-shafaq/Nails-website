"use client";

import React, { useState } from "react";
import { Search, Filter, MoreHorizontal, LayoutGrid, List } from "lucide-react";
import { CustomOrderInspector } from "@/components/admin/CustomOrderInspector";
import Image from "next/image";

// Mock Data
const MOCK_CUSTOM_ORDERS = [
  { id: "co_1a2b3c", customerEmail: "sarah@example.com", status: "submitted", occasion: "Wedding", budget: "$100-$150", deadline: "Oct 20", title: "Bridal Pearls" },
  { id: "co_4d5e6f", customerEmail: "jess@example.com", status: "in_design", occasion: "Birthday", budget: "$50-$100", deadline: "Oct 12", title: "Neon Vibes" },
  { id: "co_7g8h9i", customerEmail: "emily@example.com", status: "ready", occasion: "Everyday", budget: "$50-$100", deadline: "Oct 5", title: "Matte Black Coffin" },
  { id: "co_0j1k2l", customerEmail: "mia@example.com", status: "submitted", occasion: "Vacation", budget: "$150+", deadline: "Nov 1", title: "Tropical Chrome" },
];

const COLUMNS = [
  { id: "submitted", title: "Submitted", count: 2 },
  { id: "in_design", title: "In Design", count: 1 },
  { id: "ready", title: "Ready", count: 1 },
  { id: "shipped", title: "Shipped", count: 0 },
];

export default function CustomOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display text-[--color-obsidian]">Custom Orders</h1>
          <p className="text-sm text-[--color-ink] mt-1">Manage artisan workflow and sizing requests.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-ink]" />
            <input 
              type="text" 
              placeholder="Search ID or email..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[--color-chrome] rounded-lg focus:outline-none focus:border-[--color-obsidian]"
            />
          </div>
          <button className="p-2 border border-[--color-chrome] bg-white rounded-lg hover:bg-[--color-mist] text-[--color-obsidian]">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {COLUMNS.map((col) => (
            <div key={col.id} className="w-80 flex flex-col h-full bg-[--color-mist]/30 rounded-2xl p-4">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[--color-obsidian]">{col.title}</h3>
                  <span className="bg-white text-[--color-ink] text-xs font-mono px-2 py-0.5 rounded-full border border-[--color-chrome]">
                    {col.count}
                  </span>
                </div>
                <button className="text-[--color-ink] hover:text-[--color-obsidian]">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 overflow-y-auto">
                {MOCK_CUSTOM_ORDERS.filter(o => o.status === col.id).map(order => (
                  <div 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="bg-white border border-[--color-chrome] rounded-xl p-4 cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-mono text-[--color-ink]">#{order.id.slice(0,6)}</span>
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[--color-mist] relative">
                        <Image src="/images/products/bridal-4.png" alt="thumbnail" fill className="object-cover" />
                      </div>
                    </div>
                    <h4 className="font-medium text-[--color-obsidian] text-sm group-hover:text-[--color-lacquer] transition-colors">{order.title}</h4>
                    <p className="text-xs text-[--color-ink] mt-1">{order.customerEmail}</p>
                    
                    <div className="mt-4 pt-3 border-t border-[--color-chrome] flex items-center justify-between">
                      <span className="text-xs font-medium text-[--color-obsidian]">{order.deadline}</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">{order.budget}</span>
                    </div>
                  </div>
                ))}
                
                {/* Empty State */}
                {MOCK_CUSTOM_ORDERS.filter(o => o.status === col.id).length === 0 && (
                  <div className="border-2 border-dashed border-[--color-chrome] rounded-xl p-6 flex items-center justify-center text-sm text-[--color-ink]">
                    No orders
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspector Modal */}
      <CustomOrderInspector 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
      />
    </div>
  );
}
