import { Link } from "@/i18n/navigation";
import ImageShow from "./Image";
import BookmarkButton from "./BookmarkButton";
import { Post } from "@/interface/Post";
import { format } from "timeago.js";
import { useTranslations } from "next-intl";

const PostRow = ({
  post,
  categoryTitle,
}: {
  post: Post;
  categoryTitle?: string;
}) => {
  const t = useTranslations("Statistic");
  return (
    <div
      className="flex gap-4 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm"
      data-testid={`post-row-${post._id}`}
    >
      <Link
        href={`/posts/${post._id}`}
        className="h-24 w-[140px] flex-none overflow-hidden rounded-lg border border-line-soft bg-gradient-to-b from-page to-surface-2"
      >
        {post.img && (
          <ImageShow
            src={post.img}
            alt={post.title}
            width={280}
            height={192}
            className="h-full w-full object-cover"
          />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {categoryTitle && (
          <span className="w-fit rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-muted">
            {categoryTitle}
          </span>
        )}
        <Link href={`/posts/${post._id}`}>
          <h3 className="font-display text-[17px] font-bold leading-snug tracking-tight text-ink hover:text-accent-ink">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm leading-snug text-muted line-clamp-1">
          {post.desc}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-0.5 font-meta text-xs text-faint">
          <span className="whitespace-nowrap font-semibold text-ink">
            {post.user?.username}
          </span>
          <span className="whitespace-nowrap">{format(post.createdAt)}</span>
          {typeof post.visit === "number" && (
            <span className="whitespace-nowrap">
              · {post.visit} {t("views")}
            </span>
          )}
        </div>
      </div>
      <BookmarkButton postId={post._id} className="self-start" />
    </div>
  );
};

export default PostRow;
