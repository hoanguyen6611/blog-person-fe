"use client";
import { Link } from "@/i18n/navigation";
import ImageShow from "./Image";
import { fetcherUseSWR } from "../api/useswr";
import useSWR from "swr";
import { format } from "timeago.js";
import { Category } from "@/interface/Category";
import { Post } from "@/interface/Post";

const FeaturedPost = () => {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?featured=true&limit=4&sort=newest`,
    fetcherUseSWR
  );
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );

  if (isLoading) return <p className="text-muted">Loading...</p>;
  if (error) return <p className="text-muted">Failed to load</p>;

  const posts: Post[] = data?.posts || [];
  if (posts.length === 0) return null;

  const categoryTitle = (post: Post) =>
    categories?.categories.find((c: Category) => c._id === post.category)
      ?.title;

  const [main, ...rest] = posts;

  return (
    <div
      className="grid gap-5 lg:grid-cols-[1.35fr_1fr]"
      data-testid="featured-posts"
    >
      <Link
        href={`/posts/${main._id}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition hover:shadow-md"
        data-testid={`featured-post-${main._id}`}
      >
        {main.img && (
          <ImageShow
            src={main.img}
            className="aspect-[16/9] w-full object-cover transition group-hover:scale-[1.02]"
            width={700}
            height={400}
            alt={main.title}
          />
        )}
        <div className="flex flex-col gap-2 p-5">
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span className="text-accent-ink">{categoryTitle(main)}</span>
            <span>{format(main.createdAt)}</span>
          </div>
          <h3 className="font-display text-xl font-bold leading-snug text-ink line-clamp-2">
            {main.title}
          </h3>
        </div>
      </Link>

      <div className="flex flex-col gap-3">
        {rest.map((post, i) => (
          <Link
            key={post._id}
            href={`/posts/${post._id}`}
            className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-sm transition hover:shadow-md"
            data-testid={`featured-post-${post._id}`}
          >
            <span className="w-6 shrink-0 text-center font-display text-sm font-extrabold text-line">
              {String(i + 2).padStart(2, "0")}
            </span>
            {post.img && (
              <ImageShow
                src={post.img}
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
                width={80}
                height={80}
                alt={post.title}
              />
            )}
            <div className="flex min-w-0 flex-col gap-1">
              <h4 className="font-display text-sm font-semibold leading-snug text-ink line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
                <span>{categoryTitle(post)}</span>
                <span>·</span>
                <span>{format(post.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default FeaturedPost;
