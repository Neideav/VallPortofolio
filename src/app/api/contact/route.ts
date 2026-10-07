import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // 1. Input Validation
    if (!name || name.length < 1 || name.length > 120) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid name." },
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
        { success: false, error: "Please enter a message (maximum 4000 characters)." },
        { status: 400 }
      );
    }

    // 2. Insert to Supabase PostgreSQL database
    const supabase = getSupabaseServerClient();

    if (supabase) {
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
            error: "Something went wrong while dispatching your message. Please try again.",
          },
          { status: 500 }
        );
      }
    } else {
      console.warn(
        "Supabase is not configured yet (missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Message received in fallback mode."
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (err) {
    console.error("Contact API unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process request." },
      { status: 500 }
    );
  }
}
