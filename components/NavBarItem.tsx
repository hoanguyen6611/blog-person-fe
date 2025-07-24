"use client";
import {
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Badge, Button, Dropdown, MenuProps, Space } from "antd";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { toast } from "react-toastify";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { Notification } from "@/interface/Notification";
import axios from "axios";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import ThemeToggle from "./ThemeToggle";

const NavBarItem = () => {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const t = useTranslations("NavBar");
  const [token, setToken] = useState<string | null>(null);
  const isAdmin = user?.publicMetadata?.role === "admin";
  const cmsHref = isAdmin ? "/cms" : "/cms/personal";
  const router = useRouter();

  const linkStyle =
    "hover:text-blue-600 transition-colors duration-200 underline-offset-4";

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);
  const { data: notifications, mutate } = useSWR(
    () =>
      token
        ? [`${process.env.NEXT_PUBLIC_API_URL}/notifications`, token]
        : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
  );
  const markAllAsRead = async () => {
    const token = await getToken();
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/readAll`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    mutate(); // refresh UI
  };
  const notificationItems: MenuProps["items"] = [
    {
      label: <Button type="primary"> 🔔 {t("markAllAsRead")}</Button>,
      key: "mark_all",
    },
    ...(notifications?.length
      ? notifications.map((n: Notification) => ({
          label:
            n.type === "comment" || n.type === "like" || n.type === "post" ? (
              <a
                href={`/posts/${n.postId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={n.isRead ? "text-gray-400" : "font-semibold"}
              >
                {n.message}
              </a>
            ) : (
              <a
                href={`/user`}
                target="_blank"
                rel="noopener noreferrer"
                className={n.isRead ? "text-gray-400" : "font-semibold"}
              >
                {n.message}
              </a>
            ),
          key: n._id,
        }))
      : [{ label: t("noNotification"), key: "0", disabled: true }]),
    {
      label: <Button type="primary"> 📄 {t("viewAll")}</Button>,
      key: "view_all",
    },
  ];
  const unreadCount =
    notifications?.filter((n: Notification) => !n.isRead).length || 0;

  const socketStatus = useNotificationSocket((data) => {
    toast.success(data.message);
    mutate();
  });

  // ⬇️ Chấm trạng thái mạng socket
  const renderStatusDot = () => {
    const colorMap = {
      connected: "bg-green-500",
      disconnected: "bg-red-500",
      connecting: "bg-yellow-500",
    };
    const color = colorMap[socketStatus];

    return (
      <div
        className={`w-3 h-3 rounded-full ${color}`}
        title={`Socket status: ${socketStatus}`}
      ></div>
    );
  };

  const markAsRead = async (id: string) => {
    try {
      const token = await getToken();

      // Optional: Hiện loading toast
      // const toastId = toast.loading("Marking as read...");

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // toast.update(toastId, {
      //   render: "Marked as read ✅",
      //   type: "success",
      //   isLoading: false,
      //   autoClose: 2000,
      // });

      mutate(); // Refresh lại SWR data
    } catch (error) {
      toast.error("Something went wrong while marking as read ❌");
      console.error("Error in markAsRead:", error);
    }
  };

  return (
    <>
      <Link href="/" className={linkStyle}>
        {t("home")}
      </Link>
      <Link href="/posts?sort=trending" className={linkStyle}>
        {t("trending")}
      </Link>
      <Link href="/posts?sort=popular" className={linkStyle}>
        {t("mostPopular")}
      </Link>
      <Link href="/about" className={linkStyle}>
        {t("about")}
      </Link>
      <Link href={cmsHref} className={linkStyle}>
        {t("cms")}
      </Link>

      <Button
        type="primary"
        onClick={() => router.push("/write")}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
      >
        ✍️ {t("newPost")}
      </Button>
      {isSignedIn && (
        <Dropdown
          menu={{
            items: notificationItems,
            onClick: ({ key }) => {
              if (key === "mark_all") {
                markAllAsRead(); // Gọi API mark tất cả
              } else if (key === "view_all") {
                router.push("/notifications");
              } else {
                markAsRead(key); // Gọi API mark từng thông báo theo id
              }
            }, // 👈 Gọi API đánh dấu đã đọc với ID là key
          }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Badge count={unreadCount}>
                <Bell className="cursor-pointer dark:text-gray-400" />
                {renderStatusDot()}
              </Badge>
            </Space>
          </a>
        </Dropdown>
      )}
      <LanguageSwitcher />
      <ThemeToggle />

      <SignedOut>
        <Link href="/login">
          <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white hover:bg-blue-900 transition">
            {t("login")} ✋
          </button>
        </Link>
      </SignedOut>

      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "ring-2 ring-blue-500", // custom border
              userButtonPopoverCard: "rounded-xl shadow-lg bg-white",
              userButtonPopoverActionButton:
                "hover:bg-gray-100 text-sm text-gray-700",
            },
          }}
        />
      </SignedIn>
    </>
  );
};

export default NavBarItem;
