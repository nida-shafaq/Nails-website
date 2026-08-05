"use client";

import React from "react";
import { Search, Filter, CheckCircle2, AlertCircle, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const MOCK_ORDERS = [
  { id: "ord_1042", customer: "Sarah Jenkins", email: "sarah@example.com", total: 5400, items: 2, status: "Paid", fulfillment: "Unfulfilled", date: "Oct 2, 2026" },
  { id: "ord_1041", customer: "Michelle Lee", email: "m.lee@example.com", total: 2800, items: 1, status: "Paid", fulfillment: "Fulfilled", date: "Oct 1, 2026" },
  { id: "ord_1040", customer: "Amanda B.", email: "amanda.b@example.com", total: 8400, items: 3, status: "Pending", fulfillment: "Unfulfilled", date: "Sep 28, 2026" },
  { id: "ord_1039", customer: "Jessica Tan", email: "jess@example.com", total: 2600, items: 1, status: "Refunded", fulfillment: "Cancelled", date: "Sep 25, 2026" },
];

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display text-[--color-obsidian]">Standard Orders</h1>
          <p className="text-sm text-[--color-ink] mt-1">Manage e-commerce fulfillment and shipping.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-ink]" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[--color-chrome] rounded-lg focus:outline-none focus:border-[--color-obsidian]"
            />
          </div>
          <button className="p-2 border border-[--color-chrome] bg-white rounded-lg hover:bg-[--color-mist] text-[--color-obsidian]">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-[--color-chrome] rounded-2xl overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[--color-mist] border-b border-[--color-chrome] text-[--color-obsidian]">
              <tr>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Fulfillment</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--color-chrome]">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-[--color-mist]/30 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-[--color-obsidian]">
                    #{order.id.split('_')[1]}
                  </td>
                  <td className="px-6 py-4 text-[--color-ink]">
                    {order.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[--color-obsidian]">{order.customer}</div>
                    <div className="text-xs text-[--color-ink]">{order.items} item{order.items > 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status === 'Paid' && <CheckCircle2 size={12} />}
                      {order.status === 'Pending' && <AlertCircle size={12} />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.fulfillment === 'Fulfilled' ? 'bg-blue-100 text-blue-700' :
                      order.fulfillment === 'Unfulfilled' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <Package size={12} />
                      {order.fulfillment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-[--color-obsidian]">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
