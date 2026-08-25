"use client";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/api/useswr";
import { Category } from "@/interface/Category";
import { Post } from "@/interface/Post";
import { User } from "@/interface/User";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import useSWR from "swr";
import ImageShow from "./Image";
import MonthlyPostChart from "./MonthlyPostChart";
import CategoryPieChart from "./CategoryPieChart";
import AuthorStatsTable from "./AuthorStatsTable";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Flame } from "lucide-react";

export default function Statistic() {
  const t = useTranslations("Statistic");
  const { getToken, isSignedIn, userId } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category/all`,
    fetcherUseSWR
  );
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
  const { data: stats } = useSWR(
    () =>
      token
        ? [`${process.env.NEXT_PUBLIC_API_URL}/posts/statistic`, token]
        : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
  );
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
  const postsByCategory = stats?.postsByCategory.map((item: Category) => ({
    ...item,
    key: item._id,
    _id: categories?.categories?.find(
      (category: Category) => category._id === item._id
    )?.title,
  }));
  const postsByAuthor = stats?.postsByAuthor.map((item: User) => ({
    ...item,
    key: item._id,
    _id: users?.users?.find((user: User) => user._id === item._id)?.username,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl border border-line-soft bg-surface p-5 shadow-sm"
        data-testid="cms-statistic-top-articles"
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-surface-2 text-muted">
            <Flame size={16} />
          </span>
          <h2 className="text-sm font-bold text-ink">
            {t("top5FeaturedArticles")}
          </h2>
        </div>

        {!stats ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-2" />
            ))}
          </div>
        ) : stats.topPosts?.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Flame size={22} className="text-faint" />
            <p className="text-sm text-muted">{t("noData")}</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {stats.topPosts.map((post: Post, index: number) => (
              <div
                key={post.slug}
                className="flex items-center gap-4 border-b border-line-soft py-3 last:border-b-0"
              >
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent-ink">
                  {index + 1}
                </span>

                <ImageShow
                  src={post.img}
                  alt={post.title}
                  className="h-14 w-14 flex-none rounded-xl object-cover"
                  width={100}
                  height={100}
                />

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/posts/${post._id}`}
                    className="line-clamp-2 text-sm font-medium text-ink hover:text-accent-ink"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs text-faint">
                    {post.visit} {t("views")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div data-testid="cms-statistic-articles-by-month">
          <MonthlyPostChart
            data={stats?.postsByMonth}
            label={t("articlesByMonth")}
            nameOfYAxis={t("numberOfArticles")}
          />
        </div>
        <div data-testid="cms-statistic-monthly-visit">
          <MonthlyPostChart
            data={stats?.monthlyVisit}
            label={t("monthlyVisit")}
            nameOfYAxis={t("numberOfVisit")}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div data-testid="cms-statistic-articles-by-category">
          <CategoryPieChart data={postsByCategory} />
        </div>
        <div data-testid="cms-statistic-articles-by-author">
          <AuthorStatsTable data={postsByAuthor} />
        </div>
      </div>
    </div>
  );
}
