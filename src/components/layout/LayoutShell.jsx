"use client";

import React, { useState, useEffect } from "react";
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

  return (
    <>
      {mounted && !isDashboard && <Navbar />}
      <main className="flex-1 flex flex-col">{children}</main>
      {mounted && !isDashboard && <Footer />}
    </>
  );
}

export default LayoutShell;
