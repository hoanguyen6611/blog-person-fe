"use client";

import useSWR from "swr";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { fetcherUseSWR } from "@/api/useswr";
import Categories from "./Categories";
import { useTranslations } from "next-intl";
import { Tag } from "@/interface/Tag";
import { cn } from "@/lib/utils";

const SideMenu = ({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) => {
  const router = useRouter();
  const t = useTranslations("PostsPage");
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/tags`,
    fetcherUseSWR
  );
  // Sorted by real usage now that /tags returns postCount — "Popular tags"
  // used to just show whatever order the API happened to return, which was
  // creation order, not popularity. Tags with no published posts are hidden.
  const tags: Tag[] = (data?.tags ?? [])
    .filter((tag: Tag) => (tag.postCount ?? 0) > 0)
    .sort((a: Tag, b: Tag) => (b.postCount ?? 0) - (a.postCount ?? 0));

  return (
    <div className="flex flex-col gap-5" data-testid={`side-menu-${variant}`}>
      <div className="flex flex-col gap-2">
        <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
          {t("category")}
        </span>
        <Categories showCounts variant={variant} />
      </div>

      {Array.isArray(tags) && tags.length > 0 && (
        <>
          <div className="h-px bg-line" />
          <div className="flex flex-col gap-2">
            <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
              {t("popularTags")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 8).map((tag) => (
                <Link
                  key={tag._id}
                  href={`/posts?tag=${tag._id}`}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
                    activeTag === tag._id
                      ? "border-accent bg-accent-soft text-accent-ink"
                      : "border-line text-muted hover:border-accent-soft hover:bg-accent-soft hover:text-accent-ink"
                  )}
                  data-testid={`popular-tag-${tag._id}-${variant}`}
                >
                  #{tag.name}
                  <span className="font-mono text-[11px] text-faintest">
                    {tag.postCount}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="h-px bg-line" />
      <button
        type="button"
        onClick={() => router.push("/posts")}
        className="flex h-9 items-center justify-center rounded-[10px] border border-line text-sm font-medium text-muted hover:text-ink"
        data-testid={`clear-filters-button-${variant}`}
      >
        {t("clearFilters")}
      </button>
    </div>
  );
};

export default SideMenu;
