"use client";

import React from "react";
import { X, UploadCloud } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[--color-chrome]">
          <h2 className="text-xl font-display text-[--color-obsidian]">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[--color-mist] rounded-full transition-colors">
            <X size={20} className="text-[--color-ink]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form className="flex flex-col gap-6">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[--color-obsidian] mb-2">Product Images</label>
              <div className="border-2 border-dashed border-[--color-chrome] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[--color-mist]/50 transition-colors">
                <div className="w-12 h-12 bg-[--color-mist] rounded-full flex items-center justify-center mb-3">
                  <UploadCloud size={24} className="text-[--color-obsidian]" />
                </div>
                <p className="text-sm font-medium text-[--color-obsidian]">Click to upload or drag and drop</p>
                <p className="text-xs text-[--color-ink] mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[--color-obsidian] mb-2">Product Title</label>
                <input type="text" className="w-full px-3 py-2 border border-chrome rounded-lg focus:outline-none focus:border-obsidian" placeholder="e.g. Cherry Noir" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[--color-obsidian] mb-2">Price (USD)</label>
                <input type="number" className="w-full px-3 py-2 border border-chrome rounded-lg focus:outline-none focus:border-obsidian" placeholder="28.00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[--color-obsidian] mb-2">Finish</label>
                <select className="w-full px-3 py-2 border border-chrome rounded-lg focus:outline-none focus:border-obsidian">
                  <option>Glossy</option>
                  <option>Matte</option>
                  <option>Chrome</option>
                  <option>Glitter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[--color-obsidian] mb-2">Swatch Hex Color</label>
                <div className="flex gap-2">
                  <input type="color" className="w-10 h-10 p-1 border border-[--color-chrome] rounded-lg cursor-pointer" />
                  <input type="text" className="w-full px-3 py-2 border border-chrome rounded-lg focus:outline-none focus:border-obsidian" placeholder="#8B1A3A" />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[--color-chrome] text-[--color-obsidian] focus:ring-[--color-obsidian]" />
                <span className="text-sm font-medium text-[--color-obsidian]">Allow Custom Sizing (Made to Order)</span>
              </label>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-[--color-chrome] flex justify-end gap-3 bg-[--color-mist]/30">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-[--color-obsidian] hover:bg-white rounded-lg border border-transparent hover:border-[--color-chrome] transition-all">
            Cancel
          </button>
          <button className="px-5 py-2 bg-[--color-obsidian] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors">
            {product ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
