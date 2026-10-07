import { TrainingEntry, defaultTrainingData } from "@/data/trainings";

export async function fetchTrainingsData(): Promise<TrainingEntry[]> {
  try {
    const res = await fetch("/api/trainings", {
      next: { revalidate: 60 },
    });
    if (!res.ok) return defaultTrainingData;
    const json = await res.json();
    return json.trainings && json.trainings.length > 0
      ? json.trainings
      : defaultTrainingData;
  } catch {
    return defaultTrainingData;
  }
}
