import { SITE_URL } from "@/lib/siteUrl";
import { Post } from "@/interface/Post";
import { PostListResponse } from "@/interface/APIResponse";

export const revalidate = 3600;

const FEED_LIMIT = 30;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchLatestPosts(): Promise<Post[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?limit=${FEED_LIMIT}&sort=newest`,
    { next: { revalidate }, signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) return [];
  const data: PostListResponse = await res.json();
  return data.posts ?? [];
}

export async function GET() {
  const posts = await fetchLatestPosts().catch(() => []);

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/vi/posts/${post._id}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.desc || "")}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Tech News</title>
    <link>${SITE_URL}</link>
    <description>Chia sẻ kiến thức, công nghệ và những câu chuyện nghề.</description>
    <language>vi</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
