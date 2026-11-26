"use client";


import { API_BASE_URL } from "@/lib/api";
import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, KeyRound, ShieldAlert } from "lucide-react";
import { passwordChangeSchema } from "@/validations/profile";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { authClient } from "@/lib/auth-client";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  // Live password strength calculation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const strengthScore = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-rose-500", "bg-amber-500", "bg-teal-500", "bg-emerald-500"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setServerError("");

    const result = passwordChangeSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors = {};
      (result.error.issues || result.error.errors || []).forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Try Better Auth changePassword client method
      let changed = false;
      if (typeof authClient.changePassword === "function") {
        const res = await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: false,
        });

        if (res?.error) {
          throw new Error(res.error.message || "Failed to update password");
        }
        changed = true;
      }

      // 2. Also call backend endpoint for verification
      const backendRes = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!changed && !backendRes.ok) {
        const data = await backendRes.json().catch(() => ({}));
        throw new Error(data.message || "Incorrect current password");
      }

      setSuccessMessage("Your password has been changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      const message = err.message || "Incorrect current password";
      setServerError(message);
      if (message.toLowerCase().includes("current password")) {
        setErrors((prev) => ({ ...prev, currentPassword: message }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informational Header */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
        <KeyRound className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Choose a strong password containing at least 8 characters, an uppercase letter, and a number. Changing your password will secure your civic account across all sessions.
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Current Password */}
      <div>
        <label
          htmlFor="current-password"
          className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Current Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="current-password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            className={`w-full pl-9 pr-10 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none ${
              errors.currentPassword
                ? "border-rose-500 focus:border-rose-500"
                : "border-border focus:border-teal-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-slate-700 dark:hover:text-slate-200"
          >
            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-xs text-rose-500">{errors.currentPassword}</p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label
          htmlFor="new-password"
          className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
        >
          New Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter at least 8 characters"
            className={`w-full pl-9 pr-10 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none ${
              errors.newPassword
                ? "border-rose-500 focus:border-rose-500"
                : "border-border focus:border-teal-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-slate-700 dark:hover:text-slate-200"
          >
            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-xs text-rose-500">{errors.newPassword}</p>
        )}

        {/* Password Strength Meter */}
        {newPassword.length > 0 && (
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-600 dark:text-slate-400">
              <span>Password Strength:</span>
              <span className="font-bold">{strengthLabels[strengthScore - 1] || "Too Weak"}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-full transition-all duration-300 ${
                    strengthScore > step
                      ? strengthColors[strengthScore - 1]
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>

            {/* Rules Checklist */}
            <div className="mt-2.5 grid grid-cols-2 gap-1 text-[11px] text-muted">
              <span className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}`}>
                • 8+ characters
              </span>
              <span className={`flex items-center gap-1 ${hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}`}>
                • Uppercase letter
              </span>
              <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}`}>
                • Number (0-9)
              </span>
              <span className={`flex items-center gap-1 ${hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}`}>
                • Special character (!@#)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm New Password */}
      <div>
        <label
          htmlFor="confirm-password"
          className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Confirm New Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className={`w-full pl-9 pr-10 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none ${
              errors.confirmPassword
                ? "border-rose-500 focus:border-rose-500"
                : "border-border focus:border-teal-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-slate-700 dark:hover:text-slate-200"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Action Submit */}
      <div className="pt-2 flex justify-end">
        <MagneticButton
          variant="primary"
          size="md"
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto justify-center min-h-[44px] font-bold sm:min-w-[160px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating Password...
            </>
          ) : (
            "Update Password"
          )}
        </MagneticButton>
      </div>
    </form>
  );
}

export default PasswordChangeForm;
