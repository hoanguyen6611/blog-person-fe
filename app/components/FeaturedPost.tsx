"use client";
import Link from "next/link";
import ImageShow from "./Image";
import { fetcherUseSWR } from "../api/useswr";
import useSWR from "swr";
import { format } from "timeago.js";
import { Category } from "@/interface/Category";
const FeaturedPost = () => {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?featured=true&limit=4&sort=newest`,
    fetcherUseSWR
  );
  const {
    data: categories,
    error: errorCategories,
    isLoading: isLoadingCategories,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/category`, fetcherUseSWR);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  const posts = data.posts;
  if (!posts || posts.length === 0) {
    return;
  }
  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-2">
      {/* First */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* image */}
        {posts[0].img && (
          <ImageShow
            src={posts[0].img}
            className="rounded-3xl object-cover"
            width={600}
            height={400}
            alt="featured1"
          />
        )}
        {/* details */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl lg:text-3xl font-semibold lg:font-bold">
            01.
          </h1>
          <Link
            href={`/posts/${posts[0]._id}`}
            className="text-xl lg:text-3xl font-semibold lg:font-bold"
          >
            {posts[0].title}
          </Link>
        </div>
        <div className="flex items-center gap-4 ml-16">
          <Link
            href={`/posts?cat=${
              categories?.categories.find(
                (category: Category) => category._id === posts[0].category
              )?._id
            }`}
            className="text-blue-800"
          >
            {
              categories?.categories.find(
                (category: Category) => category._id === posts[0].category
              )?.title
            }
          </Link>
          <span className="text-gray-500">{format(posts[0].createdAt)}</span>
        </div>
      </div>
      {/* Other */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* second */}
        {posts[1] && (
          <div className="lg:h-1/3 flex justify-between gap-4">
            <ImageShow
              src={posts[1].img}
              className="rounded-3xl object-cover w-1/3 aspect-video"
              width={300}
              height={200}
              alt="featured2"
            />
            <div className="w-2/3">
              <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                <h1 className="text-xl lg:text-3xl font-semibold lg:font-bold">
                  02.
                </h1>
                <Link
                  href={`/posts/${posts[1]._id}`}
                  className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
                >
                  {posts[1].title}
                </Link>
              </div>
              <div className="flex items-center gap-4 ml-16">
                <Link
                  href={`/posts?cat=${
                    categories?.categories.find(
                      (category: Category) => category._id === posts[1].category
                    )?._id
                  }`}
                  className="text-blue-800"
                >
                  {
                    categories?.categories.find(
                      (category: Category) => category._id === posts[1].category
                    )?.title
                  }
                </Link>
                <span className="text-gray-500">
                  {format(posts[1].createdAt)}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* third */}
        {posts[2] && (
          <div className="lg:h-1/3 flex justify-between gap-4">
            <ImageShow
              src={posts[2].img}
              className="rounded-3xl object-cover w-1/3 aspect-video"
              width={300}
              height={200}
              alt="featured3"
            />
            <div className="w-2/3">
              <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                <h1 className="text-xl lg:text-3xl font-semibold lg:font-bold">
                  03.
                </h1>
                <Link
                  href={`/posts/${posts[2]._id}`}
                  className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
                >
                  {posts[2].title}
                </Link>
              </div>
              <div className="flex items-center gap-4 ml-16">
                <Link
                  href={`/posts?cat=${
                    categories?.categories.find(
                      (category: Category) => category._id === posts[2].category
                    )?._id
                  }`}
                  className="text-blue-800"
                >
                  {
                    categories?.categories.find(
                      (category: Category) => category._id === posts[2].category
                    )?.title
                  }
                </Link>
                <span className="text-gray-500">
                  {format(posts[2].createdAt)}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* fourth */}
        {posts[3] && (
          <div className="lg:h-1/3 flex justify-between gap-4">
            <ImageShow
              src={posts[3].img}
              className="rounded-3xl object-cover w-1/3 aspect-video"
              width={300}
              height={200}
              alt="featured4"
            />
            <div className="w-2/3">
              <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                <h1 className="text-xl lg:text-3xl font-semibold lg:font-bold">
                  04.
                </h1>
                <Link
                  href={`/posts/${posts[3]._id}`}
                  className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
                >
                  {posts[3].title}
                </Link>
              </div>
              <div className="flex items-center gap-4 ml-16">
                <Link
                  href={`/posts?cat=${
                    categories?.categories.find(
                      (category: Category) => category._id === posts[3].category
                    )?._id
                  }`}
                  className="text-blue-800"
                >
                  {
                    categories?.categories.find(
                      (category: Category) => category._id === posts[3].category
                    )?.title
                  }
                </Link>
                <span className="text-gray-500">
                  {format(posts[3].createdAt)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FeaturedPost;
