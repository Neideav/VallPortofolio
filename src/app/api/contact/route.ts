import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // 1. Server-Side Input Validation
    if (!name || name.length < 1 || name.length > 120) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid name (1–120 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 150) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!message || message.length < 2 || message.length > 4000) {
      return NextResponse.json(
        { success: false, error: "Please enter a message (between 2 and 4000 characters)." },
        { status: 400 }
      );
    }

    // 2. Initialize Supabase Server Client
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      // Supabase is unconfigured - never report false success
      console.warn("Supabase client is not available to store contact message.");
      return NextResponse.json(
        {
          success: false,
          error: "The contact service is temporarily unavailable. Please reach out directly via email.",
        },
        { status: 503 }
      );
    }

    // 3. Insert to Supabase PostgreSQL database
    const { error } = await supabase.from("contact_messages").insert([
      {
        name,
        email,
        message,
        status: "unread",
      },
    ]);

    if (error) {
      console.error("Supabase contact_messages insert error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to dispatch your message at this time. Please try again later.",
        },
        { status: 500 }
      );
    }

    // Only return success when the insert was confirmed by the database
    return NextResponse.json({
      success: true,
      message: "Your message has been received successfully.",
    });
  } catch (err) {
    console.error("Contact API unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process contact request." },
      { status: 500 }
    );
  }
}
