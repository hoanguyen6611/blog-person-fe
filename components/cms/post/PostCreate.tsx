"use client";
import { useUser } from "@clerk/nextjs";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, forwardRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import useSWR from "swr";
import { Category } from "@/interface/Category";
import { Modal } from "antd";
import { fetcherUseSWR } from "@/api/useswr";
import UploadV1 from "@/components/UploadV1";
import { PlusOutlined } from "@ant-design/icons";
import SelectOption from "@/components/SelectOption";
import Editor from "@/components/Editor/Editor";
import ImageShow from "@/components/Image";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const QuillWrapper = forwardRef((props: any, ref: any) => {
  return <ReactQuill {...props} forwardedRef={ref} />;
});
QuillWrapper.displayName = "QuillWrapper";

interface FormPost {
  title: string;
  category: string;
  desc?: string;
  content: string;
  img?: string;
}

const PostCreate = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [isDisabledBtnSend, setIsDisabledBtnSend] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();
  const [cover, setCover] = useState("");
  const [coverVideo, setCoverVideo] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameCategory, setNameCategory] = useState("");
  const [post, setPost] = useState("");
  const { data: dataCategories, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  useEffect(() => {
    if (coverImage) {
      setPost(
        (prev) =>
          prev +
          `<p><img src="${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${coverImage}"/>
      </p>`
      );
    }
  }, [coverImage]);
  useEffect(() => {
    if (coverVideo) {
      setPost(
        (prev) =>
          prev +
          `<p><iframe class="ql-video" src="${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${coverVideo}"/></p>`
      );
    }
  }, [coverVideo]);

  if (!isLoaded) {
    return <div>Loading</div>;
  }
  if (!isLoaded || !isSignedIn) {
    return <div>You should login</div>;
  }

  const handleOk = async () => {
    const dataForm = {
      title: nameCategory,
    };
    const token = await getToken();
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/category`,
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
      toast.success("Category created successfully");
      setIsModalOpen(false);
      mutate();
    } else {
      toast.error("Category created failed");
    }
  };

  const createCategory = async (dataForm: FormPost) => {
    const token = await getToken();
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/posts`,
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
      toast.success("Post created successfully");
      router.push(`/posts/${res.data._id}`);
    } else {
      toast.error("Post updated failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const dataForm: FormPost = {
      title: formData.get("title") as string,
      category: nameCategory,
      desc: formData.get("desc") as string,
      content: post,
      img: cover,
    };
    if (!dataForm.title) {
      toast.error("The title field is required");
      return;
    }
    if (!dataForm.category) {
      toast.error("The category field is required");
    }
    if (!dataForm.content) {
      toast.error("The content field is required");
    } else {
      setIsDisabledBtnSend(true);
      createCategory(dataForm);
    }
  };
  const categoryOptions = dataCategories?.categories.map(
    (category: Category) => ({
      value: category._id,
      label: category.title,
    })
  );
  const showModalFormCategory = () => {
    setIsModalOpen(true);
  };
  const handleCancelFormCategory = () => {
    setIsModalOpen(false);
  };

  const onChange = (content: string) => {
    setPost(content);
    console.log(content);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6 px-5">
      <h1 className="text-xl font-bold text-center">Create a New Post</h1>
      <form
        action=""
        className="flex flex-col gap-6 flex-1 mb-6"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 items-center">
          <UploadV1
            type="image"
            buttonText={cover ? "Change image cover" : "Upload image cover"}
            onSuccess={(res) => setCover(res.filePath || "")}
          />
          {cover && (
            <div className="hidden lg:block w-2/5">
              <ImageShow
                src={cover}
                className="rounded-2xl"
                width={600}
                height={400}
                alt="featured1"
              />
            </div>
          )}
        </div>
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="New Post title here ...."
          name="title"
        />
        <div className="flex gap-2">
          <SelectOption
            name="Select a category"
            categories={categoryOptions}
            onChangeCategory={(value) => setNameCategory(value)}
          />
          <div>
            <button
              onClick={showModalFormCategory}
              className="flex items-center gap-2 w-max p-3 px-5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
              type="button"
            >
              <PlusOutlined
                className="cursor-pointer"
                style={{ fontSize: "16px" }}
              />
              New Category
            </button>
            <Modal
              title="Create New Category"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancelFormCategory}
            >
              <input
                className="text-4xl font-semibold bg-transparent outline-none"
                type="text"
                placeholder="My Awesome Category"
                name="nameCategory"
                onChange={(e) => setNameCategory(e.target.value)}
              />
            </Modal>
          </div>
        </div>
        <textarea
          name="desc"
          id="content"
          placeholder="New Post Short Description here .... "
          className="p-4 rounded-xl bg-white shadow-md"
        />
        {/* quill editor */}
        <div className="flex">
          <div className="flex flex-col gap-2 mr-2 w-[20%]">
            <UploadV1
              type="image"
              buttonText="Upload image"
              onSuccess={(res) => setCoverImage(res.filePath || "")}
            />
            <UploadV1
              type="video"
              buttonText="Upload video"
              onSuccess={(res) => setCoverVideo(res.filePath || "")}
              // onProgress={(p) => console.log("Đang upload:", p.toFixed(0), "%")}
            />
          </div>
          {/* <div className="flex w-[80%]">
            <QuillWrapper
              ref={quillRef}
              theme="snow"
              className="flex-1 rounded-xl bg-white shadow-md w-[70%]"
              value={value}
              onChange={setValue}
            />
          </div> */}
          <div className="flex w-[80%]">
            <Editor content={post} onChange={onChange} />
          </div>
        </div>
        <button
          disabled={isDisabledBtnSend}
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-200 mb-4"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default PostCreate;
