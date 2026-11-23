"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/authHelpers";
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  ListTodo,
  ShieldCheck,
  Building2,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Bell,
  MapPin,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = session?.user;
  const role = user?.role || "citizen";

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
      console.error("Sign out failed:", err);
    }
  };

  const navLinks = [
    {
      name: "Citizen Portal",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["citizen", "manager", "staff", "admin"],
    },
    {
      name: "My Reports",
      href: "/my-reports",
      icon: FileText,
      roles: ["citizen", "manager", "staff", "admin"],
    },
    {
      name: "Report Issue",
      href: "/issues/new",
      icon: FilePlus2,
      roles: ["citizen", "manager", "staff", "admin"],
    },
    {
      name: "Field Staff Tasks",
      href: "/my-tasks",
      icon: ListTodo,
      roles: ["staff", "admin"],
    },
    {
      name: "Department Triage",
      href: "/department-dashboard",
      icon: Building2,
      roles: ["manager", "admin"],
    },
    {
      name: "Admin Control Center",
      href: "/admin-dashboard",
      icon: ShieldCheck,
      roles: ["admin"],
    },
  ];

  const visibleLinks = navLinks.filter((link) => link.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="CivicPulse Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain rounded-lg"
          />
          <span className="font-bold text-slate-900 dark:text-white">
            Civic<span className="text-[#0D9488]">Pulse</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-700 dark:text-slate-200"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-border flex flex-col justify-between transition-transform duration-200 md:translate-x-0 md:static md:h-screen md:sticky md:top-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-border flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="CivicPulse Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain rounded-xl"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                  Civic<span className="text-[#0D9488]">Pulse</span>
                </span>
                <span className="text-[9px] uppercase font-semibold tracking-wider text-slate-400">
                  {role} workspace
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              Navigation
            </div>
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-teal-50 text-[#0D9488] font-bold dark:bg-teal-950/60 dark:text-teal-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive && "text-[#0D9488]")} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-border">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-[#0D9488] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {user?.name?.charAt(0) || <User className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || "Civic User"}
                </div>
                <div className="text-[10px] text-muted uppercase font-semibold">
                  {role}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
