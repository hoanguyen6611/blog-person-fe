"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { fetcherUseSWR } from "@/api/useswr";
import { Link } from "@/i18n/navigation";
import { Post } from "@/interface/Post";
import { Category } from "@/interface/Category";
import { useSavePost } from "@/hooks/useSavePost";
import PostCard from "@/components/PostCard";
import { Bookmark } from "lucide-react";

const SavedPostEntry = ({
  id,
  categoryTitle,
}: {
  id: string;
  categoryTitle: (categoryId: string) => string | undefined;
}) => {
  const { data } = useSWR<Post>(["saved-post", id], ([, postId]) =>
    fetcherUseSWR(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`)
  );
  if (!data) return null;
  return <PostCard post={data} categoryTitle={categoryTitle(data.category)} />;
};

export default function SavedPostsList() {
  const t = useTranslations("SavedPage");
  const { savedPostIds } = useSavePost();
  const { data: categoriesData } = useSWR(
    savedPostIds.length > 0
      ? `${process.env.NEXT_PUBLIC_API_URL}/category/all`
      : null,
    fetcherUseSWR
  );
  const categoryTitle = (categoryId: string) =>
    categoriesData?.categories?.find((c: Category) => c._id === categoryId)
      ?.title;

  if (savedPostIds.length === 0) {
    return (
      <div
        className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-16 text-center"
        data-testid="saved-posts-empty"
      >
        <Bookmark size={28} className="text-faintest" />
        <p className="text-sm text-muted">{t("empty")}</p>
        <Link
          href="/posts"
          className="mt-2 rounded-[10px] bg-ink px-4 py-2 font-cta text-sm font-medium text-bg"
        >
          {t("browse")}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="saved-posts-list"
    >
      {savedPostIds.map((id) => (
        <SavedPostEntry key={id} id={id} categoryTitle={categoryTitle} />
      ))}
    </div>
  );
}
