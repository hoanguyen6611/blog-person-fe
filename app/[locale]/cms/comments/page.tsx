"use client";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import useSWR from "swr";
import { useState } from "react";
import { toast } from "react-toastify";
import { format } from "timeago.js";
import { Check, EyeOff, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { Comment } from "@/interface/Comment";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTranslations } from "next-intl";

const postIdOf = (post: Comment["post"]) =>
  typeof post === "string" ? post : (post as { _id?: string })?._id ?? "";

const PendingCommentsPage = () => {
  useRequireAuth();
  const { getToken, isSignedIn } = useAuth();
  const tSidebar = useTranslations("Sidebar");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, mutate, isLoading, error } = useSWR(
    isSignedIn ? ["pending-comments"] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/pending`,
        token!
      );
    }
  );

  const comments: Comment[] = Array.isArray(data)
    ? data
    : data?.comments ?? [];

  const handleApprove = async (id: string) => {
    setBusyId(id);
    try {
      const token = await getToken();
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Đã duyệt bình luận");
      await mutate();
    } finally {
      setBusyId(null);
    }
  };

  const handleHide = async (id: string) => {
    setBusyId(id);
    try {
      const token = await getToken();
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${id}/hide`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Đã ẩn bình luận");
      await mutate();
    } finally {
      setBusyId(null);
    }
  };

  const submitReply = async (comment: Comment) => {
    if (!replyText.trim()) return;
    setBusyId(comment._id);
    try {
      const token = await getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        {
          desc: replyText,
          post: postIdOf(comment.post),
          parentId: comment._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Đã trả lời bình luận");
      setReplyingId(null);
      setReplyText("");
      await mutate();
    } finally {
      setBusyId(null);
    }
  };

  if (!isSignedIn)
    return (
      <p className="py-16 text-center text-sm text-muted" data-testid="cms-comments-page">
        Bạn chưa đăng nhập.
      </p>
    );
  if (isLoading)
    return (
      <p className="py-16 text-center text-sm text-muted" data-testid="cms-comments-page">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="py-16 text-center text-sm text-muted" data-testid="cms-comments-page">
        Failed to load
      </p>
    );

  return (
    <div className="flex flex-col gap-5" data-testid="cms-comments-page">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
          {tSidebar("comments")}
        </h1>
        <p className="font-meta text-sm text-faint">
          {comments.length} bình luận chờ duyệt
        </p>
      </div>

      {comments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-line-soft bg-surface p-10 text-center shadow-sm">
          <MessageCircle size={24} className="text-faint" />
          <p className="text-sm text-muted">Không có bình luận nào chờ duyệt.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm"
              data-testid={`cms-comment-item-${comment._id}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-ink">
                  {comment.user?.username}
                </span>
                <span className="font-mono text-xs text-faint">
                  {format(comment.createdAt)}
                </span>
                <Link
                  href={`/posts/${postIdOf(comment.post)}`}
                  className="ml-auto text-xs font-medium text-accent-ink hover:underline"
                  data-testid={`cms-comment-view-post-${comment._id}`}
                >
                  Xem bài viết
                </Link>
              </div>
              <p className="text-sm text-ink">{comment.desc}</p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApprove(comment._id)}
                  disabled={busyId === comment._id}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-success-bg px-3 text-xs font-semibold text-success disabled:opacity-50"
                  data-testid={`cms-comment-approve-button-${comment._id}`}
                >
                  <Check size={13} />
                  Duyệt
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReplyingId(replyingId === comment._id ? null : comment._id)
                  }
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-medium text-muted hover:text-ink"
                  data-testid={`cms-comment-reply-button-${comment._id}`}
                >
                  Trả lời
                </button>
                <button
                  type="button"
                  onClick={() => handleHide(comment._id)}
                  disabled={busyId === comment._id}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-medium text-red-500 disabled:opacity-50"
                  data-testid={`cms-comment-hide-button-${comment._id}`}
                >
                  <EyeOff size={13} />
                  Ẩn
                </button>
              </div>

              {replyingId === comment._id && (
                <div className="flex flex-col gap-2 border-t border-line-soft pt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Viết trả lời..."
                    className="min-h-[72px] w-full rounded-[10px] border border-line bg-page p-3 text-sm text-ink outline-none focus:border-accent"
                    data-testid={`cms-comment-reply-textarea-${comment._id}`}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => submitReply(comment)}
                      disabled={busyId === comment._id || !replyText.trim()}
                      className="flex h-8 items-center rounded-lg bg-gradient-to-b from-accent to-accent-dark px-3 text-xs font-semibold text-white disabled:opacity-50"
                      data-testid={`cms-comment-reply-send-button-${comment._id}`}
                    >
                      Gửi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingId(null);
                        setReplyText("");
                      }}
                      className="flex h-8 items-center rounded-lg px-3 text-xs font-medium text-muted hover:text-ink"
                      data-testid={`cms-comment-reply-cancel-button-${comment._id}`}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingCommentsPage;
