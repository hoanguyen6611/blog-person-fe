"use client";
import { useUser } from "@clerk/nextjs";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { Category } from "@/interface/Category";
import {
  Checkbox,
  CheckboxProps,
  DatePicker,
  Modal,
  Select,
  Tabs,
  TabsProps,
} from "antd";
import { fetcherUseSWR } from "@/api/useswr";
import UploadV1 from "@/components/UploadV1";
import { PlusOutlined } from "@ant-design/icons";
import SelectOption from "@/components/SelectOption";
import Editor, { EditorHandle } from "@/components/Editor/Editor";
import ImageShow from "@/components/Image";
import { useTableStore } from "@/store/useTableStore";
import PostDetail from "@/components/PostDetail";
import { Tag } from "@/interface/Tag";
import dayjs from "dayjs";
import { UploadResponse } from "@imagekit/next";
import BackToTopButton from "@/components/BackToTopButton";
interface FormPost {
  title: string;
  category: string;
  desc?: string;
  content: string;
  img?: string;
  tags?: string[];
  publishedAt?: Date | null;
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
  const [isModalOpenTag, setIsModalOpenTag] = useState(false);
  const [nameCategory, setNameCategory] = useState("");
  const [nameTag, setNameTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [post, setPost] = useState("");
  const [publishedAt, setPublishedAt] = useState<Date | null>(new Date());
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { setFormData, setContentCreatePost, contentCreatePost } =
    useTableStore();
  const editorRef = useRef<EditorHandle>(null);
  const { data: dataCategories, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const { data: dataTags, mutate: mutateTags } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/tags`,
    fetcherUseSWR
  );
  useEffect(() => {
    setContentCreatePost("");
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
    setContentCreatePost("");
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
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (!isLoaded) {
    return <div>Loading</div>;
  }
  if (!isLoaded || !isSignedIn) {
    return <div>You should login</div>;
  }

  const handleOkTag = async () => {
    const dataForm = {
      name: nameTag,
    };
    const token = await getToken();
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/tags`,
      {
        ...dataForm,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 201) {
      toast.success("Name tag created successfully");
      setIsModalOpenTag(false);
      await mutateTags();
      setNameTag("");
    } else {
      toast.error("Name tag created failed");
    }
  };

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
    if (res.status === 201) {
      toast.success("Category created successfully");
      setIsModalOpen(false);
      await mutate();
      setNameCategory("");
    } else {
      toast.error("Category created failed");
    }
  };

  const createPost = async (dataForm: FormPost) => {
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
    if (res.status === 201) {
      setIsDisabledBtnSend(true);
      setFormData({
        title: "",
        category: "",
        desc: "",
        content: "",
        img: "",
      });
      toast.success("Post created successfully");
      setContentCreatePost("");
      router.push(`/posts/${res.data._id}`);
    } else {
      toast.error("Post updated failed");
    }
  };
  const createPostSchedule = async (dataForm: FormPost) => {
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
    if (res.status === 201) {
      setIsDisabledBtnSend(true);
      setFormData({
        title: "",
        category: "",
        desc: "",
        content: "",
        img: "",
      });
      toast.success("Post created successfully and scheduled");
      setContentCreatePost("");
      router.push(`/cms/posts/schedule`);
    } else {
      toast.error("Post updated failed");
    }
  };

