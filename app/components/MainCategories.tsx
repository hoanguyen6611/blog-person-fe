"use client";

import Link from "next/link";
import SearchInput from "./Search";
import { fetcherUseSWR } from "../api/useswr";
import useSWR from "swr";
import { Category } from "@/interface/Category";
const MainCategories = () => {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
      {/* link */}
      <div className="flex-1 flex items-center justify-between flex-wrap">
        <Link
          href="/posts"
          className="bg-blue-800 text-white rounded-full px-4 py-2"
        >
          All Posts
        </Link>
        {(data?.categories || []).map((category: Category) => (
          <Link
            href="/posts?cat=web-design"
            className="hover:bg-blue-50 rounded-full px-4 py-2"
            key={category._id}
          >
            {category.title}
          </Link>
        ))}
      </div>
      <span className="text-xl font-medium">|</span>
      {/* search */}
      <SearchInput />
    </div>
  );
};

export default MainCategories;
