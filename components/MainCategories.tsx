"use client";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { Category } from "@/interface/Category";
import { useTranslations } from "next-intl";
import HorizontalScroll from "./HorizontalScroll";
import { cn } from "@/lib/utils";

const pillBase =
  "px-3 py-1.5 text-[13px] md:px-4 md:py-2 md:text-sm rounded-full font-semibold whitespace-nowrap transition-all";
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
  const t = useTranslations("MainCategories");
  return (
    <div className="flex flex-col gap-2 md:flex-row md:min-w-0 md:items-center">
      <span className="shrink-0 font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
        {t("categoriesLabel")}
      </span>
      <div className="flex min-w-0 items-center gap-2">
        <Suspense fallback={null}>
          <AllPostsPill />
        </Suspense>
        <div className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <CategoryPills />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default MainCategories;
