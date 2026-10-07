import { TrainingEntry, defaultTrainingData } from "@/data/trainings";

export async function fetchTrainingsData(): Promise<TrainingEntry[]> {
  try {
    const res = await fetch("/api/trainings", {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.trainings) && json.trainings.length > 0) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("porto_trainings_v1", JSON.stringify(json.trainings));
          } catch {}
        }
        return json.trainings;
      }
    }
  } catch (err) {
    console.error("fetchTrainingsData error:", err);
  }

  // Fallback to localStorage if available
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("porto_trainings_v1");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }

  return defaultTrainingData;
}
