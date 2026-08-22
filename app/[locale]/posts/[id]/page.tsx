"use client";
import { fetcherUseSWR } from "@/api/useswr";
import PostDetail from "@/components/PostDetail";
import { Post } from "@/interface/Post";
import { useParams } from "next/navigation";
import useSWR from "swr";

const ItemPostPage = () => {
  const params = useParams();
  const { data, isLoading, error } = useSWR<Post>(
    params?.id ? ["post", params.id] : null,
    ([, id]) =>
      fetcherUseSWR(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`)
  );
  if (isLoading) return <p data-testid="post-detail-loading">Loading...</p>;
  if (error)
    return <p data-testid="post-detail-error">Error: {error.message}</p>;
  if (!data) return <p data-testid="post-detail-not-found">Post not found</p>;
  return <PostDetail post={data} />;
};

export default ItemPostPage;
