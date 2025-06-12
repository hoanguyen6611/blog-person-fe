"use client";
import ImageShow from "@/components/Image";
import PostMenuActions from "@/components/PostMenuActions";
import { InstagramOutlined } from "@ant-design/icons";
import Link from "next/link";
import SearchInput from "@/components/Search";
import Comments from "@/components/Comments";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { format } from "timeago.js";
import DOMPurify from "dompurify";
import { fetcherWithTokenUseSWR } from "@/app/api/useswr";
import { fetcherUseSWR } from "@/app/api/useswr/index";
import { Category } from "@/interface/Category";
import Categories from "@/components/Categories";
import { createFromIconfontCN } from "@ant-design/icons";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
});
const ItemPostPage = () => {
  const params = useParams();
  const { getToken, isSignedIn } = useAuth();
  const { data, error, isLoading } = useSWR(
    isSignedIn && params?.id ? [`post`, params.id] : null,
    async ([, id]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
        token!
      );
    }
  );
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );

  if (!isSignedIn) return <p>You are not logged in</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Post not found</p>;
  return (
    <div className="flex flex-col gap-8">
      {/* details */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {data?.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link
              href={`/posts?author=${data?.user?.username}`}
              className="text-blue-800"
            >
              {data?.user?.username}
            </Link>
            <span>on</span>
            <Link
              href={`/posts?cat=${
                categories?.categories.find(
                  (category: Category) => category._id === data.category
                )?._id
              }`}
              className="text-blue-800"
            >
              {
                categories?.categories.find(
                  (category: Category) => category._id === data?.category
                )?.title
              }
            </Link>
            <span>{format(data?.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{data?.desc}</p>
        </div>
        <div className="hidden lg:block w-2/5">
          <ImageShow
            src={data?.img}
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
            __html: DOMPurify.sanitize(data?.content),
          }}
        ></div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-bold">Author</h1>
          <div className=" flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <ImageShow
                src={data?.user?.img}
                className="w-12 h-12 rounded-full object-full"
                width={48}
                height={48}
                alt="userImg"
              />
              <Link
                href={`/posts?author=${data?.user?.username}`}
                className="text-blue-800"
              >
                {data?.user?.username}
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
          <PostMenuActions post={data} />
          <h1 className="mt-8 mb-4 text-sm font-bold">Categories</h1>
          <Categories />
          <h1 className="mt-8 mb-4 text-sm font-bold">Search</h1>
          <SearchInput />
        </div>
      </div>
      <Comments postId={data?._id} />
    </div>
  );
};

export default ItemPostPage;
