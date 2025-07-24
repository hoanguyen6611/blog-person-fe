"use client";
import ImageShow from "@/components/Image";
import { Comment } from "@/interface/Comment";
import { DeleteOutlined } from "@ant-design/icons";
import { useUser } from "@clerk/nextjs";
import { Button, Tooltip } from "antd";
import { Heart, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { format } from "timeago.js";

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
  likeComments: any;
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
  const handleReply = () => {
    onReply({
      desc: desc,
      post: postId,
      parentId: isReply ? comment._id : null,
    });
    setIsReply(false);
    setDesc("");
  };
  const isLikeComment = likeComments?.some(
    (likeComment: string) => likeComment === comment._id
  );
  const handleLikeOrDisLike = async (id: string) => {
    onLike(id);
  };
  const isLiked = likeComments?.includes(comment._id);

  return (
    <div>
      <div className="p-4 bg-slate-50 rounded-xl dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <ImageShow
            src={comment.user.img}
            className="w-10 h-10 rounded-full object-cover"
            width={40}
            height={40}
            alt="userImg"
          />
          <span className="font-medium">{comment.user.username}</span>
          <span className="text-sm text-gray-500">
            {format(comment.createdAt)}
          </span>
          {(comment.user.username === user?.username || isAdmin) && (
            <button
              className="text-sm text-gray-500"
              onClick={() => onDelete(comment._id)}
            >
              <DeleteOutlined
                className="cursor-pointer"
                style={{ color: "red", fontSize: "16px" }}
              />
            </button>
          )}
        </div>
        <div className="mt-4">
          <p>{comment.desc}</p>
        </div>
      </div>
      {!isReply && (
        <div className="flex">
          <Button
            type="text"
            onClick={() =>
              isLiked ? onDisLike(comment._id) : onLike(comment._id)
            }
          >
            <ThumbsUp className={isLiked ? "text-blue-800" : "text-gray-500"} />
            <span className="dark:text-gray-400">{comment.like}</span>
          </Button>
          <Button
            type="text"
            className="text-sm text-gray-500 "
            icon={<MessageCircle color="blue" />}
            onClick={() => setIsReply(true)}
          >
            <span className="dark:text-gray-400">{t("reply")}</span>
          </Button>
        </div>
      )}
      {isReply && (
        <div className="mt-4">
          <form
            action=""
            className="flex items-center justify-between gap-8 w-full"
            onSubmit={handleReply}
          >
            <textarea
              placeholder="Write a comment..."
              className="w-full p-4 rounded-xl bg-white dark:text-black"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              name="desc"
            />
            <div className="flex items-center gap-4">
              <button
                disabled={desc.length === 0}
                className="bg-blue-500 text-white px-4 py-3 font-medium rounded-xl disabled:opacity-50"
              >
                {t("send")}
              </button>
              <button
                onClick={() => setIsReply(false)}
                className="bg-red-500 text-white px-4 py-3 font-medium rounded-xl"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      )}
      {comment.replies && (
        <div>
          {comment.replies.map((reply: Comment) => (
            <div key={reply._id} className="ml-6">
              <div className="p-4 bg-slate-50 rounded-xl mt-4">
                <div className="flex items-center gap-4">
                  <ImageShow
                    src={reply.user.img}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                    alt="userImg"
                  />
                  <span className="font-medium">{reply.user.username}</span>
                  <span className="text-sm text-gray-500">
                    {format(reply.createdAt)}
                  </span>
                  {(reply.user.username === user?.username || isAdmin) && (
                    <button
                      className="text-sm text-gray-500"
                      onClick={() => onDelete(reply._id)}
                    >
                      <DeleteOutlined
                        className="cursor-pointer"
                        style={{ color: "red", fontSize: "16px" }}
                      />
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  <p>{reply.desc}</p>
                </div>
              </div>
              <Button
                type="text"
                onClick={() =>
                  likeComments?.includes(reply._id)
                    ? onDisLike(reply._id)
                    : onLike(reply._id)
                }
              >
                <ThumbsUp
                  className={
                    likeComments?.includes(reply._id)
                      ? "text-blue-800"
                      : "text-gray-500"
                  }
                />
                {reply.like}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
