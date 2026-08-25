"use client";
import ImageShow from "@/components/Image";
import { Comment } from "@/interface/Comment";
import { useUser } from "@clerk/nextjs";
import { Tooltip } from "antd";
import { MessageCircle, ThumbsUp, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { format } from "timeago.js";
import { format as formatDate } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  comment: Comment;
  postId: string;
  onDelete: (id: string) => void;
  onReply: (data: {
    desc: string;
    post: string;
    parentId?: string | null;
  }) => void;
  onLike: (id: string) => void;
  likeComments: string[] | undefined;
  onDisLike: (id: string) => void;
};

const CommentItem = ({
  comment,
  onDelete,
  postId,
  onReply,
  onLike,
  likeComments,
  onDisLike,
}: Props) => {
  const [isReply, setIsReply] = useState(false);
  const [desc, setDesc] = useState("");
  const { user } = useUser();
  const t = useTranslations("Comments");
  const isAdmin = user?.publicMetadata?.role === "admin" || false;

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    onReply({ desc, post: postId, parentId: comment._id });
    setIsReply(false);
    setDesc("");
  };

  const CommentBubble = ({
    item,
    isReplyItem,
  }: {
    item: Comment;
    isReplyItem?: boolean;
  }) => {
    const liked = likeComments?.includes(item._id);
    const canDelete = item.user.username === user?.username || isAdmin;

    return (
      <div className={cn("flex flex-col gap-2", isReplyItem && "ml-8 mt-3")}>
        <div
          className="rounded-2xl border border-line-soft bg-surface p-4 shadow-sm"
          data-testid={isReplyItem ? undefined : `comment-${item._id}`}
        >
          <div className="flex items-center gap-3">
            <ImageShow
              src={item.user.img}
              className="h-9 w-9 flex-none rounded-full object-cover"
              width={36}
              height={36}
              alt="userImg"
            />
            <span className="text-sm font-semibold text-ink">
              {item.user.username}
            </span>
            <Tooltip
              title={formatDate(new Date(item.createdAt), "dd/MM/yyyy hh:mm")}
            >
              <span className="font-mono text-xs text-muted">
                {format(item.createdAt)}
              </span>
            </Tooltip>
            {canDelete && (
              <button
                type="button"
                className="ml-auto text-muted hover:text-red-500"
                onClick={() => onDelete(item._id)}
                data-testid={`comment-delete-button-${item._id}`}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <p className="mt-2.5 text-sm text-ink">{item.desc}</p>
        </div>
        <div className="flex items-center gap-1 px-1">
          <button
            type="button"
            onClick={() => (liked ? onDisLike(item._id) : onLike(item._id))}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium",
              liked ? "text-accent-ink" : "text-muted hover:text-ink"
            )}
            data-testid={`comment-like-button-${item._id}`}
          >
            <ThumbsUp size={14} />
            <span data-testid={`comment-like-count-${item._id}`}>
              {item.like}
            </span>
          </button>
          {!isReplyItem && (
            <button
              type="button"
              onClick={() => setIsReply(true)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted hover:text-ink"
              data-testid={`comment-reply-button-${item._id}`}
            >
              <MessageCircle size={14} />
              {t("reply")}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <CommentBubble item={comment} />

      {isReply && (
        <form onSubmit={handleReply} className="ml-8 mt-3 flex flex-col gap-2">
          <textarea
            placeholder={t("writeComment")}
            className="min-h-[64px] w-full resize-none rounded-[10px] border border-line bg-page p-3 text-sm text-ink outline-none focus:border-accent"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            name="desc"
            data-testid="comment-reply-textarea"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={desc.length === 0}
              className="flex h-9 items-center rounded-[10px] bg-gradient-to-b from-accent to-accent-dark px-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              data-testid={`comment-reply-send-button-${comment._id}`}
            >
              {t("send")}
            </button>
            <button
              type="button"
              onClick={() => setIsReply(false)}
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
          {comment.replies.map((reply: Comment) => (
            <CommentBubble key={reply._id} item={reply} isReplyItem />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
