"use client";
import { useUser } from "@clerk/nextjs";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, forwardRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import UploadV1 from "../components/UploadV1";
import useSWR from "swr";
import { fetcherUseSWR } from "../api/useswr";
import { Category } from "@/interface/Category";
import { Modal, Select } from "antd";
import { Plus } from "lucide-react";
import { set } from "date-fns";
import SelectOption from "../components/SelectOptionAndModalCreate";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const QuillWrapper = forwardRef((props: any, ref: any) => {
  return <ReactQuill {...props} forwardedRef={ref} />;
});
QuillWrapper.displayName = "QuillWrapper";

const WritePage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [isDisabledBtnSend, setIsDisabledBtnSend] = useState(false);
  const [content, setContent] = useState("");
  const quillRef = useRef<any>(null);
  const router = useRouter();
  const [value, setValue] = useState("");
  const { getToken } = useAuth();
  const [cover, setCover] = useState("");
  const [coverVideo, setCoverVideo] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameCategory, setNameCategory] = useState("");
  const [idCategory, setIdCategory] = useState("");
  const {
    data: dataCategories,
    error,
    isLoading,
    mutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/category`, fetcherUseSWR);
  useEffect(() => {
    if (coverImage) {
      setValue(
        (prev) =>
          prev +
          `<p><image src="${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${coverImage}"/>
      </p>`
      );
    }
  }, [coverImage]);
  useEffect(() => {
    if (coverVideo) {
      setValue(
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    // setIsModalOpen(false);
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const createCategory = async (dataForm: any) => {
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
      toast.success("Post created successfully");
      router.push(`/posts/${res.data._id}`);
    } else {
      toast.error("Post updated failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const dataForm = {
      title: formData.get("title"),
      category: nameCategory,
      desc: formData.get("desc"),
      content: value,
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

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Create a New Post</h1>
      <form
        action=""
        className="flex flex-col gap-6 flex-1 mb-6"
        onSubmit={handleSubmit}
      >
        <UploadV1
          type="image"
          buttonText="Tải ảnh lên"
          onSuccess={(res) => setCover(res.filePath || "")}
        />
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="My Awesome Story"
          name="title"
        />
        {/* <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="" className="text-sm">
              Choose a category:
            </label>
            <Select
              showSearch
              defaultValue={categoryOptions[0].value}
              placeholder="Select a category"
              optionFilterProp="label"
              onChange={onChange}
              onSearch={onSearch}
              options={categoryOptions}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <button
              onClick={showModal}
              className="flex items-center gap-2 w-max p-3 px-5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
              type="button"
            >
              <Plus />
              New Category
            </button>
            <Modal
              title="Create New Category"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
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
        </div> */}
        <SelectOption
          categories={categoryOptions}
          modal={true}
          onChangeCategory={(value) => setNameCategory(value)}
        />
        <textarea
          name="desc"
          id="content"
          placeholder="A Short Description"
          className="p-4 rounded-xl bg-white shadow-md"
        />
        {/* quill editor */}
        <div className="flex">
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
              // onProgress={(p) => console.log("Đang upload:", p.toFixed(0), "%")}
            >
              🎥
            </UploadV1>
          </div>
          <div className="flex w-[80%]">
            <QuillWrapper
              ref={quillRef}
              theme="snow"
              className="flex-1 rounded-xl bg-white shadow-md w-[70%]"
              value={value}
              onChange={setValue}
            />
          </div>
        </div>
        <button
          disabled={isDisabledBtnSend}
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-200"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default WritePage;
