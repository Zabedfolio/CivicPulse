"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  PhoneCall,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  Droplets,
  HeartHandshake,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const CITIZEN_LINKS = [
  { label: "Report Public Issue", href: "/issues/new" },
  { label: "City Map & Live Incidents", href: "/map" },
  { label: "Track Issue by Ticket ID", href: "/#track" },
  { label: "Before & After Verified Repairs", href: "/#showcase" },
  { label: "Department SLA Scorecards", href: "/#scorecard" },
  { label: "Citizen Service Charter", href: "/about" },
];

const MUNICIPAL_PORTALS = [
  { label: "Citizen Portal", href: "/dashboard" },
  { label: "Field Staff Work Orders", href: "/my-tasks" },
  { label: "Department Triage Console", href: "/department-dashboard" },
  { label: "City Admin Control Center", href: "/admin-dashboard" },
  { label: "Public Works Audit Trail", href: "/#feed" },
  { label: "Municipal API Access", href: "/about" },
];

const EMERGENCY_HOTLINES = [
  {
    name: "National Emergency",
    number: "999",
    desc: "Police, Fire, Ambulance",
    icon: PhoneCall,
    color: "text-red-500",
  },
  {
    name: "Electric Hazard / Wire Fall",
    number: "16116",
    desc: "DESCO / DPDC 24h Triage",
    icon: Zap,
    color: "text-amber-500",
  },
  {
    name: "Water Main Burst / Drainage",
    number: "16162",
    desc: "WASA Emergency Operations",
    icon: Droplets,
    color: "text-cyan-500",
  },
  {
    name: "Gas Leak & Pipeline Hazard",
    number: "16496",
    desc: "Titas Gas Urgent Response",
    icon: Flame,
    color: "text-orange-500",
  },
];

export function Footer() {
  const pathname = usePathname();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  // Hide footer inside dense internal role dashboards (which use full-height app sidebars)
  const isDashboardRoute =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/my-reports") ||
    pathname?.startsWith("/admin-dashboard") ||
    pathname?.startsWith("/department-dashboard") ||
    pathname?.startsWith("/my-tasks") ||
    pathname?.startsWith("/unauthorized") ||
    pathname?.startsWith("/issues");

  if (isDashboardRoute) {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
  };

  return (
    <footer className="relative bg-slate-950 text-slate-300 border-t border-slate-800 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute left-1/4 -top-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-10 -bottom-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                  <Image
                    src="/logo.png"
                    alt="CivicPulse Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain rounded-xl"
                  />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Civic<span className="text-[#0D9488]">Pulse</span>
                </span>
              </Link>

              <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
                Next-generation GovTech smart city infrastructure platform connecting citizens, municipal field engineering crews, and city leadership to report, triage, and verify public repairs transparently.
              </p>

              {/* Live Operational Beacon */}
              <div className="mt-6 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>41 City Wards Operational • 24/7 Dispatch</span>
              </div>
            </div>

            {/* Municipal Security Trust Seal */}
            <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
              <span>Immutable cryptographic audit logs &amp; GPS-verified completion proofs.</span>
            </div>
          </div>

          {/* Column 2: Citizen Services (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Citizen Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CITIZEN_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Municipal Portals (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Municipal Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              {MUNICIPAL_PORTALS.map((portal) => (
                <li key={portal.label}>
                  <Link
                    href={portal.href}
                    className="text-slate-400 hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{portal.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Emergency Hotlines & Subscription (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Immediate Life-Safety Hotlines</span>
            </h4>

            {/* Hotline Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              {EMERGENCY_HOTLINES.map((hotline) => {
                const Icon = hotline.icon;
                return (
                  <div
                    key={hotline.number}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">
                        {hotline.name}
                      </span>
                      <Icon className={`w-3.5 h-3.5 ${hotline.color}`} />
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="font-mono text-base font-extrabold text-white">
                        {hotline.number}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Toll-Free</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ward Infrastructure Alerts Newsletter */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800">
              <h5 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>Ward Infrastructure Bulletins</span>
              </h5>
              <p className="text-xs text-slate-400 mb-3">
                Receive weekly municipal roadwork advisories and completed repair reports for your ward.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-950/60 border border-teal-800/80 text-teal-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Subscribed! You will receive ward-level advisories.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter citizen email..."
                    required
                    className="flex-1 min-w-0 min-h-[42px] px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <MagneticButton
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto justify-center min-h-[42px] px-4 text-xs font-bold shrink-0"
                    type="submit"
                  >
                    Subscribe
                  </MagneticButton>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Accessibility */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <p>
              © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">CivicPulse</span>. Smarter Cities, Faster Fixes. GovTech Infrastructure Platform.
            </p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />
              <span>Chittagong &amp; Dhaka Smart City Divisions</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              WCAG 2.2 AA
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
