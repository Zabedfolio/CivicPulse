"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { isRouteAllowed, getDashboardPath } from "@/lib/authHelpers";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function RoleGate({ allowedRoles = [], children, fallback }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const role = session?.user?.role || "citizen";

  if (!allowedRoles.includes(role)) {
    if (fallback) return fallback;

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/50 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
          <p className="mt-2 text-sm text-muted">
            Your role (<span className="font-semibold uppercase text-slate-800 dark:text-slate-200">{role}</span>) does not have authorization to view this department portal.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href={getDashboardPath(role)}>
              <Button variant="primary" size="md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to My Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default RoleGate;
