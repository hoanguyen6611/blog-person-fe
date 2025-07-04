"use client";
import useSWR from "swr";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "../../../api/useswr";
import DashBoard from "@/components/Dashboard";
import { useUser, useAuth } from "@clerk/nextjs";
import { useState } from "react";
import Statistic from "@/components/Statistic";

const CMSPage = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin" || false;
  const { data: posts } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts`,
    fetcherUseSWR
  );
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const { data: views } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/sumVisit`,
    fetcherUseSWR
  );
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { getToken, isSignedIn } = useAuth();
  const { data: users } = useSWR(
    isSignedIn
      ? [`fetch-user-posts`, pagination.current, pagination.pageSize]
      : null,
    async ([_, page, limit]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/sumUser?page=${page}&limit=${limit}`,
        token!
      );
    }
  );
  if (!isAdmin) {
    return <div>You are not admin</div>;
  }
  return (
    <div>
      <DashBoard
        name="CMS Statistics"
        posts={posts}
        categories={categories}
        views={views}
        users={users}
      />
      <Statistic />
    </div>
  );
};

export default CMSPage;
