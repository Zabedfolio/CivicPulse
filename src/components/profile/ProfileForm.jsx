"use client";

import React, { useState } from "react";
import { User, Phone, Mail, Shield, Building, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { profileSchema } from "@/validations/profile";
import { AvatarUploader } from "./AvatarUploader";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { authClient } from "@/lib/auth-client";

export function ProfileForm({ user, onProfileUpdated }) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarImage, setAvatarImage] = useState(user?.image || null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setServerError("");

    // Validate using Zod schema
    const result = profileSchema.safeParse({
      name,
      phone: phone.trim() ? phone.trim() : null,
      image: avatarImage,
    });

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Update via Better Auth client
      const updatePayload = {
        name: result.data.name,
      };
      if (result.data.image !== undefined) {
        updatePayload.image = result.data.image;
      }

      const res = await authClient.updateUser(updatePayload);

      if (res?.error) {
        throw new Error(res.error.message || "Failed to update profile");
      }

      // 2. Also sync custom phone field to backend if backend is reachable
      try {
        await fetch("http://localhost:5000/api/v1/users/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: result.data.name,
            phone: result.data.phone,
            image: result.data.image,
          }),
        });
      } catch (backendErr) {
        // Silently continue if backend is on different port during client dev
        console.warn("Backend profile sync notice:", backendErr);
      }

      setSuccessMessage("Profile information updated successfully!");
      onProfileUpdated?.({
        ...user,
        name: result.data.name,
        phone: result.data.phone,
        image: result.data.image,
      });

      // Clear success notification after 4 seconds
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setServerError(err.message || "An unexpected error occurred while saving profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const role = user?.role || "citizen";
  const roleDisplay = {
    citizen: { title: "Citizen Reporter", badge: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800" },
    staff: { title: "Field Operations Crew", badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
    manager: { title: "Department Triage Head", badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" },
    admin: { title: "Municipal Administrator", badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800" },
  }[role] || { title: role, badge: "bg-slate-100 text-slate-700 border-border" };

  return (
    <div className="space-y-6">
      {/* Avatar Uploader Section */}
      <AvatarUploader
        currentImage={avatarImage}
        name={name}
        onImageChange={(newImg) => setAvatarImage(newImg)}
      />

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
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
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Full Name Field */}
        <div>
          <label
            htmlFor="profile-name"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <User className="w-4 h-4" />
            </div>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahim Ahmed"
              className={`w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none ${
                errors.name
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-border focus:border-teal-500"
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
          )}
        </div>

        {/* Email Address (Read-only) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="profile-email"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Email Address
            </label>
            <span className="text-[11px] font-medium text-muted">Read-Only</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="profile-email"
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-[11px] text-muted">
            Official municipal ID tied to your verified citizen account.
          </p>
        </div>

        {/* Contact Phone Field */}
        <div>
          <label
            htmlFor="profile-phone"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Emergency Contact Phone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +880 1700-000000"
              className={`w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none ${
                errors.phone
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-border focus:border-teal-500"
              }`}
            />
          </div>
          {errors.phone ? (
            <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
          ) : (
            <p className="mt-1 text-[11px] text-muted">
              Used strictly for SMS progress notifications when a reported issue is resolved.
            </p>
          )}
        </div>

        {/* Municipal Role & Department Info Cards */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Municipal Role Tier
              </div>
              <div className="text-[11px] text-muted">{roleDisplay.title}</div>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${roleDisplay.badge}`}
          >
            {role}
          </span>
        </div>

        {user?.department && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Assigned Department
              </div>
              <div className="text-xs text-muted">{user.department}</div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <MagneticButton
            variant="primary"
            size="md"
            type="submit"
            disabled={isSubmitting}
            className="font-bold min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </MagneticButton>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;
