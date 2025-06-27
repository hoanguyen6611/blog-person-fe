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

export default function Statistic() {
  const { getToken, isSignedIn } = useAuth();
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
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);
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
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🔥 Top 5 bài viết nổi bật
        </h2>

        <div className="space-y-4">
          {stats?.topPosts?.map((post: Post, index: number) => (
            <div
              key={post.slug}
              className="flex items-center gap-4 border-b pb-3 last:border-b-0"
            >
              <div className="text-2xl font-bold text-gray-400 w-6">
                {index + 1}
              </div>

              <ImageShow
                src={post.img}
                alt={post.title}
                className="w-16 h-16 object-cover rounded-md"
                width={100}
                height={100}
              />

              <div className="flex-1">
                <a
                  href={`/posts/${post._id}`}
                  className="text-sm font-medium text-blue-700 hover:underline line-clamp-2"
                >
                  {post.title}
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  {post.visit} lượt xem
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MonthlyPostChart data={stats?.postsByMonth} />
      {/* <MultiYearPostChart data={stats.postsByMonth} /> */}
      <CategoryPieChart data={postsByCategory} />
      <AuthorStatsTable data={postsByAuthor} />
    </div>
  );
}
