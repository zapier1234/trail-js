"use client";

import { useState, useEffect, useCallback } from "react";
import { requestNotificationPermission, onForegroundMessage } from "@/lib/firebase-client";

interface FCMNotificationsProps {
  userId: string;
}

interface ToastNotification {
  id: number;
  title: string;
  body: string;
}

export default function FCMNotifications({ userId }: FCMNotificationsProps) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [sendMessage, setSendMessage] = useState("");
  const [sendTitle, setSendTitle] = useState("");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  const registerToken = useCallback(async () => {
    setLoading(true);
    try {
      const token = await requestNotificationPermission();
      if (token) {
        // Register token with our backend
        const res = await fetch("/api/fcm/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setPermissionGranted(true);
        }
      }
    } catch (error) {
      console.error("Failed to register FCM token:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if permission was already granted
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setPermissionGranted(true);
        // Re-register token on page load to keep it fresh
        registerToken();
      }
    }
  }, [registerToken]);

  useEffect(() => {
    if (!permissionGranted) return;

    // Listen for foreground messages
    let unsubscribe: (() => void) | undefined;

    onForegroundMessage((payload) => {
      const id = Date.now();
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: payload.title || "PushyOn",
          body: payload.body || payload.data?.message || "New notification",
        },
      ]);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    }).then((unsub) => {
      if (typeof unsub === "function") {
        unsubscribe = unsub;
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [permissionGranted]);

  async function handleSendNotification() {
    setSending(true);
    setSendStatus("");

    try {
      const res = await fetch("/api/fcm/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sendTitle || "PushyOn",
          message: sendMessage || "Hello from PushyOn!",
          userId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSendStatus(`Sent! (${data.successCount} device(s))`);
        setSendTitle("");
        setSendMessage("");
      } else {
        setSendStatus(data.error || "Failed to send");
      }
    } catch {
      setSendStatus("Network error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      {/* Toast notifications for foreground messages */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 360,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: "#1a1a1a",
              color: "white",
              padding: "16px 20px",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 14 }}>{toast.title}</p>
            <p style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{toast.body}</p>
          </div>
        ))}
      </div>

      {/* Enable notifications button */}
      {!permissionGranted && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 style={{ fontWeight: 600 }}>Enable Push Notifications</h3>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", marginTop: 4 }}>
                Get notified on your device when there are updates
              </p>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "auto", padding: "10px 20px" }}
              onClick={registerToken}
              disabled={loading}
            >
              {loading ? "Enabling..." : "Enable"}
            </button>
          </div>
        </div>
      )}

      {/* Send notification form */}
      <div className="card">
        <h3 style={{ fontWeight: 600, marginBottom: 16 }}>
          Send Push Notification
          {permissionGranted && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                color: "#16a34a",
                fontWeight: 400,
              }}
            >
              Notifications enabled
            </span>
          )}
        </h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="input"
            placeholder="Notification title (optional)"
            value={sendTitle}
            onChange={(e) => setSendTitle(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Notification message..."
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleSendNotification}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Push Notification"}
          </button>
          {sendStatus && (
            <p className={sendStatus.includes("Sent") ? "success" : "error"}>
              {sendStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
