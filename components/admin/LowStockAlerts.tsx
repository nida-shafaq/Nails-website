"use client";

import React, { useState } from "react";
import { AlertCircle, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";


interface LowStockProduct {
  id: string;
  title: string;
  slug: string;
  stockQuantity: number;
  imageUrls: string[];
}

interface LowStockAlertsProps {
  count: number;
  products: LowStockProduct[];
}

export function LowStockAlerts({ count, products }: LowStockAlertsProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdateStock = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setIsUpdating(id);
    const formData = new FormData(e.currentTarget);
    const newStock = Number(formData.get("stock"));

    try {
      const res = await fetch(`/api/v1/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: newStock }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update stock:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div 
          className="bg-white rounded-2xl p-6 border border-chrome shadow-sm cursor-pointer hover:shadow-md hover:border-obsidian transition-all group relative overflow-hidden"
        >
          {/* Subtle sheen on hover */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-50 group-hover:animate-shimmer transition-opacity" />
          
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="p-2 rounded-xl bg-red-100 text-red-600 transition-colors">
              <AlertCircle size={20} />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
              Needs restock
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-sm text-ink mb-1 group-hover:text-obsidian transition-colors">Low Stock</p>
            <h3 className="text-2xl font-display text-obsidian">
              {count}
            </h3>
          </div>
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-chrome shrink-0">
            <div>
              <Dialog.Title className="text-xl font-display text-obsidian">Low Stock Alerts</Dialog.Title>
              <Dialog.Description className="text-sm text-ink mt-1">
                Products with 5 or fewer items remaining.
              </Dialog.Description>
            </div>
            <Dialog.Close className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-mist text-ink transition-colors outline-none">
              <X size={20} />
            </Dialog.Close>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle size={32} className="mx-auto text-chrome mb-3" />
                <p className="text-obsidian font-medium">All caught up!</p>
                <p className="text-sm text-ink mt-1">No products are running low on stock.</p>
              </div>
            ) : (
              products.map((product) => {
                const isOutOfStock = product.stockQuantity <= 0;
                
                return (
                  <div key={product.id} className="flex gap-4 p-4 border border-chrome rounded-xl bg-pearl/30">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-mist border border-chrome overflow-hidden shrink-0 relative">
                      {product.imageUrls?.[0] ? (
                        <img 
                          src={product.imageUrls[0]} 
                          alt={product.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-ink/50">No img</div>
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-obsidian truncate">{product.title}</h4>
                          <span className={`shrink-0 text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} left`}
                          </span>
                        </div>
                        <p className="text-xs text-ink font-mono mt-0.5 truncate">SKU: {product.slug}</p>
                      </div>

                      {/* Restock form */}
                      <form onSubmit={(e) => handleUpdateStock(e, product.id)} className="flex items-center gap-2 mt-3">
                        <input 
                          type="number" 
                          name="stock" 
                          min="0"
                          defaultValue={product.stockQuantity}
                          className="w-20 px-2 py-1.5 text-sm border border-chrome rounded-lg outline-none focus:border-obsidian bg-white"
                          required
                        />
                        <button 
                          type="submit"
                          disabled={isUpdating === product.id}
                          className="px-3 py-1.5 bg-obsidian text-white text-xs font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                        >
                          {isUpdating === product.id ? 'Updating...' : 'Update Stock'}
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-chrome shrink-0 bg-mist/20">
            <Link 
              href="/admin/catalog?filter=low_stock"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-chrome rounded-xl bg-white text-sm font-medium text-obsidian hover:bg-mist transition-colors"
            >
              View in Catalog <ExternalLink size={16} />
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
