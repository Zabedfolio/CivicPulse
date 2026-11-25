"use client";


import { API_BASE_URL } from "@/lib/api";
import React, { useState, useEffect, useCallback } from "react";
import { RoleGate } from "@/components/layout/RoleGate";
import { useSession } from "@/lib/auth-client";
import { IssueDataTable } from "@/components/management/IssueDataTable";
import { IssueFilterBar } from "@/components/management/IssueFilterBar";
import { DebouncedSearchInput } from "@/components/management/DebouncedSearchInput";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { VerifyIssueModal } from "@/components/management/VerifyIssueModal";
import { DepartmentCardGrid } from "@/components/departments/DepartmentCardGrid";
import { DepartmentModal } from "@/components/departments/DepartmentModal";
import { StaffDataTable } from "@/components/staff/StaffDataTable";
import { StaffMemberModal } from "@/components/staff/StaffMemberModal";
import { DepartmentAnalyticsView } from "@/components/analytics/DepartmentAnalyticsView";
import { CityAnalyticsView } from "@/components/analytics/CityAnalyticsView";
import { ActivityLogList } from "@/components/admin/ActivityLogList";
import { MagneticButton } from "@/components/ui/MagneticButton";
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
  Plus,
  Layers,
  Search,
  UserPlus,
  Briefcase,
  Award,
  ScrollText,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Active sub-dashboard tab: "triage" | "departments" | "staff"
  const [activeTab, setActiveTab] = useState("triage");

  // Filter & Search states (for Triage)
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [category, setCategory] = useState("All Categories");
  const [department, setDepartment] = useState("all");
  const [sortOption, setSortOption] = useState("createdAt_desc");

  // Pagination states (for Triage)
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

  // Department Management States
  const [allDepartments, setAllDepartments] = useState([]);
  const [managerCandidates, setManagerCandidates] = useState([]);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [selectedDeptForEdit, setSelectedDeptForEdit] = useState(null);
  const [isDeptLoading, setIsDeptLoading] = useState(true);
  const [deptSearch, setDeptSearch] = useState("");
  const [selectedAnalyticsDept, setSelectedAnalyticsDept] = useState("");

  // Staff Management States
  const [staffList, setStaffList] = useState([]);
  const [isStaffLoading, setIsStaffLoading] = useState(true);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState(null);
  const [staffSearch, setStaffSearch] = useState("");
  const [staffDeptFilter, setStaffDeptFilter] = useState("all");

  // Fetch departments for dropdown & all departments for management
  const fetchAllDepartments = useCallback(async () => {
    setIsDeptLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/departments/all`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        const depts = json.data?.departments || [];
        setAllDepartments(depts);
        setDepartments(depts.filter((d) => d.status !== "inactive"));
      } else {
        const pubRes = await fetch(`${API_BASE_URL}/departments`, {
          credentials: "include",
        });
        const pubJson = await pubRes.json();
        setDepartments(pubJson.data?.departments || []);
        setAllDepartments(pubJson.data?.departments || []);
      }
    } catch (err) {
      console.warn("Failed to load departments:", err);
    } finally {
      setIsDeptLoading(false);
    }
  }, []);

  // Fetch manager candidates
  const fetchManagerCandidates = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/departments/managers/candidates`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setManagerCandidates(json.data?.candidates || []);
      }
    } catch (err) {
      console.warn("Failed to load manager candidates:", err);
    }
  }, []);

  // Fetch staff workforce
  const fetchStaffMembers = useCallback(async () => {
    setIsStaffLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/staff?limit=100`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setStaffList(json.data?.staff || []);
      }
    } catch (err) {
      console.warn("Failed to load staff workforce:", err);
    } finally {
      setIsStaffLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllDepartments();
    fetchManagerCandidates();
    fetchStaffMembers();
  }, [fetchAllDepartments, fetchManagerCandidates, fetchStaffMembers]);

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

      const res = await fetch(`${API_BASE_URL}/issues?${params.toString()}`, {
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

  // Filter departments by search
  const filteredDepartments = allDepartments.filter((d) => {
    if (!deptSearch.trim()) return true;
    const q = deptSearch.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.code?.toLowerCase().includes(q) ||
      d.manager?.name?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  });

  // Filter staff by search and department
  const filteredStaff = staffList.filter((s) => {
    if (staffDeptFilter !== "all") {
      const sDeptId = s.department?._id || s.department;
      if (sDeptId !== staffDeptFilter) return false;
    }
    if (!staffSearch.trim()) return true;
    const q = staffSearch.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q) ||
      s.department?.name?.toLowerCase().includes(q) ||
      s.department?.code?.toLowerCase().includes(q)
    );
  });

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
              Admin: <span className="font-semibold text-white">{user?.name}</span> ({user?.email}) · City-Wide Real-Time Audit, Departments &amp; Workforce
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 text-teal-200 border border-white/20">
              <Sparkles className="size-3.5 text-teal-400" />
              <span>Full Municipal Authority</span>
            </span>
          </div>
        </div>

        {/* Global Navigation Tabs (Triage vs Departments vs Staff) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit border border-slate-200/80 dark:border-slate-700/80 overflow-x-auto">
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
            <span>Incident Triage &amp; Audit</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {totalItems}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("departments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "departments"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-muted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Building2 className="size-3.5 text-[#0D9488]" />
            <span>Municipal Departments</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-50 dark:bg-teal-950 text-[#0D9488] font-mono">
              {allDepartments.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("staff")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "staff"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-muted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="size-3.5 text-blue-600" />
            <span>Staff &amp; Workforce</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-600 font-mono">
              {staffList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "analytics"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-muted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Award className="size-3.5 text-amber-500" />
            <span>Executive Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "activity"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-muted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ScrollText className="size-3.5 text-purple-600" />
            <span>Activity Log</span>
          </button>
        </div>

        {/* TAB 1: INCIDENT TRIAGE & AUDIT */}
        {activeTab === "triage" && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* TAB 2: MUNICIPAL DEPARTMENTS */}
        {activeTab === "departments" && (
          <div className="space-y-6">
            {/* Top Toolbar: Search & Add CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Municipal Department Directory
                </h2>
                <p className="text-xs text-muted">
                  Configure municipal engineering divisions, designate department heads, and monitor active ticket loads.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Search box */}
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Search className="size-3.5" />
                  </div>
                  <input
                    type="text"
                    value={deptSearch}
                    onChange={(e) => setDeptSearch(e.target.value)}
                    placeholder="Search departments or code..."
                    className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                <MagneticButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedDeptForEdit(null);
                    setIsDeptModalOpen(true);
                  }}
                  className="text-xs font-bold shadow-md shadow-teal-500/10 shrink-0 cursor-pointer"
                >
                  <Plus className="size-3.5 mr-1.5" />
                  Register Department
                </MagneticButton>
              </div>
            </div>

            {/* Department Cards Grid */}
            <DepartmentCardGrid
              departments={filteredDepartments}
              isLoading={isDeptLoading}
              onEdit={(dept) => {
                setSelectedDeptForEdit(dept);
                setIsDeptModalOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 3: STAFF & WORKFORCE */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            {/* Top Toolbar: Search, Dept Filter & Onboard CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Municipal Personnel &amp; Field Workforce
                </h2>
                <p className="text-xs text-muted">
                  Supervise field technician capacity, reassign departmental engineering teams, and onboard specialists.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Department filter */}
                <select
                  value={staffDeptFilter}
                  onChange={(e) => setStaffDeptFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="all">All Departments</option>
                  {allDepartments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>

                {/* Search input */}
                <div className="relative w-full sm:w-56">
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

        {/* TAB 4: EXECUTIVE ANALYTICS & SLA BENCHMARKS */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <CityAnalyticsView departments={allDepartments} />

            <div className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Departmental SLA Audit &amp; Priority Matrix
                  </h2>
                  <p className="text-xs text-muted">
                    Drill down into individual division turnaround targets and verified citizen reviews.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Department:
                  </span>
                  <select
                    value={selectedAnalyticsDept || (allDepartments[0]?._id || "")}
                    onChange={(e) => setSelectedAnalyticsDept(e.target.value)}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  >
                    {allDepartments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.code} - {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {allDepartments.length > 0 && (
                <DepartmentAnalyticsView
                  departmentId={selectedAnalyticsDept || allDepartments[0]?._id}
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM-WIDE ACTIVITY LOG STREAM */}
        {activeTab === "activity" && <ActivityLogList />}

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

        {/* Department Create/Edit Modal */}
        <DepartmentModal
          isOpen={isDeptModalOpen}
          department={selectedDeptForEdit}
          candidates={managerCandidates}
          onClose={() => {
            setIsDeptModalOpen(false);
            setSelectedDeptForEdit(null);
          }}
          onSuccess={() => {
            fetchAllDepartments();
            fetchManagerCandidates();
          }}
        />

        {/* Staff Onboard/Edit Modal */}
        <StaffMemberModal
          isOpen={isStaffModalOpen}
          staffMember={selectedStaffForEdit}
          departments={allDepartments}
          currentUserRole="admin"
          onClose={() => {
            setIsStaffModalOpen(false);
            setSelectedStaffForEdit(null);
          }}
          onSuccess={() => {
            fetchStaffMembers();
          }}
        />
      </div>
    </RoleGate>
  );
}
