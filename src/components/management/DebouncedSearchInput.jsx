"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * DebouncedSearchInput
 * Live search input with 300ms debounce and animated clear button
 */
export function DebouncedSearchInput({
  value: initialValue = "",
  onChange,
  debounceMs = 300,
  placeholder = "Search reports, address, ticket...",
  className = "",
}) {
  const [query, setQuery] = useState(initialValue);

  // Sync external changes to value
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debounce the callback
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query !== initialValue) {
        onChange(query);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs, onChange, initialValue]);

  const handleClear = () => {
    setQuery("");
    onChange("");
  };

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <Search className="size-4" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-colors shadow-sm"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Clear search query"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export default DebouncedSearchInput;
