import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { defaultTrainingData, TrainingEntry } from "@/data/trainings";

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
        const customTrainings = currently.trainings as TrainingEntry[] | undefined;

        return NextResponse.json(
          {
            source: "supabase",
            trainings: customTrainings && customTrainings.length > 0
              ? customTrainings
              : defaultTrainingData,
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
    console.error("Trainings API error, using static fallback:", e);
  }

  return NextResponse.json(
    {
      source: "static",
      trainings: defaultTrainingData,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
