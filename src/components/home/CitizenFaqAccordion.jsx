"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How do I report an issue in my neighborhood?",
    a: "Simply click 'Report an Issue' or use the quick form in the hero. Select the category (Road, Streetlight, Drainage, etc.), pinpoint your location with 1-click GPS, write a brief description, and attach a photo. Your report is immediately submitted to the responsible municipal department.",
  },
  {
    q: "What happens if someone else already reported the same pothole?",
    a: "CivicPulse features an automated 2dsphere proximity engine. If another report in the same category is submitted within 50 meters, the system flags it for the department manager to merge as a duplicate. You are automatically subscribed to the parent report so you receive repair progress updates without duplicate city crews being dispatched.",
  },
  {
    q: "Can I track repair progress without creating an account?",
    a: "Yes! Every report receives a unique tracking ID (e.g. #CP-2026-4821). You can paste this ID into the 'Track Report Status' search bar on the homepage at any time to see the live status, assigned crew, and official notes without logging in.",
  },
  {
    q: "How do municipal teams prove that the physical repair is actually finished?",
    a: "Field maintenance staff cannot mark a task as 'Resolved' on their console without uploading at least one mandatory high-resolution completion photo from the site. This photo proof is published to the public timeline for citizen inspection.",
  },
  {
    q: "How fast do municipal teams respond to reported issues?",
    a: "Incoming reports are triaged and prioritized: Critical safety hazards (e.g., exposed high-voltage cables, cave-ins) are dispatched within 12-24 hours. High-priority issues are resolved in under 48 hours. Our live department scorecard displays real-time on-time completion rates.",
  },
  {
    q: "Can I rate the repair quality once it's marked resolved?",
    a: "Yes. Once an issue enters 'Resolved' status, the original citizen reporter is prompted to submit a 1 to 5 star rating and comment on the workmanship. These ratings directly impact department SLA scores and supervisor audits.",
  },
];

export function CitizenFaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 border border-teal-200 text-[#0D9488] dark:bg-teal-950/60 dark:border-teal-800 mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Citizen Knowledge Base</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted">
          Everything you need to know about reporting, proximity deduplication, and repair verification.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={cn(
                "rounded-2xl border transition-all duration-200 overflow-hidden",
                isOpen
                  ? "bg-white dark:bg-slate-900 border-teal-500/80 shadow-md shadow-teal-500/5 ring-1 ring-teal-500/20"
                  : "bg-white/70 dark:bg-slate-900/60 border-border hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full py-4 px-5 sm:px-6 flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white select-none cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 shrink-0 text-muted transition-transform duration-200",
                    isOpen && "rotate-180 text-[#0D9488]"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CitizenFaqAccordion;
