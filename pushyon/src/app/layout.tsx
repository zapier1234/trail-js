import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PushyOn - Secure Authentication with Push Notifications",
  description: "A Next.js app with OTP authentication and Knock push notifications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
