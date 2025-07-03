"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import ImageShow from "@/components/Image";
import PostList from "@/components/PostList";
import { useParams } from "next/navigation";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/api/useswr";
import useSWR, { mutate as globalMutate } from "swr";
import { Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import FollowStats from "@/components/FollowStats";
import FollowList from "@/components/FollowList";

const UserPage = () => {
  const params = useParams();
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();

  const [token, setToken] = useState<string | null>(null);
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

  // Lấy token một lần
  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);

  // Lấy danh sách user mình đang theo dõi
  const { data: followers, mutate } = useSWR(
    () =>
      token
        ? [`${process.env.NEXT_PUBLIC_API_URL}/users/followList`, token]
        : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
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
    () =>
      token
        ? [
            `${process.env.NEXT_PUBLIC_API_URL}/users/follow/${params.id}`,
            token,
          ]
        : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
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

        // 🔁 Cập nhật lại danh sách followers
        await mutate(undefined, { revalidate: true });

        // 🔁 Cập nhật lại số lượng followers
        await globalMutate(
          `${process.env.NEXT_PUBLIC_API_URL}/users/follow/${params.id}`
        );
      } else {
        console.log("Follow failed");
      }
    } catch (err) {
      console.log("Error while following");
    } finally {
      setLoadingFollow(false);
    }
  };

  if (!user) return <p className="text-center">You are not signed in.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* 👤 User Info */}
      <div className="flex items-center gap-6">
        <ImageShow
          src={profileData?.img || ""}
          alt="Avatar"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{profileData?.username}</h2>
          <p className="text-gray-600">{profileData?.email}</p>
        </div>
        {/* Nút Follow */}
        <Button
          type={isFollow ? "default" : "primary"}
          onClick={handleFollow}
          loading={loadingFollow}
        >
          {isFollow ? "Following" : "Follow"}
        </Button>
      </div>

      {/* 📊 Thống kê follow */}
      <FollowStats
        followersCount={data?.followers?.length}
        followingCount={data?.following?.length}
      />
      <FollowList data={data} loading={loadingFollowing} />

      {/* 📝 Danh sách bài viết */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📝 Their Posts</h3>
        <PostList
          apiUrl={`posts/user/${params.id}`}
          showPagination={false}
          useAuthToken={true}
        />
      </div>
    </div>
  );
};

export default UserPage;
