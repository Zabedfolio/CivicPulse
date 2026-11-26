"use client";

import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PaginationControl (Motion Brew PaginationBarSpring)
 * Smooth animated page switcher with spring layout pill and items-per-page selector
 */
export function PaginationControl({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  itemLabel = "issues",
  className = "",
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-xs text-muted",
        className
      )}
    >
      {/* Items count summary */}
      <div className="flex items-center gap-2">
        <span>
          Showing <span className="font-bold text-slate-900 dark:text-white">{startItem}</span>–
          <span className="font-bold text-slate-900 dark:text-white">{endItem}</span> of{" "}
          <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> {itemLabel}
        </span>

        {/* Per-page selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-3 border-l border-border pl-3">
            <span className="text-[11px] text-slate-400">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Mobile Compact Prev / Page X of Y / Next (< 640px) */}
      <div className="sm:hidden flex items-center justify-between w-full gap-2 bg-slate-50 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="min-h-[40px] px-3 rounded-xl inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Previous Page"
        >
          <ChevronLeft className="size-4" />
          <span>Prev</span>
        </button>

        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">
          Page <span className="text-[#0D9488]">{currentPage}</span> of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="min-h-[40px] px-3 rounded-xl inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Tablet & Desktop Page switcher with spring indicator (>= 640px) */}
      <div className="hidden sm:flex items-center gap-1 bg-slate-50 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="size-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label="Previous Page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="size-8 flex items-center justify-center text-slate-400"
                >
                  …
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={cn(
                  "relative size-8 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center",
                  isCurrent
                    ? "text-[#0D9488] dark:text-teal-300 font-extrabold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {isCurrent && (
                  <motion.span
                    layoutId="pagination-spring-pill"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{p}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="size-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label="Next Page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default PaginationControl;
