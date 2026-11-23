"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategorySelector } from "./CategorySelector";
import { ImageDropzone } from "./ImageDropzone";
import { LocationInput } from "./LocationInput";
import { issueReportSchema } from "@/validations/issue";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  FileText,
  AlertOctagon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

export function IssueReportForm() {
  const router = useRouter();

  // Form State
  const [category, setCategory] = useState("Road Damage");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(22.3384);
  const [longitude, setLongitude] = useState(91.8317);
  const [imageFile, setImageFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submittedIssue, setSubmittedIssue] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const payload = {
      title,
      description,
      category,
      priority,
      address,
      latitude,
      longitude,
    };

    // Client-side validation using Zod
    const result = issueReportSchema.safeParse(payload);
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
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("priority", priority);
      formData.append("address", address);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Post to backend API
      const res = await fetch("http://localhost:5000/api/v1/issues", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit public issue report");
      }

      setSubmittedIssue(data.data?.issue || { _id: `temp_${Date.now()}`, title, category, address });
    } catch (err) {
      setServerError(
        err.message || "Network error. Please ensure the municipal dispatch backend is reachable."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setCategory("Road Damage");
    setPriority("medium");
    setAddress("");
    setLatitude(22.3384);
    setLongitude(91.8317);
    setImageFile(null);
    setSubmittedIssue(null);
    setErrors({});
    setServerError("");
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedIssue) {
    const ticketId = `CP-2026-${submittedIssue._id.toString().slice(-4).toUpperCase()}`;

    return (
      <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-teal-200 dark:border-teal-900 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-5 shadow-lg">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Report Confirmed &amp; Logged
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Issue Successfully Dispatched!
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted max-w-md mx-auto">
          Your public works ticket has been registered in the municipal audit ledger. Field engineering crews have been notified.
        </p>

        {/* Ticket Details Card */}
        <div className="my-8 max-w-md mx-auto p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-border text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs text-muted font-medium">Tracking Ticket ID</span>
            <span className="font-mono text-base font-extrabold text-teal-600 dark:text-teal-400">
              {ticketId}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Category</span>
            <span className="font-bold text-slate-900 dark:text-white">{submittedIssue.category}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Status</span>
            <span className="font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Submitted (Triaging)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-muted">SLA Target Resolution</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              &lt; 48 Hours
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/dashboard">
            <MagneticButton variant="primary" size="md" className="font-bold">
              <span>Track on Citizen Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </MagneticButton>
          </Link>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold text-muted hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  // STANDARD FORM VIEW
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Server Error Alert */}
      {serverError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* 1. Category Selector */}
      <CategorySelector
        selected={category}
        onSelect={(cat) => setCategory(cat)}
        error={errors.category}
      />

      {/* 2. Photo Dropzone */}
      <ImageDropzone
        file={imageFile}
        onFileChange={(file) => setImageFile(file)}
        error={errors.image}
      />

      {/* 3. Location Input */}
      <LocationInput
        address={address}
        onAddressChange={(val) => setAddress(val)}
        latitude={latitude}
        longitude={longitude}
        onCoordinatesChange={(lat, lng) => {
          setLatitude(lat);
          setLongitude(lng);
        }}
        errors={errors}
      />

      {/* 4. Incident Details */}
      <div className="space-y-4">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          4. Issue Details &amp; Severity <span className="text-rose-500">*</span>
        </label>

        {/* Title */}
        <div>
          <label htmlFor="issue-title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Short Headline / Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="issue-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 45cm Deep Pothole Blocking Traffic"
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none ${
              errors.title
                ? "border-rose-500 focus:border-rose-500"
                : "border-border focus:border-teal-500"
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="issue-desc" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="issue-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context on when the damage appeared, how severe the obstruction is, and any nearby landmarks..."
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors focus:outline-none ${
              errors.description
                ? "border-rose-500 focus:border-rose-500"
                : "border-border focus:border-teal-500"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.description}</p>
          )}
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Priority Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "low", label: "Low", desc: "Minor wear" },
              { id: "medium", label: "Medium", desc: "Standard repair" },
              { id: "high", label: "High", desc: "Major disruption" },
              { id: "critical", label: "Critical", desc: "Life hazard" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  priority === p.id
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 ring-1 ring-teal-500 font-bold"
                    : "border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-muted"
                }`}
              >
                <div className="text-xs text-slate-900 dark:text-white font-bold">{p.label}</div>
                <div className="text-[10px] text-muted">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex items-center justify-between border-t border-border">
        <Link
          href="/"
          className="text-xs font-semibold text-muted hover:text-slate-900 dark:hover:text-white"
        >
          Cancel
        </Link>

        <MagneticButton
          variant="primary"
          size="lg"
          type="submit"
          disabled={isSubmitting}
          className="font-bold min-w-[180px] shadow-lg shadow-teal-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting Report...
            </>
          ) : (
            <>
              <span>Dispatch Issue Report</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </>
          )}
        </MagneticButton>
      </div>
    </form>
  );
}

export default IssueReportForm;
