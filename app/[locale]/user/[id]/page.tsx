"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import ImageShow from "@/components/Image";
import PostList from "@/components/PostList";
import { useParams } from "next/navigation";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import useSWR, { mutate as globalMutate } from "swr";
import { useMemo, useState } from "react";
import axios from "axios";
import { Check, UserPlus } from "lucide-react";
import FollowList from "@/components/FollowList";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const UserPage = () => {
  useRequireAuth();
  const t = useTranslations("UserProfile");
  const params = useParams();
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();

  const [loadingFollow, setLoadingFollow] = useState(false);

  // Lấy dữ liệu user đang xem
  const { data: profileData } = useSWR(
    isSignedIn && params?.id ? [`user`, params.id] : null,
    async ([, id]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        token!
      );
    }
  );

  // Chỉ để lấy totalPosts cho thẻ thống kê — danh sách bài viết thật lấy qua
  // <PostList> riêng bên dưới.
  const { data: postsSummary } = useSWR(
    isSignedIn && params?.id ? [`user-posts-count`, params.id] : null,
    async ([, id]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/user/${id}?page=1&limit=1`,
        token!
      );
    }
  );

  // Lấy danh sách user mình đang theo dõi — lấy token mới ngay bên trong
  // fetcher mỗi lần gọi (không cache lại): JWT của Clerk hết hạn rất nhanh
  // (~60s), cache token vào state rồi tái sử dụng cho các lần revalidate
  // sau (focus lại tab, mất mạng rồi có lại...) sẽ gửi token đã hết hạn và
  // bị 401 âm thầm — đúng bug đã gặp ở Statistic.tsx/useSavePost.ts.
  const { data: followers, mutate } = useSWR(
    isSignedIn ? ["users-follow-list"] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/followList`,
        token!
      );
    }
  );

  // Tính xem có đang follow user này không
  const isFollow = useMemo(() => {
    return followers?.includes(params.id) || false;
  }, [followers, params.id]);

  const {
    data,
    isLoading: loadingFollowing,
    mutate: mutateFollow,
  } = useSWR(
    isSignedIn && params?.id ? ["users-follow", params.id] : null,
    async ([, id]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follow/${id}`,
        token!
      );
    }
  );

  // Hàm Follow / Unfollow
  const handleFollow = async () => {
    const token = await getToken();
    try {
      setLoadingFollow(true);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follow`,
        { userId: params.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        await mutateFollow();
        await mutate(undefined, { revalidate: true });
        await globalMutate(
          `${process.env.NEXT_PUBLIC_API_URL}/users/follow/${params.id}`
        );
      }
    } catch {
      // giữ nguyên trạng thái nút, không cần thông báo lỗi ồn ào cho 1 lượt bấm follow
    } finally {
      setLoadingFollow(false);
    }
  };

  if (!user)
    return (
      <p className="text-center" data-testid="user-not-signed-in">
        {t("notSignedIn")}
      </p>
    );

  const isOwnProfile = profileData?.username === user?.username;
  const memberSince = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-8">
      {/* Profile header */}
      <div
        className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface p-6 shadow-sm"
        data-testid="author-profile-header"
      >
        <div className="flex flex-wrap items-start gap-4">
          <ImageShow
            src={profileData?.img || ""}
            alt={profileData?.username || ""}
            width={84}
            height={84}
            className="h-[84px] w-[84px] flex-none rounded-full object-cover"
          />
          <div className="flex min-w-[180px] flex-1 flex-col gap-1">
            <span className="break-words font-display text-2xl font-extrabold tracking-tight text-ink">
              {profileData?.username}
            </span>
            {memberSince && (
              <span className="font-meta text-[13.5px] text-muted">
                {t("memberSince", { date: memberSince })}
              </span>
            )}
          </div>
          {!isOwnProfile && (
            <button
              type="button"
              onClick={handleFollow}
              disabled={loadingFollow}
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-[10px] px-4 font-cta text-sm font-semibold transition-opacity disabled:opacity-60",
                isFollow
                  ? "border border-line bg-surface-2 text-ink"
                  : "bg-gradient-to-b from-accent to-accent-dark text-white hover:opacity-90"
              )}
              data-testid="user-follow-button"
            >
              {isFollow ? (
                <>
                  <Check size={15} />
                  {t("followingAction")}
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  {t("follow")}
                </>
              )}
            </button>
          )}
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
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px] lg:items-start">
        {/* Posts */}
        <div data-testid="author-posts-section">
          <h2 className="mb-3.5 font-display text-base font-bold tracking-tight text-ink">
            {t("posts")}
          </h2>
          <PostList
            apiUrl={`posts/user/${params.id}`}
            showPagination={false}
            useAuthToken={true}
            variant="grid"
          />
        </div>

        {/* Connections */}
        <div
          className="rounded-2xl border border-line-soft bg-surface p-5 shadow-sm"
          data-testid="author-connections-section"
        >
          <span className="mb-3 block font-display text-base font-bold tracking-tight text-ink">
            {t("connections")}
          </span>
          <FollowList data={data} loading={loadingFollowing} variant="tabs" />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
