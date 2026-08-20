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
  "px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all";
const pillInactive =
  "bg-gray-100 text-gray-800 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-900/40";
const pillActive = "bg-blue-800 text-white hover:bg-blue-700";

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
            className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-gray-100 dark:bg-gray-700"
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
        >
          {cat.title}
        </Link>
      ))}
    </HorizontalScroll>
  );
};

const MainCategories = () => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl bg-white p-3 shadow-md dark:bg-gray-800 dark:text-gray-400">
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
          title="Tìm kiếm nâng cao"
          href="/search"
          className={cn(pillBase, pillInactive)}
        >
          <FilterOutlined />
        </Link>
      </div>
    </div>
  );
};

export default MainCategories;
