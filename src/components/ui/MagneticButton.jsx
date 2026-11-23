"use client";

/**
 * MagneticButton, from https://motion-brew.com/components/magnetic-button
 * Adapted for CivicPulse GovTech platform.
 */

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_SPRING = {
  stiffness: 400,
  damping: 25,
  mass: 0.6,
};

const PRESS = { scale: 0.96 };
const HOVER = { scale: 1.02 };

const VARIANTS = {
  primary:
    "bg-[#0D9488] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.18)_inset,0_8px_20px_-6px_rgba(13,148,136,0.4)] hover:bg-[#0F766E] border border-teal-600/30",
  solid:
    "bg-zinc-900 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_8px_24px_-8px_rgba(0,0,0,0.5)] dark:bg-white dark:text-zinc-900",
  outline:
    "border border-zinc-300 bg-white/60 text-zinc-900 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100 hover:border-teal-500",
  ghost:
    "bg-transparent text-zinc-800 hover:bg-zinc-900/5 hover:text-[#0D9488] dark:text-zinc-200 dark:hover:bg-white/10",
};

const SIZES = {
  sm: "h-9 px-4 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export const MagneticButton = React.forwardRef(function MagneticButton(
  {
    children,
    className,
    variant = "primary",
    size = "md",
    strength = 0.3,
    labelStrength = 0.15,
    spring = DEFAULT_SPRING,
    spotlight = true,
    type = "button",
    href,
    target,
    rel,
    disabled = false,
    onClick,
    onPointerMove,
    onPointerLeave,
    ...props
  },
  ref
) {
  const reduceMotion = useReducedMotion();

  // Raw cursor offset from center, in px
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);

  // Cursor position inside the button, in px, for spotlight
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const glow = useSpring(0, { stiffness: 300, damping: 30 });

  const x = useSpring(
    useTransform(dx, (v) => v * strength),
    spring
  );
  const y = useSpring(
    useTransform(dy, (v) => v * strength),
    spring
  );
  const labelX = useSpring(
    useTransform(dx, (v) => v * labelStrength),
    spring
  );
  const labelY = useSpring(
    useTransform(dy, (v) => v * labelStrength),
    spring
  );

  const background = useMotionTemplate`radial-gradient(120px circle at ${px}px ${py}px, rgba(255,255,255,0.25), transparent 70%)`;

  const handlePointerMove = (event) => {
    onPointerMove?.(event);
    if (reduceMotion || disabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    dx.set(localX - rect.width / 2);
    dy.set(localY - rect.height / 2);
    px.set(localX);
    py.set(localY);
    glow.set(1);
  };

  const handlePointerLeave = (event) => {
    onPointerLeave?.(event);
    dx.set(0);
    dy.set(0);
    glow.set(0);
  };

  const sharedClassName = cn(
    "relative isolate inline-flex cursor-pointer select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    className
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className="inline-block">
        <motion.span
          ref={ref}
          style={reduceMotion ? undefined : { x, y }}
          whileHover={reduceMotion ? undefined : HOVER}
          whileTap={PRESS}
          transition={spring}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={sharedClassName}
          {...props}
        >
          {spotlight && !reduceMotion && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 mix-blend-soft-light"
              style={{ background, opacity: glow }}
            />
          )}
          <motion.span
            className="relative inline-flex items-center gap-2"
            style={reduceMotion ? undefined : { x: labelX, y: labelY }}
          >
            {children}
          </motion.span>
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={reduceMotion || disabled ? undefined : { x, y }}
      whileHover={reduceMotion || disabled ? undefined : HOVER}
      whileTap={disabled ? undefined : PRESS}
      transition={spring}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={sharedClassName}
      {...props}
    >
      {spotlight && !reduceMotion && !disabled && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 mix-blend-soft-light"
          style={{ background, opacity: glow }}
        />
      )}
      <motion.span
        className="relative inline-flex items-center gap-2"
        style={reduceMotion ? undefined : { x: labelX, y: labelY }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
});

export default MagneticButton;
