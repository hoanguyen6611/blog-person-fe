"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { SlidersHorizontal } from "lucide-react";
import PostList from "@/components/PostList";
import SideMenu from "@/components/SideMenu";
import PostSortControl from "@/components/PostSortControl";
import FilterSheet from "@/components/FilterSheet";
import { useTranslations } from "next-intl";
import { fetcherUseSWR } from "@/api/useswr";
import { Category } from "@/interface/Category";
import { Tag } from "@/interface/Tag";

const PostListPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const t = useTranslations("PostsPage");
  const searchParams = useSearchParams();
  const activeTagId = searchParams.get("tag");
  const activeCatId = searchParams.get("cat");

  const { data: tagsData } = useSWR(
    activeTagId ? `${process.env.NEXT_PUBLIC_API_URL}/tags` : null,
    fetcherUseSWR
  );
  const { data: categoriesData } = useSWR(
    activeCatId ? `${process.env.NEXT_PUBLIC_API_URL}/category` : null,
    fetcherUseSWR
  );

  const activeTagName = tagsData?.tags?.find(
    (tag: Tag) => tag._id === activeTagId
  )?.name;
  const activeCategoryName = categoriesData?.categories?.find(
    (cat: Category) => cat._id === activeCatId
  )?.title;

  const heading = activeTagId
    ? t("filteredByTag", { tag: activeTagName ?? "" })
    : activeCatId
      ? t("filteredByCategory", { category: activeCategoryName ?? "" })
      : t("title");

  return (
    <div className="py-8" data-testid="posts-page">
      <div className="grid gap-8 md:grid-cols-[248px_1fr] md:items-start">
        <aside className="hidden md:block md:sticky md:top-24">
          <SideMenu variant="desktop" />
        </aside>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1
              className="font-display text-2xl font-bold tracking-tight text-ink"
              data-testid="posts-page-heading"
            >
              {heading}
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
