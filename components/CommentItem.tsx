"use client";
import Avatar from "@/components/Avatar";
import { Comment } from "@/interface/Comment";
import { useUser } from "@clerk/nextjs";
import { Tooltip } from "antd";
import { MessageCircle, ThumbsUp, Trash2, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTimeAgo } from "@/lib/timeAgo";
import { format as formatDate } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  comment: Comment;
  postId: string;
  onDelete: (id: string) => void;
  onEdit: (id: string, desc: string) => void;
  onReply: (data: {
    desc: string;
    post: string;
    parentId?: string | null;
  }) => void;
  onLike: (id: string) => void;
  likeComments: string[] | undefined;
  onDisLike: (id: string) => void;
  // Nesting depth — only affects indentation (capped) and the reply-form
  // test id; the actual thread can go arbitrarily deep, matching the
  // backend's parentId-based tree (buildCommentTree in comment.controller.js).
  depth?: number;
};

const MAX_INDENT_DEPTH = 4;

const CommentItem = ({
  comment,
  onDelete,
  onEdit,
  postId,
  onReply,
  onLike,
  likeComments,
  onDisLike,
  depth = 0,
}: Props) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyDesc, setReplyDesc] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(comment.desc);
  const { user } = useUser();
  const t = useTranslations("Comments");
  const timeAgo = useTimeAgo();
  const isAdmin = user?.publicMetadata?.role === "admin" || false;
  const canManage = comment.user.username === user?.username || isAdmin;
  const liked = likeComments?.includes(comment._id);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReply({ desc: replyDesc, post: postId, parentId: comment._id });
    setIsReplying(false);
    setReplyDesc("");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDesc.trim()) {
      toast.error(t("editErrorEmpty"));
      return;
    }
    onEdit(comment._id, editDesc.trim());
    setIsEditing(false);
  };

  return (
    <div
      style={{ marginLeft: Math.min(depth, MAX_INDENT_DEPTH) * 32 }}
      className={cn(depth > 0 && "mt-3")}
    >
      <div
        className="rounded-2xl border border-line-soft bg-surface p-4 shadow-sm"
        data-testid={`comment-${comment._id}`}
      >
        <div className="flex items-center gap-3">
          <Avatar
            src={comment.user.img}
            name={comment.user.username}
            size={36}
          />
          <span className="text-sm font-semibold text-ink">
            {comment.user.username}
          </span>
          <Tooltip
            title={formatDate(new Date(comment.createdAt), "dd/MM/yyyy hh:mm")}
          >
            <span className="font-mono text-xs text-muted">
              {timeAgo(comment.createdAt)}
            </span>
          </Tooltip>
          {comment.isEdited && (
            <span
              className="font-meta text-xs text-faint"
              data-testid={`comment-edited-tag-${comment._id}`}
            >
              {t("edited")}
            </span>
          )}
          {canManage && (
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                className="text-muted hover:text-ink"
                onClick={() => {
                  setEditDesc(comment.desc);
                  setIsEditing((v) => !v);
                }}
                data-testid={`comment-edit-button-${comment._id}`}
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                className="text-muted hover:text-red-500"
                onClick={() => onDelete(comment._id)}
                data-testid={`comment-delete-button-${comment._id}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <form
            onSubmit={handleEditSubmit}
            className="mt-2.5 flex flex-col gap-2"
          >
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="min-h-[64px] w-full resize-none rounded-[10px] border border-line bg-page p-3 text-sm text-ink outline-none focus:border-accent"
              data-testid={`comment-edit-textarea-${comment._id}`}
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex h-9 items-center rounded-[10px] bg-gradient-to-b from-accent to-accent-dark px-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                data-testid={`comment-edit-save-button-${comment._id}`}
              >
                {t("save")}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex h-9 items-center rounded-[10px] border border-line px-3.5 text-sm font-medium text-muted hover:text-ink"
                data-testid={`comment-edit-cancel-button-${comment._id}`}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-2.5 text-sm text-ink">{comment.desc}</p>
        )}
      </div>

      <div className="flex items-center gap-1 px-1">
        <button
          type="button"
          onClick={() =>
            liked ? onDisLike(comment._id) : onLike(comment._id)
          }
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium",
            liked ? "text-accent-ink" : "text-muted hover:text-ink"
          )}
          data-testid={`comment-like-button-${comment._id}`}
        >
          <ThumbsUp size={14} />
          <span data-testid={`comment-like-count-${comment._id}`}>
            {comment.like}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setIsReplying((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted hover:text-ink"
          data-testid={`comment-reply-button-${comment._id}`}
        >
          <MessageCircle size={14} />
          {t("reply")}
        </button>
      </div>

      {isReplying && (
        <form
          onSubmit={handleReplySubmit}
          className="ml-8 mt-3 flex flex-col gap-2"
        >
          <textarea
            placeholder={t("writeComment")}
            className="min-h-[64px] w-full resize-none rounded-[10px] border border-line bg-page p-3 text-sm text-ink outline-none focus:border-accent"
            value={replyDesc}
            onChange={(e) => setReplyDesc(e.target.value)}
            name="desc"
            data-testid={`comment-reply-textarea-${comment._id}`}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={replyDesc.length === 0}
              className="flex h-9 items-center rounded-[10px] bg-gradient-to-b from-accent to-accent-dark px-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              data-testid={`comment-reply-send-button-${comment._id}`}
            >
              {t("send")}
            </button>
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="flex h-9 items-center rounded-[10px] border border-line px-3.5 text-sm font-medium text-muted hover:text-ink"
              data-testid={`comment-reply-cancel-button-${comment._id}`}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              onDelete={onDelete}
              onEdit={onEdit}
              onReply={onReply}
              onLike={onLike}
              likeComments={likeComments}
              onDisLike={onDisLike}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
