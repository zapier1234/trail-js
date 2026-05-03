import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { triggerKnockNotification } from "@/lib/knock";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { message } = await request.json();

    await triggerKnockNotification([session.userId], {
      message: message || "You have a new notification from PushyOn!",
    });

    return NextResponse.json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
