import CommentItem from "./CommentItem";
import useSWR from "swr";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Comment } from "@/interface/Comment";
import { fetcherUseSWR } from "../api/useswr";
import { toast } from "react-toastify";

const Comments = ({ postId }: { postId: string }) => {
  const { getToken } = useAuth();
  const [desc, setDesc] = useState("");
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/${postId}`,
    fetcherUseSWR
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
      toast.success("Delete comment successfully");
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
    if (res.status === 200) {
      await mutate();
      setDesc("");
    }
  };
  const comments = Array.isArray(data) ? data : data?.comments || [];
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  return (
    <div className="flex flex-col gap-8 lg:w-3/5">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      <form
        action=""
        className="flex items-center justify-between gap-8 w-full"
        onSubmit={handleSubmit}
      >
        <textarea
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl bg-white"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          name="desc"
        />
        <button className="bg-blue-500 text-white px-4 py-3 font-medium rounded-xl">
          Send
        </button>
      </form>
      {comments.map((comment: Comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onDelete={handleDeleteComment}
        />
      ))}
    </div>
  );
};

export default Comments;
