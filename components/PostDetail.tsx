"use client";

import DOMPurify from "dompurify";
import Link from "next/link";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { format } from "timeago.js";
import { InstagramOutlined } from "@ant-design/icons";
import { createFromIconfontCN } from "@ant-design/icons";

import ImageShow from "@/components/Image";
import PostMenuActions from "@/components/PostMenuActions";
import SearchInput from "@/components/Search";
import Comments from "@/components/Comments";
import Categories from "@/components/Categories";

import { fetcherUseSWR } from "@/api/useswr";
import { Post } from "@/interface/Post";
import { Category } from "@/interface/Category";
import { Flex, Tag } from "antd";
import ShareButtons from "./ShareButtons";
import RelatedPosts from "./RelatedPosts";
import { Tag as TagInterface } from "@/interface/Tag";
import { useTranslations } from "next-intl";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
});

export default function PostDetail({ post }: { post: Post }) {
  const { isSignedIn } = useAuth();
  const t = useTranslations("PostDetail");
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const { data: tags } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/tags`,
    fetcherUseSWR
  );
  const { data: relatedPosts } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/related/${post._id}`,
    fetcherUseSWR
  );

  if (!isSignedIn) return <p>You are not logged in</p>;

  const categoryTitle = categories?.categories.find(
    (cat: Category) => cat._id === post?.category
  )?.title;
  const tagNames = tags?.tags
    .filter((tag: TagInterface) => post.tags.includes(tag._id))
    .map((tag: TagInterface) => tag.name);
  return (
    <div className="mb-10">
      <div className="container mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main content */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Title & meta */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 dark:text-gray-400 text-black">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm mb-4">
              <span>Written by</span>
              <Link
                href={`/posts?author=${post?.user?.username}`}
                className="text-blue-600 hover:underline"
              >
                {post.user?.username}
              </Link>
              <span>on</span>
              <Link
                href={`/posts?cat=${post?.category}`}
                className="text-blue-600 hover:underline"
              >
                {categoryTitle}
              </Link>
              <span>{format(post?.createdAt)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
              {tagNames?.map((tag: string) => (
                <Flex gap="4px 0" wrap key={tag}>
                  <Tag color="processing">{tag}</Tag>
                </Flex>
              ))}
            </div>

            <p className="text-gray-600">{post.desc}</p>
          </div>
          <ShareButtons title={post.title} />
          {/* Cover Image */}
          {post?.img && (
            <ImageShow
              src={post.img}
              alt="cover"
              width={800}
              height={500}
              className="rounded-2xl shadow-md"
            />
          )}

          {/* Post content */}
          <div
            className="prose max-w-none prose-lg prose-blue"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.content),
            }}
          />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 sticky top-20 self-start space-y-10">
          {/* Author box */}
          <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
            <h2 className="font-semibold text-sm mb-3 dark:text-gray-400">
              {t("author")}
            </h2>
            <div className="flex items-center gap-4 mb-3">
              <ImageShow
                src={post?.user?.img}
                alt="author"
                className="w-12 h-12 rounded-full object-cover"
                width={48}
                height={48}
              />
              <Link
                href={`/user/${post?.user?._id}`}
                className="text-blue-600 font-medium"
              >
                {post?.user?.username}
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur.
            </p>
            <div className="flex gap-3 mt-3">
              <Link href="#">
                {/* <IconFont
                  type="icon-facebook"
                  className="text-blue-600 text-xl"
                /> */}
                <IconFont
                  type="icon-facebook"
                  className="text-xl"
                  style={{ color: "#1877F2" }}
                />
              </Link>
              <Link href="#">
                <InstagramOutlined
                  className="text-pink-500 text-xl"
                  style={{ color: "#C13584" }}
                />
              </Link>
            </div>
          </div>

          <PostMenuActions post={post} />

          <div className="p-4 rounded-xl shadow bg-white dark:text-gray-400 dark:bg-gray-800">
            <h2 className="font-semibold text-sm mb-3">{t("categories")}</h2>
            <Categories />
          </div>

          <div className="p-4 rounded-xl shadow bg-white dark:text-gray-400 dark:bg-gray-800">
            <h2 className="font-semibold text-sm mb-3">{t("search")}</h2>
            <SearchInput />
          </div>
        </aside>
        {/* Comments */}
        <div className="lg:col-span-12 mt-10">
          <Comments postId={post?._id} />
        </div>
      </div>
      <RelatedPosts posts={relatedPosts?.relatedPosts} />
    </div>
  );
}
