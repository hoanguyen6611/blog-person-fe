"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import ImageShow from "@/components/Image";
import PostList from "@/components/PostList";
import FollowList from "@/components/FollowList";
import useSWR from "swr";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { useEffect, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTranslations } from "next-intl";

const UserPersonalPage = () => {
  useRequireAuth();
  const t = useTranslations("UserProfile");
  const { user } = useUser();
  const { getToken, userId } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (!userId) {
      setToken(null);
      return;
    }
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken, userId]);
  const { data: postsSummary } = useSWR(
    token ? [`fetch-user-posts-count`, token] : null,
    async ([, token]) => {
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/user?page=1&limit=1`,
        token
      );
    }
  );
  const { data, isLoading: loading } = useSWR(
    () =>
      token ? [`${process.env.NEXT_PUBLIC_API_URL}/users/follow`, token] : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
  );

  if (!user)
    return (
      <p className="text-center" data-testid="user-not-signed-in">
        {t("notSignedIn")}
      </p>
    );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-8">
      {/* Profile header */}
      <div
        className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface p-6 shadow-sm"
        data-testid="user-profile-header"
      >
        <div className="flex flex-wrap items-start gap-4">
          <ImageShow
            src={user.imageUrl || ""}
            alt={user.fullName || user.username || ""}
            width={84}
            height={84}
            className="h-[84px] w-[84px] flex-none rounded-full object-cover"
          />
          {/* min-w-[180px] (not just min-w-0) so this column keeps enough
              room for the full name instead of getting squeezed down to a
              couple of characters by the action button below sharing the
              row — it wraps onto its own line first instead. */}
          <div className="flex min-w-[180px] flex-1 flex-col gap-1">
            <span className="break-words font-display text-2xl font-extrabold tracking-tight text-ink">
              {user.fullName || user.username}
            </span>
            <span className="font-meta text-[13.5px] text-muted">
              @{user.username}
            </span>
            {user.primaryEmailAddress?.emailAddress && (
              <span className="font-meta text-xs text-faint">
                {user.primaryEmailAddress.emailAddress}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 border-t border-line-soft pt-4 font-meta text-[13px] text-muted">
          <span className="whitespace-nowrap">
            <span className="font-mono font-semibold text-ink">
              {postsSummary?.totalPosts ?? "–"}
            </span>{" "}
            {t("statPosts")}
          </span>
          <span className="whitespace-nowrap">
            <span className="font-mono font-semibold text-ink">
              {data?.followers?.length ?? "–"}
            </span>{" "}
            {t("statFollowers")}
          </span>
          <span className="whitespace-nowrap">
            <span className="font-mono font-semibold text-ink">
              {data?.following?.length ?? "–"}
            </span>{" "}
            {t("statFollowing")}
          </span>
        </div>

        <Link
          href="/cms/posts"
          className="flex h-9 w-fit items-center gap-1.5 rounded-[10px] border border-line px-3.5 font-cta text-sm font-medium text-ink transition-colors hover:border-accent-soft hover:text-accent-ink"
          data-testid="user-manage-posts-link"
        >
          <LayoutGrid size={15} />
          {t("managePosts")}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px] lg:items-start">
        {/* Posts */}
        <div data-testid="user-posts-section">
          <h2 className="mb-3.5 font-display text-base font-bold tracking-tight text-ink">
            {t("posts")}
          </h2>
          <PostList
            apiUrl="posts/user"
            showPagination={false}
            useAuthToken={true}
            variant="grid"
          />
        </div>

        {/* Connections */}
        <div
          className="rounded-2xl border border-line-soft bg-surface p-5 shadow-sm"
          data-testid="user-connections-section"
        >
          <span className="mb-3 block font-display text-base font-bold tracking-tight text-ink">
            {t("connections")}
          </span>
          <FollowList data={data} loading={loading} variant="tabs" />
        </div>
      </div>
    </div>
  );
};

export default UserPersonalPage;
