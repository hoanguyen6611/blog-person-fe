"use client";

import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { Link } from "@/i18n/navigation";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { format } from "timeago.js";
import { format as formatDate } from "date-fns";

import ImageShow from "@/components/Image";
import PostMenuActions from "@/components/PostMenuActions";
import BookmarkButton from "@/components/BookmarkButton";
import Comments from "@/components/Comments";
import ArticleToc from "@/components/ArticleToc";
import ReadingProgressBar from "@/components/ReadingProgressBar";

import { fetcherUseSWR } from "@/api/useswr";
import { Post } from "@/interface/Post";
import { Category } from "@/interface/Category";
import { RelatedPost } from "@/interface/RelatedPost";
import { Tooltip } from "antd";
import ShareButtons from "./ShareButtons";
import RelatedPosts from "./RelatedPosts";
import { Tag as TagInterface } from "@/interface/Tag";
import { useTranslations } from "next-intl";
import { getContentPreview } from "@/lib/contentPreview";
import { addHeadingIds } from "@/lib/postContentToc";
import { cn } from "@/lib/utils";
import { useAppearanceSettings } from "@/hooks/useAppearanceSettings";

export default function PostDetail({ post }: { post: Post }) {
  const { isSignedIn } = useAuth();
  const t = useTranslations("PostDetail");
  const tHome = useTranslations("HomePage");
  const { settings } = useAppearanceSettings();
  const showSidebars = !settings.focusMode;
  const [feedback, setFeedback] = useState<"yes" | "unsure" | null>(null);
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

  const { html: contentWithIds, headings } = useMemo(
    () => addHeadingIds(canReadFull ? sanitized : preview.html),
    [canReadFull, sanitized, preview.html]
  );

  const categoryTitle = categories?.categories.find(
    (cat: Category) => cat._id === post?.category
  )?.title;
  const postTags: TagInterface[] = tags?.tags?.filter((tag: TagInterface) =>
    post.tags.includes(tag._id)
  );
  const readTeasers: RelatedPost[] = (relatedPosts?.relatedPosts ?? []).slice(0, 3);

  return (
    <div className="mb-10" data-testid="post-detail-page">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 pt-6">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 flex-1 items-center gap-2 font-mono text-xs text-muted"
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
          <div className="flex flex-none items-center gap-2">
            <BookmarkButton postId={post._id} />
            <ShareButtons title={post.title} />
          </div>
        </div>
      </div>

      <ReadingProgressBar />

      <div
        className={cn(
          "container mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 gap-10",
          showSidebars ? "lg:grid-cols-[200px_1fr_260px]" : "lg:mx-auto lg:max-w-[680px]"
        )}
      >
        {/* Table of contents */}
        {showSidebars && (
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <ArticleToc headings={headings} label={t("onThisPage")} />
          </aside>
        )}

        {/* Main content */}
        <div className="flex flex-col gap-6">
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
            <p className="text-muted">{post.desc}</p>
            <div className="flex flex-wrap items-center gap-3 border-y border-line-soft py-3">
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
              <div className="ml-auto">
                <PostMenuActions post={post} />
              </div>
            </div>
          </div>

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
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
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

          {canReadFull && postTags && postTags.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-2"
              data-testid="post-detail-tags"
            >
              {postTags.map((tag) => (
                <Link
                  key={tag._id}
                  href={`/posts?tag=${tag._id}`}
                  className="rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent-ink"
                  data-testid={`post-detail-tag-${tag._id}`}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {canReadFull && (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <span className="text-sm text-muted">{t("wasHelpful")}</span>
              {feedback ? (
                <span className="text-sm font-medium text-accent-ink">
                  {t("feedbackThanks")}
                </span>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedback("yes")}
                    className="flex h-8 items-center rounded-lg border border-line px-3 text-xs font-medium text-ink"
                    data-testid="post-detail-feedback-yes"
                  >
                    {t("feedbackYes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedback("unsure")}
                    className="flex h-8 items-center rounded-lg border border-line px-3 text-xs font-medium text-muted"
                    data-testid="post-detail-feedback-unsure"
                  >
                    {t("feedbackUnsure")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        {showSidebars && canReadFull && readTeasers.length > 0 && (
          <aside className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-3 lg:self-start">
            <div className="rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
                {t("continueReading")}
              </span>
              <div className="mt-3 flex flex-col gap-3">
                {readTeasers.map((rp, i) => (
                  <div key={rp._id}>
                    {i > 0 && <div className="mb-3 h-px bg-line-soft" />}
                    <Link
                      href={`/posts/${rp._id}`}
                      className="text-sm font-semibold leading-snug tracking-tight text-ink hover:text-accent-ink"
                    >
                      {rp.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Comments — kept outside the sticky TOC/rail grid so the sticky
          columns don't stay pinned past their own row and overlap it. */}
      {canReadFull && (
        <div className="container mx-auto px-4 py-6 lg:px-8">
          <Comments postId={post?._id} />
        </div>
      )}
      {canReadFull && <RelatedPosts posts={relatedPosts?.relatedPosts} />}
    </div>
  );
}
