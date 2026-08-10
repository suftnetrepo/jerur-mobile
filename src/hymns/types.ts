export interface HymnSummary {
  id: string;
  title: string;
}

export interface Hymn extends HymnSummary {
  content: string;
}
