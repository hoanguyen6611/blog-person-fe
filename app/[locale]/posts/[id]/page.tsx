import type { Metadata } from "next";
import PostDetailClient from "./PostDetailClient";
import { Post } from "@/interface/Post";

async function fetchPost(id: string): Promise<Post | null> {
  // Metadata generation blocks the page render, so a slow/unreachable
  // backend must not hang it indefinitely — fall back to defaults instead.
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(5000),
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post?.title) {
    return { title: "Post not found" };
  }

  const description = post.desc || undefined;
  // post.img is a path relative to ImageKit, not an absolute URL — same
  // convention as ImageShow.tsx / PostCreate.tsx's cover image handling.
  const imageUrl = post.img
    ? `${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${post.img}`
    : undefined;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

const ItemPostPage = () => {
  return <PostDetailClient />;
};

export default ItemPostPage;
