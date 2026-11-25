"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  CheckCheck,
  Inbox,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { NotificationItem } from "./NotificationItem";

/**
 * NotificationPopover
 * Animated Motion Brew spring popover displaying user notifications with filters and mark-all-read.
 */
export function NotificationPopover({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  isLoading = false,
  filter = "all",
  onFilterChange,
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for click-outside dismissal on small screens */}
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Floating Popover Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 30,
            }}
            className="fixed inset-x-3 top-20 sm:inset-x-auto sm:absolute sm:right-0 sm:top-full sm:mt-3 z-50 w-auto sm:w-[400px] sm:max-w-[calc(100vw-2rem)] rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-[#0D9488] flex items-center justify-center font-bold">
                  <Bell className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Notifications
                  </h3>
                  <span className="text-[11px] text-muted">
                    {unreadCount > 0 ? `${unreadCount} unread alerts` : "All caught up"}
                  </span>
                </div>
              </div>

              {/* Mark all as read button */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-[#0D9488] hover:bg-teal-50 dark:hover:bg-teal-950/60 transition-colors cursor-pointer"
                >
                  <CheckCheck className="size-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 bg-slate-50/30 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onFilterChange("all")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  filter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-muted hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => onFilterChange("unread")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  filter === "unread"
                    ? "bg-[#0D9488] text-white"
                    : "text-muted hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>Unread</span>
                {unreadCount > 0 && (
                  <span className="size-4 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[60dvh] sm:max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-slate-100/60 dark:divide-slate-800/40">
              {isLoading ? (
                <div className="p-8 flex flex-col items-center justify-center text-muted gap-2">
                  <Loader2 className="size-6 animate-spin text-[#0D9488]" />
                  <span className="text-xs font-semibold">Loading alerts...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                  <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <Inbox className="size-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No notifications
                  </h4>
                  <p className="text-[11px] text-muted max-w-[220px]">
                    {filter === "unread"
                      ? "You've read all your recent notifications."
                      : "When your reports update or tasks are assigned, they'll appear here."}
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onRead={onMarkAsRead}
                    onClose={onClose}
                  />
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificationPopover;
