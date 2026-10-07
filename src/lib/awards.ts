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
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return { awards: defaultAwardsList, photos: defaultAwardPhotosList };
    }
    const json = await res.json();
    return {
      awards: json.awards || defaultAwardsList,
      photos: normalizeAwardPhotos(json.photos),
    };
  } catch {
    return { awards: defaultAwardsList, photos: defaultAwardPhotosList };
  }
}

