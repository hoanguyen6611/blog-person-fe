import Link from "next/link";
import ImageShow from "./Image";
import { Post } from "@/interface/Post";
import { format } from "timeago.js";
import useSWR from "swr";
import { fetcherUseSWR } from "../api/useswr";
import { Category } from "@/interface/Category";

const PostListItem = ({ post }: { post: Post }) => {
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  return (
    <div className="flex flex-col xl:flex-row gap-8 ">
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
      {/* <div className="flex flex-col gap-4 xl:w-2/3">
        <Link href={`/posts/${post._id}`} className="text-4xl font-semibold">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link href={`/user/${post?.user?._id}`} className="text-blue-800">
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
      </div> */}
      <div className="p-6 rounded-xl bg-white shadow hover:shadow-md transition-all space-y-4 flex flex-col gap-4 xl:w-2/3 dark:bg-gray-800">
        <Link href={`/posts/${post._id}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:underline dark:text-gray-400">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-200">{post.desc}</p>
        <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-200">
          <span>{post.user.username}</span>
          <span>{format(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
