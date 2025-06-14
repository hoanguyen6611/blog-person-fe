"use client";
import Link from "next/link";
import SearchInput from "./Search";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { Category } from "@/interface/Category";

const MainCategories = () => {
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category/getLimit`,
    fetcherUseSWR
  );

  return (
    <div className="hidden md:flex items-center justify-between gap-4 p-4 bg-white rounded-3xl xl:rounded-full shadow-md">
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href="/posts"
          className="bg-blue-800 text-white px-4 py-2 rounded-full font-medium"
        >
          All Posts
        </Link>
        {data?.categories?.map((cat: Category) => (
          <Link
            key={cat._id}
            href={`/posts?cat=${cat._id}`}
            className="hover:bg-blue-50 px-4 py-2 rounded-full text-gray-800"
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
