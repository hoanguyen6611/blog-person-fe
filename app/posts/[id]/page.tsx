"use client";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import PostDetail from "@/components/PostDetail";
import { Post } from "@/interface/Post";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import useSWR from "swr";

const ItemPostPage = () => {
  const params = useParams();
  const { getToken, isSignedIn } = useAuth();
  const { data, isLoading, error } = useSWR<Post>(
    isSignedIn && params?.id ? [`post`, params.id] : null,
    async ([, id]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
        token!
      );
    }
  );
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Post not found</p>;
  return <PostDetail post={data} />;
};

export default ItemPostPage;
