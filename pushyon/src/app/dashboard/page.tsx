"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FCMNotifications from "@/components/FCMNotifications";

interface User {
  userId: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Welcome back!</h2>
          <p style={{ marginTop: 8, opacity: 0.9 }}>{user.email}</p>
        </div>

        <div className="feature-grid" style={{ marginBottom: 24 }}>
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
              FCM Push Notifications
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
              Real-time mobile push via Firebase Cloud Messaging
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

        <FCMNotifications userId={user.userId} />
      </div>
    </div>
  );
}
