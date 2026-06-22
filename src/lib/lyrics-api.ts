export interface Suggestion {
  id: number;
  title: string;
  preview?: string;
  duration?: number;
  artist: { id: number; name: string; picture?: string; picture_medium?: string };
  album: { id: number; title: string; cover?: string; cover_medium?: string; cover_big?: string };
}

export interface LyricsResult {
  artist: string;
  title: string;
  lyrics: string;
  cover?: string;
  preview?: string;
}

export async function suggestSongs(query: string, signal?: AbortSignal): Promise<Suggestion[]> {
  if (!query.trim()) return [];
  const url = `https://api.lyrics.ovh/suggest/${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return (data?.data ?? []) as Suggestion[];
}

export async function fetchLyrics(artist: string, title: string, signal?: AbortSignal): Promise<string> {
  const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Lyrics not found");
  const data = await res.json();
  if (!data?.lyrics) throw new Error("No lyrics available for this track");
  // Normalize whitespace
  return String(data.lyrics).replace(/\r\n/g, "\n").trim();
}
