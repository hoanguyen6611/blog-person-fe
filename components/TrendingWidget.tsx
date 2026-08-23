"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { fetcherUseSWR } from "@/api/useswr";
import { Link } from "@/i18n/navigation";
import { Post } from "@/interface/Post";
import { PostListResponse } from "@/interface/APIResponse";

const TrendingWidget = () => {
  const t = useTranslations("HomePage");
  const { data } = useSWR<PostListResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?sort=trending&limit=4`,
    fetcherUseSWR
  );
  const posts: Post[] = data?.posts ?? [];
  if (posts.length === 0) return null;

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm"
      data-testid="trending-widget"
    >
      <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
        {t("trendingThisWeek")}
      </span>
      {posts.map((post, i) => (
        <div key={post._id}>
          {i > 0 && <div className="my-3 h-px bg-line-soft" />}
          <Link
            href={`/posts/${post._id}`}
            className="flex items-start gap-3"
            data-testid={`trending-widget-item-${post._id}`}
          >
            <span className="font-mono text-sm text-faintest">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-sm font-semibold leading-snug tracking-tight text-ink hover:text-accent-ink">
              {post.title}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TrendingWidget;
