import { 
  AwardItem, 
  AwardPhoto, 
  defaultAwardsList, 
  defaultAwardPhotosList,
  normalizeAwardPhotos 
} from "@/data/awards";

export interface AwardsPayload {
  awards: AwardItem[];
  photos: AwardPhoto[];
}

export async function fetchAwardsData(): Promise<AwardsPayload> {
  try {
    const res = await fetch("/api/awards", {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const resolvedAwards = json.awards && json.awards.length > 0 ? json.awards : defaultAwardsList;
      const resolvedPhotos = normalizeAwardPhotos(json.photos);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("porto_awards_v1", JSON.stringify(resolvedAwards));
          localStorage.setItem("porto_award_photos_v1", JSON.stringify(resolvedPhotos));
        } catch {}
      }

      return {
        awards: resolvedAwards,
        photos: resolvedPhotos,
      };
    }
  } catch (err) {
    console.error("fetchAwardsData error:", err);
  }

  // Fallback to localStorage if available
  if (typeof window !== "undefined") {
    try {
      const localAwards = localStorage.getItem("porto_awards_v1");
      const localPhotos = localStorage.getItem("porto_award_photos_v1");
      return {
        awards: localAwards ? JSON.parse(localAwards) : defaultAwardsList,
        photos: localPhotos ? JSON.parse(localPhotos) : defaultAwardPhotosList,
      };
    } catch {}
  }

  return { awards: defaultAwardsList, photos: defaultAwardPhotosList };
}

