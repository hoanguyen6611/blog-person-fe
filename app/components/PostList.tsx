"use client";
import PostListItem from "./PostListItem";
import useSWR from "swr";
import { Post } from "@/interface/Post";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PostList = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?page=${pageIndex}`,
    fetcher
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  return (
    <div className="flex flex-col gap-12 mb-8">
      {(data?.posts || []).map((post: Post) => (
        <PostListItem key={post._id} post={post} />
      ))}
      <div className="flex justify-center gap-4">
        <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>
        <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
      </div>
    </div>
  );
};

export default PostList;
