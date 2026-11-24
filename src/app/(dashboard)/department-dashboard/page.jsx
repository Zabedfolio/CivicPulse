"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RoleGate } from "@/components/layout/RoleGate";
import { useSession } from "@/lib/auth-client";
import { IssueDataTable } from "@/components/management/IssueDataTable";
import { IssueFilterBar } from "@/components/management/IssueFilterBar";
import { DebouncedSearchInput } from "@/components/management/DebouncedSearchInput";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { VerifyIssueModal } from "@/components/management/VerifyIssueModal";
import { StaffDataTable } from "@/components/staff/StaffDataTable";
import { StaffMemberModal } from "@/components/staff/StaffMemberModal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  Building2,
  Clock,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ListFilter,
  Sparkles,
  Users,
  Activity,
  UserPlus,
  Search,
} from "lucide-react";

export default function DepartmentDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Active tab: "triage" | "technicians"
  const [activeTab, setActiveTab] = useState("triage");

  // Filter & Search states (for Triage)
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [category, setCategory] = useState("All Categories");
  const [sortOption, setSortOption] = useState("createdAt_desc");

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Issues data & loading
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Staff Technicians states
  const [staffList, setStaffList] = useState([]);
  const [isStaffLoading, setIsStaffLoading] = useState(true);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState(null);
  const [staffSearch, setStaffSearch] = useState("");

  // Fetch departments for potential re-routing
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/departments", { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        if (json.data?.departments) {
          setDepartments(json.data.departments);
        }
      })
      .catch((err) => console.warn("Departments fetch notice:", err));
  }, []);

  // Fetch department staff
  const fetchDepartmentStaff = useCallback(async () => {
    setIsStaffLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/users/staff?limit=100", {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setStaffList(json.data?.staff || []);
      }
    } catch (err) {
      console.warn("Staff fetch notice:", err);
    } finally {
      setIsStaffLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartmentStaff();
  }, [fetchDepartmentStaff]);

  const fetchDepartmentIssues = useCallback(async () => {
    setIsLoading(true);
    setFetchError("");

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", pageSize.toString());

      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);
      if (priority !== "all") params.set("priority", priority);
      if (category !== "All Categories") params.set("category", category);

      // Parse sort option (e.g., 'createdAt_desc')
      const [sortBy, sortOrder] = sortOption.split("_");
      params.set("sortBy", sortBy || "createdAt");
      params.set("sortOrder", sortOrder || "desc");

      const res = await fetch(`http://localhost:5000/api/v1/issues?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load department issues.");
      }

      const json = await res.json();
      setIssues(json.data?.issues || []);
      if (json.pagination) {
        setTotalItems(json.pagination.total || 0);
        setTotalPages(json.pagination.totalPages || 1);
      }
    } catch (err) {
      console.warn("Department issues fetch notice:", err.message);
      setFetchError(err.message || "Failed to connect to municipal dispatch server.");
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, status, priority, category, sortOption]);

  useEffect(() => {
    fetchDepartmentIssues();
  }, [fetchDepartmentIssues]);

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

  const handleSortChange = (newSort) => {
    setSortOption(newSort);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setCategory("All Categories");
    setSortOption("createdAt_desc");
    setPage(1);
  };

  // Filter staff by search
  const filteredStaff = staffList.filter((s) => {
    if (!staffSearch.trim()) return true;
    const q = staffSearch.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <RoleGate allowedRoles={["manager", "admin"]}>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Department Manager Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-teal-500/10 border border-teal-200/80 dark:border-teal-900/60 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100/80 text-teal-800 dark:bg-teal-950 dark:text-teal-300 mb-2">
              <Building2 className="size-3.5" />
              <span>Department Operations &amp; Triage Board</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {user?.department?.name || "Municipal Infrastructure"} Division
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Role: <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">{user?.role}</span> · Logged in as{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span> ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
              <Sparkles className="size-3.5 text-teal-600" />
              <span>Auto SLA Audited</span>
            </span>
          </div>
        </div>

        {/* Global Navigation Tabs (Triage vs Technicians) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            onClick={() => setActiveTab("triage")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "triage"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-muted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Activity className="size-3.5 text-teal-600" />
            <span>Incident Triage Board</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {totalItems}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("technicians")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "technicians"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-muted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="size-3.5 text-blue-600" />
            <span>Field Technicians</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-600 font-mono">
              {staffList.length}
            </span>
          </button>
        </div>

        {/* TAB 1: INCIDENT TRIAGE */}
        {activeTab === "triage" && (
          <div className="space-y-6">
            {/* Operational KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-[11px] font-bold text-muted uppercase tracking-wider">Total Reports</div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {totalItems}
                </div>
                <p className="text-[10px] text-muted mt-0.5">Assigned to department</p>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending Review</div>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">
                  {issues.filter((i) => i.status === "Submitted" || i.status === "Under Review").length}
                </div>
                <p className="text-[10px] text-muted mt-0.5">Requires triage / verification</p>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Active Crews</div>
                <div className="text-2xl font-extrabold text-purple-600 mt-1">
                  {issues.filter((i) => i.status === "In Progress" || i.status === "Assigned").length}
                </div>
                <p className="text-[10px] text-muted mt-0.5">Dispatched on site</p>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Resolved</div>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  {issues.filter((i) => i.status === "Resolved" || i.status === "Closed").length}
                </div>
                <p className="text-[10px] text-muted mt-0.5">Resolution verified</p>
              </div>
            </div>

            {/* Triage Search & Filter Control Panel */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <ListFilter className="size-4 text-teal-600" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Issue Triage Controls &amp; Search
                  </h2>
                </div>
                <DebouncedSearchInput
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search reports by title or ward address..."
                />
              </div>

              <IssueFilterBar
                selectedStatus={status}
                onStatusChange={handleStatusChange}
                selectedPriority={priority}
                onPriorityChange={handlePriorityChange}
                selectedCategory={category}
                onCategoryChange={handleCategoryChange}
                sortOption={sortOption}
                onSortChange={handleSortChange}
                onReset={handleResetFilters}
              />
            </div>

            {/* Responsive Motion Brew IssueDataTable */}
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
          </div>
        )}

        {/* TAB 2: FIELD TECHNICIANS */}
        {activeTab === "technicians" && (
          <div className="space-y-6">
            {/* Top Toolbar: Search & Onboard CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Department Field Engineering Team
                </h2>
                <p className="text-xs text-muted">
                  View technician workload capacities, active repair order queues, and onboard specialists to {user?.department?.name || "your department"}.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Search input */}
                <div className="relative w-full sm:w-60">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Search className="size-3.5" />
                  </div>
                  <input
                    type="text"
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    placeholder="Search technician..."
                    className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                <MagneticButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedStaffForEdit(null);
                    setIsStaffModalOpen(true);
                  }}
                  className="text-xs font-bold shadow-md shadow-teal-500/10 shrink-0 cursor-pointer"
                >
                  <UserPlus className="size-3.5 mr-1.5" />
                  Onboard Technician
                </MagneticButton>
              </div>
            </div>

            {/* Staff Data Table */}
            <StaffDataTable
              staff={filteredStaff}
              isLoading={isStaffLoading}
              onEdit={(member) => {
                setSelectedStaffForEdit(member);
                setIsStaffModalOpen(true);
              }}
            />
          </div>
        )}

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
            fetchDepartmentIssues();
          }}
        />

        {/* Staff Onboard/Edit Modal */}
        <StaffMemberModal
          isOpen={isStaffModalOpen}
          staffMember={selectedStaffForEdit}
          departments={departments}
          currentUserRole="manager"
          currentManagerDept={user?.department}
          onClose={() => {
            setIsStaffModalOpen(false);
            setSelectedStaffForEdit(null);
          }}
          onSuccess={() => {
            fetchDepartmentStaff();
          }}
        />
      </div>
    </RoleGate>
  );
}
