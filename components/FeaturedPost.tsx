"use client";
import { Link } from "@/i18n/navigation";
import ImageShow from "./Image";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { format } from "timeago.js";
import { useTranslations } from "next-intl";
import { Eye, ArrowUpRight, MessageCircle, Clock } from "lucide-react";
import { Category } from "@/interface/Category";
import { Post } from "@/interface/Post";
import { readingTimeMinutes } from "@/lib/wordCount";

const FeaturedPost = () => {
  const t = useTranslations("HomePage");
  const tStat = useTranslations("Statistic");
  const { data, isLoading, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?featured=true&limit=4&sort=newest`,
    fetcherUseSWR
  );
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category/all`,
    fetcherUseSWR
  );

  const getCategoryTitle = (id: string) =>
    categories?.categories?.find((c: Category) => c._id === id)?.title || "";

  if (isLoading)
    return (
      <div className="h-[340px] animate-pulse rounded-3xl bg-surface-2" />
    );
  if (error || !data?.posts?.length) return null;

  const [first, ...rest]: Post[] = data.posts;

  return (
    <div className="flex flex-col gap-4" data-testid="featured-post-section">
      <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
        {t("featuredPosts")}
      </span>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Big post */}
        <Link
          href={`/posts/${first._id}`}
          className="flex w-full flex-col gap-4 rounded-3xl border border-line-soft bg-surface p-4 shadow-sm lg:w-1/2"
          data-testid={`featured-post-${first._id}`}
        >
          <ImageShow
            src={first.img}
            className="h-[220px] w-full rounded-2xl object-cover lg:h-[260px]"
            width={600}
            height={400}
            alt={first.title}
          />
          <div className="flex flex-col gap-2 px-1 pb-1">
            {getCategoryTitle(first.category) && (
              <span className="w-fit font-meta text-xs font-semibold text-accent-ink">
                {getCategoryTitle(first.category)}
              </span>
            )}
            <h2 className="font-display text-2xl font-bold leading-snug tracking-tight text-ink">
              {first.title}
            </h2>
            {first.desc && (
              <p className="line-clamp-2 text-sm text-muted">{first.desc}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 font-meta text-xs text-faint">
              <span className="flex items-center gap-1">
                <Eye size={13} />
                {first.visit ?? 0} {tStat("views")}
              </span>
              {typeof first.commentCount === "number" && first.commentCount > 0 && (
                <span className="flex items-center gap-1">
                  <MessageCircle size={13} />
                  {first.commentCount} {tStat("comments")}
                </span>
              )}
              {first.content && (
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {readingTimeMinutes(first.content)} {tStat("readTime")}
                </span>
              )}
              <span>{format(first.createdAt)}</span>
              <span className="ml-auto flex items-center gap-1.5 font-cta text-sm font-medium text-accent-ink">
                <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
        </Link>

        {/* Smaller posts */}
        <div className="flex w-full flex-col gap-3 lg:w-1/2">
          {rest.map((post, idx) => (
            <FeaturedItem
              key={post._id}
              postId={post._id}
              index={idx + 2}
              title={post.title}
              img={post.img}
              date={format(post.createdAt)}
              category={getCategoryTitle(post.category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedItem = ({
  index,
  title,
  img,
  date,
  category,
  postId,
}: {
  index: number;
  title: string;
  img: string;
  date: string;
  category: string;
  postId: string;
}) => {
  return (
    <Link
      href={`/posts/${postId}`}
      className="flex items-center gap-4 rounded-2xl border border-line-soft bg-surface p-3 shadow-sm"
      data-testid={`featured-post-${postId}`}
    >
      <span className="w-6 flex-none font-mono text-sm text-faintest">
        {index.toString().padStart(2, "0")}
      </span>
      <ImageShow
        src={img}
        className="aspect-video w-24 flex-none rounded-lg object-cover"
        width={160}
        height={100}
        alt={title}
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug tracking-tight text-ink">
          {title}
        </h3>
        <div className="flex gap-2 font-meta text-xs text-faint">
          {category && <span>{category}</span>}
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPost;
