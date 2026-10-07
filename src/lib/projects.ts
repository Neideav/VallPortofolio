import { projects as staticProjects, Project } from "@/data/projects";

export async function getProjects(): Promise<Project[]> {
  try {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.projects) && json.projects.length > 0) {
          try {
            localStorage.setItem("porto_projects_v1", JSON.stringify(json.projects));
          } catch {}
          return json.projects;
        }
      }
    }
  } catch {
    // Fallback to static data on network error
  }

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("porto_projects_v1");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }

  return staticProjects;
}
