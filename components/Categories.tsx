"use client";

import { Category } from "@/interface/Category";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcherUseSWR } from "../api/useswr";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PostListResponse } from "@/interface/APIResponse";

const rowClass = (active: boolean) =>
  cn(
    "flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors",
    active
      ? "bg-surface-2 font-semibold text-ink"
      : "text-muted hover:text-ink"
  );

const CategoryCount = ({ catId }: { catId?: string }) => {
  const { data } = useSWR<PostListResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?limit=1${
      catId ? `&cat=${catId}` : ""
    }`,
    fetcherUseSWR
  );
  if (data?.totalPosts === undefined) return null;
  return <span className="font-mono text-xs text-faintest">{data.totalPosts}</span>;
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
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
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
      {(data?.categories || []).map((category: Category) => (
        <Link
          href={`/posts?cat=${category._id}`}
          key={category._id}
          className={rowClass(activeCat === category._id)}
          data-testid={`categories-link-${category._id}-${variant}`}
        >
          {category.title}
          {showCounts && <CategoryCount catId={category._id} />}
        </Link>
      ))}
    </div>
  );
};

export default Categories;
