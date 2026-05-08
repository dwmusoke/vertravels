"use client";

import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui";
import { SearchFilters } from "./search-filters";

interface MobileFiltersDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileFiltersDrawer({ open, onClose }: MobileFiltersDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#F5F7FB] shadow-2xl animate-slide-in-left overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-5">
          <SearchFilters />
        </div>
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
          <Button
            onClick={onClose}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 h-11"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
