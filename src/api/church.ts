import { apiClient } from "./client";
import type { ChurchSettings, RegularService, FellowshipGroup, ChurchEvent, LatestSermon, Article, ArticleDetail } from "./types";

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

// Public per-church-key endpoint (jerur-next app/api/sermon/get/route.js),
// distinct from the admin's staff-session-gated /sermon route — returns
// the single most recent PUBLISHED sermon, already trimmed to what the
// Home screen's "Latest Sermon" card needs. `data` is null when the
// church has no published sermon at all.
export async function getLatestSermon(): Promise<LatestSermon | null> {
  const { data } = await apiClient.get<{ data: LatestSermon | null }>("/sermon/get");
  return data?.data ?? null;
}

// Same public per-church-key endpoint the admin's article list/reader will
// eventually share (GET /article/get) - `action=latest` already exists
// server-side for exactly this ("Phase 2 preparation" per that route's own
// comment), so this is the first consumer, not a new endpoint. Only ever
// returns published articles - the route filters on status itself.
export async function getLatestArticles(limit = 4): Promise<Article[]> {
  const { data } = await apiClient.get<{ data: Article[]; success: boolean }>("/article/get", {
    params: { action: "latest", limit },
  });
  return data?.data ?? [];
}

export async function getArticleDetail(id: string): Promise<ArticleDetail | null> {
  const { data } = await apiClient.get<{ data: ArticleDetail; success: boolean }>("/article/get", {
    params: { action: "detail", id },
  });
  return data?.data ?? null;
}
