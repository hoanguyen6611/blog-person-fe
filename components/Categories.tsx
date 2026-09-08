"use client";

import { useEffect, useState } from "react";
import { Category } from "@/interface/Category";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcherUseSWR } from "../api/useswr";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PostListResponse } from "@/interface/APIResponse";

const COLLAPSED_COUNT = 15;

const rowClass = (active: boolean) =>
  cn(
    "flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors",
    active
      ? "bg-surface-2 font-semibold text-ink"
      : "text-muted hover:text-ink"
  );

// If /category ever returns postCount per category (mirroring /tags), this
// renders it directly with zero extra requests. Until then it falls back to
// the old one-request-per-category behavior, so nothing breaks either way.
const CategoryCount = ({
  catId,
  presetCount,
}: {
  catId?: string;
  presetCount?: number;
}) => {
  const shouldFetch = presetCount === undefined;
  const { data } = useSWR<PostListResponse>(
    shouldFetch
      ? `${process.env.NEXT_PUBLIC_API_URL}/posts?limit=1${
          catId ? `&cat=${catId}` : ""
        }`
      : null,
    fetcherUseSWR
  );
  const count = presetCount ?? data?.totalPosts;
  if (count === undefined) return null;
  return <span className="font-mono text-xs text-faintest">{count}</span>;
};

const Categories = ({
  showCounts,
  variant = "desktop",
}: {
  showCounts?: boolean;
  variant?: "desktop" | "mobile";
}) => {
  const t = useTranslations("PostDetail");
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat");
  const [expanded, setExpanded] = useState(false);
  // Categories/SideMenu never unmounts when only the "cat" query param
  // changes (same route, e.g. picking a filter or hitting back to it) — so
  // without this, "expanded" would keep whatever value it had from before,
  // instead of the collapsed default a fresh look at the list should start
  // from.
  useEffect(() => {
    setExpanded(false);
  }, [activeCat]);
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category/all`,
    fetcherUseSWR
  );
  const categories: Category[] = data?.categories || [];
  const hasMore = categories.length > COLLAPSED_COUNT;
  const visibleCategories =
    expanded || !hasMore ? categories : categories.slice(0, COLLAPSED_COUNT);
  return (
    <div className="flex flex-col gap-0.5">
      <Link
        href="/posts"
        className={rowClass(!activeCat)}
        data-testid={`categories-link-all-${variant}`}
      >
        {t("all")}
        {showCounts && <CategoryCount />}
      </Link>
      {visibleCategories.map((category: Category) => (
        <Link
          href={`/posts?cat=${category._id}`}
          key={category._id}
          className={rowClass(activeCat === category._id)}
          data-testid={`categories-link-${category._id}-${variant}`}
        >
          {category.title}
          {showCounts && (
            <CategoryCount catId={category._id} presetCount={category.postCount} />
          )}
        </Link>
      ))}
      {hasMore && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={cn(rowClass(false), "justify-center")}
          data-testid={`categories-show-more-${variant}`}
          aria-label={t("showMoreCategories")}
        >
          &#8226;&#8226;&#8226;
        </button>
      )}
    </div>
  );
};

export default Categories;
