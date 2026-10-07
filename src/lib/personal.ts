import { personalInfo as fallbackPersonal, PersonalInfo } from "@/data/personal";

export async function fetchPersonalInfo(): Promise<PersonalInfo> {
  try {
    const res = await fetch("/api/personal", {
      cache: "no-store",
    });
    if (!res.ok) return fallbackPersonal;
    const json = await res.json();
    return json.personal || fallbackPersonal;
  } catch {
    return fallbackPersonal;
  }
}
