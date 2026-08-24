"use client";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/api/useswr";
import TableCMS, { BulkAction } from "@/components/Table";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Dropdown, Modal, Select, TableColumnsType } from "antd";
import { usePathname, useRouter } from "@/i18n/navigation";
import useSWR from "swr";
import { format as formatTimeAgo } from "timeago.js";
import { MoreOutlined } from "@ant-design/icons";
import { Plus, Search, Shapes, Tag as TagIcon, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Category } from "@/interface/Category";
import { Tag } from "@/interface/Tag";
import { Post } from "@/interface/Post";
import { useTableStore } from "@/store/useTableStore";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface DataType extends Post {
  key: string;
  categoryName?: string;
  postStatus: "published" | "scheduled" | "draft";
}

type TabKey = "all" | "published" | "draft";
type SortOrder = "newest" | "oldest";

const StatCard = ({
  label,
  value,
  testId,
}: {
  label: string;
  value: string | number;
  testId: string;
}) => (
  <div
    className="flex flex-col gap-1.5 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm"
    data-testid={testId}
  >
    <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
      {label}
    </span>
    <span className="font-display text-2xl font-bold tracking-tight text-ink">
      {value}
    </span>
  </div>
);

const PostPage = () => {
  useRequireAuth();
  const pathname = usePathname();
  const t = useTranslations("PostTable");
  const tCms = useTranslations("Cms");
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const { setIsShowFormDelete, setIdDelete } = useTableStore();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [searchQuery, setSearchQuery] = useState("");
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
  const { data: followData } = useSWR(
    isSignedIn ? ["follow-stats"] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follow`,
        token!
      );
    }
  );
  // Admin-only endpoint — silently unavailable for regular authors, falls
  // back to "—" in the stat card below rather than showing a stale number.
  const { data: trafficData } = useSWR(
    isSignedIn ? ["traffic-stats-30d"] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/stats/traffic?days=30`,
        token!
      );
    },
    { shouldRetryOnError: false }
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

  const toRow = (post: Post, postStatus: DataType["postStatus"]): DataType => ({
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
  // "Nháp" groups true drafts with scheduled-but-not-live posts — both are
  // "not published yet", each still shown with its own status badge.
  const unpublishedRows = [...draftRows, ...scheduledRows];
  const totalUnpublished = totalDraft + totalScheduled;
  const followersCount = followData?.followers?.length;

  const tabRows =
    activeTab === "published"
      ? publishedRows
      : activeTab === "draft"
      ? unpublishedRows
      : [...publishedRows, ...unpublishedRows];

  const searchedRows = (() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tabRows;
    return tabRows.filter((row: DataType) =>
      JSON.stringify(row).toLowerCase().includes(q)
    );
  })();

  const dataSource = [...searchedRows].sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? -diff : diff;
  });

  const latestUpdatedAt = [...publishedRows, ...unpublishedRows].reduce(
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

  const columns: TableColumnsType<DataType> = [
    {
      title: t("title"),
      dataIndex: "title",
      key: "title",
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
      title: t("visit"),
      dataIndex: "visit",
      key: "visit",
    },
    {
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "edit",
                label: tCms("actionEdit"),
                onClick: () => router.push(`/cms/edit/post/${record._id}`),
              },
              ...(record.postStatus !== "published"
                ? [
                    {
                      key: "publish",
                      label: tCms("actionPublish"),
                      onClick: () => handlePublishDraft(record._id),
                    },
                  ]
                : []),
              {
                key: "delete",
                label: tCms("bulkDelete"),
                danger: true,
                onClick: () => showFormDelete(record._id),
              },
            ],
          }}
        >
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
            data-testid={`cms-posts-row-menu-${record._id}`}
          >
            <MoreOutlined style={{ fontSize: "16px" }} />
          </button>
        </Dropdown>
      ),
    },
  ];

  if (!isSignedIn)
    return <p data-testid="cms-posts-page">{tCms("notLoggedIn")}</p>;
  if (isLoading) return <p data-testid="cms-posts-page">Loading...</p>;
  if (error) return <p data-testid="cms-posts-page">Failed to load</p>;

  const tabs: { key: TabKey; label: string; count: number }[] = [
    {
      key: "all",
      label: tCms("tabAll"),
      count: totalPublished + totalUnpublished,
    },
    { key: "published", label: tCms("statusPublished"), count: totalPublished },
    { key: "draft", label: tCms("statusDraft"), count: totalUnpublished },
  ];

  return (
    <div className="flex flex-col gap-5" data-testid="cms-posts-page">
      {/* Header: search + create + avatar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 min-w-[260px] flex-1 items-center gap-2 rounded-[10px] bg-surface-2 px-3">
          <Search size={15} className="text-faint" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tCms("searchMyPosts")}
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
            data-testid="cms-posts-search-input"
          />
        </div>
        <button
          type="button"
          onClick={() => router.push("/write")}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-[10px] bg-gradient-to-b from-accent to-accent-dark px-4 font-cta text-sm font-medium text-white hover:opacity-90"
          data-testid="cms-posts-create-button"
        >
          <Plus size={15} />
          {t("newPost")}
        </button>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Compact stat cards */}
      <div
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        data-testid="cms-posts-stats"
      >
        <StatCard
          label={tCms("totalPublished")}
          value={totalPublished}
          testId="cms-posts-stat-published"
        />
        <StatCard
          label={tCms("statusDraft")}
          value={totalUnpublished}
          testId="cms-posts-stat-draft"
        />
        <StatCard
          label={tCms("views30Days")}
          value={trafficData?.totalViews?.toLocaleString("vi-VN") ?? "—"}
          testId="cms-posts-stat-views"
        />
        <StatCard
          label={tCms("followersLabel")}
          value={followersCount?.toLocaleString("vi-VN") ?? "—"}
          testId="cms-posts-stat-followers"
        />
      </div>
      {latestUpdatedAt && (
        <p
          className="font-meta text-xs text-faint"
          data-testid="cms-posts-subtitle"
        >
          {tCms("postsSubtitle", {
            count: totalPublished + totalUnpublished,
            time: formatTimeAgo(latestUpdatedAt),
          })}
        </p>
      )}

      {/* Tabs + sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft">
        <div className="flex items-center gap-1" data-testid="cms-posts-tabs">
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
        <Select
          value={sortOrder}
          onChange={(value) => setSortOrder(value)}
          options={[
            { value: "newest", label: tCms("sortNewest") },
            { value: "oldest", label: tCms("sortOldest") },
          ]}
          className="w-36"
          data-testid="cms-posts-sort-select"
        />
      </div>

      <TableCMS
        columns={columns}
        dataSource={dataSource}
        showToolbar={false}
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
