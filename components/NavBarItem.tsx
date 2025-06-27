"use client";
import {
  SignedIn,
  SignedOut,
  UserButton,
  UserProfile,
  useUser,
} from "@clerk/nextjs";
import { Button, Dropdown, MenuProps, Space } from "antd";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NavBarItem = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const cmsHref = isAdmin ? "/cms" : "/cms/personal";
  const router = useRouter();

  const linkStyle =
    "hover:text-blue-600 transition-colors duration-200 underline-offset-4";
  const items: MenuProps["items"] = [
    {
      label: (
        <a
          href="https://www.antgroup.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ban dang co 1 bai viet moi tu huyhoa2001
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a
          href="https://www.aliyun.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          2nd menu item
        </a>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];

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
      <Dropdown menu={{ items }} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Bell />
          </Space>
        </a>
      </Dropdown>

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
