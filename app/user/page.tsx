"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import ImageShow from "@/components/Image";
import PostList from "@/components/PostList";
import FollowList from "@/components/FollowList";
import useSWR from "swr";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { useEffect, useState } from "react";
import FollowStats from "@/components/FollowStats";

const UserPersonalPage = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);
  const { data } = useSWR(
    () =>
      token ? [`${process.env.NEXT_PUBLIC_API_URL}/users/follow`, token] : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
  );
  const { data: follow, isLoading: loading } = useSWR(
    () =>
      token ? [`${process.env.NEXT_PUBLIC_API_URL}/users/follow`, token] : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
  );

  if (!user) return <p className="text-center">You are not signed in.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* 🧑 User Info */}
      <div className="flex items-center gap-6">
        <ImageShow
          src={user.imageUrl || ""}
          alt="Avatar"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <p className="text-gray-600">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
      <FollowStats
        followersCount={data?.followers?.length}
        followingCount={data?.following?.length}
      />
      <FollowList data={follow} loading={loading} />

      {/* 📝 Posts */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📝 Your Posts</h3>
        <PostList
          apiUrl="posts/user"
          showPagination={false}
          useAuthToken={true}
        />
      </div>
    </div>
  );
};

export default UserPersonalPage;
