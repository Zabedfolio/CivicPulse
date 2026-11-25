"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

/**
 * Animated spring counter for numerical KPI metrics.
 */
function AnimatedCounter({ value, decimals = 0, suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const numericTarget = Number(value) || 0;

  useEffect(() => {
    let frameId;
    const duration = 650;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(numericTarget * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [numericTarget]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}

/**
 * KpiMetricCard
 * Spotlight-style executive metric card with subtle cursor-follow glow and animated counter.
 */
export function KpiMetricCard({
  title,
  value,
  decimals = 0,
  suffix = "",
  subtitle,
  icon: Icon,
  accentClass = "text-[#0D9488]",
  badgeBgClass = "bg-teal-50 dark:bg-teal-950/60 border-teal-200/60 dark:border-teal-800/60",
  badgeText = null,
  delay = 0,
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos((prev) => ({ ...prev, active: false }))}
      className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow"
    >
      {/* Subtle spotlight hover layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: mousePos.active ? 1 : 0,
          background: `radial-gradient(240px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.08), transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider">
            {title}
          </p>
          <div className={`text-2xl sm:text-3xl font-extrabold mt-1.5 tracking-tight ${accentClass}`}>
            <AnimatedCounter value={value} decimals={decimals} suffix={suffix} />
          </div>
        </div>

        {Icon && (
          <div
            className={`size-10 rounded-xl border flex items-center justify-center shrink-0 ${badgeBgClass}`}
          >
            <Icon className={`size-5 ${accentClass}`} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-muted truncate">{subtitle}</p>
        {badgeText && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
            {badgeText}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default KpiMetricCard;
