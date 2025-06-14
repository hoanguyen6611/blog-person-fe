"use client";
import PostListItem from "./PostListItem";
import useSWR from "swr";
import { Post } from "@/interface/Post";
import { useState, Suspense } from "react";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "../api/useswr";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface PostListProps {
  apiUrl: string;
  showPagination?: boolean;
  useAuthToken?: boolean;
}
const PostListContent = ({
  apiUrl,
  showPagination,
  useAuthToken,
}: PostListProps) => {
  const [pageIndex, setPageIndex] = useState(1);
  const searchParams = useSearchParams();
  const { getToken } = useAuth();
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/${apiUrl}?page=${pageIndex}&${searchParams}`;
  const endpointToken = `${process.env.NEXT_PUBLIC_API_URL}/${apiUrl}`;

  const { data, error, isLoading } = useSWR(
    useAuthToken ? ["authPosts", endpointToken] : endpoint,
    async (key: any) => {
      if (useAuthToken) {
        const [, url] = key as [string, string];
        const token = await getToken();
        return fetcherWithTokenUseSWR(url, token!);
      } else {
        const url = key as string;
        return fetcherUseSWR(url);
      }
    }
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  return (
    <div className="flex flex-col gap-12 mb-8">
      {(data?.posts || []).map((post: Post) => (
        <PostListItem key={post._id} post={post} />
      ))}
      {showPagination && (
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
      )}
    </div>
  );
};

const PostList = (props: PostListProps) => {
  return (
    <Suspense fallback={<div>Loading posts...</div>}>
      <PostListContent {...props} />
    </Suspense>
  );
};

export default PostList;
