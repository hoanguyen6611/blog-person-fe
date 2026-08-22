"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import { Link } from "@/i18n/navigation";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { format } from "timeago.js";
import { format as formatDate } from "date-fns";
import { InstagramOutlined } from "@ant-design/icons";
import { createFromIconfontCN } from "@ant-design/icons";

import ImageShow from "@/components/Image";
import PostMenuActions from "@/components/PostMenuActions";
import SearchInput from "@/components/Search";
import Comments from "@/components/Comments";
import Categories from "@/components/Categories";

import { fetcherUseSWR } from "@/api/useswr";
import { Post } from "@/interface/Post";
import { Category } from "@/interface/Category";
import { Tooltip } from "antd";
import ShareButtons from "./ShareButtons";
import RelatedPosts from "./RelatedPosts";
import { Tag as TagInterface } from "@/interface/Tag";
import { useTranslations } from "next-intl";
import { getContentPreview } from "@/lib/contentPreview";
import { cn } from "@/lib/utils";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
});

export default function PostDetail({ post }: { post: Post }) {
  const { isSignedIn } = useAuth();
  const t = useTranslations("PostDetail");
  const tHome = useTranslations("HomePage");
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const { data: tags } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/tags`,
    fetcherUseSWR
  );
  const { data: relatedPosts } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/related/${post._id}`,
    fetcherUseSWR
  );

  const sanitized = useMemo(() => {
    if (typeof window === "undefined") return "";
    return DOMPurify.sanitize(post.content);
  }, [post.content]);
  const preview = useMemo(() => getContentPreview(sanitized), [sanitized]);
  const canReadFull = !!isSignedIn;

  const categoryTitle = categories?.categories.find(
    (cat: Category) => cat._id === post?.category
  )?.title;
  const tagNames = tags?.tags
    ?.filter((tag: TagInterface) => post.tags.includes(tag._id))
    .map((tag: TagInterface) => tag.name);

  return (
    <div className="mb-10" data-testid="post-detail-page">
      <div className="container mx-auto px-4 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 pt-6 font-mono text-xs text-muted"
        >
          <Link href="/" className="hover:text-ink">
            {tHome("home")}
          </Link>
          {categoryTitle && (
            <>
              <span>/</span>
              <Link
                href={`/posts?cat=${post?.category}`}
                className="hover:text-ink"
              >
                {categoryTitle}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="truncate text-ink">{post.title}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main content */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Title & meta */}
          <div className="flex flex-col gap-4">
            {categoryTitle && (
              <Link
                href={`/posts?cat=${post?.category}`}
                className="w-fit rounded-full bg-accent-soft px-3 py-1 font-mono text-xs font-medium uppercase tracking-wide text-accent-ink"
                data-testid="post-detail-category-link"
              >
                {categoryTitle}
              </Link>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight text-ink">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <ImageShow
                src={post?.user?.img}
                alt={post.user?.username}
                className="h-9 w-9 rounded-full object-cover"
                width={36}
                height={36}
              />
              <div className="flex flex-col">
                <Link
                  href={`/posts?author=${post?.user?.username}`}
                  className="text-sm font-semibold text-ink hover:text-accent-ink"
                  data-testid="post-detail-author-link"
                >
                  {post.user?.username}
                </Link>
                <Tooltip
                  title={formatDate(
                    new Date(post?.createdAt),
                    "dd/MM/yyyy hh:mm"
                  )}
                >
                  <span className="font-mono text-xs text-muted">
                    {format(post?.createdAt)}
                  </span>
                </Tooltip>
              </div>
            </div>
            <p className="text-muted">{post.desc}</p>
          </div>

          <ShareButtons title={post.title} />

          {/* Cover Image */}
          {post?.img && (
            <ImageShow
              src={post.img}
              alt={post.title}
              width={800}
              height={500}
              className="rounded-2xl shadow-sm"
            />
          )}

          {/* Post content */}
          <div
            className={cn(
              "post-content",
              !canReadFull &&
                preview.truncated &&
                "[mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]"
            )}
            dangerouslySetInnerHTML={{
              __html: canReadFull ? sanitized : preview.html,
            }}
          />

          {!canReadFull && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-8 text-center shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-ink">
                {t("gateTitle")}
              </h3>
              <p className="max-w-sm text-sm text-muted">
                {t("gateSubtitle")}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  data-testid="post-detail-gate-login-link"
                >
                  {t("gateLogin")}
                </Link>
                <Link
                  href="/posts"
                  className="rounded-full border border-line bg-surface-2 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-line"
                >
                  {t("gateBrowseOther")}
                </Link>
              </div>
              <p className="mt-1 text-xs text-muted">
                {t("gateNoAccount")}{" "}
                <Link
                  href="/register"
                  className="font-semibold text-accent-ink hover:underline"
                >
                  {t("gateSignUp")}
                </Link>
              </p>
            </div>
          )}

          {canReadFull && tagNames && tagNames.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-2"
              data-testid="post-detail-tags"
            >
              {tagNames.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 sticky top-24 self-start flex flex-col gap-6">
          {/* Author box */}
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <h2 className="font-mono text-xs font-medium uppercase tracking-wide text-muted mb-3">
              {t("author")}
            </h2>
            <div className="flex items-center gap-4 mb-3">
              <ImageShow
                src={post?.user?.img}
                alt={post?.user?.username}
                className="w-12 h-12 rounded-full object-cover"
                width={48}
                height={48}
              />
              <Link
                href={`/user/${post?.user?._id}`}
                className="text-ink font-semibold hover:text-accent-ink"
              >
                {post?.user?.username}
              </Link>
            </div>
            <div className="flex gap-3 mt-3">
              <Link href="#">
                <IconFont
                  type="icon-facebook"
                  className="text-xl"
                  style={{ color: "#1877F2" }}
                />
              </Link>
              <Link href="#">
                <InstagramOutlined
                  className="text-pink-500 text-xl"
                  style={{ color: "#C13584" }}
                />
              </Link>
            </div>
          </div>

          <PostMenuActions post={post} />

          <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <h2 className="font-mono text-xs font-medium uppercase tracking-wide text-muted mb-3">
              {t("categories")}
            </h2>
            <Categories />
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <h2 className="font-mono text-xs font-medium uppercase tracking-wide text-muted mb-3">
              {t("search")}
            </h2>
            <SearchInput />
          </div>
        </aside>

        {/* Comments */}
        {canReadFull && (
          <div className="lg:col-span-12 mt-6">
            <Comments postId={post?._id} />
          </div>
        )}
      </div>
      {canReadFull && <RelatedPosts posts={relatedPosts?.relatedPosts} />}
    </div>
  );
}
