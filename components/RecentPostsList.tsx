"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { fetcherUseSWR } from "@/api/useswr";
import { Link } from "@/i18n/navigation";
import { Post } from "@/interface/Post";
import { Category } from "@/interface/Category";
import { PostListResponse } from "@/interface/APIResponse";
import PostRow from "./PostRow";

const RecentPostsList = () => {
  const t = useTranslations("HomePage");
  const { data, error, isLoading } = useSWR<PostListResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?limit=5&sort=newest`,
    fetcherUseSWR
  );
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );

  const categoryTitle = (post: Post) =>
    categories?.categories.find((c: Category) => c._id === post.category)
      ?.title;

  if (isLoading)
    return <p className="text-muted" data-testid="recent-posts-loading">Loading...</p>;
  if (error)
    return <p className="text-muted" data-testid="recent-posts-error">Failed to load</p>;

  const posts: Post[] = data?.posts ?? [];

  return (
    <div className="flex min-w-0 flex-col gap-4" data-testid="recent-posts-list">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          {t("recentPosts")}
        </h2>
        <Link
          href="/posts"
          className="text-sm font-medium text-accent hover:text-accent-dark"
        >
          {t("viewAll")} →
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <PostRow key={post._id} post={post} categoryTitle={categoryTitle(post)} />
        ))}
      </div>
    </div>
  );
};

export default RecentPostsList;
