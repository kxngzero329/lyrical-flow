import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const searchYouTube = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ q: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    try {
      const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        data.q + " official audio"
      )}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (!res.ok) return { videoId: null as string | null };
      const html = await res.text();
      // First videoId in the search result payload is the top hit
      const m = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      return { videoId: m?.[1] ?? null };
    } catch {
      return { videoId: null as string | null };
    }
  });
