"use client";
import useSWR from "swr";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "../../../api/useswr";
import DashBoard from "@/components/Dashboard";
import TrafficStats from "@/components/TrafficStats";
import { useUser, useAuth } from "@clerk/nextjs";
import { useState } from "react";
import Statistic from "@/components/Statistic";
import { useTranslations } from "next-intl";

const CMSPage = () => {
  const { user } = useUser();
  const tCms = useTranslations("Cms");
  const tSidebar = useTranslations("Sidebar");
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
    return <div data-testid="cms-not-admin">{tCms("notAdmin")}</div>;
  }
  return (
    <div className="flex flex-col gap-5" data-testid="cms-page">
      <div data-testid="cms-dashboard-container">
        <DashBoard
          name={tSidebar("dashboard")}
          posts={posts}
          categories={categories}
          views={views}
          users={users}
        />
      </div>
      <TrafficStats days={30} />
      <div data-testid="cms-statistic-container">
        <Statistic />
      </div>
    </div>
  );
};

export default CMSPage;
