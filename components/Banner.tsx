"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { Category } from "@/interface/Category";
import { Post } from "@/interface/Post";
import { PostListResponse } from "@/interface/APIResponse";
import ImageShow from "./Image";
import { ArrowRight } from "lucide-react";

const Banner = () => {
  const t = useTranslations("Banner");
  const { data: featuredData } = useSWR<PostListResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?featured=true&limit=1`,
    fetcherUseSWR
  );
  const { data: newestData } = useSWR<PostListResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?limit=1&sort=newest`,
    fetcherUseSWR
  );
  const { data: categoriesData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );

  const featured: Post | undefined =
    featuredData?.posts?.[0] ?? newestData?.posts?.[0];
  const categoryTitle = categoriesData?.categories.find(
    (c: Category) => c._id === featured?.category
  )?.title;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_460px] lg:items-center">
      <div className="flex max-w-xl flex-col gap-5">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent-ink">
          Tech News
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight text-ink text-balance">
          {t("title")}
        </h1>
        <p className="text-lg text-muted">{t("description")}</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/write"
            className="flex items-center gap-2 rounded-full bg-gradient-to-b from-accent to-accent-dark px-6 py-3 font-cta text-sm font-semibold text-white hover:opacity-90"
            data-testid="banner-start-writing-button"
          >
            {t("startWriting")}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/posts"
            className="rounded-full border border-line px-6 py-3 font-cta text-sm font-semibold text-ink hover:border-accent hover:text-accent"
            data-testid="banner-explore-posts-button"
          >
            {t("explorePosts")}
          </Link>
        </div>
      </div>

      {featured && (
        <Link
          href={`/posts/${featured._id}`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-surface p-3 shadow-sm"
          data-testid={`banner-featured-post-${featured._id}`}
        >
          <div className="h-56 overflow-hidden rounded-xl border border-line-soft bg-gradient-to-b from-page to-surface-2">
            {featured.img && (
              <ImageShow
                src={featured.img}
                alt={featured.title}
                width={700}
                height={400}
                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
              />
            )}
          </div>
          <div className="flex flex-col gap-2 p-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-ink">
                {t("featuredBadge")}
              </span>
              {categoryTitle && (
                <span className="font-meta text-xs text-muted">
                  {categoryTitle}
                </span>
              )}
            </div>
            <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-ink line-clamp-2">
              {featured.title}
            </h3>
            <p className="text-sm text-muted line-clamp-2">{featured.desc}</p>
            <div className="flex items-center gap-2 pt-1">
              <ImageShow
                src={featured.user?.img}
                alt={featured.user?.username}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-ink">
                {featured.user?.username}
              </span>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Banner;
