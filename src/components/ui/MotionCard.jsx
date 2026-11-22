"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * MotionCard - Motion Brew Interactive Hover Card
 *
 * Provides spring elevation, subtle tilt, glowing borders, and smooth scaling.
 */
export const MotionCard = React.forwardRef(function MotionCard(
  {
    children,
    className,
    glowColor = "rgba(20, 184, 166, 0.15)",
    borderColor,
    onClick,
    ...props
  },
  ref
) {
  const still = useReducedMotion();
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      whileHover={
        still
          ? undefined
          : {
              y: -4,
              scale: 1.01,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }
      }
      whileTap={
        still || !onClick
          ? undefined
          : {
              scale: 0.98,
              transition: { type: "spring", stiffness: 500, damping: 25 },
            }
      }
      className={cn(
        "relative rounded-3xl bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-6 transition-all duration-300",
        hovered
          ? "shadow-[0_12px_32px_-12px_rgba(20,184,166,0.18)] dark:shadow-[0_12px_32px_-12px_rgba(45,212,191,0.12)] border-teal-200 dark:border-teal-800/80"
          : "shadow-xs",
        onClick && "cursor-pointer select-none",
        className
      )}
      style={{
        borderColor: hovered && borderColor ? borderColor : undefined,
      }}
      {...props}
    >
      {/* Subtle ambient glow mesh behind card on hover */}
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] blur-xl opacity-60 transition-opacity duration-300"
          style={{ background: glowColor }}
        />
      )}
      {children}
    </motion.div>
  );
});

MotionCard.displayName = "MotionCard";
export default MotionCard;
