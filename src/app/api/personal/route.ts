import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { personalInfo as fallbackPersonal, PersonalInfo } from "@/data/personal";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("personal_info")
        .select("*")
        .eq("id", "default")
        .single();

      if (!error && data) {
        const mapped: PersonalInfo = {
          name: data.name,
          nickname: data.nickname,
          title: data.title,
          roles: data.roles || fallbackPersonal.roles,
          bio: data.bio,
          shortBio: data.short_bio,
          email: data.email,
          placeOfBirth: data.place_of_birth,
          gpa: data.gpa,
          education: data.education,
          approach:
            ((data as Record<string, unknown>).my_approach as string) ||
            ((data.currently as Record<string, unknown>)?.approach as string) ||
            fallbackPersonal.approach,
          avatarUrl:
            ((data as Record<string, unknown>).avatar_url as string) ||
            ((data.currently as Record<string, unknown>)?.avatar_url as string) ||
            fallbackPersonal.avatarUrl,
          github: data.github,
          linkedin: data.linkedin,
          location: data.location,
          availability: data.availability,
          status: data.status,
          resumeUrl: data.resume_url,
          traits: data.traits || fallbackPersonal.traits,
          currently: (data.currently as PersonalInfo["currently"]) || fallbackPersonal.currently,
        };

        return NextResponse.json(
          { source: "supabase", personal: mapped },
          {
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            },
          }
        );
      }
    }
  } catch (e) {
    console.error("Personal API error, using static fallback:", e);
  }

  return NextResponse.json(
    { source: "static", personal: fallbackPersonal },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
