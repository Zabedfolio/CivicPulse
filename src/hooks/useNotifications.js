"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

/**
 * useNotifications
 * Comprehensive notification management hook with optimistic updates and live badge polling.
 */
export function useNotifications() {
  const { data: session } = useSession();
  const user = session?.user;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" | "unread"

  // Fetch quick unread count for badge
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get("/notifications/unread-count");
      if (res?.data?.unreadCount !== undefined) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      // Graceful silence on background badge polls
    }
  }, [user]);

  // Fetch full list of notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({ limit: "40" });
      if (filter === "unread") {
        queryParams.set("isRead", "false");
      }
      const res = await api.get(`/notifications?${queryParams.toString()}`);
      if (res?.data?.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, filter]);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchUnreadCount, fetchNotifications]);

  // Live polling (every 30 seconds if tab is active)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchUnreadCount();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  // Mark a single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!notificationId) return;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await api.patch(`/notifications/${notificationId}/read`);
    } catch (err) {
      console.error("Failed to mark notification read:", err);
      // Re-fetch on error to revert state
      fetchUnreadCount();
      fetchNotifications();
    }
  }, [fetchUnreadCount, fetchNotifications]);

  // Mark all unread notifications as read
  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await api.patch("/notifications/mark-all-read");
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
      fetchUnreadCount();
      fetchNotifications();
    }
  }, [fetchUnreadCount, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    refresh: () => {
      fetchUnreadCount();
      fetchNotifications();
    },
  };
}

export default useNotifications;
