export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

export async function fetchLatestNews(companyName: string): Promise<NewsItem[]> {
  const gnewsKey = process.env.GNEWS_API_KEY;

  if (gnewsKey) {
    try {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        companyName
      )}&lang=en&max=6&apikey=${gnewsKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const items: NewsItem[] = (data.articles || []).map((a: any) => ({
          title: a.title,
          source: a.source?.name ?? "Unknown",
          url: a.url,
          publishedAt: a.publishedAt
        }));
        if (items.length) return items;
      }
    } catch (err) {
      console.error("GNews fetch failed, falling back to RSS:", err);
    }
  }

  return fetchNewsFromGoogleRSS(companyName);
}

async function fetchNewsFromGoogleRSS(companyName: string): Promise<NewsItem[]> {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
      companyName + " company"
    )}&hl=en-US&gl=US&ceid=US:en`;
    const res = await fetch(rssUrl);
    const xml = await res.text();

    const items: NewsItem[] = [];
    const itemBlocks = xml.split("<item>").slice(1, 7);

    for (const block of itemBlocks) {
      const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
      const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim();
      const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim();
      const source = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.trim();

      if (title && link) {
        items.push({
          title: decodeXmlEntities(title),
          source: source ? decodeXmlEntities(source) : "Google News",
          url: link,
          publishedAt: pubDate ?? ""
        });
      }
    }

    return items;
  } catch (err) {
    console.error("Google News RSS fetch failed:", err);
    return [];
  }
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
