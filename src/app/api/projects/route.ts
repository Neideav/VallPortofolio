import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { projects as fallbackProjects, Project } from "@/data/projects";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, number, title, category, description, detailed_description, technologies, github_url, live_url, featured, metrics, architecture_points, banner_gradient, sort_order"
        )
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        // Map Supabase snake_case to Project camelCase interface
        const mapped: Project[] = data.map((row) => ({
          id: row.id,
          number: row.number,
          title: row.title,
          category: row.category,
          description: row.description,
          detailedDescription: row.detailed_description || undefined,
          technologies: row.technologies || [],
          githubUrl: row.github_url,
          liveUrl: row.live_url || undefined,
          featured: row.featured,
          metrics: (row.metrics as { label: string; value: string }[]) || undefined,
          architecturePoints: row.architecture_points || undefined,
          bannerGradient:
            row.banner_gradient || "from-emerald-950/40 via-slate-900/60 to-zinc-950/80",
        }));

        return NextResponse.json(
          { source: "supabase", projects: mapped },
          {
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            },
          }
        );
      }
    }
  } catch (e) {
    console.error("Projects API error, using static fallback:", e);
  }

  // Fallback to static data
  return NextResponse.json(
    { source: "static", projects: fallbackProjects },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