  const handleSubmit = async () => {
    const dataForm: FormPost = {
      title,
      category: nameCategory,
      desc,
      content: post,
      img: cover,
      tags: tags,
    };
    if (!dataForm.title) {
      toast.error("The title field is required");
      return;
    }
    if (!dataForm.category) {
      toast.error("The category field is required");
      return;
    }
    if (!dataForm.content) {
      toast.error("The content field is required");
      return;
    } else {
      setIsDisabledBtnSend(true);
      createPost(dataForm);
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
  const showModalFormTag = () => {
    setIsModalOpenTag(true);
  };
  const handleCancelFormCategory = () => {
    setIsModalOpen(false);
  };
  const handleCancelFormTag = () => {
    setIsModalOpenTag(false);
  };
  const changeUploadImage = (res: UploadResponse) => {
    setCover(res.filePath || "");
    setFormData((prev) => ({ ...prev, img: res.filePath || "" }));
  };
  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setFormData((prev) => ({ ...prev, title: e.target.value }));
  };
  const onChange = (content: string) => {
    setContentCreatePost(content);
    setPost(content);
    setFormData((prev) => ({ ...prev, content }));
  };
  const changeCategory = (value: string) => {
    setNameCategory(value);
    setFormData((prev) => ({ ...prev, category: value }));
  };
  const handleChange = (value: string[]) => {
    setTags(value);
  };
  const tagsOptions = dataTags?.tags.map((tag: Tag) => ({
    value: tag._id,
    label: tag.name,
  }));
  const onChangeCheckBox: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const handleSubmitSchedule = async () => {
    const dataForm: FormPost = {
      title,
      category: nameCategory,
      desc,
      content: post,
      img: cover,
      tags: tags,
      publishedAt,
    };
    if (!dataForm.title) {
      toast.error("The title field is required");
      return;
    }
    if (!dataForm.category) {
      toast.error("The category field is required");
      return;
    }
    if (!dataForm.content) {
      toast.error("The content field is required");
      return;
    } else {
      setIsDisabledBtnSend(true);
      createPostSchedule(dataForm);
    }
  };

  return (
    <div className="h-full min-h-screen bg-gray-50 py-8 px-4 md:px-10">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          📝 Create a New Post
        </h1>

        <form className="space-y-6">
          {/* Upload cover */}
          <div className="space-y-2">
            <label className="block font-medium">Cover Image</label>
            <UploadV1
              type="image"
              buttonText={cover ? "Change cover image" : "Upload cover image"}
              onSuccess={changeUploadImage}
            />
            {cover && (
              <div className="mt-2">
                <ImageShow
                  src={cover}
                  className="rounded-xl"
                  width={800}
                  height={400}
                  alt="cover"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <input
              ref={inputRef}
              name="title"
              onChange={changeTitle}
              className="w-full text-2xl font-semibold p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="New Post title here..."
            />
          </div>

          {/* Category */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <SelectOption
                name="Select a category"
                categories={categoryOptions}
                onChangeCategory={changeCategory}
              />
            </div>
            <button
              type="button"
              onClick={showModalFormCategory}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <PlusOutlined />
              New Category
            </button>
          </div>

          {/* Modal */}
          <Modal
            title="Create New Category"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancelFormCategory}
          >
            <input
              type="text"
              name="nameCategory"
              placeholder="Awesome Category"
              className="w-full p-3 text-xl rounded-lg border border-gray-300 outline-none"
              onChange={(e) => setNameCategory(e.target.value)}
            />
          </Modal>

          {/* Tag */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select name tag"
                onChange={handleChange}
                options={tagsOptions}
              />
            </div>
            <button
              type="button"
              onClick={showModalFormTag}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <PlusOutlined />
              New Tag
            </button>
          </div>
          <Modal
            title="Create New Tag"
            open={isModalOpenTag}
            onOk={handleOkTag}
            onCancel={handleCancelFormTag}
          >
            <input
              type="text"
              name="nameTag"
              value={nameTag}
              placeholder="Awesome Tag"
              className="w-full p-3 text-xl rounded-lg border border-gray-300 outline-none"
              onChange={(e) => setNameTag(e.target.value)}
            />
          </Modal>
          <div className="flex gap-3 items-end">
            <Checkbox onChange={onChangeCheckBox}>
              Send Email to All Users
            </Checkbox>
          </div>
          {/* Description */}
          <div>
            <textarea
              name="desc"
              placeholder="Short description..."
              className="w-full min-h-[100px] p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, desc: e.target.value }));
                setDesc(e.target.value);
              }}
            />
          </div>

          {/* Editor + upload image/video */}
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
              />
            </div>
            <div className="md:col-span-3">
              <Editor
                ref={editorRef}
                content={contentCreatePost}
                onChange={onChange}
              />
            </div>
          </div>
          <BackToTopButton />
          {/* Submit */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-6">
            {/* Nút Create Post */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isDisabledBtnSend}
              className="w-full md:w-auto px-6 py-3 text-white bg-blue-700 hover:bg-blue-800 rounded-xl font-semibold disabled:opacity-50 transition-all"
            >
              {isDisabledBtnSend ? "Creating..." : "Create Post"}
            </button>

            {/* Lên lịch đăng */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-3 w-full md:w-auto">
              <DatePicker
                showTime
                className="w-full md:w-60"
                defaultValue={dayjs()}
                onChange={(date) => setPublishedAt(date?.toDate() || null)}
                placeholder="Select publish time"
              />
              <button
                onClick={handleSubmitSchedule}
                className="w-full md:w-auto px-6 py-3 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition-all"
              >
                Schedule
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
const Preview = () => {
  const { formData } = useTableStore();
  const mockPost = {
    _id: "preview",
    tags: [],
    user: {
      _id: "preview-user",
      clerkUserId: "preview-clerk",
      username: "Preview User",
      email: "preview@example.com",
      img: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    slug: "preview",
    isFeature: false,
    visit: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
    ...formData,
  };
  return (
    <div>
      <PostDetail post={mockPost} />
    </div>
  );
};
const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Editor",
    children: <PostCreate />,
  },
  {
    key: "2",
    label: "Preview",
    children: <Preview />,
  },
];
const PostCreateCMS = () => <Tabs defaultActiveKey="1" items={items} />;

export default PostCreateCMS;
