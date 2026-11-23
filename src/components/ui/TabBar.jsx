"use client";

/**
 * TabBar, from https://motion-brew.com/components/tab-bar
 * Adapted for CivicPulse GovTech platform.
 */

import * as React from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useAnimation, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Animated icon: chart-pie
const ChartPieIcon = (() => {
  const PATH_VARIANTS = {
    normal: { translateX: 0, translateY: 0 },
    animate: { translateX: 1.1, translateY: -1.1 },
  };

  const ChartPieIcon = forwardRef(function ChartPieIcon(
    { onMouseEnter, onMouseLeave, className, size, active, style, strokeWidth = 2, ...props },
    ref
  ) {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (isControlledRef.current) onMouseEnter?.(e);
        else controls.start("animate");
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (isControlledRef.current) onMouseLeave?.(e);
        else controls.start("normal");
      },
      [controls, onMouseLeave]
    );

    const wrap = useRef(null);
    const reduced = useReducedMotion();
    const [hosted, setHosted] = useState(false);

    useEffect(() => {
      const fake = {};
      if (reduced) {
        setHosted(true);
        return;
      }
      if (active !== undefined) {
        setHosted(true);
        (active ? handleMouseEnter : handleMouseLeave)(fake);
        return;
      }
      const host = wrap.current?.parentElement?.closest("button, a, [role=button], [role=tab]");
      setHosted(!!host);
      if (!host) return;
      const on = () => handleMouseEnter(fake);
      const off = () => handleMouseLeave(fake);
      host.addEventListener("pointerenter", on);
      host.addEventListener("pointerleave", off);
      return () => {
        host.removeEventListener("pointerenter", on);
        host.removeEventListener("pointerleave", off);
      };
    }, [active, reduced, handleMouseEnter, handleMouseLeave]);

    return (
      <span
        ref={wrap}
        className={cn("inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full", className)}
        style={size ? { width: size, height: size, ...style } : style}
        onMouseEnter={hosted ? undefined : handleMouseEnter}
        onMouseLeave={hosted ? undefined : handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={controls}
            d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 15,
              bounce: 0.6,
            }}
            variants={PATH_VARIANTS}
          />
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        </svg>
      </span>
    );
  });

  ChartPieIcon.displayName = "ChartPieIcon";
  return ChartPieIcon;
})();

// Animated icon: home
const HomeIcon = (() => {
  const DEFAULT_TRANSITION = {
    duration: 0.6,
    opacity: { duration: 0.2 },
  };

  const PATH_VARIANTS = {
    normal: { pathLength: 1, opacity: 1 },
    animate: { opacity: [0, 1], pathLength: [0, 1] },
  };

  const HomeIcon = forwardRef(function HomeIcon(
    { onMouseEnter, onMouseLeave, className, size, active, style, strokeWidth = 2, ...props },
    ref
  ) {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (isControlledRef.current) onMouseEnter?.(e);
        else controls.start("animate");
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (isControlledRef.current) onMouseLeave?.(e);
        else controls.start("normal");
      },
      [controls, onMouseLeave]
    );

    const wrap = useRef(null);
    const reduced = useReducedMotion();
    const [hosted, setHosted] = useState(false);

    useEffect(() => {
      const fake = {};
      if (reduced) {
        setHosted(true);
        return;
      }
      if (active !== undefined) {
        setHosted(true);
        (active ? handleMouseEnter : handleMouseLeave)(fake);
        return;
      }
      const host = wrap.current?.parentElement?.closest("button, a, [role=button], [role=tab]");
      setHosted(!!host);
      if (!host) return;
      const on = () => handleMouseEnter(fake);
      const off = () => handleMouseLeave(fake);
      host.addEventListener("pointerenter", on);
      host.addEventListener("pointerleave", off);
      return () => {
        host.removeEventListener("pointerenter", on);
        host.removeEventListener("pointerleave", off);
      };
    }, [active, reduced, handleMouseEnter, handleMouseLeave]);

    return (
      <span
        ref={wrap}
        className={cn("inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full", className)}
        style={size ? { width: size, height: size, ...style } : style}
        onMouseEnter={hosted ? undefined : handleMouseEnter}
        onMouseLeave={hosted ? undefined : handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <motion.path
            animate={controls}
            d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
            transition={DEFAULT_TRANSITION}
            variants={PATH_VARIANTS}
          />
        </svg>
      </span>
    );
  });

  HomeIcon.displayName = "HomeIcon";
  return HomeIcon;
})();

