import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { identifyUserInKnock } from "@/lib/knock";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and OTP code are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find valid OTP
    const otp = await prisma.otp.findFirst({
      where: {
        email: normalizedEmail,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!otp || !otp.user) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    // Mark OTP as used
    await prisma.otp.update({
      where: { id: otp.id },
      data: { used: true },
    });

    // Identify user in Knock for push notifications
    try {
      await identifyUserInKnock(otp.user.id, otp.user.email, otp.user.name || undefined);
    } catch (knockError) {
      console.error("Knock identify error (non-blocking):", knockError);
    }

    // Create session
    await createSession({
      userId: otp.user.id,
      email: otp.user.email,
    });

    return NextResponse.json({
      message: "Authenticated successfully",
      user: {
        id: otp.user.id,
        email: otp.user.email,
        name: otp.user.name,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
