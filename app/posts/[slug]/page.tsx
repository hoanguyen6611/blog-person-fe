"use client";
import ImageShow from "@/app/components/Image";
import PostMenuActions from "@/app/components/PostMenuActions";
import { FacebookIcon, InstagramIcon } from "lucide-react";
import Link from "next/link";
import SearchInput from "@/app/components/Search";
import Comments from "@/app/components/Comments";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { format } from "timeago.js";
import DOMPurify from "dompurify";
import { fetcherWithTokenUseSWR } from "@/app/api/useswr";
const ItemPostPage = () => {
  const params = useParams();
  const { getToken, isSignedIn } = useAuth();

  const { data, error, isLoading } = useSWR(
    isSignedIn ? "fetch-user" : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${params.slug}`,
        token!
      );
    }
  );

  if (!isSignedIn) return <p>Bạn chưa đăng nhập</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;
  if (!data) return <p>Không tìm thấy bài viết</p>;
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
            <Link href="" className="text-blue-800">
              {data?.user.username}
            </Link>
            <span>on</span>
            <Link href="" className="text-blue-800">
              {data?.category}
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
                src={data?.user.img}
                className="w-12 h-12 rounded-full object-full"
                width={48}
                height={48}
                alt="userImg"
              />
              <Link href="" className="text-blue-800">
                {data?.user.username}
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </p>
            <div className="flex gap-2">
              <Link href="">
                <FacebookIcon />
              </Link>
              <Link href="">
                <InstagramIcon />
              </Link>
            </div>
          </div>
          <PostMenuActions post={data} />
          <h1 className="mt-8 mb-4 text-sm font-bold">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/posts" className="underline">
              All
            </Link>
            <Link href="/posts?cat=web-design" className="underline">
              Web Design
            </Link>
            <Link href="/posts?cat=development" className="underline">
              Development
            </Link>
            <Link href="/posts?cat=database" className="underline">
              Database
            </Link>
            <Link href="/posts?cat=ai" className="underline">
              AI
            </Link>
            <Link href="/posts?cat=security" className="underline">
              Security
            </Link>
            <Link href="/posts?cat=marketing" className="underline">
              Marketing
            </Link>
            <Link href="/posts?cat=business" className="underline">
              Business
            </Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-bold">Search</h1>
          <SearchInput />
        </div>
      </div>
      <Comments postId={data?._id} />
    </div>
  );
};

export default ItemPostPage;
