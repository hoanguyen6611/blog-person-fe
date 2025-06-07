import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetcherWithTokenUseSWR } from "../api/useswr";
import { DeleteOutlined, SaveOutlined, StarOutlined } from "@ant-design/icons";

const PostMenuActions = ({ post }: { post: any }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(post.isFeature);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);
  useEffect(() => {
    setIsFeatured(post.isFeature);
  }, [post]);

  const {
    data: savedPosts,
    isLoading,
    error,
    mutate,
  } = useSWR(
    () =>
      token ? [`${process.env.NEXT_PUBLIC_API_URL}/users/saved`, token] : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
  );

  const isSavedPost = savedPosts?.some(
    (savedPost: any) => savedPost === post._id
  );
  const isAdmin = user?.publicMetadata?.role === "admin" || false;

  const handleDeletePost = async () => {
    const token = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      toast.success("Delete post successfully");
      router.push(`/`);
    }
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    if (!user) {
      router.push("/login");
      return;
    }
    const token = await getToken();
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/save`,
      {
        postId: post._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      await mutate();
      toast.success(res.data || "Saved successfully");
    }
  };
  const featurePost = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsFeatured(!isFeatured);
    const token = await getToken();
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/feature`,
      {
        postId: post._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      await mutate();
      toast.success(
        res.data.isFeature
          ? "Featured post successfully"
          : "Unfeatured post successfully"
      );
    }
  };
  return (
    <div>
      <h1 className="mt-8 mb-4 text-sm font-bold">Actions</h1>
      <div
        className="flex items-center gap-2 py-2 text-sm cursor-pointer"
        onClick={handleSave}
      >
        <SaveOutlined
          style={{ color: isSavedPost ? "black" : "gray", fontSize: 32 }}
        />
        <span>Save this Post</span>
      </div>
      {isAdmin && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={featurePost}
        >
          <StarOutlined
            style={{ color: isFeatured ? "black" : "gray", fontSize: 32 }}
          />
          <span>Featured this Post</span>
        </div>
      )}
      {(post?.user?.username === user?.username || isAdmin) && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer text-red-500"
          onClick={handleDeletePost}
        >
          <DeleteOutlined
            className="cursor-pointer"
            style={{ color: "red", fontSize: "32px" }}
          />
          <span>Delete this Post</span>
        </div>
      )}
    </div>
  );
};

export default PostMenuActions;
