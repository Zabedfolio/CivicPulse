"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * BlurText - Motion Brew Component
 *
 * Words (or letters) rise out of a blur one after another when the text
 * scrolls into view, settling sharp and in place.
 */
export const BlurText = React.forwardRef(function BlurText(
  {
    text = "Every word drifts out of the blur and settles into sharp focus",
    as: Tag = "p",
    by = "word",
    stagger = 0.08,
    duration = 0.7,
    blur = 12,
    direction = "up",
    delay = 0,
    trigger = "inView",
    className,
  },
  forwardedRef
) {
  const ref = React.useRef(null);
  React.useImperativeHandle(forwardedRef, () => ref.current);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const inView = trigger === "mount" || seen;
  const still = useReducedMotion();
  const pieces = by === "word" ? text.split(" ") : Array.from(text);
  const offset = direction === "up" ? "0.35em" : "-0.35em";

  return (
    <Tag
      ref={ref}
      aria-label={text}
      className={cn("text-balance inline-block", className)}
    >
      {pieces.map((piece, i) => (
        <React.Fragment key={i}>
          <motion.span
            aria-hidden
            className="inline-block whitespace-pre will-change-transform"
            initial={
              still ? false : { opacity: 0, y: offset, filter: `blur(${blur}px)` }
            }
            animate={
              inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
            }
            transition={{
              duration,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * stagger,
            }}
          >
            {piece}
          </motion.span>
          {by === "word" && i < pieces.length - 1 && " "}
        </React.Fragment>
      ))}
    </Tag>
  );
});

BlurText.displayName = "BlurText";
export default BlurText;
