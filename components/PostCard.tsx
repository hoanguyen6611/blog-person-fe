import { Link } from "@/i18n/navigation";
import ImageShow from "./Image";
import BookmarkButton from "./BookmarkButton";
import { Post } from "@/interface/Post";
import { format } from "timeago.js";

const PostCard = ({
  post,
  categoryTitle,
}: {
  post: Post;
  categoryTitle?: string;
}) => {
  return (
    <div
      className="flex flex-col gap-2.5 rounded-2xl border border-line-soft bg-surface p-3 shadow-sm"
      data-testid={`post-card-${post._id}`}
    >
      <Link
        href={`/posts/${post._id}`}
        className="block h-[132px] overflow-hidden rounded-lg border border-line-soft bg-gradient-to-b from-page to-surface-2"
      >
        {post.img && (
          <ImageShow
            src={post.img}
            alt={post.title}
            width={320}
            height={200}
            className="h-full w-full object-cover"
          />
        )}
      </Link>
      <div className="flex flex-col gap-1.5 px-0.5">
        <div className="flex items-center justify-between">
          {categoryTitle && (
            <span className="text-[11px] font-semibold text-accent">
              {categoryTitle}
            </span>
          )}
          <BookmarkButton postId={post._id} className="h-6 w-6" />
        </div>
        <Link href={`/posts/${post._id}`}>
          <h3 className="font-display text-[16px] font-bold leading-snug tracking-tight text-ink line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <span className="font-meta text-xs text-faint">
          {post.user?.username} · {format(post.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default PostCard;
