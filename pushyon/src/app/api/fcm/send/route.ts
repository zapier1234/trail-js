import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPushToMultiple } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { title, message, userId } = await request.json();

    const targetUserId = userId || session.userId;

    // Get all device tokens for the target user
    const deviceTokens = await prisma.deviceToken.findMany({
      where: { userId: targetUserId },
      select: { token: true, id: true },
    });

    if (deviceTokens.length === 0) {
      return NextResponse.json(
        { error: "No registered devices for this user. Enable notifications first." },
        { status: 404 }
      );
    }

    const tokens = deviceTokens.map((dt) => dt.token);
    const notifTitle = title || "PushyOn";
    const notifBody = message || "You have a new notification!";

    const result = await sendPushToMultiple(tokens, notifTitle, notifBody, {
      message: notifBody,
      url: "/dashboard",
    });

    // Clean up invalid tokens
    const failedTokenIds: string[] = [];
    result.responses.forEach((resp, idx) => {
      if (
        !resp.success &&
        resp.error &&
        (resp.error.code === "messaging/invalid-registration-token" ||
          resp.error.code === "messaging/registration-token-not-registered")
      ) {
        failedTokenIds.push(deviceTokens[idx].id);
      }
    });

    if (failedTokenIds.length > 0) {
      await prisma.deviceToken.deleteMany({
        where: { id: { in: failedTokenIds } },
      });
    }

    return NextResponse.json({
      message: "Push notification sent",
      successCount: result.successCount,
      failureCount: result.failureCount,
    });
  } catch (error) {
    console.error("FCM send error:", error);
    return NextResponse.json(
      { error: "Failed to send push notification" },
      { status: 500 }
    );
  }
}
