"use client";
import ImageShow from "@/components/Image";
import PostMenuActions from "@/components/PostMenuActions";
import { InstagramOutlined } from "@ant-design/icons";
import Link from "next/link";
import SearchInput from "@/components/Search";
import Comments from "@/components/Comments";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { format } from "timeago.js";
import DOMPurify from "dompurify";
import { fetcherUseSWR } from "@/api/useswr/index";
import { Category } from "@/interface/Category";
import Categories from "@/components/Categories";
import { createFromIconfontCN } from "@ant-design/icons";
import { Post } from "@/interface/Post";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
});
const PostDetail = ({ post }: { post: Post }) => {
  const { isSignedIn } = useAuth();
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  if (!isSignedIn) return <p>You are not logged in</p>;
  return (
    <div className="flex flex-col gap-8">
      {/* details */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {post?.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link
              href={`/posts?author=${post?.user?.username}`}
              className="text-blue-800"
            >
              {post?.user?.username}
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
            <span>{format(post?.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{post?.desc}</p>
        </div>
        <div className="hidden lg:block w-2/5">
          <ImageShow
            src={post?.img}
            className="rounded-2xl"
            width={600}
            height={400}
            alt="featured1"
          />
        </div>
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* text */}
        <div
          className="lg:text-lg flex flex-col gap-6 text-justify w-[95%]"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post?.content),
          }}
        ></div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-bold">Author</h1>
          <div className=" flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <ImageShow
                src={post?.user?.img}
                className="w-12 h-12 rounded-full object-full"
                width={48}
                height={48}
                alt="userImg"
              />
              <Link
                href={`/posts?author=${post?.user?.username}`}
                className="text-blue-800"
              >
                {post?.user?.username}
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </p>
            <div className="flex gap-2">
              <Link href="">
                <IconFont
                  type="icon-facebook"
                  style={{ color: "#1877F2", fontSize: "32px" }}
                />
              </Link>
              <Link href="">
                <InstagramOutlined
                  style={{ color: "#E1306C", fontSize: "32px" }}
                />
              </Link>
            </div>
          </div>
          <PostMenuActions post={post} />
          <h1 className="mt-8 mb-4 text-sm font-bold">Categories</h1>
          <Categories />
          <h1 className="mt-8 mb-4 text-sm font-bold">Search</h1>
          <SearchInput />
        </div>
      </div>
      <Comments postId={post?._id} />
    </div>
  );
};

export default PostDetail;
