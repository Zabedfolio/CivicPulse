"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Menu, X, User, LogOut, ShieldAlert } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* CivicPulse Logo from logo.png (No yellow dot) */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-10 h-10 transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="CivicPulse Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain rounded-xl"
              priority
            />
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
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#0D9488]">
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-[#0D9488] font-bold text-xs uppercase">
                  {user.name?.charAt(0) || <User className="w-4 h-4" />}
                </div>
                <span>{user.name}</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-[#0D9488] border border-teal-200 dark:bg-teal-950 dark:border-teal-800">
                  {user.role || "citizen"}
                </span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} title="Sign Out">
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
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
            </>
          )}
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
            {user ? (
              <>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 py-1">
                  Signed in as <span className="font-semibold">{user.email}</span> ({user.role || "citizen"})
                </div>
                <Button variant="outline" size="md" className="w-full" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
