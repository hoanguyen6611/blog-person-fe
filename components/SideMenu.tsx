"use client";

import useSWR from "swr";
import { useRouter } from "@/i18n/navigation";
import { fetcherUseSWR } from "@/api/useswr";
import Categories from "./Categories";
import { useTranslations } from "next-intl";
import { Tag } from "@/interface/Tag";

const SideMenu = ({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) => {
  const router = useRouter();
  const t = useTranslations("PostsPage");
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/tags`,
    fetcherUseSWR
  );
  const tags: Tag[] = data?.tags ?? [];

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
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => router.push(`/posts?search=${tag.name}`)}
                  className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-accent-soft hover:bg-accent-soft hover:text-accent-ink"
                  data-testid={`popular-tag-${tag._id}-${variant}`}
                >
                  #{tag.name}
                </button>
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
