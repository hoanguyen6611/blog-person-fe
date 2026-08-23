"use client";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/api/useswr";
import ImageShow from "@/components/Image";
import TableCMS, { BulkAction } from "@/components/Table";
import { useAuth } from "@clerk/nextjs";
import { Modal, Select, Space, TableColumnsType } from "antd";
import { usePathname, useRouter } from "@/i18n/navigation";
import useSWR from "swr";
import { format } from "date-fns";
import { format as formatTimeAgo } from "timeago.js";
import { DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import { Shapes, Tag as TagIcon, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Category } from "@/interface/Category";
import { Tag } from "@/interface/Tag";
import { Post } from "@/interface/Post";
import { useTableStore } from "@/store/useTableStore";
import { User } from "@/interface/User";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Dashboard from "@/components/Dashboard";

interface DataType {
  _id: string;
  title: string;
  description: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  visit: number;
  user: User;
  postStatus: "published" | "scheduled" | "draft";
}

type TabKey = "all" | "published" | "scheduled" | "draft";

const PostPage = () => {
  useRequireAuth();
  const pathname = usePathname();
  const t = useTranslations("PostTable");
  const tCms = useTranslations("Cms");
  const tSidebar = useTranslations("Sidebar");
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const { setIsShowFormDelete, setIdDelete } = useTableStore();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const { data: tagsData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/tags`,
    fetcherUseSWR
  );
  const { data: scheduleData, mutate: mutateSchedule } = useSWR(
    isSignedIn ? ["schedule-list"] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/user/schedule?page=1&limit=100`,
        token!
      );
    }
  );
  const { data: draftData, mutate: mutateDraft } = useSWR(
    isSignedIn ? ["draft-list"] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/user/draft?page=1&limit=100`,
        token!
      );
    }
  );

  const [bulkCategoryOpen, setBulkCategoryOpen] = useState(false);
  const [bulkCategoryValue, setBulkCategoryValue] = useState<string | null>(null);
  const [bulkCategoryKeys, setBulkCategoryKeys] = useState<React.Key[]>([]);
  const [bulkCategorySubmitting, setBulkCategorySubmitting] = useState(false);
  const [bulkCategoryDone, setBulkCategoryDone] = useState<() => void>(() => {});

  const [bulkTagsOpen, setBulkTagsOpen] = useState(false);
  const [bulkTagsValue, setBulkTagsValue] = useState<string[]>([]);
  const [bulkTagsKeys, setBulkTagsKeys] = useState<React.Key[]>([]);
  const [bulkTagsSubmitting, setBulkTagsSubmitting] = useState(false);
  const [bulkTagsDone, setBulkTagsDone] = useState<() => void>(() => {});

  const [bulkPublishOpen, setBulkPublishOpen] = useState(false);
  const [bulkPublishKeys, setBulkPublishKeys] = useState<React.Key[]>([]);
  const [bulkPublishSubmitting, setBulkPublishSubmitting] = useState(false);
  const [bulkPublishDone, setBulkPublishDone] = useState<() => void>(() => {});

  const refreshAll = async () => {
    await Promise.all([mutate(), mutateSchedule(), mutateDraft()]);
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: t("image"),
      dataIndex: "img",
      key: "img",
      render: (text) => (
        <>
          <ImageShow
            src={text}
            alt={text}
            className="w-10 h-10"
            width={100}
            height={100}
          />
        </>
      ),
    },
    {
      title: t("title"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("description"),
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: t("author"),
      dataIndex: "user",
      key: "user",
      render: (text) => <>{text.username}</>,
    },
    {
      title: t("visit"),
      dataIndex: "visit",
      key: "visit",
    },
    {
      title: t("category"),
      dataIndex: "categoryName",
      key: "categoryName",
      filters: categories?.categories.map((category: Category) => ({
        text: category.title,
        value: category._id,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <>{format(new Date(text), "dd/MM/yyyy")}</>,
      //   defaultSortOrder: 'descend',
      // sorter: (a, b) => format(new Date(a.createdAt), "dd/MM/yyyy") - b.createdAt,
    },
    {
      title: t("status"),
      dataIndex: "postStatus",
      key: "status",
      render: (postStatus: DataType["postStatus"]) =>
        postStatus === "scheduled" ? (
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-ink">
            {tCms("statusScheduled")}
          </span>
        ) : postStatus === "draft" ? (
          <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-muted">
            {tCms("statusDraft")}
          </span>
        ) : (
          <span className="rounded-full bg-success-bg px-2.5 py-0.5 text-xs font-semibold text-success">
            {tCms("statusPublished")}
          </span>
        ),
    },
    {
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.postStatus === "draft" && (
            <button
              className="text-accent"
              data-testid={`cms-posts-publish-button-${record._id}`}
              onClick={() => handlePublishDraft(record._id)}
              title={tCms("statusPublished")}
            >
              <SendOutlined
                className="cursor-pointer"
                style={{ fontSize: "16px" }}
              />
            </button>
          )}
          <button
            className="text-muted"
            data-testid={`cms-posts-edit-button-${record._id}`}
            onClick={() => {
              router.push(`/cms/edit/post/${record._id}`);
            }}
          >
            <EditOutlined
              className="cursor-pointer"
              style={{ fontSize: "16px" }}
            />
          </button>
          <button
            className="text-red-500"
            data-testid={`cms-posts-delete-button-${record._id}`}
            onClick={() => showFormDelete(record._id)}
          >
            <DeleteOutlined
              className="cursor-pointer"
              style={{ fontSize: "16px" }}
            />
          </button>
        </Space>
      ),
    },
  ];
  const { data, error, isLoading, mutate } = useSWR(
    isSignedIn
      ? [`fetch-user-posts`, pagination.current, pagination.pageSize]
      : null,
    async ([_, page, limit]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/user?page=${page}&limit=${limit}`,
        token!
      );
    }
  );
  useEffect(() => {
    mutate(); // force revalidation
  }, [pathname]);

  const toRow = (post: Post, postStatus: DataType["postStatus"]) => ({
    key: post._id,
    categoryName: categories?.categories.find(
      (category: Category) => category._id === post.category
    )?.title,
    postStatus,
    ...post,
  });

  const publishedRows = (data?.posts ?? []).map((post: Post) =>
    toRow(post, "published")
  );
  const scheduledRows = (scheduleData?.posts ?? []).map((post: Post) =>
    toRow(post, "scheduled")
  );
  const draftRows = (draftData?.posts ?? []).map((post: Post) =>
    toRow(post, "draft")
  );
  const totalPublished = data?.totalPosts ?? publishedRows.length;
  const totalScheduled = scheduleData?.totalPosts ?? scheduledRows.length;
  const totalDraft = draftData?.totalPosts ?? draftRows.length;

  const dataSource =
    activeTab === "published"
      ? publishedRows
      : activeTab === "scheduled"
      ? scheduledRows
      : activeTab === "draft"
      ? draftRows
      : [...publishedRows, ...scheduledRows, ...draftRows];

  const totalViews = (data?.posts ?? []).reduce(
    (sum: number, post: Post) => sum + (post.visit ?? 0),
    0
  );

  const latestUpdatedAt = [...publishedRows, ...scheduledRows, ...draftRows].reduce(
    (latest: string | null, row: DataType) => {
      const candidate = row.updatedAt || row.createdAt;
      if (!candidate) return latest;
      return !latest || new Date(candidate) > new Date(latest)
        ? candidate
        : latest;
    },
    null
  );

  const handleDeletePost = async (id: string) => {
    const token = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      setIsShowFormDelete(false);
      toast.success("Delete post successfully");
      await refreshAll();
      router.push(`/cms/posts`);
    }
  };
  const showFormDelete = (id: string) => {
    setIsShowFormDelete(true);
    setIdDelete(id);
  };

  const handlePublishDraft = async (id: string) => {
    const token = await getToken();
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/publish-status`,
      { isPublished: true, publishedAt: new Date() },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.status === 200) {
      toast.success("Đã đăng bài");
      await refreshAll();
    }
  };

  const handleBulkDeleteReal = async (ids: string[]) => {
    const token = await getToken();
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/bulk`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { ids },
    });
    toast.success(tCms("bulkDeleteConfirmTitle", { count: ids.length }));
    await refreshAll();
  };

  const openBulkCategory = (keys: React.Key[], done: () => void) => {
    setBulkCategoryKeys(keys);
    setBulkCategoryValue(null);
    setBulkCategoryDone(() => done);
    setBulkCategoryOpen(true);
  };
  const confirmBulkCategory = async () => {
    if (!bulkCategoryValue) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }
    setBulkCategorySubmitting(true);
    const token = await getToken();
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/bulk/category`,
      { ids: bulkCategoryKeys.map(String), category: bulkCategoryValue },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBulkCategorySubmitting(false);
    setBulkCategoryOpen(false);
    toast.success("Đã đổi danh mục");
    bulkCategoryDone();
    await refreshAll();
  };

  const openBulkTags = (keys: React.Key[], done: () => void) => {
    setBulkTagsKeys(keys);
    setBulkTagsValue([]);
    setBulkTagsDone(() => done);
    setBulkTagsOpen(true);
  };
  const confirmBulkTags = async () => {
    if (bulkTagsValue.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 thẻ");
      return;
    }
    setBulkTagsSubmitting(true);
    const token = await getToken();
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/bulk/tags`,
      { ids: bulkTagsKeys.map(String), tags: bulkTagsValue },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBulkTagsSubmitting(false);
    setBulkTagsOpen(false);
    toast.success("Đã thêm thẻ");
    bulkTagsDone();
    await refreshAll();
  };

  const openBulkPublish = (keys: React.Key[], done: () => void) => {
    setBulkPublishKeys(keys);
    setBulkPublishDone(() => done);
    setBulkPublishOpen(true);
  };
  const confirmBulkPublish = async () => {
    setBulkPublishSubmitting(true);
    const token = await getToken();
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/bulk/publish`,
      { ids: bulkPublishKeys.map(String) },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBulkPublishSubmitting(false);
    setBulkPublishOpen(false);
    toast.success("Đã xuất bản");
    bulkPublishDone();
    await refreshAll();
  };

  const extraBulkActions: BulkAction[] = [
    {
      key: "category",
      label: "Đổi danh mục",
      icon: <Shapes size={12} />,
      onClick: openBulkCategory,
    },
    {
      key: "tags",
      label: "Thêm thẻ",
      icon: <TagIcon size={12} />,
      onClick: openBulkTags,
    },
    {
      key: "publish",
      label: "Xuất bản",
      icon: <Send size={12} />,
      onClick: openBulkPublish,
    },
  ];

  const categoryOptions = categories?.categories.map((category: Category) => ({
    value: category._id,
    label: category.title,
  }));
  const tagOptions = tagsData?.tags?.map((tag: Tag) => ({
    value: tag._id,
    label: tag.name,
  }));

  if (!isSignedIn)
    return (
      <p data-testid="cms-posts-page">{tCms("notLoggedIn")}</p>
    );
  if (isLoading)
    return <p data-testid="cms-posts-page">Loading...</p>;
  if (error)
    return <p data-testid="cms-posts-page">Failed to load</p>;
  const tabs: { key: TabKey; label: string; count: number }[] = [
    {
      key: "all",
      label: tCms("tabAll"),
      count: totalPublished + totalScheduled + totalDraft,
    },
    { key: "published", label: tCms("statusPublished"), count: totalPublished },
    { key: "scheduled", label: tCms("statusScheduled"), count: totalScheduled },
    { key: "draft", label: tCms("statusDraft"), count: totalDraft },
  ];

  return (
    <div className="flex flex-col gap-5" data-testid="cms-posts-page">
      <Dashboard
        name={tSidebar("myPosts")}
        subtitle={
          latestUpdatedAt
            ? tCms("postsSubtitle", {
                count: totalPublished + totalScheduled,
                time: formatTimeAgo(latestUpdatedAt),
              })
            : undefined
        }
        posts={{ totalPosts: totalPublished }}
        views={{ totalVisits: totalViews }}
        scheduled={totalScheduled}
      />
      <div
        className="flex items-center gap-1 border-b border-line-soft"
        data-testid="cms-posts-tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-accent text-ink"
                : "text-muted hover:text-ink"
            }`}
            data-testid={`cms-posts-tab-${tab.key}`}
          >
            {tab.label} {tab.count}
          </button>
        ))}
      </div>
      <TableCMS
        columns={columns}
        dataSource={dataSource}
        buttonCreate={true}
        nameButtonCreate={t("newPost")}
        onDelete={handleDeletePost}
        onBulkDelete={handleBulkDeleteReal}
        extraBulkActions={extraBulkActions}
        nameModalDelete="post"
      />

      <Modal
        title="Đổi danh mục"
        open={bulkCategoryOpen}
        onOk={confirmBulkCategory}
        onCancel={() => setBulkCategoryOpen(false)}
        confirmLoading={bulkCategorySubmitting}
        okButtonProps={{ "data-testid": "cms-posts-bulk-category-confirm-button" }}
      >
        <Select
          className="w-full"
          placeholder="Chọn danh mục"
          options={categoryOptions}
          value={bulkCategoryValue}
          onChange={(value) => setBulkCategoryValue(value)}
          data-testid="cms-posts-bulk-category-select"
        />
      </Modal>

      <Modal
        title="Thêm thẻ"
        open={bulkTagsOpen}
        onOk={confirmBulkTags}
        onCancel={() => setBulkTagsOpen(false)}
        confirmLoading={bulkTagsSubmitting}
        okButtonProps={{ "data-testid": "cms-posts-bulk-tags-confirm-button" }}
      >
        <Select
          mode="multiple"
          className="w-full"
          placeholder="Chọn thẻ"
          options={tagOptions}
          value={bulkTagsValue}
          onChange={(value) => setBulkTagsValue(value)}
          data-testid="cms-posts-bulk-tags-select"
        />
      </Modal>

      <Modal
        title={`Xuất bản ${bulkPublishKeys.length} bài viết?`}
        open={bulkPublishOpen}
        onOk={confirmBulkPublish}
        onCancel={() => setBulkPublishOpen(false)}
        confirmLoading={bulkPublishSubmitting}
        okButtonProps={{ "data-testid": "cms-posts-bulk-publish-confirm-button" }}
      >
        <p>Các bài viết đã chọn sẽ được đăng công khai ngay lập tức.</p>
      </Modal>
    </div>
  );
};

export default PostPage;
