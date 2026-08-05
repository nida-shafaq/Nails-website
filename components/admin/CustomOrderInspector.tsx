"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Clock, 
  DollarSign, 
  Calendar, 
  Ruler, 
  Mail,
  ZoomIn,
  Package,
  Save
} from "lucide-react";
import Image from "next/image";

interface CustomOrderInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
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
  const [internalNotes, setInternalNotes] = useState(order?.internalNotes || "");
  const [trackingId, setTrackingId] = useState(order?.trackingId || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setInternalNotes(order.internalNotes || "");
      setTrackingId(order.trackingId || "");
    }
  }, [order]);

  const handleUpdate = async () => {
    if (!order) return;
    setIsSaving(true);
    try {
      await fetch(`/api/v1/admin/custom-orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          internalNotes,
          trackingId
        })
      });
      onClose(); // Close on success
    } catch (error) {
      console.error("Failed to update order", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Col - Image Viewer */}
        <div className="w-full md:w-5/12 bg-mist p-6 flex flex-col relative h-[40vh] md:h-auto border-r border-chrome">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm md:hidden z-10 text-obsidian"
          >
            <X size={16} />
          </button>
          
          <div className="hidden md:flex items-center justify-between mb-4">
            <h3 className="font-medium text-obsidian">Reference Photos</h3>
            <button className="text-ink hover:text-obsidian transition-colors">
              <ZoomIn size={18} />
            </button>
          </div>
          
          <div className="flex-1 relative rounded-xl overflow-hidden border border-chrome bg-white shadow-sm group">
            {order.referenceImageUrls?.[0] ? (
              <Image 
                src={order.referenceImageUrls[0]}
                alt="Reference"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-ink">No Reference Image</div>
            )}
          </div>
          
          {/* Thumbnails */}
          {order.referenceImageUrls && order.referenceImageUrls.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 custom-scrollbar">
              {order.referenceImageUrls.map((url: string, i: number) => (
                <div key={i} className={`w-16 h-16 rounded-lg border-2 shrink-0 relative overflow-hidden cursor-pointer hover:border-obsidian transition-colors ${i === 0 ? 'border-obsidian' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                   <Image 
                    src={url}
                    alt={`Thumbnail ${i}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col - Details & Measurements */}
        <div className="w-full md:w-7/12 bg-white flex flex-col h-[50vh] md:h-auto">
          <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-display text-obsidian">Order #{order.id.slice(0, 6)}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Mail size={14} className="text-ink" />
                  <span className="text-sm text-ink">{order.customerEmail}</span>
                  <span className="text-ink mx-1">•</span>
                  <span className="text-sm font-medium text-obsidian">{order.customerName}</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="hidden md:flex p-2 hover:bg-mist rounded-full transition-colors text-obsidian"
              >
                <X size={20} />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-mist rounded-full text-xs font-medium text-obsidian border border-chrome">
                <Clock size={14} /> {order.occasion || "Everyday"}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                <DollarSign size={14} /> Budget: {order.budget || "$50 - $100"}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-100">
                <Calendar size={14} /> Due: {order.deadline ? new Date(order.deadline).toLocaleDateString() : "ASAP"}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Sizing Matrix */}
              <div>
                <h3 className="font-medium text-obsidian flex items-center gap-2 mb-4">
                  <Ruler size={16} /> Client Sizing Matrix
                </h3>
                <div className="bg-mist/30 rounded-xl border border-chrome p-4 shadow-sm">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-ink mb-2 px-2">
                    <span>Finger</span>
                    <span className="w-12 text-center">Left</span>
                    <span className="w-12 text-center">Right</span>
                  </div>
                  {FINGERS.map((finger) => (
                    <div key={finger.id} className="flex justify-between items-center py-2.5 px-2 border-t border-chrome/50 text-sm">
                      <span className="capitalize text-obsidian">{finger.label}</span>
                      <span className="w-12 text-center font-mono font-medium text-obsidian bg-white py-1 rounded border border-chrome shadow-sm">
                        {order.fingerSizes?.[`${finger.id}_L`] || "-"}
                      </span>
                      <span className="w-12 text-center font-mono font-medium text-obsidian bg-white py-1 rounded border border-chrome shadow-sm">
                        {order.fingerSizes?.[`${finger.id}_R`] || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-medium text-obsidian mb-2 text-sm">Client Instructions</h3>
                  <div className="bg-yellow-50/50 rounded-xl border border-yellow-200 p-4 text-sm text-obsidian leading-relaxed shadow-sm min-h-25">
                    {order.notes || "No special instructions provided by the client."}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-obsidian mb-2 text-sm flex items-center gap-2">
                    Internal Crafting Notes
                  </h3>
                  <textarea 
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="E.g. Use DND Gel #014 for base, double cure the charms..."
                    className="w-full bg-white rounded-xl border border-chrome p-4 text-sm text-obsidian leading-relaxed shadow-sm min-h-30 focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Workflow (Conditional) */}
            {(selectedStatus === "ready" || selectedStatus === "shipped") && (
              <div className="mb-4 p-5 bg-mist/50 rounded-2xl border border-chrome">
                <h3 className="font-medium text-obsidian mb-3 flex items-center gap-2 text-sm">
                  <Package size={16} /> Shipping & Fulfillment
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. 1Z9999...)"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-chrome text-sm focus:outline-none focus:border-obsidian"
                  />
                  <button 
                    onClick={() => {
                      if (!trackingId) alert("Please enter a tracking ID");
                      else setSelectedStatus("shipped");
                    }}
                    className="px-4 py-2.5 bg-obsidian text-white rounded-lg text-sm font-medium hover:bg-black transition-colors shrink-0"
                  >
                    Mark as Shipped
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer / Action Bar */}
          <div className="p-4 md:p-6 border-t border-chrome bg-white flex flex-col sm:flex-row gap-3 items-center shrink-0">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto flex-1 px-4 py-3 rounded-xl border border-chrome bg-white outline-none focus:border-obsidian font-medium text-obsidian text-sm cursor-pointer shadow-sm"
            >
              <option value="submitted">Status: Submitted</option>
              <option value="in_design">Status: In Design</option>
              <option value="ready">Status: Ready for Shipping</option>
              <option value="shipped">Status: Shipped</option>
              <option value="cancelled">Status: Cancelled</option>
            </select>
            <button 
              onClick={handleUpdate}
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3 bg-obsidian text-white rounded-xl font-medium text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isSaving ? "Saving..." : <><Save size={16} /> Save & Close</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
