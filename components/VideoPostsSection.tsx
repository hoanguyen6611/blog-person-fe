"use client";
import { Link } from "@/i18n/navigation";
import ImageShow from "./Image";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { Post } from "@/interface/Post";

const formatDuration = (seconds?: number) => {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const VideoPostsSection = () => {
  const t = useTranslations("HomePage");
  const { data, isLoading, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?hasVideo=true&limit=2&sort=newest`,
    fetcherUseSWR
  );

  if (isLoading) return null;
  if (error || !data?.posts?.length) return null;

  const posts: Post[] = data.posts;

  return (
    <div className="flex flex-col gap-4" data-testid="video-posts-section">
      <div className="flex flex-col gap-1.5">
        <span className="w-fit rounded-lg border border-line-soft bg-surface-2 px-2.5 py-1 font-meta text-[11px] font-medium text-faint">
          {t("videoPostsEyebrow")}
        </span>
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
          {t("videoPostsHeading")}
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/posts/${post._id}`}
            className="flex flex-col gap-3"
            data-testid={`video-post-${post._id}`}
          >
            <div className="relative h-[220px] overflow-hidden rounded-2xl border border-line-soft">
              <ImageShow
                src={post.img}
                alt={post.title}
                width={640}
                height={360}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90">
                <Play size={18} className="ml-0.5 fill-ink text-ink" />
              </span>
              {post.videoDuration ? (
                <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 font-meta text-xs text-white">
                  {formatDuration(post.videoDuration)}
                </span>
              ) : null}
            </div>
            <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-ink">
              {post.title}
            </h3>
            {post.desc && (
              <p className="line-clamp-2 text-sm text-muted">{post.desc}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoPostsSection;
