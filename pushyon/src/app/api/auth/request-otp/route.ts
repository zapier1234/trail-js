import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email: normalizedEmail },
      });
    }

    // Invalidate any existing unused OTPs for this email
    await prisma.otp.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    });

    // Generate new OTP
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otp.create({
      data: {
        code,
        email: normalizedEmail,
        expiresAt,
        userId: user.id,
      },
    });

    // Send OTP email
    await sendOtpEmail(normalizedEmail, code);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Request OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
