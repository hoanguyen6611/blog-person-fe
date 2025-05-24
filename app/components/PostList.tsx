"use client";
import PostListItem from "./PostListItem";
import useSWR from "swr";
import { Post } from "@/interface/Post";
import { useState } from "react";
import { fetcherUseSWR } from "../api/useswr";
import { useSearchParams } from "next/navigation";

const PostList = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const searchParams = useSearchParams();
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?page=${pageIndex}&${searchParams}`,
    fetcherUseSWR
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  return (
    <div className="flex flex-col gap-12 mb-8">
      {(data?.posts || []).map((post: Post) => (
        <PostListItem key={post._id} post={post} />
      ))}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
          disabled={pageIndex === 1}
        >
          Prev
        </button>
        <span>Page {pageIndex}</span>
        <button
          onClick={() => setPageIndex((p) => (data.hasMore ? p + 1 : p))}
          disabled={!data.hasMore}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList;
