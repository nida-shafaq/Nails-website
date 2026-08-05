"use client";

import React, { useState } from "react";
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ProductModal } from "@/components/admin/ProductModal";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

const MOCK_PRODUCTS = [
  { id: "p1", title: "Cherry Noir", priceInCents: 2800, stock: 12, finish: "Glossy", status: "Active", img: "/images/products/cherry-noir.png" },
  { id: "p2", title: "Midnight Fig", priceInCents: 2600, stock: 5, finish: "Matte", status: "Active", img: "/images/products/midnight-fig.png" },
  { id: "p3", title: "Gilt Hour", priceInCents: 3200, stock: 0, finish: "Chrome", status: "Out of Stock", img: "/images/products/gilt-hour.png" },
  { id: "p4", title: "Bridal Pearl", priceInCents: 4500, stock: -1, finish: "Glossy", status: "Made to Order", img: "/images/products/bridal-pearl-cascade.png" },
];

export default function CatalogPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display text-[--color-obsidian]">Product Catalog</h1>
          <p className="text-sm text-[--color-ink] mt-1">Manage inventory, pricing, and product details.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-ink]" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[--color-chrome] rounded-lg focus:outline-none focus:border-[--color-obsidian]"
            />
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[--color-obsidian] text-white rounded-lg text-sm font-medium hover:bg-black transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[--color-chrome] rounded-2xl overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[--color-mist] border-b border-[--color-chrome] text-[--color-obsidian]">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Inventory</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Finish</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--color-chrome]">
              {MOCK_PRODUCTS.map((product) => (
                <tr key={product.id} className="hover:bg-[--color-mist]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative border border-[--color-chrome]">
                        <Image src={product.img} alt={product.title} fill className="object-cover" />
                      </div>
                      <span className="font-medium text-[--color-obsidian]">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Active' ? 'bg-green-100 text-green-700' :
                      product.status === 'Out of Stock' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[--color-ink]">
                      {product.stock === -1 ? '∞ (MTO)' : `${product.stock} in stock`}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {formatPrice(product.priceInCents)}
                  </td>
                  <td className="px-6 py-4 text-[--color-ink]">
                    {product.finish}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-[--color-ink] hover:text-[--color-lacquer] transition-colors rounded-lg hover:bg-[--color-mist]">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-[--color-ink] hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 ml-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
