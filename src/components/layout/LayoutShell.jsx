"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Dashboard routes where Navbar and Footer must be suppressed
const DASHBOARD_ROUTES = [
  "/dashboard",
  "/my-reports",
  "/my-tasks",
  "/department-dashboard",
  "/admin-dashboard",
  "/unauthorized",
];

export function LayoutShell({ children }) {
  const pathname = usePathname();

  const isDashboard = DASHBOARD_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className="flex-1 flex flex-col">{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}

export default LayoutShell;
