"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface NotificationItem {
  id: string;
  data?: { message?: string };
  read_at: string | null;
  inserted_at: string;
}

interface NotificationFeedProps {
  userId: string;
}

export default function NotificationFeed({ userId }: NotificationFeedProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      const apiKey = process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY;
      const channelId = process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID;

      const res = await fetch(
        `https://api.knock.app/v1/users/${userId}/feeds/${channelId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.entries || []);
        setUnreadCount(data.meta?.unread_count || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();

    // Poll every 5 seconds for new notifications
    intervalRef.current = setInterval(fetchNotifications, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchNotifications]);

  async function markAllAsRead() {
    if (!userId) return;
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY;
      const channelId = process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID;

      await fetch(
        `https://api.knock.app/v1/users/${userId}/feeds/${channelId}/bulk_action`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "mark_as_read" }),
        }
      );

      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read_at: n.read_at || new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="notification-bell"
        onClick={() => setShowPanel(!showPanel)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="notification-panel">
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: 16 }}
          >
            <h3 style={{ fontWeight: 600 }}>Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  className="btn btn-outline"
                  style={{ width: "auto", padding: "6px 12px", fontSize: 13 }}
                  onClick={markAllAsRead}
                  disabled={loading}
                >
                  Mark all read
                </button>
              )}
              <button
                className="btn btn-outline"
                style={{ width: "auto", padding: "6px 12px", fontSize: 13 }}
                onClick={() => setShowPanel(false)}
              >
                Close
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "var(--muted-foreground)",
                padding: 32,
              }}
            >
              No notifications yet
            </p>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`notification-item ${
                  !item.read_at ? "notification-item-unread" : ""
                }`}
              >
                <p style={{ fontSize: 14 }}>
                  {item.data?.message || "New notification"}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--muted-foreground)",
                    marginTop: 4,
                  }}
                >
                  {new Date(item.inserted_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
