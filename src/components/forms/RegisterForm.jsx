"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { registerSchema } from "@/validations/auth";
import { Button } from "@/components/ui/Button";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validation = registerSchema.safeParse(formData);
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
      const { data, error } = await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        role: "citizen", // Enforce citizen role
        callbackURL: "/dashboard",
      });

      if (error) {
        setServerError(error.message || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch (err) {
      setServerError(err?.message || "An unexpected error occurred during registration.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8 space-y-4 animate-in fade-in">
        <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-[#0D9488] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-[#0D9488]" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Account Created!</h3>
        <p className="text-sm text-muted">Welcome to CivicPulse. Redirecting to your citizen dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {serverError && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-300 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Full Name
        </label>
        <div className="relative rounded-xl shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <User className="h-5 w-5" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Citizen"
            disabled={isLoading}
            className={`block w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-colors ${
              errors.name
                ? "border-red-300 dark:border-red-800 focus:ring-red-500"
                : "border-border dark:border-slate-700"
            }`}
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
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
            placeholder="john@example.com"
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

      {/* Phone Number (Optional) */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Phone Number <span className="text-xs text-muted font-normal">(Optional)</span>
        </label>
        <div className="relative rounded-xl shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <Phone className="h-5 w-5" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+880 1712 345678"
            disabled={isLoading}
            className={`block w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-colors ${
              errors.phone
                ? "border-red-300 dark:border-red-800 focus:ring-red-500"
                : "border-border dark:border-slate-700"
            }`}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Password
        </label>
        <div className="relative rounded-xl shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
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

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Confirm Password
        </label>
        <div className="relative rounded-xl shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            disabled={isLoading}
            className={`block w-full pl-11 pr-11 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-colors ${
              errors.confirmPassword
                ? "border-red-300 dark:border-red-800 focus:ring-red-500"
                : "border-border dark:border-slate-700"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Toggle password visibility"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full text-base font-semibold mt-2"
      >
        Create Citizen Account
      </Button>

      {/* Switch to Login */}
      <p className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[#0D9488] hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
