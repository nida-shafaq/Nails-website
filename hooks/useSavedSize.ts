"use client";

import { useEffect, useState } from "react";

const SAVED_SIZE_KEY = "lacquered-saved-size";

export type NailSize = "XS" | "S" | "M" | "L" | "XL";

interface FingerSizeMap {
  thumb_L?: NailSize;
  index_L?: NailSize;
  middle_L?: NailSize;
  ring_L?: NailSize;
  pinky_L?: NailSize;
  thumb_R?: NailSize;
  index_R?: NailSize;
  middle_R?: NailSize;
  ring_R?: NailSize;
  pinky_R?: NailSize;
}

interface UseSavedSizeReturn {
  savedSizes: FingerSizeMap;
  primarySize: NailSize | null;
  saveSizes: (sizes: FingerSizeMap) => void;
  savePrimarySize: (size: NailSize) => void;
  clearSizes: () => void;
  isLoaded: boolean;
}

/**
 * useSavedSize — Persists the user's nail size profile to localStorage.
 * On reorder, the saved profile auto-populates size selection, reducing friction.
 *
 * V2 note: This will be synced to user account/D1 profile when auth is added.
 */
export function useSavedSize(): UseSavedSizeReturn {
  const [savedSizes, setSavedSizes] = useState<FingerSizeMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_SIZE_KEY);
      if (stored) setSavedSizes(JSON.parse(stored));
    } catch {}
    setIsLoaded(true);
  }, []);

  const saveSizes = (sizes: FingerSizeMap) => {
    setSavedSizes(sizes);
    localStorage.setItem(SAVED_SIZE_KEY, JSON.stringify(sizes));
  };

  const savePrimarySize = (size: NailSize) => {
    const sizes = {
      thumb_L: size, index_L: size, middle_L: size, ring_L: size, pinky_L: size,
      thumb_R: size, index_R: size, middle_R: size, ring_R: size, pinky_R: size,
    };
    saveSizes(sizes);
  };

  const clearSizes = () => {
    setSavedSizes({});
    localStorage.removeItem(SAVED_SIZE_KEY);
  };

  // Derive a "primary size" from the most common size across all fingers
  const primarySize = (() => {
    const values = Object.values(savedSizes).filter(Boolean) as NailSize[];
    if (!values.length) return null;
    const freq = values.reduce<Record<string, number>>((acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});
    return (Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] as NailSize) ?? null;
  })();

  return { savedSizes, primarySize, saveSizes, savePrimarySize, clearSizes, isLoaded };
}
