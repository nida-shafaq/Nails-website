"use client";

import React, { useState } from "react";
import { 
  X, 
  Clock, 
  DollarSign, 
  Calendar, 
  Ruler, 
  Mail,
  ZoomIn
} from "lucide-react";
import Image from "next/image";

interface CustomOrderInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  order: any; // We'll type this properly later
}

const FINGERS = [
  { id: "thumb", label: "Thumb" },
  { id: "index", label: "Index" },
  { id: "middle", label: "Middle" },
  { id: "ring", label: "Ring" },
  { id: "pinky", label: "Pinky" },
];

export function CustomOrderInspector({ isOpen, onClose, order }: CustomOrderInspectorProps) {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "submitted");

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Col - Image Viewer */}
        <div className="w-full md:w-1/2 bg-[--color-mist] p-6 flex flex-col relative h-[40vh] md:h-auto border-r border-[--color-chrome]">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm md:hidden z-10"
          >
            <X size={16} />
          </button>
          
          <div className="hidden md:flex items-center justify-between mb-4">
            <h3 className="font-medium text-[--color-obsidian]">Reference Photos</h3>
            <button className="text-[--color-ink] hover:text-[--color-obsidian]">
              <ZoomIn size={18} />
            </button>
          </div>
          
          <div className="flex-1 relative rounded-xl overflow-hidden border border-[--color-chrome] bg-white">
            <Image 
              src={order.referenceImageUrls?.[0] || "/images/products/bridal-4.png"}
              alt="Reference"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {[0,1,2].map((i) => (
              <div key={i} className={`w-16 h-16 rounded-lg border-2 shrink-0 relative overflow-hidden ${i === 0 ? 'border-[--color-obsidian]' : 'border-transparent opacity-60'}`}>
                 <Image 
                  src={order.referenceImageUrls?.[i] || "/images/products/bridal-4.png"}
                  alt={`Thumbnail ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Col - Details & Measurements */}
        <div className="w-full md:w-1/2 bg-white flex flex-col h-[50vh] md:h-auto overflow-y-auto">
          <div className="p-6 md:p-8 flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-display text-[--color-obsidian]">Order #{order.id.slice(0, 6)}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Mail size={14} className="text-[--color-ink]" />
                  <span className="text-sm text-[--color-ink]">{order.customerEmail}</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="hidden md:flex p-2 hover:bg-[--color-mist] rounded-full transition-colors"
              >
                <X size={20} className="text-[--color-ink]" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[--color-mist] rounded-full text-xs font-medium text-[--color-obsidian]">
                <Clock size={14} /> Occasion: {order.occasion || "Everyday"}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                <DollarSign size={14} /> Budget: {order.budget || "$50 - $100"}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                <Calendar size={14} /> Due: {order.deadline || "ASAP"}
              </div>
            </div>

            {/* Sizing Matrix */}
            <div className="mb-8">
              <h3 className="font-medium text-[--color-obsidian] flex items-center gap-2 mb-4">
                <Ruler size={16} /> Client Sizing Matrix
              </h3>
              
              <div className="bg-[--color-mist]/50 rounded-xl border border-[--color-chrome] p-4">
                <div className="flex justify-between text-xs font-medium text-[--color-ink] mb-2 px-2">
                  <span>Finger</span>
                  <span className="w-12 text-center">Left</span>
                  <span className="w-12 text-center">Right</span>
                </div>
                {FINGERS.map((finger) => (
                  <div key={finger.id} className="flex justify-between items-center py-2 px-2 border-t border-[--color-chrome] text-sm">
                    <span className="capitalize">{finger.label}</span>
                    <span className="w-12 text-center font-mono font-medium text-[--color-obsidian]">{order.fingerSizes?.[`${finger.id}_L`] || "M"}</span>
                    <span className="w-12 text-center font-mono font-medium text-[--color-obsidian]">{order.fingerSizes?.[`${finger.id}_R`] || "M"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="font-medium text-[--color-obsidian] mb-2">Design Notes</h3>
              <div className="bg-yellow-50/50 rounded-xl border border-yellow-100 p-4 text-sm text-[--color-obsidian] leading-relaxed">
                {order.notes || "Client wants the pink bows to match her bridesmaid dresses exactly. See reference photo 2 for the shade of pink."}
              </div>
            </div>
          </div>

          {/* Sticky Footer / Action Bar */}
          <div className="p-4 md:p-6 border-t border-[--color-chrome] bg-white flex flex-col sm:flex-row gap-3 items-center shrink-0">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto flex-1 px-4 py-3 rounded-xl border border-chrome bg-white outline-none focus:border-obsidian font-medium text-[--color-obsidian] text-sm"
            >
              <option value="submitted">Status: Submitted</option>
              <option value="in_design">Status: In Design</option>
              <option value="ready">Status: Ready for Shipping</option>
              <option value="shipped">Status: Shipped</option>
              <option value="cancelled">Status: Cancelled</option>
            </select>
            <button 
              className="w-full sm:w-auto px-6 py-3 bg-[--color-obsidian] text-white rounded-xl font-medium text-sm hover:bg-black transition-colors"
            >
              Update Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
