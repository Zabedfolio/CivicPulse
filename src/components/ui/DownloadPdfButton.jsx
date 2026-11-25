"use client";

import React, { useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FileDown, Loader2 } from "lucide-react";

/**
 * DownloadPdfButton
 * Triggers clean A4 print / Save-as-PDF export with automatic document title naming.
 */
export function DownloadPdfButton({ ticketId = "CP-2026" }) {
  const [isPreparing, setIsPreparing] = useState(false);

  const handleDownloadPdf = () => {
    setIsPreparing(true);
    const originalTitle = document.title;
    document.title = `CivicPulse-Report-${ticketId}`;

    // Allow React state & title update to flush before invoking native print dialog
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
      setIsPreparing(false);
    }, 120);
  };

  return (
    <MagneticButton
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleDownloadPdf}
      disabled={isPreparing}
      className="text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
    >
      {isPreparing ? (
        <Loader2 className="size-3.5 mr-1.5 animate-spin text-[#0D9488]" aria-hidden="true" />
      ) : (
        <FileDown className="size-3.5 mr-1.5 text-[#0D9488]" aria-hidden="true" />
      )}
      <span>Download Official PDF</span>
    </MagneticButton>
  );
}

export default DownloadPdfButton;
