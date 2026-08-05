"use client";

import React, { useState, useCallback } from "react";

import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import { FadeUp } from "@/components/shared/MotionWrapper";

export function CustomOrderForm() {
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles].slice(0, 5)); // Max 5 images
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: 5242880, // 5MB
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-20 px-6 max-w-lg mx-auto">
        <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 className="text-3xl font-display text-[--color-obsidian] mb-4">Request Received</h2>
        <p className="text-[--color-ink] mb-8">
          We&apos;ve received your custom design request. Our artists will review it and get back to you with a quote within 48 hours.
        </p>
        <button 
          onClick={() => {
            setIsSuccess(false);
            setImages([]);
          }} 
          className="btn-ghost"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[--color-obsidian]">Full Name</label>
          <input 
            required
            type="text" 
            id="name" 
            className="w-full bg-white border border-[--color-chrome] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[--color-lacquer] transition-shadow text-sm"
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[--color-obsidian]">Email Address</label>
          <input 
            required
            type="email" 
            id="email" 
            className="w-full bg-white border border-[--color-chrome] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[--color-lacquer] transition-shadow text-sm"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="occasion" className="text-sm font-medium text-[--color-obsidian]">Occasion (Optional)</label>
          <input 
            type="text" 
            id="occasion" 
            className="w-full bg-white border border-[--color-chrome] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[--color-lacquer] transition-shadow text-sm"
            placeholder="Wedding, Birthday, Everyday..."
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="budget" className="text-sm font-medium text-[--color-obsidian]">Budget Range</label>
          <select 
            id="budget" 
            className="w-full bg-white border border-[--color-chrome] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[--color-lacquer] transition-shadow text-sm"
          >
            <option value="">Select a range</option>
            <option value="50-75">$50 - $75</option>
            <option value="75-120">$75 - $120</option>
            <option value="120+">$120+</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[--color-obsidian]">Reference Images</label>
        <p className="text-xs text-[--color-ink] mb-3">Upload up to 5 photos of inspiration (colors, patterns, vibes).</p>
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-[--color-lacquer] bg-[--color-lacquer-tint]" : "border-[--color-chrome] hover:bg-black/5"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto text-[--color-ink] mb-3" size={24} />
          <p className="text-sm text-[--color-obsidian]">
            Drag & drop images here, or click to select
          </p>
          <p className="text-xs text-[--color-ink] mt-1">PNG, JPG, WEBP up to 5MB</p>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            {images.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-[--color-chrome]">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Preview ${i}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-[--color-obsidian]">Design Notes</label>
        <textarea 
          required
          id="notes" 
          rows={5}
          className="w-full bg-white border border-[--color-chrome] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[--color-lacquer] transition-shadow text-sm resize-none custom-scrollbar"
          placeholder="Tell us about the shapes, colors, or specific art you want..."
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn-lacquer w-full py-4 text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Sending Request...
          </>
        ) : (
          "Submit Custom Request"
        )}
      </button>
    </form>
  );
}
