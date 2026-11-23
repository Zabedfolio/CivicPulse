"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/authHelpers";

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const role = session?.user?.role || "citizen";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 flex items-center justify-center">
          <ShieldAlert className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Access Restricted
        </h1>
        <p className="mt-2 text-sm text-muted">
          Your account role (<span className="font-semibold uppercase text-slate-800 dark:text-slate-200">{role}</span>) does not possess authorization to view or operate this municipal portal.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href={getDashboardPath(role)}>
            <Button variant="primary" size="md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Authorized Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
