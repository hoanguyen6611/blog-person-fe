"use client";
import { useUser } from "@clerk/nextjs";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { Category } from "@/interface/Category";
import { Checkbox, CheckboxProps, DatePicker, Modal, Select, Tabs, TabsProps } from "antd";
import { fetcherUseSWR } from "@/api/useswr";
import UploadV1 from "@/components/UploadV1";
import { Plus, Check, ExternalLink } from "lucide-react";
import SelectOption from "@/components/SelectOption";
import Editor, { EditorHandle } from "@/components/Editor/Editor";
import ImageShow from "@/components/Image";
import { useTableStore } from "@/store/useTableStore";
import PostDetail from "@/components/PostDetail";
import { Tag } from "@/interface/Tag";
import dayjs from "dayjs";
import { UploadResponse } from "@imagekit/next";
import BackToTopButton from "@/components/BackToTopButton";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { countWords } from "@/lib/wordCount";
import { cn } from "@/lib/utils";

interface FormPost {
  title: string;
  category: string;
  desc?: string;
  content: string;
  img?: string;
  tags?: string[];
  publishedAt?: Date | null;
  isPublished?: boolean;
}

const modalInputClass =
  "w-full rounded-[10px] border border-line bg-surface p-3 text-base text-ink outline-none focus:border-accent";

