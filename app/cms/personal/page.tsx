"use client";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import DashBoard from "@/components/Dashboard";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import { useEffect, useState } from "react";
import FollowList from "@/components/FollowList";

const PersonalPage = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);
  const { data: posts } = useSWR(
    isSignedIn
      ? [`fetch-user-posts`, pagination.current, pagination.pageSize]
      : null,
    async ([_, page, limit]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/user?page=${page}&limit=${limit}`,
        token!
      );
    }
  );
  const { data: views } = useSWR(
    isSignedIn
      ? [`fetch-user-posts`, pagination.current, pagination.pageSize]
      : null,
    async ([_, ,]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/sumPostUser`,
        token!
      );
    }
  );
  const { data, isLoading } = useSWR(
    () =>
      token ? [`${process.env.NEXT_PUBLIC_API_URL}/users/follow`, token] : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
  );
  if (!isSignedIn) return <p>You are not logged in</p>;
  return (
    <div>
      <DashBoard
        name="Personal Statistics"
        posts={posts}
        views={views}
        followers={data?.followers?.length}
        following={data?.following?.length}
      />
      <FollowList data={data} loading={isLoading} />
    </div>
  );
};

export default PersonalPage;
