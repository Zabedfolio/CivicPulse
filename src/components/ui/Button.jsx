"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CivicPulse Motion Brew Button
 * Adheres strictly to WCAG contrast: white text strictly on #0D9488 or darker
 */
const variants = {
  primary:
    "bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-sm shadow-teal-500/20 focus-visible:ring-[#0D9488]",
  secondary:
    "bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm shadow-cyan-500/20 focus-visible:ring-cyan-600",
  outline:
    "border border-slate-200 bg-white text-slate-800 hover:bg-teal-50 hover:border-teal-400 focus-visible:ring-teal-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-700",
  ghost:
    "text-slate-700 hover:bg-teal-50 hover:text-[#0D9488] focus-visible:ring-teal-500 dark:text-slate-300 dark:hover:bg-slate-800",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-500/20 focus-visible:ring-red-600",
};

const sizes = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
};

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        whileHover={disabled || isLoading ? undefined : { scale: 1.02 }}
        whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