const PostCreate = () => {
  useRequireAuth();
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

  const wordCount = useMemo(() => countWords(post), [post]);
  const checklist = useMemo(
    () => [
      { key: "title", label: "Tiêu đề", done: !!title },
      { key: "content", label: "Nội dung > 300 từ", done: wordCount > 300 },
      { key: "category", label: "Danh mục", done: !!nameCategory },
      { key: "cover", label: "Ảnh bìa", done: !!cover },
      { key: "desc", label: "Mô tả ngắn", done: !!desc },
    ],
    [title, wordCount, nameCategory, cover, desc]
  );
  const doneCount = checklist.filter((c) => c.done).length;

  if (!isLoaded) {
    return <div className="py-16 text-center text-sm text-muted">Loading</div>;
  }
  if (!isLoaded || !isSignedIn) {
    return <div className="py-16 text-center text-sm text-muted">You should login</div>;
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

  type PublishMode = "draft" | "schedule" | "now";

  const submitPost = async (mode: PublishMode, dataForm: FormPost) => {
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
      setContentCreatePost("");
      if (mode === "draft") {
        toast.success("Đã lưu nháp");
        router.push(`/cms/posts`);
      } else if (mode === "schedule") {
        toast.success("Đã tạo bài và hẹn giờ đăng");
        router.push(`/cms/posts/schedule`);
      } else {
        toast.success("Đã đăng bài");
        router.push(`/posts/${res.data._id}`);
      }
    } else {
      toast.error("Post updated failed");
    }
  };

  const buildBaseForm = (): FormPost | null => {
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
      return null;
    }
    if (!dataForm.category) {
      toast.error("The category field is required");
      return null;
    }
    if (!dataForm.content) {
      toast.error("The content field is required");
      return null;
    }
    return dataForm;
  };

  const handleSaveDraft = async () => {
    const dataForm = buildBaseForm();
    if (!dataForm) return;
    setIsDisabledBtnSend(true);
    // No publishedAt/isPublished sent — backend defaults to a real draft.
    submitPost("draft", dataForm);
  };

  const handlePublishNow = async () => {
    const dataForm = buildBaseForm();
    if (!dataForm) return;
    setIsDisabledBtnSend(true);
    submitPost("now", {
      ...dataForm,
      publishedAt: new Date(),
      isPublished: true,
    });
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
    const dataForm = buildBaseForm();
    if (!dataForm) return;
    if (!publishedAt) {
      toast.error("Vui lòng chọn thời gian đăng");
      return;
    }
    setIsDisabledBtnSend(true);
    submitPost("schedule", { ...dataForm, publishedAt });
  };

  return (
    <div data-testid="post-create-page" className="min-h-screen bg-page pb-16">
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
          <span className="font-display text-base font-bold tracking-tight text-ink">
            {title || "New post"}
          </span>
          <span className="ml-auto font-meta text-xs text-faint">
            {wordCount} từ
          </span>
        </div>

        <form className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="flex flex-col gap-5 rounded-2xl border border-line-soft bg-surface p-5 shadow-sm md:p-8">
            <input
              ref={inputRef}
              name="title"
              onChange={changeTitle}
              className="w-full font-display text-2xl font-bold text-ink outline-none placeholder:text-faintest md:text-3xl"
              placeholder="New post title here..."
              data-testid="post-create-title-input"
            />
            <textarea
              name="desc"
              placeholder="Thêm mô tả ngắn (hiện ở trang chủ và kết quả tìm kiếm)…"
              className="min-h-[56px] w-full resize-none text-lg text-muted outline-none placeholder:text-faintest"
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, desc: e.target.value }));
                setDesc(e.target.value);
              }}
              data-testid="post-create-description-input"
            />

            <div className="h-px bg-line-soft" />

            <div className="flex flex-wrap items-center gap-2">
              <UploadV1
                type="image"
                buttonText="Chèn ảnh"
                onSuccess={(res) => setCoverImage(res.filePath || "")}
                testId="post-create-content-image"
              />
              <UploadV1
                type="video"
                buttonText="Chèn video"
                onSuccess={(res) => setCoverVideo(res.filePath || "")}
                testId="post-create-content-video"
              />
            </div>

            <div data-testid="post-create-editor-container">
              <Editor
                ref={editorRef}
                content={contentCreatePost}
                onChange={onChange}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            {/* Publish readiness checklist */}
            <div className="rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-ink">
                  Sẵn sàng xuất bản
                </span>
                <span className="font-meta text-xs text-muted">
                  {doneCount}/{checklist.length}
                </span>
              </div>
              <div className="mt-2.5 h-[5px] overflow-hidden rounded-full bg-line-soft">
                <div
                  className="h-[5px] bg-gradient-to-r from-accent to-accent-dark transition-[width]"
                  style={{ width: `${(doneCount / checklist.length) * 100}%` }}
                />
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {checklist.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center gap-2 text-[13px]"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 flex-none items-center justify-center rounded-full",
                        item.done
                          ? "bg-success text-white"
                          : "border-[1.5px] border-line"
                      )}
                    >
                      {item.done && <Check size={10} strokeWidth={3} />}
                    </span>
                    <span className={item.done ? "text-muted" : "font-medium text-ink"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover image */}
            <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
                Ảnh bìa
              </span>
              <UploadV1
                type="image"
                buttonText={cover ? "Đổi ảnh bìa" : "Chọn ảnh bìa"}
                onSuccess={changeUploadImage}
                testId="post-create-cover-image"
              />
              {cover && (
                <ImageShow
                  src={cover}
                  className="rounded-xl"
                  width={800}
                  height={400}
                  alt="cover"
                />
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
                Danh mục
              </span>
              <SelectOption
                name="Select a category"
                categories={categoryOptions}
                onChangeCategory={changeCategory}
              />
              <button
                type="button"
                onClick={showModalFormCategory}
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-line text-xs font-medium text-muted hover:text-ink"
                data-testid="post-create-new-category-button"
              >
                <Plus size={13} />
                New Category
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
                Thẻ
              </span>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select name tag"
                onChange={handleChange}
                options={tagsOptions}
                data-testid="post-create-tags-select"
              />
              <button
                type="button"
                onClick={showModalFormTag}
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-line text-xs font-medium text-muted hover:text-ink"
                data-testid="post-create-new-tag-button"
              >
                <Plus size={13} />
                New Tag
              </button>
            </div>

            {/* Google preview */}
            <div className="flex flex-col gap-1 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
                Xem trước trên Google
              </span>
              <span className="font-meta text-xs text-muted">
                blog-person.vercel.app › posts
              </span>
              <span className="flex items-center gap-1 text-[15px] font-medium text-accent-ink">
                {title || "Tiêu đề bài viết…"}
                <ExternalLink size={12} />
              </span>
              <span className="text-xs text-muted">
                {desc || "Thiếu mô tả ngắn — Google sẽ tự cắt đoạn đầu bài."}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <Checkbox
                onChange={onChangeCheckBox}
                data-testid="post-create-send-email-checkbox"
              >
                <span className="text-sm text-ink">Send Email to All Users</span>
              </Checkbox>
            </div>

            {/* Publish actions */}
            <div className="flex flex-col gap-2.5 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <button
                type="button"
                onClick={handlePublishNow}
                disabled={isDisabledBtnSend}
                className="flex h-11 w-full items-center justify-center rounded-[10px] bg-gradient-to-b from-accent to-accent-dark font-cta text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                data-testid="post-create-submit-button"
              >
                {isDisabledBtnSend ? "Đang đăng..." : "Đăng ngay"}
              </button>

              <div className="h-px bg-line-soft" />

              <DatePicker
                showTime
                className="w-full"
                defaultValue={dayjs()}
                onChange={(date) => setPublishedAt(date?.toDate() || null)}
                placeholder="Select publish time"
                data-testid="post-create-publish-date-picker"
              />
              <button
                type="button"
                onClick={handleSubmitSchedule}
                disabled={isDisabledBtnSend}
                className="flex h-9 w-full items-center justify-center rounded-[10px] border border-line font-cta text-sm font-medium text-ink hover:border-accent hover:text-accent disabled:opacity-50"
                data-testid="post-create-schedule-button"
              >
                Lên lịch
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isDisabledBtnSend}
                className="flex h-9 w-full items-center justify-center rounded-[10px] text-sm font-medium text-muted hover:text-ink disabled:opacity-50"
                data-testid="post-create-draft-button"
              >
                Lưu nháp
              </button>
            </div>
          </aside>
        </form>
      </div>

      {/* Category modal */}
      <Modal
        title="Create New Category"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancelFormCategory}
        okButtonProps={{ "data-testid": "post-create-category-modal-confirm-button" }}
      >
        <input
          type="text"
          name="nameCategory"
          placeholder="Awesome Category"
          className={modalInputClass}
          onChange={(e) => setNameCategory(e.target.value)}
          data-testid="post-create-category-modal-input"
        />
      </Modal>

      {/* Tag modal */}
      <Modal
        title="Create New Tag"
        open={isModalOpenTag}
        onOk={handleOkTag}
        onCancel={handleCancelFormTag}
        okButtonProps={{ "data-testid": "post-create-tag-modal-confirm-button" }}
      >
        <input
          type="text"
          name="nameTag"
          value={nameTag}
          placeholder="Awesome Tag"
          className={modalInputClass}
          onChange={(e) => setNameTag(e.target.value)}
          data-testid="post-create-tag-modal-input"
        />
      </Modal>

      <BackToTopButton />
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
    label: "Viết",
    children: <PostCreate />,
  },
  {
    key: "2",
    label: "Xem trước",
    children: <Preview />,
  },
];
const PostCreateCMS = () => (
  <Tabs defaultActiveKey="1" items={items} className="p-3" />
);

export default PostCreateCMS;