// Animated icon: compass (City Map)
const CompassIcon = (() => {
  const CompassIcon = forwardRef(function CompassIcon(
    { onMouseEnter, onMouseLeave, className, size, active, style, strokeWidth = 2, ...props },
    ref
  ) {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (isControlledRef.current) onMouseEnter?.(e);
        else controls.start("animate");
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (isControlledRef.current) onMouseLeave?.(e);
        else controls.start("normal");
      },
      [controls, onMouseLeave]
    );

    const wrap = useRef(null);
    const reduced = useReducedMotion();
    const [hosted, setHosted] = useState(false);

    useEffect(() => {
      const fake = {};
      if (reduced) {
        setHosted(true);
        return;
      }
      if (active !== undefined) {
        setHosted(true);
        (active ? handleMouseEnter : handleMouseLeave)(fake);
        return;
      }
      const host = wrap.current?.parentElement?.closest("button, a, [role=button], [role=tab]");
      setHosted(!!host);
      if (!host) return;
      const on = () => handleMouseEnter(fake);
      const off = () => handleMouseLeave(fake);
      host.addEventListener("pointerenter", on);
      host.addEventListener("pointerleave", off);
      return () => {
        host.removeEventListener("pointerenter", on);
        host.removeEventListener("pointerleave", off);
      };
    }, [active, reduced, handleMouseEnter, handleMouseLeave]);

    return (
      <span
        ref={wrap}
        className={cn("inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full", className)}
        style={size ? { width: size, height: size, ...style } : style}
        onMouseEnter={hosted ? undefined : handleMouseEnter}
        onMouseLeave={hosted ? undefined : handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <motion.polygon
            animate={controls}
            points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 15,
            }}
            variants={{
              normal: { rotate: 0 },
              animate: { rotate: 360 },
            }}
          />
        </svg>
      </span>
    );
  });

  CompassIcon.displayName = "CompassIcon";
  return CompassIcon;
})();

// Animated icon: message-circle (About / Info)
const MessageCircleIcon = (() => {
  const ICON_VARIANTS = {
    normal: { scale: 1, rotate: 0 },
    animate: {
      scale: 1.05,
      rotate: [0, -7, 7, 0],
      transition: {
        rotate: { duration: 0.5, ease: "easeInOut" },
        scale: { type: "spring", stiffness: 400, damping: 10 },
      },
    },
  };

  const MessageCircleIcon = forwardRef(function MessageCircleIcon(
    { onMouseEnter, onMouseLeave, className, size, active, style, strokeWidth = 2, ...props },
    ref
  ) {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (isControlledRef.current) onMouseEnter?.(e);
        else controls.start("animate");
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (isControlledRef.current) onMouseLeave?.(e);
        else controls.start("normal");
      },
      [controls, onMouseLeave]
    );

    const wrap = useRef(null);
    const reduced = useReducedMotion();
    const [hosted, setHosted] = useState(false);

    useEffect(() => {
      const fake = {};
      if (reduced) {
        setHosted(true);
        return;
      }
      if (active !== undefined) {
        setHosted(true);
        (active ? handleMouseEnter : handleMouseLeave)(fake);
        return;
      }
      const host = wrap.current?.parentElement?.closest("button, a, [role=button], [role=tab]");
      setHosted(!!host);
      if (!host) return;
      const on = () => handleMouseEnter(fake);
      const off = () => handleMouseLeave(fake);
      host.addEventListener("pointerenter", on);
      host.addEventListener("pointerleave", off);
      return () => {
        host.removeEventListener("pointerenter", on);
        host.removeEventListener("pointerleave", off);
      };
    }, [active, reduced, handleMouseEnter, handleMouseLeave]);

    return (
      <span
        ref={wrap}
        className={cn("inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full", className)}
        style={size ? { width: size, height: size, ...style } : style}
        onMouseEnter={hosted ? undefined : handleMouseEnter}
        onMouseLeave={hosted ? undefined : handleMouseLeave}
        {...props}
      >
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          variants={ICON_VARIANTS}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </motion.svg>
      </span>
    );
  });

  MessageCircleIcon.displayName = "MessageCircleIcon";
  return MessageCircleIcon;
})();

