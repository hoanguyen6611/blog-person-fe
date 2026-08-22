"use client";
import CommentItem from "./CommentItem";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-toastify";
import { Comment } from "@/interface/Comment";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "../api/useswr";
import { useTranslations } from "next-intl";

const bumpCommentLike = (
  list: Comment[],
  id: string,
  delta: number
): Comment[] =>
  list.map((c) => {
    if (c._id === id) return { ...c, like: c.like + delta };
    if (c.replies?.length) {
      return { ...c, replies: bumpCommentLike(c.replies, id, delta) };
    }
    return c;
  });

const bumpLikeInData = (data: unknown, id: string, delta: number) => {
  if (Array.isArray(data)) return bumpCommentLike(data, id, delta);
  if (data && typeof data === "object" && "comments" in data) {
    const typed = data as { comments: Comment[] };
    return { ...typed, comments: bumpCommentLike(typed.comments, id, delta) };
  }
  return data;
};

const Comments = ({ postId }: { postId: string }) => {
  const [desc, setDesc] = useState("");
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const t = useTranslations("Comments");
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/${postId}`,
    fetcherUseSWR
  );
  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);
  const { data: likeComments, mutate: mutateLikeComments } = useSWR(
    () =>
      token
        ? [`${process.env.NEXT_PUBLIC_API_URL}/users/likeComment`, token]
        : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
  );

  const handleDeleteComment = async (id: string) => {
    const token = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      await mutate();
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataForm = {
      desc: desc,
      post: postId,
    };
    const token = await getToken();
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/comments`,
      {
        ...dataForm,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200 || res.status === 201) {
      setDesc("");
      await mutate();
    }
  };
  const handleReply = async (dataForm: {
    desc: string;
    post: string;
    parentId?: string | null;
  }) => {
    const token = await getToken();
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/comments`,
      {
        ...dataForm,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 201) {
      await mutate();
      await mutateLikeComments();
    }
  };
  const handleLike = async (id: string) => {
    const previousComments = data;
    const previousLikeComments = likeComments;

    mutate(bumpLikeInData(data, id, 1), { revalidate: false });
    mutateLikeComments([...(likeComments || []), id], { revalidate: false });

    try {
      const token = await getToken();
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/like`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status !== 200) throw new Error("Failed to like comment");
      await mutate();
      await mutateLikeComments();
    } catch {
      mutate(previousComments, { revalidate: false });
      mutateLikeComments(previousLikeComments, { revalidate: false });
      toast.error("Không thể thích bình luận, vui lòng thử lại.");
    }
  };

  const handleDisLike = async (id: string) => {
    const previousComments = data;
    const previousLikeComments = likeComments;

    mutate(bumpLikeInData(data, id, -1), { revalidate: false });
    mutateLikeComments(
      (likeComments || []).filter((likedId: string) => likedId !== id),
      { revalidate: false }
    );

    try {
      const token = await getToken();
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/disLike`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status !== 200) throw new Error("Failed to unlike comment");
      await mutate();
      await mutateLikeComments();
    } catch {
      mutate(previousComments, { revalidate: false });
      mutateLikeComments(previousLikeComments, { revalidate: false });
      toast.error("Không thể bỏ thích bình luận, vui lòng thử lại.");
    }
  };
  const comments = Array.isArray(data) ? data : data?.comments || [];
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  return (
    <div className="flex flex-col gap-8 lg:w-3/5">
      <h1 className="text-xl text-black font-bold dark:text-gray-400">
        {t("title")}
      </h1>
      <form
        action=""
        className="flex items-center justify-between gap-8 w-full"
        onSubmit={handleSubmit}
      >
        <textarea
          placeholder={t("writeComment")}
          className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 dark:text-gray-100"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          name="desc"
          data-testid="comment-textarea"
        />
        <button
          className="bg-slate-500 text-white px-4 py-3 font-medium rounded-xl"
          data-testid="comment-submit-button"
        >
          {t("comment")}
        </button>
      </form>
      {comments.map((comment: Comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          postId={postId}
          onDelete={handleDeleteComment}
          onReply={handleReply}
          onLike={handleLike}
          likeComments={likeComments}
          onDisLike={handleDisLike}
        />
      ))}
    </div>
  );
};

export default Comments;
