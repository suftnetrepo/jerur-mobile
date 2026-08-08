import { apiClient } from "./client";
import type { ChurchSearchResult } from "./types";

export async function searchChurchesByQuery(searchQuery: string): Promise<ChurchSearchResult[]> {
  const { data } = await apiClient.get<{ data: ChurchSearchResult[]; success: boolean }>("/church/search", {
    params: { action: "search", searchQuery },
  });
  return data.data ?? [];
}

export async function searchChurchesByRadius(
  latitude: number,
  longitude: number,
  radiusKm: number
): Promise<ChurchSearchResult[]> {
  const { data } = await apiClient.get<{ data: ChurchSearchResult[]; success: boolean }>("/church/search", {
    params: { action: "radius", latitude, longitude, radius: radiusKm },
  });
  return data.data ?? [];
}
