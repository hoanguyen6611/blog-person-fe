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
import { useNotificationSocket } from "@/hook/useNotificationSocket";

const NavBarItem = () => {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();

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
  const items: MenuProps["items"] = [
    {
      label: "Khong co thong bao",
      key: "0",
    },
  ];
  const notificationItems: MenuProps["items"] = notifications?.map(
    (notification: any) => ({
      label: (
        <a
          href={`/posts/${notification.postId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {notification.message}
        </a>
      ),
      key: notification._id,
    })
  );
  useNotificationSocket((data) => {
    toast.success(data.message); // Hoặc cập nhật UI thông báo
    mutate();
  });

  return (
    <>
      <Link href="/" className={linkStyle}>
        Home
      </Link>
      <Link href="/posts?sort=trending" className={linkStyle}>
        Trending
      </Link>
      <Link href="/posts?sort=popular" className={linkStyle}>
        Most Popular
      </Link>
      <Link href="/about" className={linkStyle}>
        About
      </Link>
      <Link href={cmsHref} className={linkStyle}>
        CMS
      </Link>

      <Button
        type="primary"
        onClick={() => router.push("/write")}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
      >
        ✍️ New Post
      </Button>
      {isSignedIn && (
        <Dropdown
          menu={{ items: notificationItems ? notificationItems : items }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Badge count={notifications?.filter((n: any) => !n.read).length}>
                <Bell />
              </Badge>
            </Space>
          </a>
        </Dropdown>
      )}
      {/* <ThemeToggle /> */}

      <SignedOut>
        <Link href="/login">
          <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white hover:bg-blue-900 transition">
            Login ✋
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
