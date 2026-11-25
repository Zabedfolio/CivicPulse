"use client";


import { API_BASE_URL } from "@/lib/api";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  X,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/**
 * CompletionProofModal (Motion Brew DialogSpring + FileDropzoneAnimated)
 * Upload resolution photo proof and optionally mark work order completed
 */
export function CompletionProofModal({
  isOpen,
  task,
  onClose,
  onProofUploaded,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [markAsCompleted, setMarkAsCompleted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setMarkAsCompleted(true);
    setError("");
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit.");
      return;
    }

    setError("");
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select or capture a completion proof photo.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 1. Upload photo to Cloudinary
      const formData = new FormData();
      formData.append("image", selectedFile);

      const uploadRes = await fetch(
        `${API_BASE_URL}/tasks/${task._id}/completion-photos`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadJson.message || "Failed to upload resolution proof.");
      }

      let updatedTask = task;

      // 2. If markAsCompleted is checked, trigger status transition
      if (markAsCompleted) {
        const statusRes = await fetch(
          `${API_BASE_URL}/tasks/${task._id}/status`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              status: "Completed",
              note: "Repairs finalized with photographic proof",
            }),
          }
        );

        const statusJson = await statusRes.json();
        if (!statusRes.ok) {
          throw new Error(statusJson.message || "Failed to transition task to Completed.");
        }
        updatedTask = statusJson.data?.task || updatedTask;
      }

      onProofUploaded?.(updatedTask, uploadJson.data?.latestPhoto);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit resolution proof.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 32,
            mass: 0.9,
          }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-2xl z-10 max-h-[92dvh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Camera className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Upload Resolution Photo Proof
                </h2>
                <p className="text-xs text-muted mt-0.5 line-clamp-1">
                  Required photographic evidence for: {task.title}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Dropzone / Preview Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Photographic Proof of Completed Repair
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-300 dark:border-emerald-800 aspect-video bg-slate-900 flex items-center justify-center group">
                  <img
                    src={previewUrl}
                    alt="Completion preview"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-900 text-xs font-bold shadow-md hover:bg-white"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                    <UploadCloud className="size-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Tap to capture or upload repair photo
                    </span>
                    <span className="text-[11px] text-muted block mt-0.5">
                      JPEG, PNG or WebP up to 5MB (stored on Cloudinary)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Mark completed checkbox */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={markAsCompleted}
                onChange={(e) => setMarkAsCompleted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 size-4"
              />
              <div className="text-xs leading-tight">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Mark Work Order as Completed &amp; Resolve Issue
                </span>
                <span className="text-muted text-[11px] block mt-0.5">
                  Synchronously resolves ticket, records timestamp, and publishes proof to the citizen.
                </span>
              </div>
            </label>

            {/* Footer controls */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-muted hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <MagneticButton
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSubmitting || !selectedFile}
                className="!bg-emerald-600 hover:!bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 px-5 py-2.5 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Uploading Proof...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    <span>{markAsCompleted ? "Submit Proof & Resolve" : "Upload Photo Only"}</span>
                  </>
                )}
              </MagneticButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CompletionProofModal;
