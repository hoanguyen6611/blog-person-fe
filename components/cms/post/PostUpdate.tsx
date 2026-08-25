"use client";
import ImageShow from "@/components/Image";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/api/useswr";
import { useEffect, useMemo, useRef, useState } from "react";
import UploadV1 from "@/components/UploadV1";
import SelectOption from "@/components/SelectOption";
import { Category } from "@/interface/Category";
import axios from "axios";
import { toast } from "react-toastify";
import Editor, { EditorHandle } from "@/components/Editor/Editor";
import { useTableStore } from "@/store/useTableStore";
import BackToTopButton from "@/components/BackToTopButton";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { countWords } from "@/lib/wordCount";
import { useTranslations } from "next-intl";

const PostUpdate = () => {
  useRequireAuth();
  const t = useTranslations("PostUpdate");
  const tCreate = useTranslations("PostCreate");
  const tCms = useTranslations("Cms");
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
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
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
    setTitle(data?.title || "");
    setDesc(data?.desc || "");
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

  const wordCount = useMemo(
    () => countWords(editorInitialContent),
    [editorInitialContent]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataForm = {
      title,
      category,
      desc,
      content: editorInitialContent,
      img: cover,
    };
    setIsDisabledBtnSend(true);
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
      setContentCreatePost("");
      router.push(`/cms/posts`);
      toast.success(t("toastUpdated"));
    } else {
      setIsDisabledBtnSend(false);
      toast.error(t("toastFailed"));
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

  if (!isSignedIn)
    return (
      <p className="py-16 text-center text-sm text-muted" data-testid="post-update-page">
        {tCms("notLoggedIn")}
      </p>
    );
  if (isLoading)
    return (
      <p className="py-16 text-center text-sm text-muted" data-testid="post-update-page">
        {t("loading")}
      </p>
    );
  if (error)
    return (
      <p className="py-16 text-center text-sm text-muted" data-testid="post-update-page">
        {t("error")}
      </p>
    );
  if (!data)
    return (
      <p className="py-16 text-center text-sm text-muted" data-testid="post-update-page">
        {t("notFound")}
      </p>
    );

  return (
    <div data-testid="post-update-page" className="min-h-screen bg-page pb-16">
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
          <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
            {t("editingBadge")}
          </span>
          <span className="truncate font-display text-base font-bold tracking-tight text-ink">
            {title || t("pageTitle")}
          </span>
          <span className="ml-auto font-meta text-xs text-faint">
            {wordCount} {tCreate("wordCountSuffix")}
          </span>
        </div>

        <form
          className="grid gap-6 lg:grid-cols-[1fr_320px]"
          onSubmit={handleSubmit}
        >
          {/* Main column */}
          <div className="flex flex-col gap-5 rounded-2xl border border-line-soft bg-surface p-5 shadow-sm md:p-8">
            <input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full font-display text-2xl font-bold text-ink outline-none placeholder:text-faintest md:text-3xl"
              placeholder={tCreate("titlePlaceholder")}
              data-testid="post-update-title-input"
            />
            <textarea
              name="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={tCreate("descPlaceholder")}
              className="min-h-[56px] w-full resize-none text-lg text-muted outline-none placeholder:text-faintest"
              data-testid="post-update-description-input"
            />

            <div className="h-px bg-line-soft" />

            <div className="flex flex-wrap items-center gap-2">
              <UploadV1
                type="image"
                buttonText={tCreate("insertImage")}
                onSuccess={(res) => setCoverImage(res.filePath || "")}
                testId="post-update-content-image"
              />
              <UploadV1
                type="video"
                buttonText={tCreate("insertVideo")}
                onSuccess={(res) => setCoverVideo(res.filePath || "")}
                testId="post-update-content-video"
              />
            </div>

            <div data-testid="post-update-editor-container">
              <Editor
                ref={editorRef}
                content={editorInitialContent}
                onChange={onChange}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            {/* Cover image */}
            <div className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
                {tCreate("coverImage")}
              </span>
              <UploadV1
                type="image"
                buttonText={tCreate("changeCover")}
                onSuccess={(res) => setCover(res.filePath || "")}
                testId="post-update-cover-image"
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
                {tCreate("category")}
              </span>
              <SelectOption
                name={tCreate("selectCategory")}
                label=""
                testId="post-update-category-select"
                categories={categoryOptions}
                value={category}
                onChangeCategory={(value: string) => setCategory(value)}
              />
            </div>

            {/* Update action */}
            <div className="flex flex-col gap-2.5 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm">
              <button
                type="submit"
                disabled={isDisabledBtnSend}
                className="flex h-11 w-full items-center justify-center rounded-[10px] bg-gradient-to-b from-accent to-accent-dark font-cta text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                data-testid="post-update-submit-button"
              >
                {isDisabledBtnSend ? t("updating") : t("updateButton")}
              </button>
            </div>
          </aside>
        </form>
      </div>

      <BackToTopButton />
    </div>
  );
};

export default PostUpdate;
