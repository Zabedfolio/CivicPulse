"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Camera, UploadCloud, X, Check, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function AvatarUploader({ currentImage, name, onImageChange }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert("Image file size must be under 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      onImageChange?.(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setPreview(customUrl.trim());
    onImageChange?.(customUrl.trim());
    setIsUrlModalOpen(false);
    setCustomUrl("");
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CP";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload profile avatar"
      />

      {/* Avatar Display */}
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-teal-500/40 shadow-md flex items-center justify-center bg-gradient-to-tr from-[#14B8A6] via-[#06B6D4] to-[#0D9488] text-white font-extrabold text-2xl select-none">
          {preview ? (
            <img
              src={preview}
              alt={name || "User Avatar"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* Camera overlay button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-teal-600 text-white shadow-md hover:bg-teal-700 transition-transform active:scale-95"
          title="Upload avatar photo"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Avatar Controls */}
      <div className="flex-1 text-center sm:text-left">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Profile Photo
        </h4>
        <p className="mt-1 text-xs text-muted max-w-sm">
          Recommended: square photo (PNG, JPG, WebP) under 4MB. Visual identity visible across municipal reports and dispatch logs.
        </p>

        <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-border hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Upload File
          </button>

          <button
            type="button"
            onClick={() => setIsUrlModalOpen(!isUrlModalOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-border hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            Use Image URL
          </button>

          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          )}
        </div>

        {/* Direct Image URL input */}
        {isUrlModalOpen && (
          <form onSubmit={handleApplyUrl} className="mt-3 flex gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white hover:bg-teal-700"
            >
              Apply
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AvatarUploader;
