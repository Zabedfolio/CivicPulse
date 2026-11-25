"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Dashboard and full-screen routes where Navbar and Footer must be suppressed
const DASHBOARD_ROUTES = [
  "/dashboard",
  "/my-reports",
  "/my-tasks",
  "/department-dashboard",
  "/admin-dashboard",
  "/unauthorized",
];

const FOOTER_SUPPRESSED_ROUTES = [
  ...DASHBOARD_ROUTES,
  "/map",
];

export function LayoutShell({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDashboard = Boolean(
    pathname &&
      DASHBOARD_ROUTES.some(
        (route) => pathname === route || pathname?.startsWith(`${route}/`)
      )
  );

  const isFooterSuppressed = Boolean(
    pathname &&
      FOOTER_SUPPRESSED_ROUTES.some(
        (route) => pathname === route || pathname?.startsWith(`${route}/`)
      )
  );

  return (
    <>
      {mounted && !isDashboard && (
        <div className="print:hidden">
          <Navbar />
        </div>
      )}
      <main className="flex-1 flex flex-col">{children}</main>
      {mounted && !isFooterSuppressed && (
        <div className="print:hidden">
          <Footer />
        </div>
      )}
    </>
  );
}

export default LayoutShell;
