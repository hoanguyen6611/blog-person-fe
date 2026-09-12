"use client";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import DashBoard from "@/components/Dashboard";
import { useAuth, useUser } from "@clerk/nextjs";
import useSWR from "swr";
import { Eye, Pencil, Plus, UserRound } from "lucide-react";
import { format } from "timeago.js";
import FollowList from "@/components/FollowList";
import ImageShow from "@/components/Image";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Post } from "@/interface/Post";
import { cn } from "@/lib/utils";

const RECENT_POSTS_LIMIT = 5;

const PersonalPage = () => {
  useRequireAuth();
  const tCms = useTranslations("Cms");
  const tSidebar = useTranslations("Sidebar");
  const tNav = useTranslations("NavBar");
  const { user } = useUser();
  const { getToken, isSignedIn, userId } = useAuth();
  const { data: posts } = useSWR(
    isSignedIn ? [`fetch-user-posts`, userId, RECENT_POSTS_LIMIT] : null,
    async ([, , limit]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/user?page=1&limit=${limit}&scope=own`,
        token!
      );
    }
  );
  const { data: views } = useSWR(
    isSignedIn ? [`fetch-user-posts-sum`, userId] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/sumPostUser?scope=own`,
        token!
      );
    }
  );
  // Fetch a fresh token inside the fetcher each time (not cached in state) —
  // see the comment in app/[locale]/user/[id]/page.tsx for why.
  const { data, isLoading } = useSWR(
    isSignedIn ? ["users-follow"] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follow`,
        token!
      );
    }
  );

  if (!isSignedIn)
    return (
      <p data-testid="cms-personal-not-logged-in">{tCms("notLoggedIn")}</p>
    );

  const recentPosts: Post[] = posts?.posts ?? [];
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col gap-6" data-testid="cms-personal-page">
      {/* Profile band */}
      <div
        className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface p-5 shadow-sm"
        data-testid="cms-personal-profile-band"
      >
        <div className="flex flex-wrap items-center gap-4">
          <ImageShow
            src={user?.imageUrl || ""}
            alt={user?.fullName || user?.username || ""}
            width={60}
            height={60}
            className="h-[60px] w-[60px] flex-none rounded-full object-cover"
          />
          {/* min-w-[160px] (not just min-w-0) keeps room for the full name
              instead of it getting squeezed to a couple of characters by
              the action buttons below sharing the row — they wrap onto
              their own line first instead. */}
          <div className="flex min-w-[160px] flex-1 flex-col gap-0.5">
            <span className="break-words font-display text-xl font-bold tracking-tight text-ink">
              {user?.fullName || user?.username}
            </span>
            <span className="font-meta text-[13px] text-muted">
              @{user?.username}
              {memberSince && (
                <>
                  {" "}
                  · {tCms("memberSince", { date: memberSince })}
                </>
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/user"
            className="flex h-9 items-center gap-1.5 rounded-[10px] border border-line px-3.5 font-cta text-sm font-medium text-ink"
            data-testid="cms-personal-view-profile-link"
          >
            <UserRound size={15} />
            {tCms("viewProfile")}
          </Link>
          <Link
            href="/write"
            className="flex h-9 items-center gap-1.5 rounded-[10px] bg-gradient-to-b from-accent to-accent-dark px-3.5 font-cta text-sm font-medium text-white"
            data-testid="cms-personal-write-link"
          >
            <Plus size={15} />
            {tNav("newPost")}
          </Link>
        </div>
      </div>

      <div data-testid="cms-personal-dashboard-container">
        <DashBoard
          name={tSidebar("dashboardPersonal")}
          posts={{ totalPosts: posts?.totalPosts ?? 0 }}
          views={views}
          followers={data?.followers?.length}
          following={data?.following?.length}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
        {/* Recent posts */}
        <div
          className="rounded-2xl border border-line-soft bg-surface shadow-sm"
          data-testid="cms-personal-recent-posts"
        >
          <div className="flex items-baseline justify-between px-5 pb-3.5 pt-4">
            <span className="font-display text-base font-bold tracking-tight text-ink">
              {tCms("recentPosts")}
            </span>
            <Link
              href="/user"
              className="font-cta text-[12.5px] font-semibold text-accent-ink"
              data-testid="cms-personal-view-all-posts-link"
            >
              {tCms("viewAll")} →
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-muted">
              {tCms("noPostsYet")}
            </p>
          ) : (
            recentPosts.map((post) => (
              <div
                key={post._id}
                className="flex items-center gap-3.5 border-t border-line-soft px-5 py-3"
                data-testid={`cms-personal-post-row-${post._id}`}
              >
                <ImageShow
                  src={post.img}
                  alt={post.title}
                  width={56}
                  height={56}
                  className="h-14 w-14 flex-none rounded-xl object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-[14.5px] font-semibold text-ink">
                    {post.title}
                  </span>
                  <div className="flex items-center gap-2.5 font-meta text-xs text-faint">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide",
                        post.isPublished
                          ? "bg-success-bg text-success"
                          : "bg-warning-bg text-warning"
                      )}
                    >
                      {post.isPublished
                        ? tCms("statusPublished")
                        : tCms("statusDraft")}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Eye size={12} />
                      {post.visit ?? 0}
                    </span>
                    <span>{format(post.createdAt)}</span>
                  </div>
                </div>
                <Link
                  href={`/cms/edit/post/${post._id}`}
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent-soft hover:text-accent-ink"
                  aria-label={tCms("actionEdit")}
                  data-testid={`cms-personal-post-edit-${post._id}`}
                >
                  <Pencil size={14} />
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Connections */}
        <div
          className="rounded-2xl border border-line-soft bg-surface p-5 shadow-sm"
          data-testid="cms-personal-connections"
        >
          <span className="mb-3 block font-display text-base font-bold tracking-tight text-ink">
            {tCms("connections")}
          </span>
          <FollowList data={data} loading={isLoading} variant="tabs" />
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;
