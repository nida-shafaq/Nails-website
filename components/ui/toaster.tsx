"use client";

import React, { createContext, useContext, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: "default" | "success" | "error";
}

interface ToastContextValue {
  toast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within Toaster component");
  }
  return context;
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <div className="fixed bottom-0 right-0 z-100 p-4 flex flex-col gap-2 w-full sm:w-auto">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "bg-[--color-obsidian] text-white p-4 rounded-xl shadow-xl flex items-start justify-between gap-4 sm:w-96",
                t.type === "error" && "bg-red-600",
                t.type === "success" && "bg-green-600"
              )}
            >
              <div>
                <p className="font-medium text-sm">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-white/80 mt-1">{t.description}</p>
                )}
              </div>
              <button
                type="button"
                className="text-white/60 hover:text-white"
                onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
