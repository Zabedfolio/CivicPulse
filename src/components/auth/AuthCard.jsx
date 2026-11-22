"use client";

/**
 * AuthCard, adapted from https://motion-brew.com/components/auth-card
 * Styled for CivicPulse GovTech platform with Better Auth integration.
 */

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";
import { signIn, signUp } from "@/lib/auth-client";

// Animated icon: arrow-right
const ArrowRightIcon = React.forwardRef(function ArrowRightIcon(
  { onMouseEnter, onMouseLeave, className, size = 16, active, style, strokeWidth = 2, ...props },
  ref
) {
  const controls = useAnimation();
  const isControlledRef = React.useRef(false);

  React.useImperativeHandle(ref, () => {
    isControlledRef.current = true;
    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    };
  });

  const handleMouseEnter = React.useCallback(
    (e) => {
      if (isControlledRef.current) {
        onMouseEnter?.(e);
      } else {
        controls.start("animate");
      }
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = React.useCallback(
    (e) => {
      if (isControlledRef.current) {
        onMouseLeave?.(e);
      } else {
        controls.start("normal");
      }
    },
    [controls, onMouseLeave]
  );

  const wrap = React.useRef(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    const fake = {};
    if (reduced) return;
    if (active !== undefined) {
      (active ? handleMouseEnter : handleMouseLeave)(fake);
      return;
    }
  }, [active, reduced, handleMouseEnter, handleMouseLeave]);

  return (
    <span
      ref={wrap}
      className={cn("inline-grid size-4 shrink-0 place-items-center align-middle", className)}
      style={size ? { width: size, height: size, ...style } : style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
      >
        <motion.path
          animate={controls}
          d="M5 12h14"
          variants={{
            normal: { d: "M5 12h14" },
            animate: { d: ["M5 12h14", "M5 12h9", "M5 12h14"], transition: { duration: 0.4 } },
          }}
        />
        <motion.path
          animate={controls}
          d="m12 5 7 7-7 7"
          variants={{
            normal: { d: "m12 5 7 7-7 7", translateX: 0 },
            animate: { d: "m12 5 7 7-7 7", translateX: [0, -3, 0], transition: { duration: 0.4 } },
          }}
        />
      </svg>
    </span>
  );
});

// Animated icon: at-sign
const AtSignIcon = React.forwardRef(function AtSignIcon(
  { onMouseEnter, onMouseLeave, className, size = 18, active, style, strokeWidth = 2, ...props },
  ref
) {
  const controls = useAnimation();
  return (
    <span
      ref={ref}
      className={cn("inline-grid size-5 shrink-0 place-items-center align-middle", className)}
      style={size ? { width: size, height: size, ...style } : style}
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
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
      </svg>
    </span>
  );
});

// Animated icon: lock-keyhole
const LockKeyholeIcon = React.forwardRef(function LockKeyholeIcon(
  { className, size = 18, active, style, strokeWidth = 2, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn("inline-grid size-5 shrink-0 place-items-center align-middle", className)}
      style={size ? { width: size, height: size, ...style } : style}
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
      >
        <circle cx="12" cy="16" r="1" />
        <rect height="12" rx="2" width="18" x="3" y="10" />
        <path d="M7 10V7a5 5 0 0 1 10 0v3" />
      </svg>
    </span>
  );
});

// Animated icon: user
const UserIcon = React.forwardRef(function UserIcon(
  { className, size = 18, active, style, strokeWidth = 2, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn("inline-grid size-5 shrink-0 place-items-center align-middle", className)}
      style={size ? { width: size, height: size, ...style } : style}
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
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    </span>
  );
});

// Animated icon: circle-check
const CircleCheckIcon = React.forwardRef(function CircleCheckIcon(
  { className, size = 18, active, style, strokeWidth = 2, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn("inline-grid size-5 shrink-0 place-items-center align-middle", className)}
      style={size ? { width: size, height: size, ...style } : style}
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
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </span>
  );
});

// Eye & EyeOff icons
const EyeIcon = ({ size = 18, className }) => (
  <svg
    className={cn("size-[18px]", className)}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
  >
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 18, className }) => (
  <svg
    className={cn("size-[18px]", className)}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
  >
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </svg>
);

const GLIDE = [0.22, 1, 0.36, 1];
const TEAL_BUTTON = "#0D9488";
const GOOD = "#22C55E";
const BAD = "#EF4444";

