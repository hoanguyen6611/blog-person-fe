"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import PostList from "@/components/PostList";
import SideMenu from "@/components/SideMenu";
import PostSortControl from "@/components/PostSortControl";
import FilterSheet from "@/components/FilterSheet";
import { useTranslations } from "next-intl";

const PostListPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const t = useTranslations("PostsPage");

  return (
    <div className="py-8" data-testid="posts-page">
      <div className="grid gap-8 md:grid-cols-[248px_1fr] md:items-start">
        <aside className="hidden md:block md:sticky md:top-24">
          <SideMenu variant="desktop" />
        </aside>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              {t("title")}
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-sm font-medium text-bg md:hidden"
                data-testid="posts-filter-toggle-button"
              >
                <SlidersHorizontal size={14} />
                {t("filter")}
              </button>
              <PostSortControl />
            </div>
          </div>

          <PostList apiUrl="posts" showPagination variant="grid" />
        </div>
      </div>

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title={t("filter")}
      >
        <SideMenu variant="mobile" />
      </FilterSheet>
    </div>
  );
};

export default PostListPage;
