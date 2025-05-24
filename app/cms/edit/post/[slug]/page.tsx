"use client";
import ImageShow from "@/app/components/Image";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { fetcherWithTokenUseSWR } from "@/app/api/useswr";
import dynamic from "next/dynamic";
import { useState } from "react";
import UploadV1 from "@/app/components/UploadV1";
import axios from "axios";
import { toast } from "react-toastify";
const EditPage = () => {
  const params = useParams();
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
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
  const [content, setContent] = useState(data?.content || "");
  const [cover, setCover] = useState(data?.img || "");
  const changeContent = (value: string) => {
    setContent(value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const dataForm = {
      title: formData.get("title"),
      category: data?.category,
      desc: formData.get("desc"),
      content: content,
      img: cover,
    };
    const token = await getToken();
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${data?._id}`,
      {
        ...dataForm,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      toast.success("Post updated successfully");
      setTimeout(() => {
        router.push(`/cms`);
      }, 5000);
    }
  };

  if (!isSignedIn) return <p>Bạn chưa đăng nhập</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;
  if (!data) return <p>Không tìm thấy bài viết</p>;

  return (
    <form action="" className="flex flex-col gap-8" onSubmit={handleSubmit}>
      {/* details */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            <input
              className="text-4xl font-semibold bg-transparent outline-none w-full h-full"
              type="text"
              defaultValue={data?.title}
              name="title"
            />
          </h1>
          <UploadV1
            type="image"
            buttonText="Change cover"
            onSuccess={(res) => setCover(res.filePath || "")}
          />
          {/* <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link href="" className="text-blue-800">
              {data?.user.username}
            </Link>
            <span>on</span>
            <Link href="" className="text-blue-800">
              {data?.category}
            </Link>
            <span>{format(data?.createdAt)}</span>
          </div> */}
          <textarea
            name="desc"
            defaultValue={data?.desc}
            id="content"
            placeholder="A Short Description"
            className="p-4 rounded-xl bg-white shadow-md"
          />
        </div>
        <div className="hidden lg:block w-2/5">
          <ImageShow
            src={cover}
            className="rounded-2xl"
            width={600}
            height={400}
            alt="featured1"
          />
        </div>
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12">
        <ReactQuill
          theme="snow"
          className="flex-1 rounded-xl bg-white shadow-md w-[70%]"
          value={content}
          onChange={changeContent}
        />
        {/* menu */}
        {/* <div className="px-4 h-max sticky top-8">
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
        </div> */}
      </div>
      {/* <Comments postId={data?._id} /> */}
      <button className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-200">
        Update
      </button>
    </form>
  );
};

export default EditPage;
