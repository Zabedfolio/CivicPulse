"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, X, Activity } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* CivicPulse Skyline Pin Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#0D9488] shadow-sm transition-transform duration-200 group-hover:scale-105 dark:bg-teal-950/60 dark:border-teal-800">
            {/* Map Pin icon with City Skyline & Pulse line */}
            <svg
              className="w-6 h-6 text-[#0D9488]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <path d="M9 10v2" strokeWidth="1.5" />
              <path d="M12 8v4" strokeWidth="1.5" />
              <path d="M15 10v2" strokeWidth="1.5" />
            </svg>
            <span className="absolute -bottom-0.5 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Civic<span className="text-[#0D9488]">Pulse</span>
            </span>
            <span className="text-[10px] text-muted font-medium tracking-wide">
              SMART CITY INFRASTRUCTURE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 hover:text-[#0D9488] transition-colors dark:text-slate-300 dark:hover:text-teal-400"
          >
            Home
          </Link>
          <Link
            href="/map"
            className="text-sm font-medium text-slate-700 hover:text-[#0D9488] transition-colors dark:text-slate-300 dark:hover:text-teal-400"
          >
            City Map
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-700 hover:text-[#0D9488] transition-colors dark:text-slate-300 dark:hover:text-teal-400"
          >
            About
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/issues/new">
            <Button variant="primary" size="sm">
              Report Issue
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-3 bg-white dark:bg-slate-900 animate-in fade-in duration-150">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-800 hover:text-[#0D9488] dark:text-slate-200"
          >
            Home
          </Link>
          <Link
            href="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-800 hover:text-[#0D9488] dark:text-slate-200"
          >
            City Map
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-800 hover:text-[#0D9488] dark:text-slate-200"
          >
            About
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="md" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/issues/new" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
