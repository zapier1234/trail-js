"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationFeed from "@/components/NotificationFeed";

interface User {
  userId: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifMessage, setNotifMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notifStatus, setNotifStatus] = useState("");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function handleSendNotification() {
    setSending(true);
    setNotifStatus("");

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: notifMessage || "Hello from PushyOn!" }),
      });

      if (res.ok) {
        setNotifStatus("Notification sent!");
        setNotifMessage("");
      } else {
        const data = await res.json();
        setNotifStatus(data.error || "Failed to send");
      }
    } catch {
      setNotifStatus("Network error");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="page-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <header className="header">
        <h2 style={{ fontWeight: 700 }}>PushyOn</h2>
        <div className="flex items-center gap-4">
          <NotificationFeed userId={user.userId} />
          <button
            className="btn btn-outline"
            style={{ width: "auto", padding: "8px 16px" }}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>
            Welcome back!
          </h2>
          <p style={{ marginTop: 8, opacity: 0.9 }}>{user.email}</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3 style={{ fontWeight: 600, marginBottom: 8 }}>OTP Auth</h3>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
              Secure passwordless login via email OTP
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
              Push Notifications
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
              Real-time notifications via Knock
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗄️</div>
            <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
              Neon PostgreSQL
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
              Serverless Postgres with Prisma ORM
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>
            Send Test Notification
          </h3>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className="input"
              placeholder="Enter notification message..."
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleSendNotification}
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Notification"}
            </button>
            {notifStatus && (
              <p
                className={
                  notifStatus.includes("sent") ? "success" : "error"
                }
              >
                {notifStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
