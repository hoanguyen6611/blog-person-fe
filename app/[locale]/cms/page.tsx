"use client";
import useSWR from "swr";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "../../../api/useswr";
import DashBoard from "@/components/Dashboard";
import TrafficStats from "@/components/TrafficStats";
import RecentActivity from "@/components/RecentActivity";
import { useUser, useAuth } from "@clerk/nextjs";
import { useState } from "react";
import Statistic from "@/components/Statistic";
import { useTranslations } from "next-intl";

const CMSPage = () => {
  const { user } = useUser();
  const tCms = useTranslations("Cms");
  const tSidebar = useTranslations("Sidebar");
  const tTraffic = useTranslations("TrafficStats");
  const tStatistic = useTranslations("Statistic");
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
  const { getToken, isSignedIn, userId } = useAuth();
  const { data: users } = useSWR(
    isSignedIn
      ? [`fetch-user-posts`, userId, pagination.current, pagination.pageSize]
      : null,
    async ([_u, _id, page, limit]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/sumUser?page=${page}&limit=${limit}`,
        token!
      );
    }
  );
  const { data: pendingCommentsData } = useSWR(
    isSignedIn ? ["cms-pending-comments", userId] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/pending`,
        token!
      );
    }
  );
  const pendingComments = pendingCommentsData
    ? Array.isArray(pendingCommentsData)
      ? pendingCommentsData.length
      : pendingCommentsData?.comments?.length ?? 0
    : undefined;
  if (!isAdmin) {
    return <div data-testid="cms-not-admin">{tCms("notAdmin")}</div>;
  }
  return (
    <div className="flex flex-col gap-8" data-testid="cms-page">
      <div data-testid="cms-dashboard-container">
        <DashBoard
          name={tSidebar("dashboard")}
          posts={posts}
          categories={categories}
          views={views}
          users={users}
          pendingComments={pendingComments}
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold tracking-tight text-ink">
          {tTraffic("title")}
        </h2>
        <TrafficStats days={30} />
      </div>

      <RecentActivity />

      <div className="flex flex-col gap-3" data-testid="cms-statistic-container">
        <h2 className="font-display text-lg font-bold tracking-tight text-ink">
          {tStatistic("title")}
        </h2>
        <Statistic />
      </div>
    </div>
  );
};

export default CMSPage;
