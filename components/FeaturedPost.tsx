"use client";
import Link from "next/link";
import ImageShow from "./Image";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { format } from "timeago.js";
import { Category } from "@/interface/Category";
import { Post } from "@/interface/Post";

const FeaturedPost = () => {
  const { data, isLoading, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?featured=true&limit=4&sort=newest`,
    fetcherUseSWR
  );
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );

  const getCategoryTitle = (id: string) =>
    categories?.categories?.find((c: Category) => c._id === id)?.title || "";

  if (isLoading) return <p>Loading...</p>;
  if (error || !data?.posts?.length) return null;

  const [first, ...rest] = data.posts;

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Big post */}
      <div className="w-full lg:w-1/2 space-y-4">
        <ImageShow
          src={first.img}
          className="rounded-3xl"
          width={600}
          height={400}
          alt="featured"
        />
        <h2 className="text-2xl font-bold text-gray-800">{first.title}</h2>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{getCategoryTitle(first.category)}</span>
          <span>{format(first.createdAt)}</span>
        </div>
      </div>

      {/* Smaller posts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {rest.map((post: Post, idx: number) => (
          <FeaturedItem
            key={post._id}
            index={idx + 2}
            title={post.title}
            img={post.img}
            date={format(post.createdAt)}
            category={getCategoryTitle(post.category)}
            href={`/posts/${post._id}`}
          />
        ))}
      </div>
    </div>
  );
};

const FeaturedItem = ({
  index,
  title,
  img,
  date,
  category,
  href,
}: {
  index: number;
  title: string;
  img: string;
  date: string;
  category: string;
  href: string;
}) => {
  return (
    <div className="flex gap-4">
      <ImageShow
        src={img}
        className="rounded-2xl w-1/3 object-cover aspect-video"
        width={300}
        height={200}
        alt={title}
      />
      <div className="w-2/3 space-y-1">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <span>{index.toString().padStart(2, "0")}.</span>
          <Link
            href={href}
            className="hover:underline text-base sm:text-lg font-medium"
          >
            {title}
          </Link>
        </div>
        <div className="text-sm text-gray-500 ml-6 flex gap-2">
          <span>{category}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
