import { apiClient } from "./client";
import type { ChurchSettings, RegularService, FellowshipGroup, ChurchEvent } from "./types";

// These paths match Jerur's actual route handlers directly (church/get,
// slider/get, etc.) — not church-site's renamed proxy paths
// (settings, regular-services) from the earlier proxied-through-the-website
// version of this file. Every one of these requires the "nj-api-key" header,
// attached automatically by the interceptor in client.ts based on whichever
// church is currently selected (see src/church/SelectedChurchContext.tsx).

export async function getSettings(): Promise<ChurchSettings | null> {
  const { data } = await apiClient.get<{ data: ChurchSettings }>("/church/get");
  return data?.data ?? null;
}

export async function getRegularServices(): Promise<RegularService[]> {
  const { data } = await apiClient.get<{ data: RegularService[] }>("/regularService/get");
  return data.data ?? [];
}

export async function getPrayerTimes(): Promise<RegularService[]> {
  const { data } = await apiClient.get<{ data: RegularService[] }>("/regularService/get/prayer");
  return data.data ?? [];
}

export async function getFellowshipGroups(): Promise<FellowshipGroup[]> {
  const { data } = await apiClient.get<{ data: FellowshipGroup[] }>("/fellowship/get");
  return data.data ?? [];
}

export async function getEvents(): Promise<ChurchEvent[]> {
  const { data } = await apiClient.get<{ data: ChurchEvent[] }>("/event/get");
  return data.data ?? [];
}
