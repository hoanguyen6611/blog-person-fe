"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Star, Trash2 } from "lucide-react";
import { Post } from "@/interface/Post";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const PostMenuActions = ({ post }: { post: Post }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isFeatured, setIsFeatured] = useState(post.isFeature);
  const t = useTranslations("PostMenuActions");

  useEffect(() => {
    setIsFeatured(post.isFeature);
  }, [post]);

  const isAdmin = user?.publicMetadata?.role === "admin" || false;

  const handleDeletePost = async () => {
    const token = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.status === 200) {
      toast.success("Delete post successfully");
      router.push(`/`);
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
      { postId: post._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.status === 200) {
      toast.success(
        res.data.isFeature
          ? "Featured post successfully"
          : "Unfeatured post successfully"
      );
    }
  };

  if (!isAdmin && post?.user?.username !== user?.username) return null;

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <button
          type="button"
          onClick={featurePost}
          aria-pressed={isFeatured}
          data-testid="post-action-feature-button"
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-medium text-muted hover:text-ink",
            isFeatured && "border-accent-soft bg-accent-soft text-accent"
          )}
        >
          <Star size={13} fill={isFeatured ? "currentColor" : "none"} />
          {t("feature")}
        </button>
      )}
      {(post?.user?.username === user?.username || isAdmin) && (
        <button
          type="button"
          onClick={handleDeletePost}
          data-testid="post-action-delete-button"
          className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-medium text-muted hover:border-red-200 hover:text-red-500"
        >
          <Trash2 size={13} />
          {t("delete")}
        </button>
      )}
    </div>
  );
};

export default PostMenuActions;
