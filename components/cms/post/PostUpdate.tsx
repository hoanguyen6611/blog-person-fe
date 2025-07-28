"use client";
import ImageShow from "@/components/Image";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/api/useswr";
import { useEffect, useRef, useState } from "react";
import UploadV1 from "@/components/UploadV1";
import SelectOption from "@/components/SelectOption";
import { Category } from "@/interface/Category";
import axios from "axios";
import { toast } from "react-toastify";
import Editor, { EditorHandle } from "@/components/Editor/Editor";
import { useTableStore } from "@/store/useTableStore";
import BackToTopButton from "@/components/BackToTopButton";
const PostUpdate = () => {
  const params = useParams();
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const editorRef = useRef<EditorHandle>(null);
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
  const { data: dataCategories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const [cover, setCover] = useState("");
  const [coverVideo, setCoverVideo] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [isDisabledBtnSend, setIsDisabledBtnSend] = useState(false);
  const [editorInitialContent, setEditorInitialContent] = useState("");
  const { setContentCreatePost, resetContentCreatePost } = useTableStore();
  useEffect(() => {
    resetContentCreatePost();
  }, []);
  useEffect(() => {
    if (!data) return;
    setContentCreatePost(data?.content || "");
    setEditorInitialContent(data?.content || "");
    setCover(data?.img || "");
    setCategory(data?.category || "");
  }, [data]);
  useEffect(() => {
    if (coverImage && editorRef.current) {
      editorRef.current?.insertImage(
        `${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${coverImage}`
      );
      setContentCreatePost(
        (prev) =>
          prev +
          `<p><img src="${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${coverImage}"/>
    </p>`
      );
    }
  }, [coverImage, setContentCreatePost]);
  useEffect(() => {
    if (coverVideo && editorRef.current) {
      editorRef.current?.insertImage(
        `${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${coverVideo}`
      );
      setContentCreatePost(
        (prev) =>
          prev +
          `<p><iframe class="ql-video" src="${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${coverVideo}"/></p>`
      );
    }
  }, [coverVideo, setContentCreatePost]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const dataForm = {
      title: formData.get("title"),
      category: category,
      desc: formData.get("desc"),
      content: editorInitialContent,
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
      setIsDisabledBtnSend(true);
      setContentCreatePost("");
      router.push(`/cms/posts`);
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
  const onChange = (content: string) => {
    setContentCreatePost(content);
    setEditorInitialContent(content);
  };

  if (!isSignedIn) return <p>You are not logged in</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;
  if (!data) return <p>Post not found</p>;

  return (
    <div className="h-full min-h-screen bg-gray-50 py-8 px-4 md:px-10">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          📝 Update Post
        </h1>
        <form action="" className="space-y-6" onSubmit={handleSubmit}>
          {/* details */}
          <div className="space-y-2">
            <label className="block font-medium">Cover Image</label>
            <UploadV1
              type="image"
              buttonText="Change cover"
              onSuccess={(res) => setCover(res.filePath || "")}
            />
            <div className="mt-2">
              <ImageShow
                src={cover}
                className="rounded-xl"
                width={800}
                height={400}
                alt="cover"
              />
            </div>
          </div>
          <div>
            <input
              name="title"
              className="w-full text-2xl font-semibold p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="New Post title here..."
              defaultValue={data?.title}
            />
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <SelectOption
                name="Select a category"
                categories={categoryOptions}
                value={category}
                onChangeCategory={(value: string) => setCategory(value)}
              />
            </div>
          </div>
          <div>
            <textarea
              name="desc"
              placeholder="Short description..."
              className="w-full min-h-[100px] p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              defaultValue={data?.desc}
              id="content"
            />
          </div>

          {/* content */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-3">
              <UploadV1
                type="image"
                buttonText="Upload image"
                onSuccess={(res) => setCoverImage(res.filePath || "")}
              />
              <UploadV1
                type="video"
                buttonText="Upload video"
                onSuccess={(res) => setCoverVideo(res.filePath || "")}
                onProgress={(p) =>
                  console.log("Uploading...:", p.toFixed(0), "%")
                }
              />
            </div>
            <div className="md:col-span-3">
              <Editor
                ref={editorRef}
                content={editorInitialContent}
                onChange={onChange}
              />
            </div>
          </div>
          <BackToTopButton />
          <div className="text-center">
            <button
              type="submit"
              disabled={isDisabledBtnSend}
              className="px-6 py-3 text-white bg-blue-700 hover:bg-blue-800 rounded-lg font-medium disabled:opacity-50"
            >
              {isDisabledBtnSend ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostUpdate;
