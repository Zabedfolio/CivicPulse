"use client";

/**
 * PixelScroll, from https://motion-brew.com/components/pixel-scroll
 * Adapted for CivicPulse GovTech platform.
 */

import * as React from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = {
  linear: (t) => t,
  "ease-in": (t) => t * t * t,
  "ease-out": (t) => 1 - (1 - t) ** 3,
  "ease-in-out": (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  "expo-out": (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
};

/** Stable pseudo-random value per cell. */
const hash = (c, r) => {
  const x = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const frac = (v) => v - Math.floor(v);

/** Draw an image covering the box, like object-fit: cover. */
function cover(img, W, H) {
  const k = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const w = img.naturalWidth * k;
  const h = img.naturalHeight * k;
  return [(W - w) / 2, (H - h) / 2, w, h];
}

function useImage(src) {
  const [img, setImg] = React.useState(null);
  React.useEffect(() => {
    if (!src) return setImg(null);
    const i = new window.Image();
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);
  return img;
}

export const PixelScroll = React.forwardRef(function PixelScroll(
  {
    mode = "colors",
    from = "#F0FDFA", // Light CivicPulse surface teal
    to = "#0B132B",   // Deep municipal slate
    layerA,
    layerB,
    pixelSize = 16,
    gap = 1,
    endAt = 0.55,
    startAt = 0.0,
    direction = "center-out",
    pattern = "wave",
    intensity = 0.45,
    easing = "ease-in-out",
    accentShare = 0.3,
    accents = ["#14B8A6", "#06B6D4", "#F59E0B", "#22C55E"],
    length = 2.2,
    container,
    children,
    label = "City Infrastructure Transformation",
    className,
  },
  ref
) {
  const track = React.useRef(null);
  const stage = React.useRef(null);
  const canvas = React.useRef(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const reducedMotion = useReducedMotion();
  const imgA = useImage(mode === "layers" ? layerA : undefined);
  const imgB = useImage(mode === "layers" ? layerB : undefined);

  const { scrollYProgress } = useScroll({
    target: track,
    container,
    offset: ["start start", "end end"],
  });

  React.useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const grid = React.useMemo(() => {
    const step = Math.max(2, pixelSize + gap);
    const cols = Math.ceil(size.w / step) || 0;
    const rows = Math.ceil(size.h / step) || 0;
    const th = new Float32Array(cols * rows);
    const pick = new Float32Array(cols * rows);
    const cx = (cols - 1) / 2;
    const cy = (rows - 1) / 2;
    const maxD = Math.hypot(cx, cy) || 1;
    const k = Math.max(0, Math.min(1, intensity));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const d = Math.hypot(c - cx, r - cy) / maxD;
        const base =
          direction === "top-bottom"
            ? r / Math.max(1, rows - 1)
            : direction === "bottom-top"
            ? 1 - r / Math.max(1, rows - 1)
            : direction === "left-right"
            ? c / Math.max(1, cols - 1)
            : direction === "right-left"
            ? 1 - c / Math.max(1, cols - 1)
            : direction === "center-out"
            ? d
            : 1 - d;
        const h = hash(c, r);
        const pv =
          pattern === "random"
            ? h
            : pattern === "checker"
            ? ((c + r) % 2) * 0.7 + h * 0.3
            : pattern === "diagonal"
            ? frac((c + r) / 9) * 0.85 + h * 0.15
            : pattern === "wave"
            ? 0.5 + 0.42 * Math.sin(c * 0.45 + r * 0.18) + (h - 0.5) * 0.16
            : pattern === "spiral"
            ? frac(Math.atan2(r - cy, c - cx) / (Math.PI * 2) + 0.5 + d * 2.2) * 0.9 + h * 0.1
            : frac(d * 4) * 0.85 + h * 0.15;

        th[r * cols + c] = (1 - k) * base + k * pv;
        pick[r * cols + c] = hash(c + 91, r + 17);
      }
    }
    return { step, cols, rows, th, pick };
  }, [size, pixelSize, gap, direction, pattern, intensity]);

  const draw = React.useCallback(
    (raw) => {
      const c = canvas.current;
      if (!c || !size.w || !grid.cols) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (c.width !== Math.round(size.w * dpr)) {
        c.width = Math.round(size.w * dpr);
        c.height = Math.round(size.h * dpr);
      }
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = size.w;
      const H = size.h;

      const fillA = () => {
        if (mode === "layers" && imgA) ctx.drawImage(imgA, ...cover(imgA, W, H));
        else {
          ctx.fillStyle = from;
          ctx.fillRect(0, 0, W, H);
        }
      };

      const drawB = () => {
        if (mode === "layers" && imgB) ctx.drawImage(imgB, ...cover(imgB, W, H));
        else {
          ctx.fillStyle = to;
          ctx.fillRect(0, 0, W, H);
        }
      };

      // Respect prefers-reduced-motion: instantly show target state past halfway
      if (reducedMotion) {
        ctx.clearRect(0, 0, W, H);
        if (raw >= 0.5) drawB();
        else fillA();
        return;
      }

      // If scroll progress is at or past completion threshold, guarantee 100% full solid layer B
      if (raw >= endAt) {
        ctx.clearRect(0, 0, W, H);
        drawB();
        return;
      }

      // If scroll progress hasn't reached start threshold, guarantee initial layer A
      if (raw <= startAt) {
        ctx.clearRect(0, 0, W, H);
        fillA();
        return;
      }

      // Normalized transition progress between [startAt, endAt]
      const span = Math.max(0.01, endAt - startAt);
      const norm = Math.max(0, Math.min(1, (raw - startAt) / span));
      const t = EASE[easing || "ease-in-out"](norm);

      const band = 0.08;
      const p = t * (1 + band * 2.2) - band;
      const { step, cols, rows, th, pick } = grid;

      ctx.clearRect(0, 0, W, H);
      fillA();

      const settled = new Path2D();
      const moving = new Path2D();
      const accentCells = [];
      const inset = gap / 2;

      for (let r = 0; r < rows; r++) {
        for (let q = 0; q < cols; q++) {
          const i = r * cols + q;
          const lead = p - th[i];
          if (lead < -band) continue;
          const x = q * step;
          const y = r * step;
          if (lead >= band) {
            settled.rect(x, y, step, step);
          } else {
            const s = pick[i];
            if (s < accentShare && accents.length) {
              accentCells.push([
                x + inset,
                y + inset,
                accents[Math.floor((s / Math.max(0.0001, accentShare)) * accents.length) % accents.length],
              ]);
            } else {
              moving.rect(x + inset, y + inset, step - gap, step - gap);
            }
          }
        }
      }

      ctx.save();
      ctx.clip(settled);
      drawB();
      ctx.restore();

      ctx.save();
      ctx.clip(moving);
      drawB();
      ctx.restore();

      for (const [x, y, col] of accentCells) {
        ctx.fillStyle = col;
        ctx.fillRect(x, y, step - gap, step - gap);
      }
    },
    [size, grid, easing, endAt, startAt, mode, imgA, imgB, from, to, gap, accentShare, accents, reducedMotion]
  );

  useMotionValueEvent(scrollYProgress, "change", draw);
  React.useEffect(() => {
    draw(scrollYProgress.get());
  }, [draw, scrollYProgress]);

  const inContainer = !!container;

  return (
    <div
      ref={(el) => {
        track.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      className={cn("relative w-full", className)}
      style={{
        height: inContainer ? `${length * 100}%` : `${length * 100}vh`,
      }}
    >
      <div
        ref={stage}
        className="sticky top-0 w-full overflow-hidden flex items-center justify-center"
        style={{ height: inContainer ? `${100 / length}%` : "100vh" }}
        role={label ? "img" : undefined}
        aria-label={label}
      >
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
        {children && (
          <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
            <div className="w-full pointer-events-auto">
              {typeof children === "function" ? children({ scrollYProgress }) : children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default PixelScroll;
