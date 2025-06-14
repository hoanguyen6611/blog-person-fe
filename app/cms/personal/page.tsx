"use client";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import DashBoard from "@/components/Dashboard";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import { useState } from "react";

const PersonalPage = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { getToken, isSignedIn } = useAuth();
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
  if (!isSignedIn) return <p>You are not logged in</p>;
  return (
    <div>
      <DashBoard name="Personal Statistics" posts={posts} views={posts} />
    </div>
  );
};

export default PersonalPage;
