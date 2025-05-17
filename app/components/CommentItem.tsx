import ImageShow from "@/app/components/Image";
import { Comment } from "@/interface/Comment";
import { format } from "timeago.js";

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-8">
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
      </div>
      <div className="mt-4">
        <p>{comment.desc}</p>
      </div>
    </div>
  );
};

export default CommentItem;
