"use client";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import TableCMS from "@/components/Table";
import { Subscriber } from "@/interface/Subscriber";
import { Post } from "@/interface/Post";
import { Modal, Space, TableColumnsType } from "antd";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import { format } from "date-fns";
import { DeleteOutlined } from "@ant-design/icons";
import { Replace, Send } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { useTableStore } from "@/store/useTableStore";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { cn } from "@/lib/utils";

interface DataType extends Subscriber {
  key: string;
}

const NewsletterPage = () => {
  useRequireAuth();
  const t = useTranslations("SubscriberTable");
  const tCms = useTranslations("Cms");
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const { setIsShowFormDelete, setIdDelete } = useTableStore();
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const { data: previewData } = useSWR(
    isSignedIn ? ["cms-newsletter-preview"] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/preview`,
        token!
      );
    }
  );

  const handleSendNow = async () => {
    setSending(true);
    try {
      const token = await getToken();
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/send`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        t("sendSuccess", { sent: res.data.sent, failed: res.data.failed })
      );
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      toast.error(message || t("sendError"));
    } finally {
      setSending(false);
      setSendModalOpen(false);
    }
  };

  const { data, error, isLoading, mutate } = useSWR(
    isSignedIn ? ["cms-subscribers"] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribers?limit=500`,
        token!
      );
    }
  );

  const dataSource: DataType[] =
    data?.subscribers?.map((subscriber: Subscriber) => ({
      key: subscriber._id,
      ...subscriber,
    })) ?? [];

  const changeStatus = async (id: string) => {
    const token = await getToken();
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribers/${id}/status`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.status === 200) {
      toast.success(t("toggleSuccess"));
      await mutate();
    }
  };

  const handleDelete = async (id: string) => {
    const token = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribers/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.status === 200) {
      setIsShowFormDelete(false);
      toast.success(t("deleteSuccess"));
      await mutate();
      router.push(`/cms/newsletter`);
    }
  };

  const showFormDelete = (id: string) => {
    setIsShowFormDelete(true);
    setIdDelete(id);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("status"),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
            isActive ? "bg-success-bg text-success" : "bg-surface-2 text-muted"
          )}
        >
          {isActive ? tCms("statusActive") : tCms("statusInactive")}
        </span>
      ),
    },
    {
      title: t("subscribedAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <>{format(new Date(text), "dd/MM/yyyy")}</>,
    },
    {
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            className="text-muted hover:text-ink"
            data-testid={`cms-subscriber-toggle-status-button-${record._id}`}
            onClick={() => changeStatus(record._id)}
          >
            <Replace className="cursor-pointer" style={{ fontSize: "16px" }} />
          </button>
          <button
            className="text-red-500"
            data-testid={`cms-subscriber-delete-button-${record._id}`}
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

  if (!isSignedIn)
    return <p data-testid="cms-newsletter-page">{tCms("notLoggedIn")}</p>;
  if (isLoading) return <p data-testid="cms-newsletter-page">Loading...</p>;
  if (error) return <p data-testid="cms-newsletter-page">Failed to load</p>;

  const previewPosts: Post[] = previewData?.posts ?? [];

  return (
    <div className="flex flex-col gap-4" data-testid="cms-newsletter-page">
      <p
        className="font-meta text-sm text-faint"
        data-testid="cms-newsletter-summary"
      >
        {t("totalSubscribers")}: {data?.totalSubscribers ?? 0} ·{" "}
        {t("activeSubscribers")}: {data?.activeSubscribers ?? 0}
      </p>

      <div
        className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm"
        data-testid="cms-newsletter-preview"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-bold text-ink">
            {t("previewHeading")}
          </span>
          <button
            type="button"
            onClick={() => setSendModalOpen(true)}
            disabled={previewPosts.length === 0}
            className="flex h-9 items-center gap-1.5 rounded-[10px] bg-gradient-to-b from-accent to-accent-dark px-3.5 font-cta text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            data-testid="cms-newsletter-send-now-button"
          >
            <Send size={15} />
            {t("sendNow")}
          </button>
        </div>
        {previewPosts.length === 0 ? (
          <p className="text-sm text-muted">{t("previewEmpty")}</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {previewPosts.map((post) => (
              <li
                key={post._id}
                className="truncate text-sm text-ink"
                data-testid={`cms-newsletter-preview-post-${post._id}`}
              >
                {post.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <TableCMS
        columns={columns}
        dataSource={dataSource}
        onDelete={handleDelete}
        nameModalDelete="subscriber"
      />

      <Modal
        title={t("sendConfirmTitle")}
        open={sendModalOpen}
        onOk={handleSendNow}
        onCancel={() => setSendModalOpen(false)}
        confirmLoading={sending}
        okButtonProps={{ "data-testid": "cms-newsletter-send-confirm-button" }}
      >
        <p>
          {t("sendConfirmBody", { count: data?.activeSubscribers ?? 0 })}
        </p>
      </Modal>
    </div>
  );
};

export default NewsletterPage;
