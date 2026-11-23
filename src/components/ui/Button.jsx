"use client";

import React from "react";
import { MagneticButton } from "./MagneticButton";

/**
 * CivicPulse Button (Powered by Motion Brew MagneticButton)
 * Backward compatible drop-in replacement with magnetic parallax & spotlight glow.
 */
export const Button = React.forwardRef(function Button(
  {
    children,
    className,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    onClick,
    type = "button",
    href,
    ...props
  },
  ref
) {
  // Map Button size to MagneticButton size
  const mappedSize = size === "lg" ? "lg" : size === "sm" ? "sm" : "md";
  const mappedVariant =
    variant === "secondary"
      ? "outline"
      : variant === "danger"
      ? "solid"
      : variant;

  return (
    <MagneticButton
      ref={ref}
      variant={mappedVariant}
      size={mappedSize}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      href={href}
      className={className}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </MagneticButton>
  );
});

export default Button;
