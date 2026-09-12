import { Link } from "@/i18n/navigation";
import ImageShow from "./Image";
import BookmarkButton from "./BookmarkButton";
import { Post } from "@/interface/Post";
import { format } from "timeago.js";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Eye, MessageCircle, Clock } from "lucide-react";
import { readingTimeMinutes } from "@/lib/wordCount";

const PostRow = ({
  post,
  categoryTitle,
}: {
  post: Post;
  categoryTitle?: string;
}) => {
  const t = useTranslations("Statistic");
  const tPost = useTranslations("PostDetail");
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm sm:flex-row sm:items-center"
      data-testid={`post-row-${post._id}`}
    >
      <div className="flex flex-none items-center gap-3 sm:w-[180px]">
        <ImageShow
          src={post.user?.img || ""}
          alt={post.user?.username || ""}
          width={40}
          height={40}
          className="h-10 w-10 flex-none rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-ink">
            {post.user?.username}
          </span>
          {categoryTitle && (
            <span className="truncate font-meta text-xs text-faint">
              {categoryTitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Link href={`/posts/${post._id}`}>
          <h3 className="font-display text-[17px] font-bold leading-snug tracking-tight text-ink hover:text-accent-ink">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm leading-snug text-muted line-clamp-1">
          {post.desc}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-meta text-xs text-faint">
          <span className="whitespace-nowrap">{format(post.createdAt)}</span>
          {typeof post.visit === "number" && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Eye size={12} />
              {post.visit} {t("views")}
            </span>
          )}
          {typeof post.commentCount === "number" && post.commentCount > 0 && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <MessageCircle size={12} />
              {post.commentCount} {t("comments")}
            </span>
          )}
          {post.content && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Clock size={12} />
              {readingTimeMinutes(post.content)} {t("readTime")}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-none items-center gap-2">
        <BookmarkButton postId={post._id} />
        <Link
          href={`/posts/${post._id}`}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent-soft hover:text-accent-ink"
          aria-label={tPost("continueReading")}
          title={tPost("continueReading")}
          data-testid={`post-row-cta-${post._id}`}
        >
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default PostRow;
