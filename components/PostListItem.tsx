import { Link } from "@/i18n/navigation";
import ImageShow from "./Image";
import { Post } from "@/interface/Post";
import { format } from "timeago.js";

const PostListItem = ({ post }: { post: Post }) => {
  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition hover:shadow-md xl:flex-row">
      {/* image */}
      {post.img && (
        <Link href={`/posts/${post._id}`} className="block xl:w-1/3">
          <ImageShow
            src={post.img}
            className="aspect-video w-full object-cover xl:aspect-auto xl:h-full"
            width={600}
            height={400}
            alt={post.title}
          />
        </Link>
      )}
      {/* details */}
      <div className="flex flex-col gap-3 p-5 xl:w-2/3">
        <Link href={`/posts/${post._id}`} data-testid={`post-item-${post._id}`}>
          <h3 className="font-display text-lg font-bold leading-snug text-ink hover:text-accent-ink">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-muted line-clamp-2">{post.desc}</p>
        <div className="flex gap-3 font-mono text-xs text-muted">
          <span>{post.user.username}</span>
          <span>{format(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
