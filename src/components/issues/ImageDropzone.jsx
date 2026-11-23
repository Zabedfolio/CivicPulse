"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageDropzone({ file, onFileChange, error }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState("");

  const handleProcessFile = (selectedFile) => {
    setLocalError("");

    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setLocalError("Only JPEG, PNG, or WebP images are allowed.");
      return;
    }

    if (selectedFile.size > MAX_SIZE_BYTES) {
      setLocalError(`Image file size must be less than ${MAX_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onFileChange(selectedFile);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleProcessFile(droppedFile);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          2. Photographic Proof Evidence
        </label>
        <span className="text-[11px] text-muted">Max {MAX_SIZE_MB}MB • JPG, PNG, WebP</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleProcessFile(e.target.files?.[0])}
        className="hidden"
        aria-label="Upload issue photo"
      />

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-border bg-slate-950 p-2 group">
          <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden">
            <img
              src={preview}
              alt="Reported hazard preview"
              className="w-full h-full object-cover"
            />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-md hover:bg-slate-100"
              >
                Replace Photo
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white shadow-md hover:bg-rose-700"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="p-3 flex items-center justify-between text-xs text-slate-300">
            <span className="truncate max-w-xs">{file?.name || "Uploaded photo proof"}</span>
            <span className="font-mono text-[11px] text-slate-400">
              {(file?.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200",
            isDragging
              ? "border-teal-500 bg-teal-50/50 dark:bg-teal-950/20"
              : "border-border hover:border-teal-400 bg-slate-50/50 dark:bg-slate-900/40"
          )}
        >
          <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-[#0D9488] mx-auto flex items-center justify-center mb-3.5 shadow-xs">
            <Camera className="w-7 h-7" />
          </div>

          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Upload photo of broken infrastructure
          </h4>
          <p className="mt-1 text-xs text-muted max-w-xs mx-auto">
            Drag and drop your camera photo here, or click to browse files.
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-slate-800 border border-border text-slate-700 dark:text-slate-300 shadow-xs">
            <UploadCloud className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Select from device</span>
          </div>
        </div>
      )}

      {(localError || error) && (
        <div className="mt-2 text-xs text-rose-500 flex items-center gap-1 font-semibold">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{localError || error}</span>
        </div>
      )}
    </div>
  );
}

export default ImageDropzone;
