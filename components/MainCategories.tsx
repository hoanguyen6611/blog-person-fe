"use client";
import Link from "next/link";
import SearchInput from "./Search";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { Category } from "@/interface/Category";
import { useTranslations } from "next-intl";

const MainCategories = () => {
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category/getLimit`,
    fetcherUseSWR
  );
  const t = useTranslations("MainCategories");

  return (
    <div className="hidden md:flex items-center justify-between gap-4 p-4 bg-white rounded-3xl xl:rounded-full shadow-md">
      <div className="flex overflow-x-auto gap-3 scrollbar-hide md:flex-wrap">
        <Link
          href="/posts"
          className="bg-blue-800 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-all whitespace-nowrap"
        >
          {t("allPosts")}
        </Link>
        {data?.categories?.map((cat: Category) => (
          <Link
            key={cat._id}
            href={`/posts?cat=${cat._id}`}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-800 font-medium whitespace-nowrap transition-all"
          >
            {cat.title}
          </Link>
        ))}
      </div>
      <SearchInput />
    </div>
  );
};

export default MainCategories;
