import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "FCM token is required" }, { status: 400 });
    }

    // Upsert the device token - if it already exists, update the userId
    await prisma.deviceToken.upsert({
      where: { token },
      update: { userId: session.userId },
      create: {
        token,
        userId: session.userId,
      },
    });

    return NextResponse.json({ message: "Device token registered successfully" });
  } catch (error) {
    console.error("FCM register error:", error);
    return NextResponse.json(
      { error: "Failed to register device token" },
      { status: 500 }
    );
  }
}
