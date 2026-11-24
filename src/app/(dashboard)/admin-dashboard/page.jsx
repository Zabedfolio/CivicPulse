"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RoleGate } from "@/components/layout/RoleGate";
import { useSession } from "@/lib/auth-client";
import { IssueDataTable } from "@/components/management/IssueDataTable";
import { IssueFilterBar } from "@/components/management/IssueFilterBar";
import { DebouncedSearchInput } from "@/components/management/DebouncedSearchInput";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { VerifyIssueModal } from "@/components/management/VerifyIssueModal";
import {
  ShieldCheck,
  Building2,
  Users,
  Activity,
  AlertTriangle,
  FileText,
  BarChart3,
  ListFilter,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [category, setCategory] = useState("All Categories");
  const [department, setDepartment] = useState("all");
  const [sortOption, setSortOption] = useState("createdAt_desc");

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Issues & departments data
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch departments for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/departments", { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        if (json.data?.departments) {
          setDepartments(json.data.departments);
        }
      })
      .catch((err) => console.warn("Failed to load departments:", err));
  }, []);

  // Fetch city-wide issues
  const fetchAllIssues = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", pageSize.toString());

      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);
      if (priority !== "all") params.set("priority", priority);
      if (category !== "All Categories") params.set("category", category);
      if (department !== "all") params.set("department", department);

      const [sortBy, sortOrder] = sortOption.split("_");
      params.set("sortBy", sortBy || "createdAt");
      params.set("sortOrder", sortOrder || "desc");

      const res = await fetch(`http://localhost:5000/api/v1/issues?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load municipal issues.");
      }

      const json = await res.json();
      setIssues(json.data?.issues || []);
      if (json.pagination) {
        setTotalItems(json.pagination.total || 0);
        setTotalPages(json.pagination.totalPages || 1);
      }
    } catch (err) {
      console.warn("Admin issues fetch notice:", err.message);
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, status, priority, category, department, sortOption]);

  useEffect(() => {
    fetchAllIssues();
  }, [fetchAllIssues]);

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    setPage(1);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleDepartmentChange = (newDept) => {
    setDepartment(newDept);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortOption(newSort);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setCategory("All Categories");
    setDepartment("all");
    setSortOption("createdAt_desc");
    setPage(1);
  };

  return (
    <RoleGate allowedRoles={["admin"]}>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white border border-slate-700 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 mb-2">
              <ShieldCheck className="size-3.5" />
              <span>Super Administrator Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              City Infrastructure Governance Portal
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Admin: <span className="font-semibold text-white">{user?.name}</span> ({user?.email}) · City-Wide Real-Time Audit &amp; Cross-Department Triage
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 text-teal-200 border border-white/20">
              <Sparkles className="size-3.5 text-teal-400" />
              <span>Full Municipal Authority</span>
            </span>
          </div>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider">Total Reports</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalItems}</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Across all 41 wards</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wider">Active Divisions</div>
            <div className="text-2xl font-extrabold text-[#0D9488] mt-1">{departments.length || 6}</div>
            <p className="text-[10px] text-muted mt-0.5">Engineering departments</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Unverified Queue</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {issues.filter((i) => i.status === "Submitted").length}
            </div>
            <p className="text-[10px] text-muted mt-0.5">Pending initial review</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">
              {issues.filter((i) => i.status === "In Progress").length}
            </div>
            <p className="text-[10px] text-muted mt-0.5">Under field repair</p>
          </div>
        </div>

        {/* Triage Search & Filter Control Panel */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <ListFilter className="size-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                City-Wide Incident Triage Controls
              </h2>
            </div>
            <DebouncedSearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search reports by title, ticket, or ward..."
            />
          </div>

          <IssueFilterBar
            selectedStatus={status}
            onStatusChange={handleStatusChange}
            selectedPriority={priority}
            onPriorityChange={handlePriorityChange}
            selectedCategory={category}
            onCategoryChange={handleCategoryChange}
            selectedDepartment={department}
            onDepartmentChange={handleDepartmentChange}
            departments={departments}
            showDepartmentFilter={true}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Motion Brew IssueDataTable */}
        <div className="space-y-3">
          <IssueDataTable
            issues={issues}
            isLoading={isLoading}
            onInspect={(iss) => {
              setSelectedIssue(iss);
              setIsTriageModalOpen(true);
            }}
          />

          {/* Spring Pagination Controls */}
          <PaginationControl
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setPage(1);
            }}
          />
        </div>

        {/* Triage Decision Modal */}
        <VerifyIssueModal
          isOpen={isTriageModalOpen}
          issue={selectedIssue}
          departments={departments}
          onClose={() => {
            setIsTriageModalOpen(false);
            setSelectedIssue(null);
          }}
          onSuccess={() => {
            fetchAllIssues();
          }}
        />
      </div>
    </RoleGate>
  );
}
