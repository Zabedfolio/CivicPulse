"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { TabBar } from "@/components/ui/TabBar";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/authHelpers";

const NAV_TABS = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  { id: "map", label: "City Map", icon: "explore", href: "/map" },
  { id: "about", label: "About", icon: "about", href: "/about" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

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

  // Don't render floating public navbar on internal role-dashboard routes (which have their own sidebar)
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/department-dashboard") ||
    pathname.startsWith("/my-tasks") ||
    pathname.startsWith("/issues");

  if (isDashboardRoute) {
    return null;
  }

  // Active tab resolver
  let currentTabId = "home";
  if (pathname === "/map" || pathname.startsWith("/map/")) currentTabId = "map";
  else if (pathname === "/about" || pathname.startsWith("/about/")) currentTabId = "about";

  const handleTabChange = (tabId) => {
    const target = NAV_TABS.find((t) => t.id === tabId);
    if (target) {
      router.push(target.href);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full pt-3 px-4 sm:px-6 pointer-events-none transition-all">
      <div className="max-w-6xl mx-auto rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.07)] px-4 sm:px-6 h-16 flex items-center justify-between pointer-events-auto">
        {/* CivicPulse Logo without subtext */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="CivicPulse Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain rounded-xl"
              priority
            />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Civic<span className="text-[#0D9488]">Pulse</span>
          </span>
        </Link>

        {/* Center Desktop Navigation: Motion Brew TabBar */}
        <div className="hidden md:flex items-center">
          <TabBar
            tabs={NAV_TABS}
            value={currentTabId}
            onChange={handleTabChange}
          />
        </div>

        {/* Action Buttons: Motion Brew MagneticButton */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardPath(user.role)}
                className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 px-2.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900 text-[#0D9488] flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0) || <User className="w-3.5 h-3.5" />
                  )}
                </div>
                <span>{user.name}</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200 dark:bg-teal-950 dark:border-teal-800">
                  {user.role || "citizen"}
                </span>
              </Link>
              <Link
                href="/profile"
                className="p-2 rounded-full text-slate-600 hover:text-teal-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="Account Settings & Profile"
              >
                <Settings className="w-4 h-4" />
              </Link>
              <MagneticButton
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-xs"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Sign Out
              </MagneticButton>
            </div>
          ) : (
            <>
              <MagneticButton
                variant="ghost"
                size="sm"
                href="/login"
                className="text-xs font-semibold text-slate-700 hover:text-[#0D9488]"
              >
                Sign In
              </MagneticButton>
              <MagneticButton
                variant="primary"
                size="sm"
                href="/issues/new"
                className="text-xs font-bold shadow-md shadow-teal-500/10"
              >
                Report Issue
              </MagneticButton>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto rounded-3xl p-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 pointer-events-auto animate-in fade-in duration-150">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-[#0D9488] dark:text-slate-200"
          >
            Home
          </Link>
          <Link
            href="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-[#0D9488] dark:text-slate-200"
          >
            City Map
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 hover:text-[#0D9488] dark:text-slate-200"
          >
            About
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={getDashboardPath(user.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-medium text-slate-700 dark:text-slate-300 py-1"
                >
                  Signed in as <span className="font-bold">{user.email}</span> ({user.role})
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 py-1 hover:underline"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Account Settings &amp; Profile
                </Link>
                <MagneticButton
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  Sign Out
                </MagneticButton>
              </>
            ) : (
              <>
                <MagneticButton
                  variant="outline"
                  size="sm"
                  href="/login"
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </MagneticButton>
                <MagneticButton
                  variant="primary"
                  size="sm"
                  href="/issues/new"
                  className="w-full justify-center font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Report Issue
                </MagneticButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
