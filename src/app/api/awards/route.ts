import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { 
  defaultAwardsList, 
  defaultAwardPhotosList, 
  normalizeAwardPhotos,
  AwardItem 
} from "@/data/awards";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("personal_info")
        .select("currently")
        .eq("id", "default")
        .single();

      if (!error && data && data.currently) {
        const currently = data.currently as Record<string, unknown>;
        const customAwards = currently.awards as AwardItem[] | undefined;
        const customPhotos = currently.award_photos;

        return NextResponse.json(
          {
            source: "supabase",
            awards: customAwards && customAwards.length > 0 ? customAwards : defaultAwardsList,
            photos: normalizeAwardPhotos(customPhotos),
          },
          {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate",
            },
          }
        );
      }
    }
  } catch (e) {
    console.error("Awards API error, using static fallback:", e);
  }

  return NextResponse.json(
    {
      source: "static",
      awards: defaultAwardsList,
      photos: defaultAwardPhotosList,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

