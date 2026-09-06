import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { routing } from "@/i18n/routing";
import { Post } from "@/interface/Post";
import { PostListResponse } from "@/interface/APIResponse";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PAGE_SIZE = 100;
const MAX_PAGES = 50; // safety cap so a runaway backend can't hang the build

async function fetchAllPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(
      `${API_URL}/posts?page=${page}&limit=${PAGE_SIZE}`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) break;
    const data: PostListResponse = await res.json();
    posts.push(...(data.posts ?? []));
    if (!data.hasMore || posts.length >= (data.totalPosts ?? 0)) break;
  }
  return posts;
}

const STATIC_PATHS = ["", "/posts", "/about"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts().catch(() => []);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/${locale}/posts/${post._id}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
