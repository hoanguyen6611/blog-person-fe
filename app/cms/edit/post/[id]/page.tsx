"use client";
import ImageShow from "@/app/components/Image";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/app/api/useswr";
import dynamic from "next/dynamic";
import { forwardRef, useEffect, useRef, useState } from "react";
import UploadV1 from "@/app/components/UploadV1";
import SelectOption from "@/app/components/SelectOption";
import { Category } from "@/interface/Category";
import axios from "axios";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const QuillWrapper = forwardRef((props: any, ref: any) => {
  return <ReactQuill {...props} forwardedRef={ref} />;
});
QuillWrapper.displayName = "QuillWrapper";
const EditPage = () => {
  const params = useParams();
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const quillRef = useRef<any>(null);
  const { data, error, isLoading } = useSWR(
    isSignedIn && params?.slug ? [`post`, params.slug] : null,
    async ([, slug]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`,
        token!
      );
    }
  );
  const { data: dataCategories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [coverVideo, setCoverVideo] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
    if (data?.content) {
      setContent(data?.content || "");
    }
    if (data?.img) {
      setCover(data?.img || "");
    }
    if (data?.category) {
      setCategory(data?.category || "");
    }
    if (data?.content) {
      setContent(data?.content || "");
    }
  }, [data]);
  useEffect(() => {
    if (coverImage) {
      setContent(
        (prev) =>
          prev +
          `<p><image src="${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${coverImage}"/>
      </p>`
      );
    }
  }, [coverImage]);
  useEffect(() => {
    if (coverVideo) {
      setContent(
        (prev) =>
          prev +
          `<p><iframe class="ql-video" src="${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${coverVideo}"/></p>`
      );
    }
  }, [coverVideo]);
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
    console.log(dataForm);
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
      router.push(`/cms`);
      // setTimeout(() => {
      // }, 5000);
      toast.success("Post updated successfully");
    } else {
      toast.error("Post updated failed");
    }
  };
  const categoryOptions = dataCategories?.categories?.map(
    (category: Category) => ({
      label: category.title,
      value: category._id,
    })
  );

  if (!isSignedIn) return <p>You are not logged in</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;
  if (!data) return <p>Post not found</p>;

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
      <SelectOption
        categories={categoryOptions}
        modal={true}
        value={category}
        onChangeCategory={(value) => setCategory(value)}
      />
      {/* content */}
      <div>
        <div className="flex flex-col gap-2 mr-2 w-[20%]">
          <UploadV1
            type="image"
            buttonText="Tải ảnh lên"
            onSuccess={(res) => setCoverImage(res.filePath || "")}
          >
            🌠
          </UploadV1>
          <UploadV1
            type="video"
            buttonText="Upload video mới"
            onSuccess={(res) => setCoverVideo(res.filePath || "")}
            onProgress={(p) => console.log("Đang upload:", p.toFixed(0), "%")}
          >
            🎥
          </UploadV1>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-12 w-[80%]">
        <QuillWrapper
          ref={quillRef}
          theme="snow"
          className="flex-1 rounded-xl bg-white shadow-md w-[70%]"
          value={content}
          onChange={changeContent}
        />
      </div>
      <button className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-200">
        Update
      </button>
    </form>
  );
};

export default EditPage;
