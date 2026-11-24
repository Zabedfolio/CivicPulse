"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Tag,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const STANDARD_CATEGORIES = [
  "Road Damage",
  "Streetlight",
  "Drainage",
  "Footpath",
  "Waste Management",
  "Public Infrastructure",
];

/**
 * DepartmentModal (Motion Brew DialogSpring)
 * Form modal to create or edit municipal departments and assign lead managers
 */
export function DepartmentModal({
  isOpen,
  department = null, // null for create mode, or department object for edit
  candidates = [],
  onClose,
  onSuccess,
}) {
  const isEditing = Boolean(department?._id);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [manager, setManager] = useState("");
  const [status, setStatus] = useState("active");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize or reset form values
  useEffect(() => {
    if (department) {
      setName(department.name || "");
      setCode(department.code || "");
      setDescription(department.description || "");
      setContactEmail(department.contactEmail || "");
      setContactPhone(department.contactPhone || "");
      setManager(department.manager?._id || department.manager || "");
      setStatus(department.status || "active");
      setSelectedCategories(department.categories || []);
    } else {
      setName("");
      setCode("");
      setDescription("");
      setContactEmail("");
      setContactPhone("");
      setManager("");
      setStatus("active");
      setSelectedCategories([]);
    }
    setError("");
  }, [department, isOpen]);

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

  if (!isOpen) return null;

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Department name is required.");
      return;
    }
    if (!code.trim()) {
      setError("Department code (e.g. WASA, RHD) is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const url = isEditing
        ? `http://localhost:5000/api/v1/departments/${department._id}`
        : "http://localhost:5000/api/v1/departments";
      const method = isEditing ? "PATCH" : "POST";

      const payload = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        contactEmail: contactEmail.trim() || null,
        contactPhone: contactPhone.trim() || null,
        manager: manager || null,
        status,
        categories: selectedCategories,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to save department details.");
      }

      onSuccess?.(json.data?.department);
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred while saving department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 my-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[#0D9488] flex items-center justify-center">
              <Building2 className="size-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-50 dark:bg-teal-950 text-[#0D9488] border border-teal-200 dark:border-teal-800 mb-1">
                <ShieldCheck className="size-3" />
                <span>Super Admin Governance</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isEditing ? "Edit Municipal Department" : "Register New Department"}
              </h2>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 font-medium"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name and Code row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Department Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. City Power & Lighting Bureau"
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Short Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CPLB"
                  maxLength={10}
                  required
                  className="w-full px-3.5 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Manager Candidate Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Assigned Department Head / Manager</span>
                <span className="text-[10px] text-muted font-normal">Optional</span>
              </label>
              <div className="relative">
                <select
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="">-- No Manager Assigned (Unassigned) --</option>
                  {candidates.map((cand) => (
                    <option key={cand._id} value={cand._id}>
                      {cand.name} ({cand.email}) — Role: {cand.role.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Email and Hotline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Contact Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Mail className="size-3.5" />
                  </div>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="dept@chattogram.gov.bd"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Hotline Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Phone className="size-3.5" />
                  </div>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+880 31 123456"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Department Mandate &amp; Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Oversees electrical line maintenance, municipal streetlighting, and smart grid poles..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors resize-none"
              />
            </div>

            {/* Categories handled */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Associated Incident Categories
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STANDARD_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border ${
                        isSelected
                          ? "bg-teal-50 text-[#0D9488] border-teal-300 dark:bg-teal-950/80 dark:border-teal-800 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Operational Status
                </div>
                <div className="text-[10px] text-muted">
                  Active departments automatically receive incident routing
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setStatus("active")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    status === "active"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-xs"
                      : "text-muted hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("inactive")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    status === "inactive"
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 shadow-xs"
                      : "text-muted hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>

            {/* Form actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <MagneticButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                className="text-xs font-bold shadow-md shadow-teal-500/10 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  <span>{isEditing ? "Update Department" : "Create Department"}</span>
                )}
              </MagneticButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default DepartmentModal;
