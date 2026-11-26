"use client";

import React, { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { DebouncedSearchInput } from "@/components/management/DebouncedSearchInput";
import { PaginationControl } from "@/components/ui/PaginationControl";
import {
  Users,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Building2,
  UserCheck,
  Mail,
  Phone,
} from "lucide-react";

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "citizen", label: "Citizen" },
  { value: "staff", label: "Field Staff" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

const ROLE_STYLE = {
  admin: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/70 dark:border-rose-800/70",
  manager: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/70 dark:border-teal-800/70",
  staff: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/70 dark:border-blue-800/70",
  citizen: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

/**
 * AllUsersDirectory
 * Admin directory to inspect all platform accounts across 4 roles, update roles/departments,
 * and toggle active account status with self-protection guards.
 */
export function AllUsersDirectory({ departments = [] }) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || session?.user?._id;

  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ total: 0, admin: 0, manager: 0, staff: 0, citizen: 0 });

  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        role: roleFilter,
        status: statusFilter,
      });
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to load municipal user directory.");
      }

      const json = await res.json();
      setUsers(json.data?.users || []);
      if (json.data?.counts) setCounts(json.data.counts);
      setTotalItems(json.data?.pagination?.total || 0);
      setTotalPages(json.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Unable to fetch user directory.");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, roleFilter, statusFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateUser = async (userId, payload) => {
    setUpdatingId(userId);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to update user record.");
      }

      const updatedUser = json.data?.user;
      if (updatedUser) {
        setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
      }
      fetchUsers();
    } catch (err) {
      setError(err.message || "Update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Accounts", value: counts.total, accent: "text-slate-900 dark:text-white" },
          { label: "Citizens", value: counts.citizen, accent: "text-slate-600 dark:text-slate-300" },
          { label: "Field Staff", value: counts.staff, accent: "text-blue-600 dark:text-blue-400" },
          { label: "Managers", value: counts.manager, accent: "text-[#0D9488] dark:text-teal-400" },
          { label: "Admins", value: counts.admin, accent: "text-rose-600 dark:text-rose-400" },
        ].map((card, idx) => (
          <div
            key={card.label}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs ${
              idx === 0 ? "col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {card.label}
            </div>
            <div className={`text-2xl font-extrabold mt-1 ${card.accent}`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-[#0D9488]" aria-hidden="true" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Municipal User Governance Directory
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <DebouncedSearchInput
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="Search user by name or email..."
            />

            <select
              aria-label="Filter users by active status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0D9488]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Deactivated Only</option>
            </select>

            <button
              type="button"
              onClick={fetchUsers}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Role Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider mr-1">
            Role:
          </span>
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setRoleFilter(opt.value);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                roleFilter === opt.value
                  ? "bg-[#0D9488] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Users Mobile Cards (< 640px) + Desktop Table (>= 640px) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Mobile Card List */}
        <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted px-4">
              No users match the selected filters.
            </div>
          ) : (
            users.map((u) => {
              const isSelf = currentUserId && u._id === currentUserId;
              const isBusy = updatingId === u._id;
              const initials = (u.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div key={u._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-9 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200/70 dark:border-teal-800/70 text-[#0D9488] font-extrabold text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-900 dark:text-white">
                          <span className="truncate">{u.name}</span>
                          {isSelf && (
                            <span className="px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900 text-[#0D9488] text-[9px] font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted truncate">{u.email}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={u.isActive !== false}
                      aria-label={`Toggle active status for ${u.name}`}
                      disabled={isSelf || isBusy}
                      onClick={() =>
                        handleUpdateUser(u._id, { isActive: u.isActive === false })
                      }
                      className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer disabled:opacity-50 ${
                        u.isActive !== false
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span
                        className={`size-2 rounded-full ${
                          u.isActive !== false ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span>{u.isActive !== false ? "Active" : "Inactive"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      aria-label={`Change role for ${u.name}`}
                      disabled={isSelf || isBusy}
                      value={u.role}
                      onChange={(e) => handleUpdateUser(u._id, { role: e.target.value })}
                      className={`min-h-[38px] px-2.5 py-1 rounded-xl border text-[11px] font-extrabold uppercase cursor-pointer disabled:opacity-60 ${
                        ROLE_STYLE[u.role] || ROLE_STYLE.citizen
                      }`}
                    >
                      <option value="citizen">Citizen</option>
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>

                    {(u.role === "staff" || u.role === "manager") && (
                      <select
                        aria-label={`Assign department for ${u.name}`}
                        disabled={isBusy}
                        value={u.department?._id || u.department || ""}
                        onChange={(e) =>
                          handleUpdateUser(u._id, {
                            department: e.target.value || null,
                          })
                        }
                        className="min-h-[38px] px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
                      >
                        <option value="">Unassigned</option>
                        {departments.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.code}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Tablet & Desktop Table (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[10px] font-bold uppercase tracking-wider text-muted">
                <th scope="col" className="py-3.5 px-5">User Identity</th>
                <th scope="col" className="py-3.5 px-4">Role</th>
                <th scope="col" className="py-3.5 px-4">Department</th>
                <th scope="col" className="hidden lg:table-cell py-3.5 px-4">Joined</th>
                <th scope="col" className="py-3.5 px-5 text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="py-4 px-5">
                      <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    No users match the selected filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelf = currentUserId && u._id === currentUserId;
                  const isBusy = updatingId === u._id;
                  const initials = (u.name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200/70 dark:border-teal-800/70 text-[#0D9488] font-extrabold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-extrabold text-slate-900 dark:text-white">
                              <span className="truncate">{u.name}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900 text-[#0D9488] text-[9px] font-bold">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted mt-0.5">
                              <span className="inline-flex items-center gap-1">
                                <Mail className="size-2.5" aria-hidden="true" />
                                {u.email}
                              </span>
                              {u.phone && (
                                <span className="inline-flex items-center gap-1">
                                  <Phone className="size-2.5" aria-hidden="true" />
                                  {u.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          aria-label={`Change role for ${u.name}`}
                          disabled={isSelf || isBusy}
                          value={u.role}
                          onChange={(e) => handleUpdateUser(u._id, { role: e.target.value })}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold uppercase tracking-wide cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                            ROLE_STYLE[u.role] || ROLE_STYLE.citizen
                          }`}
                        >
                          <option value="citizen">Citizen</option>
                          <option value="staff">Staff</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        {u.role === "staff" || u.role === "manager" ? (
                          <select
                            aria-label={`Assign department for ${u.name}`}
                            disabled={isBusy}
                            value={u.department?._id || u.department || ""}
                            onChange={(e) =>
                              handleUpdateUser(u._id, {
                                department: e.target.value || null,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#0D9488]"
                          >
                            <option value="">Unassigned</option>
                            {departments.map((d) => (
                              <option key={d._id} value={d._id}>
                                {d.code} — {d.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-[11px] text-muted">—</span>
                        )}
                      </td>

                      <td className="hidden lg:table-cell py-3.5 px-4 text-[11px] font-semibold text-muted whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={u.isActive !== false}
                          aria-label={`Toggle active status for ${u.name}`}
                          disabled={isSelf || isBusy}
                          onClick={() =>
                            handleUpdateUser(u._id, { isActive: u.isActive === false })
                          }
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                            u.isActive !== false
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <span
                            className={`size-2 rounded-full ${
                              u.isActive !== false ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span>{u.isActive !== false ? "Active" : "Inactive"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationControl
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemLabel="users"
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
      />
    </div>
  );
}

export default AllUsersDirectory;
