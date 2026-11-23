"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { SidebarNav } from "@/components/ui/SidebarNav";
import { ReportIssueModal } from "@/components/issues/ReportIssueModal";
import { LogOut } from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col sm:flex-row p-2 sm:p-4 gap-4">
      {/* Motion Brew SidebarNav */}
      <div className="shrink-0 flex flex-col justify-between">
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
          className="shadow-xl border border-slate-200/80 dark:border-slate-800"
        />

        {/* Desktop Quick Sign Out Pill below sidebar */}
        <div className="hidden sm:block mt-2 px-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900 cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
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
