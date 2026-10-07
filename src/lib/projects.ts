import { projects as staticProjects, Project } from "@/data/projects";

export async function getProjects(): Promise<Project[]> {
  try {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.projects) && json.projects.length > 0) {
          return json.projects;
        }
      }
    }
  } catch {
    // Fallback to static data on network error
  }
  return staticProjects;
}
