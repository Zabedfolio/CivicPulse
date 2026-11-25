"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { SidebarNav } from "@/components/ui/SidebarNav";
import { ReportIssueModal } from "@/components/issues/ReportIssueModal";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LogOut, User } from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // TAB-01: Auto-collapse sidebar into slim icon rail on 640px–1023px tablets
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");
    const sync = () => setSidebarCollapsed(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const user = session?.user;
  const role = user?.role || "citizen";

  // Determine active item id in SidebarNav
  let activeId = "dashboard";
  if (pathname.startsWith("/my-reports")) activeId = "my-reports";
  else if (pathname.startsWith("/my-tasks")) activeId = "my-tasks";
  else if (pathname.startsWith("/department-dashboard")) activeId = "department-dashboard";
  else if (pathname.startsWith("/admin-dashboard")) activeId = "admin-dashboard";

  // Build role-tailored navigation sections
  const sections = [
    {
      label: "Citizen Services",
      items: [
        { id: "dashboard", label: "Citizen Portal", icon: "home" },
        { id: "my-reports", label: "My Reports", icon: "projects" },
        { id: "report-issue", label: "Report Issue", icon: "explore", tag: "Modal" },
      ],
    },
  ];

  if (role === "staff" || role === "admin") {
    sections.push({
      label: "Field Operations",
      items: [
        { id: "my-tasks", label: "Field Staff Tasks", icon: "workflows" },
      ],
    });
  }

  if (role === "manager" || role === "admin") {
    sections.push({
      label: "Management",
      items: [
        { id: "department-dashboard", label: "Department Triage", icon: "analytics" },
      ],
    });
  }

  if (role === "admin") {
    sections.push({
      label: "Governance",
      items: [
        { id: "admin-dashboard", label: "Admin Control", icon: "team" },
      ],
    });
  }

  const handleNavigate = (id) => {
    if (id === "report-issue") {
      setIsReportModalOpen(true);
      return;
    }
    if (id === "dashboard") router.push("/dashboard");
    else if (id === "my-reports") router.push("/my-reports");
    else if (id === "my-tasks") router.push("/my-tasks");
    else if (id === "department-dashboard") router.push("/department-dashboard");
    else if (id === "admin-dashboard") router.push("/admin-dashboard");
  };

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

  const logoNode = (
    <div className="relative flex items-center justify-center size-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 p-0.5 border border-teal-200/60 dark:border-teal-800/60">
      <Image
        src="/logo.png"
        alt="CivicPulse Logo"
        width={28}
        height={28}
        className="size-7 object-contain rounded-lg"
      />
    </div>
  );

  return (
    <div className="min-h-screen sm:h-screen sm:overflow-hidden bg-slate-100 dark:bg-slate-950 flex flex-col sm:flex-row p-1.5 sm:p-4 gap-2.5 sm:gap-4 overflow-x-clip">
      {/* Motion Brew SidebarNav (Fixed Viewport Height on sm+) */}
      <div className="shrink-0 sm:h-full flex flex-col">
        <SidebarNav
          brand="CivicPulse"
          logo={logoNode}
          sections={sections}
          value={activeId}
          onNavigate={handleNavigate}
          user={{
            name: user?.name || "Civic Citizen",
            email: user?.email || `${role}@civicpulse.gov`,
            avatar:
              user?.image ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces",
          }}
          onSettings={() => router.push("/profile")}
          onSignOut={handleSignOut}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          className="shadow-xl border border-slate-200/80 dark:border-slate-800 sm:h-full"
        />
      </div>

      {/* Main Content Area (Independently Scrollable on sm+) */}
      <main className="flex-1 min-w-0 sm:h-full bg-white dark:bg-slate-900/60 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-3.5 sm:p-6 lg:p-8 sm:overflow-y-auto flex flex-col">
        {/* Dashboard Top Header: Context Path, Mobile Profile/SignOut & Notification Bell */}
        <div className="flex items-center justify-between gap-2 pb-3.5 sm:pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-5 sm:mb-6 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted shrink-0">
              CivicPulse
            </span>
            <span className="text-slate-300 dark:text-slate-700 shrink-0">/</span>
            <span className="text-xs font-extrabold text-[#0D9488] capitalize truncate">
              {activeId.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <NotificationBell />
            <Link
              href="/profile"
              aria-label="Account Profile & Settings"
              className="sm:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-[#0D9488] transition-colors"
            >
              <User className="size-4" />
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign Out"
              className="sm:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex-1">
          {children}
        </div>
      </main>

      {/* Animated Report Issue Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={() => {
          setIsReportModalOpen(false);
          router.push("/my-reports");
        }}
      />
    </div>
  );
}
