"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench,
  Star,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";

/**
 * Format relative timestamps simply
 */
function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffInSecs = Math.floor((now - date) / 1000);

  if (diffInSecs < 60) return "Just now";
  if (diffInSecs < 3600) return `${Math.floor(diffInSecs / 60)}m ago`;
  if (diffInSecs < 86400) return `${Math.floor(diffInSecs / 3600)}h ago`;
  if (diffInSecs < 172800) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const TYPE_CONFIG = {
  status_change: {
    icon: CheckCircle2,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800",
  },
  task_assigned: {
    icon: Wrench,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
  },
  feedback_received: {
    icon: Star,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
  },
  system: {
    icon: Info,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800",
  },
};

export function NotificationItem({ notification, onRead, onClose }) {
  const router = useRouter();
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.isRead && onRead) {
      onRead(notification._id);
    }

    if (onClose) onClose();

    // Deep-link to ticket if issue is referenced
    if (notification.issue?._id) {
      router.push(`/issues/${notification.issue._id}`);
    } else if (notification.type === "task_assigned") {
      router.push("/my-tasks");
    } else {
      router.push("/my-reports");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative p-3.5 rounded-2xl transition-all cursor-pointer border ${
        notification.isRead
          ? "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
          : "bg-teal-50/40 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/40 hover:bg-teal-50/70 dark:hover:bg-teal-950/40"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon Badge */}
        <div
          className={`size-8 rounded-xl flex items-center justify-center shrink-0 border ${config.bg} ${config.color}`}
        >
          <Icon className="size-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <h4
              className={`text-xs font-bold truncate ${
                notification.isRead
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {notification.title}
            </h4>
            <span className="text-[10px] text-muted font-medium shrink-0">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>

          <p className="text-xs text-muted line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          {notification.issue && (
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#0D9488]">
              <span>View ticket</span>
              <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          )}
        </div>

        {/* Unread indicator dot */}
        {!notification.isRead && (
          <div className="size-2 rounded-full bg-[#0D9488] shrink-0 mt-1 shadow-sm" />
        )}
      </div>
    </div>
  );
}

export default NotificationItem;
