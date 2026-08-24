"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { fetcherUseSWR } from "@/api/useswr";
import { Link } from "@/i18n/navigation";
import { Post } from "@/interface/Post";
import { useSavePost } from "@/hooks/useSavePost";
import PostListItem from "@/components/PostListItem";
import { Bookmark } from "lucide-react";

const SavedPostEntry = ({ id }: { id: string }) => {
  const { data } = useSWR<Post>(["saved-post", id], ([, postId]) =>
    fetcherUseSWR(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`)
  );
  if (!data) return null;
  return <PostListItem post={data} />;
};

export default function SavedPostsList() {
  const t = useTranslations("SavedPage");
  const { savedPostIds } = useSavePost();

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
    <div className="mt-6 flex flex-col gap-4" data-testid="saved-posts-list">
      {savedPostIds.map((id) => (
        <SavedPostEntry key={id} id={id} />
      ))}
    </div>
  );
}
