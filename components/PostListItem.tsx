import Link from "next/link";
import ImageShow from "./Image";
import { Post } from "@/interface/Post";
import { format } from "timeago.js";
import useSWR from "swr";
import { fetcherUseSWR } from "../app/api/useswr";
import { Category } from "@/interface/Category";

const PostListItem = ({ post }: { post: Post }) => {
  const {
    data: categories,
    error,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/category`, fetcherUseSWR);
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* image */}
      <div className="md:hidden xl:block xl:w-1/3">
        <ImageShow
          src={post.img}
          className="rounded-2xl object-cover"
          width={600}
          height={400}
          alt="featured1"
        />
      </div>
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link href={`/posts/${post._id}`} className="text-4xl font-semibold">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link
            href={`/posts?author=${post.user.username}`}
            className="text-blue-800"
          >
            {post.user.username}
          </Link>
          <span>on</span>
          <Link
            href={`/posts?cat=${
              categories?.categories.find(
                (category: Category) => category._id === post.category
              )?._id
            }`}
            className="text-blue-800"
          >
            {
              categories?.categories.find(
                (category: Category) => category._id === post.category
              )?.title
            }
          </Link>
          <span>{format(post.createdAt)}</span>
        </div>
        <p className="">{post.desc}</p>
        <Link href={`/posts/${post._id}`} className="underline text-blue-800">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
