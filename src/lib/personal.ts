import { personalInfo as fallbackPersonal, PersonalInfo } from "@/data/personal";

export async function fetchPersonalInfo(): Promise<PersonalInfo> {
  try {
    const res = await fetch("/api/personal", {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.personal) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("porto_personal_v1", JSON.stringify(json.personal));
          } catch {}
        }
        return json.personal;
      }
    }
  } catch {}

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("porto_personal_v1");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && parsed.name) return parsed;
      }
    } catch {}
  }

  return fallbackPersonal;
}
