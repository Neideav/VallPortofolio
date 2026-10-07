import { 
  AwardItem, 
  AwardPhoto, 
  defaultAwardsList, 
  defaultPhotoColumns 
} from "@/data/awards";

export interface AwardsPayload {
  awards: AwardItem[];
  photos: AwardPhoto[][];
}

export async function fetchAwardsData(): Promise<AwardsPayload> {
  try {
    const res = await fetch("/api/awards", {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return { awards: defaultAwardsList, photos: defaultPhotoColumns };
    }
    const json = await res.json();
    return {
      awards: json.awards || defaultAwardsList,
      photos: json.photos || defaultPhotoColumns,
    };
  } catch {
    return { awards: defaultAwardsList, photos: defaultPhotoColumns };
  }
}