const COPY = {
  signin: {
    title: "Welcome back",
    sub: "Sign in to access your CivicPulse portal.",
    cta: "Sign In",
    busy: "Signing you in",
    done: "You're in",
    ask: "Don't have a citizen account?",
    flip: "Register",
  },
  signup: {
    title: "Create citizen account",
    sub: "Report public issues in less than a minute.",
    cta: "Create account",
    busy: "Setting things up",
    done: "Account ready",
    ask: "Already have an account?",
    flip: "Sign in",
  },
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function strength(pw) {
  if (!pw) return 0;
  let s = pw.length >= 8 ? 1 : 0;
  if (/\d/.test(pw)) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.max(1, s);
}

const LEVELS = [
  { label: "", color: "#242423" },
  { label: "Weak", color: BAD },
  { label: "Fair", color: "#F59E0B" },
  { label: "Good", color: "#14B8A6" },
  { label: "Strong", color: GOOD },
];

function Roll({ children, dir, className }) {
  const still = !!useReducedMotion();
  return (
    <span className={cn("relative inline-grid overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.span
          key={children}
          custom={dir}
          variants={{
            in: (d) => ({
              y: d > 0 ? "60%" : "-60%",
              opacity: 0,
              filter: "blur(4px)",
            }),
            on: { y: "0%", opacity: 1, filter: "blur(0px)" },
            out: (d) => ({
              y: d > 0 ? "-60%" : "60%",
              opacity: 0,
              filter: "blur(4px)",
            }),
          }}
          initial={still ? false : "in"}
          animate="on"
          exit={still ? undefined : "out"}
          transition={{ duration: 0.35, ease: GLIDE }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Reveal({ show, children, delay = 0 }) {
  const still = !!useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={
            still
              ? false
              : {
                  height: 0,
                  opacity: 0,
                  filter: "blur(4px)",
                  overflow: "hidden",
                }
          }
          animate={{
            height: "auto",
            opacity: 1,
            filter: "blur(0px)",
            transitionEnd: { overflow: "visible" },
            transition: {
              duration: still ? 0 : 0.42,
              ease: GLIDE,
              delay: still ? 0 : delay,
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            filter: "blur(4px)",
            overflow: "hidden",
            transition: { duration: still ? 0 : 0.3, ease: GLIDE },
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  icon: Icon,
  autoComplete,
  error,
  valid,
  shake,
  end,
}) {
  const still = !!useReducedMotion();
  const [focus, setFocus] = React.useState(false);
  const filled = value.trim().length > 0;
  const box = useAnimationControls();

  React.useEffect(() => {
    if (error && shake && !still)
      void box.start({
        x: [0, -7, 7, -5, 5, -2, 0],
        transition: { duration: 0.45 },
      });
  }, [shake, error, still, box]);

  return (
    <div className="pt-2.5">
      <label
        htmlFor={id}
        className="mb-1 block px-4 text-xs font-medium text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      <motion.div
        animate={box}
        className={cn(
          "relative flex h-12 items-center gap-2.5 rounded-full pl-4 pr-3.5 transition-[background-color,box-shadow] duration-300",
          focus
            ? "bg-white dark:bg-slate-800 shadow-[0_0_0_4px_rgba(20,184,166,0.15)] border-teal-500"
            : filled
              ? "bg-white dark:bg-slate-800 shadow-[0_0_0_1.5px_rgba(20,184,166,0.4)]"
              : "bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-800",
          error && "shadow-[0_0_0_2px_rgba(239,68,68,0.55)] border-red-500"
        )}
      >
        <span
          className={cn(
            "grid shrink-0 transition-colors duration-200",
            focus ? "text-[#0D9488]" : "text-slate-400"
          )}
        >
          <Icon className="size-[18px]" active={focus} />
        </span>
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
        />
        {valid && !error && (
          <span className="grid text-[#22C55E]">
            <CircleCheckIcon className="size-[18px]" />
          </span>
        )}
        {end}
      </motion.div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: still ? 0 : 0.25, ease: GLIDE }}
            className="overflow-hidden px-4 text-xs text-red-500 pt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AuthCard({
  defaultMode = "signin",
  mode: modeProp,
  onModeChange,
  className,
}) {
  const router = useRouter();
  const still = !!useReducedMotion();
  const id = React.useId();
  const root = React.useRef(null);
  const seen = useInView(root, { once: true, amount: 0.3 });

  const [own, setOwn] = React.useState(defaultMode);
  const mode = modeProp ?? own;
  const signup = mode === "signup";
  const dir = signup ? 1 : -1;
  const copy = COPY[mode];

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [shake, setShake] = React.useState(0);
  const [status, setStatus] = React.useState("idle");
  const [ctaHover, setCtaHover] = React.useState(false);
  const [turns, setTurns] = React.useState(0);

  const switchMode = () => {
    const next = signup ? "signin" : "signup";
    setOwn(next);
    onModeChange?.(next);
    setErrors({});
    setStatus("idle");
    setTurns((t) => t + 1);
  };

  const edit = (key, set) => (v) => {
    set(v);
    if (errors[key] || errors.form) {
      setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
    }
  };

  const level = strength(password);
  const emailOk = EMAIL.test(email.trim());

  const submit = async (e) => {
    e.preventDefault();
    if (status !== "idle") return;

    const next = {};
    if (signup && !name.trim()) next.name = "Please enter your full name.";
    if (!emailOk) next.email = email ? "Please enter a valid email." : "Email is required.";
    if (!password) next.password = "Password is required.";
    else if (signup && password.length < 8) next.password = "Password must be at least 8 characters.";

    if (Object.keys(next).length) {
      setErrors(next);
      setShake((n) => n + 1);
      return;
    }

    setStatus("busy");

    try {
      if (signup) {
        const { error } = await signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          role: "citizen",
          callbackURL: "/dashboard",
        });
        if (error) throw new Error(error.message || "Failed to create account.");
      } else {
        const { error } = await signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/dashboard",
        });
        if (error) throw new Error(error.message || "Invalid credentials.");
      }

      setStatus("done");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    } catch (err) {
      setStatus("idle");
      setErrors({ form: err.message || "Authentication failed." });
      setShake((n) => n + 1);
    }
  };

  return (
    <motion.div
      ref={root}
      initial={still ? false : { opacity: 0, y: 16 }}
      animate={seen || still ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: GLIDE }}
      className={cn(
        "w-[400px] max-w-full rounded-[32px] bg-white dark:bg-slate-900 p-8 text-slate-800 dark:text-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_16px_40px_-16px_rgba(20,184,166,0.15)] border border-border dark:border-slate-800",
        className
      )}
    >
      {/* Header with logo.png (No yellow dot) */}
      <div className="flex flex-col items-center text-center">
        <motion.div
          animate={{ rotate: turns * 360 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative grid size-14 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 shadow-sm"
        >
          <Image
            src="/logo.png"
            alt="CivicPulse Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain rounded-xl"
            priority
          />
        </motion.div>

        <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          <Roll dir={dir}>{copy.title}</Roll>
        </h3>
        <p className="mt-1 text-xs text-muted">
          <Roll dir={dir}>{copy.sub}</Roll>
        </p>
      </div>

      {/* Form */}
      <form noValidate onSubmit={submit} className="mt-5 space-y-1">
        <Reveal show={signup}>
          <Field
            id={`${id}-name`}
            label="Full Name"
            type="text"
            value={name}
            onChange={edit("name", setName)}
            icon={UserIcon}
            autoComplete="name"
            error={errors.name}
            valid={name.trim().length > 1}
            shake={shake}
          />
        </Reveal>

        <Field
          id={`${id}-email`}
          label="Email Address"
          type="email"
          value={email}
          onChange={edit("email", setEmail)}
          icon={AtSignIcon}
          autoComplete="email"
          error={errors.email}
          valid={emailOk}
          shake={shake}
        />

        <Field
          id={`${id}-password`}
          label="Password"
          type={show ? "text" : "password"}
          value={password}
          onChange={edit("password", setPassword)}
          icon={LockKeyholeIcon}
          autoComplete={signup ? "new-password" : "current-password"}
          error={errors.password}
          shake={shake}
          end={
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="-mr-1.5 grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          }
        />

        {/* Password Strength Gauge (Signup only) */}
        <Reveal show={signup} delay={0.08}>
          <div className="flex items-center gap-3 px-4 pt-2">
            <div className="flex flex-1 gap-1">
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                >
                  <motion.span
                    className="block h-full origin-left rounded-full"
                    animate={{
                      scaleX: level >= n ? 1 : 0,
                      backgroundColor: LEVELS[level]?.color,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 26,
                      delay: still ? 0 : (n - 1) * 0.04,
                    }}
                  />
                </span>
              ))}
            </div>
            <span
              className="w-16 text-right text-[11px] font-semibold"
              style={{ color: LEVELS[level]?.color }}
            >
              {level ? LEVELS[level]?.label : "8+ chars"}
            </span>
          </div>
        </Reveal>

        {/* Global form error message */}
        <AnimatePresence initial={false}>
          {errors.form && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-4 text-xs text-red-500 pt-2"
            >
              {errors.form}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          onPointerEnter={() => setCtaHover(true)}
          onPointerLeave={() => setCtaHover(false)}
          whileTap={still || status !== "idle" ? undefined : { scale: 0.98 }}
          animate={{ backgroundColor: status === "done" ? GOOD : TEAL_BUTTON }}
          transition={{ duration: 0.3 }}
          className="relative mt-6 flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white shadow-sm shadow-teal-500/20 outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={status}
              initial={still ? false : { y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={still ? undefined : { y: -14, opacity: 0 }}
              transition={{ duration: 0.25, ease: GLIDE }}
              className="flex items-center gap-2"
            >
              {status === "idle" && (
                <>
                  <Roll dir={dir}>{copy.cta}</Roll>
                  <ArrowRightIcon className="size-4" active={ctaHover} />
                </>
              )}
              {status === "busy" && <span>{copy.busy}...</span>}
              {status === "done" && (
                <>
                  <CircleCheckIcon className="size-4" />
                  <span>{copy.done}</span>
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </form>

      {/* Switch modes */}
      <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Roll dir={dir}>{copy.ask}</Roll>
        <button
          type="button"
          onClick={switchMode}
          className="cursor-pointer font-bold text-[#0D9488] hover:underline outline-none"
        >
          <Roll dir={dir}>{copy.flip}</Roll>
        </button>
      </p>
    </motion.div>
  );
}

export default AuthCard;
