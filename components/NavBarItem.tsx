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
import { Link, useRouter } from "@/i18n/navigation";
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

const linkStyle =
  "shrink-0 whitespace-nowrap text-sm font-medium text-muted hover:text-ink transition-colors duration-200 underline-offset-4";

export const NavLinks = () => {
  const { user } = useUser();
  const t = useTranslations("NavBar");
  const isAdmin = user?.publicMetadata?.role === "admin";
  const cmsHref = isAdmin ? "/cms" : "/cms/personal";

  return (
    <>
      <Link href="/" className={linkStyle} data-testid="navbar-home-link">
        {t("home")}
      </Link>
      <Link
        href="/posts?sort=trending"
        className={linkStyle}
        data-testid="navbar-trending-link"
      >
        {t("trending")}
      </Link>
      <Link
        href="/posts?sort=popular"
        className={linkStyle}
        data-testid="navbar-popular-link"
      >
        {t("mostPopular")}
      </Link>
      <Link href="/about" className={linkStyle} data-testid="navbar-about-link">
        {t("about")}
      </Link>
      <Link href={cmsHref} className={linkStyle} data-testid="navbar-cms-link">
        {t("cms")}
      </Link>
    </>
  );
};

export const NavActions = () => {
  const { getToken, isSignedIn } = useAuth();
  const t = useTranslations("NavBar");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

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
      label: (
        <Button type="primary" data-testid="navbar-notifications-mark-all-read-button">
          {" "}
          🔔 {t("markAllAsRead")}
        </Button>
      ),
      key: "mark_all",
    },
    ...(notifications?.length
      ? notifications.map((n: Notification) => ({
          label:
            n.type === "comment" || n.type === "like" || n.type === "post" ? (
              <Link
                href={`/posts/${n.postId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={n.isRead ? "text-gray-400" : "font-semibold"}
                data-testid={`navbar-notification-item-${n._id}`}
              >
                {n.message}
              </Link>
            ) : (
              <Link
                href={`/user`}
                target="_blank"
                rel="noopener noreferrer"
                className={n.isRead ? "text-gray-400" : "font-semibold"}
                data-testid={`navbar-notification-item-${n._id}`}
              >
                {n.message}
              </Link>
            ),
          key: n._id,
        }))
      : [{ label: t("noNotification"), key: "0", disabled: true }]),
    {
      label: (
        <Button type="primary" data-testid="navbar-notifications-view-all-button">
          {" "}
          📄 {t("viewAll")}
        </Button>
      ),
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
      <Button
        type="primary"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        }
        onClick={() => router.push("/write")}
        className="shrink-0 whitespace-nowrap rounded-full font-medium"
        data-testid="navbar-write-button"
      >
        {t("newPost")}
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
          className="dark:text-gray-400 dark:bg-gray-800"
        >
          <a
            onClick={(e) => e.preventDefault()}
            data-testid="navbar-notifications-bell"
          >
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
          <button
            className="rounded-full bg-surface-2 border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-line"
            data-testid="navbar-login-button"
          >
            {t("login")}
          </button>
        </Link>
      </SignedOut>

      <SignedIn>
        <div data-testid="navbar-user-menu">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "ring-2 ring-accent",
                userButtonPopoverCard:
                  "rounded-xl shadow-lg bg-white dark:bg-gray-800",
                userButtonPopoverActionButton:
                  "hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200",
              },
            }}
          />
        </div>
      </SignedIn>
    </>
  );
};

const NavBarItem = () => (
  <>
    <NavLinks />
    <NavActions />
  </>
);

export default NavBarItem;
