"use client";
import { Link } from "@/i18n/navigation";
import ImageShow from "@/components/Image";
import { format } from "timeago.js";
import { useTranslations } from "next-intl";
import { Eye, Pencil, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Post } from "@/interface/Post";

export interface AuthorPostCardData extends Post {
  key: string;
  categoryName?: string;
  postStatus: "published" | "scheduled" | "draft";
}

const statusBadgeClass: Record<AuthorPostCardData["postStatus"], string> = {
  published: "bg-success-bg text-success",
  scheduled: "bg-accent-soft text-accent-ink",
  draft: "bg-surface-2 text-muted",
};

const AuthorPostCards = ({
  posts,
  onPublish,
  onDeleteRequest,
  emptyStateAction,
}: {
  posts: AuthorPostCardData[];
  onPublish: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  emptyStateAction: React.ReactNode;
}) => {
  const tCms = useTranslations("Cms");

  if (posts.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-soft bg-surface px-6 py-14 text-center"
        data-testid="author-post-cards-empty"
      >
        <p className="text-sm text-muted">{tCms("noPostsYet")}</p>
        {emptyStateAction}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="author-post-cards"
    >
      {posts.map((post) => (
        <div
          key={post._id}
          className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-surface p-3 shadow-sm"
          data-testid={`author-post-card-${post._id}`}
        >
          <ImageShow
            src={post.img}
            alt={post.title}
            width={400}
            height={200}
            className="h-[140px] w-full flex-none rounded-xl object-cover"
          />
          <div className="flex flex-col gap-1.5 px-0.5">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide",
                  statusBadgeClass[post.postStatus]
                )}
              >
                {tCms(
                  post.postStatus === "published"
                    ? "statusPublished"
                    : post.postStatus === "scheduled"
                      ? "statusScheduled"
                      : "statusDraft"
                )}
              </span>
              {post.categoryName && (
                <span className="truncate font-meta text-xs text-faint">
                  {post.categoryName}
                </span>
              )}
            </div>
            <h3
              className="line-clamp-2 font-display text-[15px] font-semibold leading-snug tracking-tight text-ink"
              data-testid={`author-post-card-title-${post._id}`}
            >
              {post.title}
            </h3>
            <div className="flex items-center gap-3 font-meta text-xs text-faint">
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {post.visit ?? 0}
              </span>
              <span>{format(post.updatedAt || post.createdAt)}</span>
            </div>
          </div>

          <div className="mt-auto flex items-center gap-2 pt-1">
            <Link
              href={`/cms/edit/post/${post._id}`}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-line font-cta text-sm font-medium text-ink transition-colors hover:border-accent-soft hover:text-accent-ink"
              data-testid={`author-post-card-edit-${post._id}`}
            >
              <Pencil size={14} />
              {tCms("actionEdit")}
            </Link>
            {post.postStatus !== "published" && (
              <button
                type="button"
                onClick={() => onPublish(post._id)}
                className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:border-accent-soft hover:text-accent-ink"
                aria-label={tCms("actionPublish")}
                title={tCms("actionPublish")}
                data-testid={`author-post-card-publish-${post._id}`}
              >
                <Send size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onDeleteRequest(post._id)}
              className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:border-red-200 hover:text-red-500"
              aria-label={tCms("bulkDelete")}
              title={tCms("bulkDelete")}
              data-testid={`author-post-card-delete-${post._id}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthorPostCards;