const ICONS = {
  home: HomeIcon,
  explore: CompassIcon,
  about: MessageCircleIcon,
  analytics: ChartPieIcon,
};

const DEFAULT_TABS = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  { id: "map", label: "City Map", icon: "explore", href: "/map" },
  { id: "about", label: "About", icon: "about", href: "/about" },
];

const GLIDE = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 500, damping: 34 };

export const TabBar = forwardRef(function TabBar(
  {
    tabs = DEFAULT_TABS,
    variant = "pill",
    value,
    defaultValue,
    onChange,
    className,
  },
  ref
) {
  const still = !!useReducedMotion();
  const uid = React.useId();
  const root = useRef(null);
  useImperativeHandle(ref, () => root.current);
  const seen = useInView(root, { once: true, amount: 0.4 });
  const shown = seen || still;

  const [own, setOwn] = useState(defaultValue ?? tabs[0]?.id ?? "");
  const current = value ?? own;
  const [playing, setPlaying] = useState(null);
  const [taps, setTaps] = useState({});
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = (id) => {
    setTaps((t) => ({ ...t, [id]: (t[id] ?? 0) + 1 }));
    setPlaying(id);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPlaying(null), 900);
    if (id === current) return;
    if (value === undefined) setOwn(id);
    onChange?.(id);
  };

  return (
    <motion.nav
      ref={root}
      aria-label="Main"
      initial={still ? false : { opacity: 0, y: -8 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, ease: GLIDE }}
      className={cn(
        "relative flex items-center rounded-full bg-slate-100/90 dark:bg-slate-800/80 p-1 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60",
        className
      )}
    >
      <LayoutGroup id={uid}>
        <div className="flex items-center gap-1">
          {tabs.map((t, i) => {
            const on = t.id === current;
            const Icon = ICONS[t.icon] || HomeIcon;
            const ripple = taps[t.id] ?? 0;

            return (
              <motion.button
                key={t.id}
                type="button"
                data-tab=""
                layout={!still ? "position" : false}
                aria-label={t.label}
                aria-current={on ? "page" : undefined}
                onClick={() => choose(t.id)}
                whileTap={still ? undefined : { scale: 0.92 }}
                transition={SPRING}
                className={cn(
                  "group relative flex cursor-pointer select-none items-center justify-center outline-none transition-colors",
                  "h-9 rounded-full px-3.5 gap-2",
                  on
                    ? "text-[#0D9488] font-bold dark:text-teal-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                {/* Active Pill Gliding Capsule */}
                {on && (
                  <motion.span
                    layoutId={`${uid}-pill`}
                    transition={still ? { duration: 0 } : SPRING}
                    className="absolute inset-0 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                  />
                )}

                {/* Soft Hover background */}
                {!on && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                )}

                {/* Animated Icon & Ripple */}
                <span className="relative grid place-items-center">
                  <AnimatePresence>
                    {!still && ripple > 0 && (
                      <motion.span
                        key={ripple}
                        aria-hidden
                        initial={{ scale: 0.4, opacity: 0.45 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: GLIDE }}
                        className="absolute size-6 rounded-full bg-teal-500/20"
                      />
                    )}
                  </AnimatePresence>

                  <span className={cn("relative grid transition-colors duration-200", on ? "text-[#0D9488]" : "")}>
                    <Icon
                      className="size-[17px]"
                      strokeWidth={on ? 2.25 : 2}
                      active={playing === t.id}
                    />
                  </span>
                </span>

                {/* Label text */}
                <span className="relative text-[13px] tracking-tight z-10 whitespace-nowrap">
                  {t.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </motion.nav>
  );
});

export default TabBar;
