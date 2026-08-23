"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const SORTS = ["trending", "popular", "newest", "oldest"] as const;

const PostSortControl = () => {
  const t = useTranslations("PostsPage");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeSort = searchParams.get("sort") ?? "newest";

  const setSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      className="flex items-center gap-0.5 rounded-[10px] bg-surface-2 p-0.5"
      data-testid="post-sort-control"
    >
      {SORTS.map((sort) => (
        <button
          key={sort}
          type="button"
          onClick={() => setSort(sort)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            activeSort === sort
              ? "bg-surface text-ink shadow-sm"
              : "text-muted hover:text-ink"
          )}
          data-testid={`post-sort-${sort}`}
        >
          {t(`sort.${sort}`)}
        </button>
      ))}
    </div>
  );
};

export default PostSortControl;
