"use client";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import SearchInput from "./Search";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { Category } from "@/interface/Category";
import { useTranslations } from "next-intl";
import { FilterOutlined } from "@ant-design/icons";
import HorizontalScroll from "./HorizontalScroll";
import { cn } from "@/lib/utils";

const pillBase =
  "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all";
const pillInactive = "bg-surface-2 text-ink hover:bg-line";
const pillActive = "bg-ink text-bg hover:opacity-90";

const AllPostsPill = () => {
  const t = useTranslations("MainCategories");
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat");

  return (
    <Link
      aria-label={t("allPosts")}
      href="/posts"
      className={cn(
        pillBase,
        "shrink-0",
        !activeCat ? pillActive : pillInactive
      )}
      data-testid="category-pill-all"
    >
      {t("allPosts")}
    </Link>
  );
};

const CategoryPills = () => {
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category/getLimit`,
    fetcherUseSWR
  );
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat");

  return (
    <HorizontalScroll>
      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-surface-2"
          />
        ))}

      {data?.categories?.map((cat: Category) => (
        <Link
          key={cat._id}
          href={`/posts?cat=${cat._id}`}
          className={cn(
            pillBase,
            activeCat === cat._id ? pillActive : pillInactive
          )}
          data-testid={`category-pill-${cat._id}`}
        >
          {cat.title}
        </Link>
      ))}
    </HorizontalScroll>
  );
};

const MainCategories = () => {
  const tSearch = useTranslations("AdvancedSearch");
  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl border border-line bg-surface p-3 shadow-sm text-ink">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Suspense fallback={null}>
          <AllPostsPill />
        </Suspense>
        <div className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <CategoryPills />
          </Suspense>
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-3 md:flex">
        <SearchInput />
        <Link
          title={tSearch("title")}
          href="/search"
          className={cn(pillBase, pillInactive, "px-3")}
          data-testid="main-categories-advanced-search-link"
        >
          <FilterOutlined />
        </Link>
      </div>
    </div>
  );
};

export default MainCategories;
