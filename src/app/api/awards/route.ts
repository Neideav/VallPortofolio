import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { 
  defaultAwardsList, 
  defaultPhotoColumns, 
  AwardItem, 
  AwardPhoto 
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
        const customPhotos = currently.award_photos as AwardPhoto[][] | undefined;

        return NextResponse.json(
          {
            source: "supabase",
            awards: customAwards && customAwards.length > 0 ? customAwards : defaultAwardsList,
            photos: customPhotos && customPhotos.length > 0 ? customPhotos : defaultPhotoColumns,
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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
      photos: defaultPhotoColumns,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
