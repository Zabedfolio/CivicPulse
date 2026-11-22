"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { loginSchema } from "@/validations/auth";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (error) {
        setServerError(error.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      // Successful sign-in
      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      setServerError(err?.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {serverError && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-300 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Email input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Email Address
        </label>
        <div className="relative rounded-xl shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <Mail className="h-5 w-5" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={isLoading}
            className={`block w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-colors ${
              errors.email
                ? "border-red-300 dark:border-red-800 focus:ring-red-500"
                : "border-border dark:border-slate-700"
            }`}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Password input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          <a
            href="#"
            className="text-xs font-medium text-[#0D9488] hover:underline"
            onClick={(e) => {
              e.preventDefault();
              alert("Password reset is managed by municipal administrators in demo mode.");
            }}
          >
            Forgot password?
          </a>
        </div>
        <div className="relative rounded-xl shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading}
            className={`block w-full pl-11 pr-11 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-colors ${
              errors.password
                ? "border-red-300 dark:border-red-800 focus:ring-red-500"
                : "border-border dark:border-slate-700"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
        )}
      </div>

      {/* Remember me toggle */}
      <div className="flex items-center">
        <input
          id="rememberMe"
          name="rememberMe"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={handleChange}
          className="h-4 w-4 rounded border-border text-[#0D9488] focus:ring-[#0D9488] dark:bg-slate-800"
        />
        <label
          htmlFor="rememberMe"
          className="ml-2 block text-xs text-slate-600 dark:text-slate-400 select-none"
        >
          Keep me signed in on this device
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full text-base font-semibold"
      >
        Sign In to CivicPulse
      </Button>

      {/* Switch to Register */}
      <p className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2">
        Don&apos;t have a citizen account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#0D9488] hover:underline"
        >
          Register as Citizen
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
