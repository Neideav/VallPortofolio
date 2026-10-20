import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { 
  projects as fallbackProjects, 
  Project, 
  extractProjectCoverImage 
} from "@/data/projects";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    if (supabase) {
      // 1. Fetch mirror of project_images from personal_info if available
      let projectImagesMirror: Record<string, string> = {};
      try {
        const { data: prof } = await supabase
          .from("personal_info")
          .select("currently")
          .eq("id", "default")
          .single();
        if (prof?.currently && typeof prof.currently === "object") {
          projectImagesMirror = ((prof.currently as Record<string, unknown>).project_images as Record<string, string>) || {};
        }
      } catch {
        // ignore mirror fetch error
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        // Map Supabase snake_case to Project camelCase interface with resolved image
        const mapped: Project[] = (data as unknown as Record<string, unknown>[]).map((row) => {
          const resolvedImage = extractProjectCoverImage(
            row as unknown as Parameters<typeof extractProjectCoverImage>[0],
            projectImagesMirror
          );
          return {
            id: String(row.id),
            number: String(row.number),
            title: String(row.title),
            category: String(row.category),
            description: String(row.description),
            detailedDescription: (row.detailed_description as string) || undefined,
            technologies: (row.technologies as string[]) || [],
            githubUrl: String(row.github_url),
            liveUrl: (row.live_url as string) || undefined,
            featured: Boolean(row.featured),
            metrics: (row.metrics as { label: string; value: string }[]) || undefined,
            architecturePoints: Array.isArray(row.architecture_points)
              ? (row.architecture_points as string[])
              : undefined,
            bannerGradient:
              (row.banner_gradient as string) ||
              "from-emerald-950/40 via-slate-900/60 to-zinc-950/80",
            imageUrl: resolvedImage || undefined,
            image: resolvedImage || undefined,
          };
        });

        return NextResponse.json(
          { source: "supabase", projects: mapped },
          {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate",
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
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

