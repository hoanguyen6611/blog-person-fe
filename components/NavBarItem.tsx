"use client";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NavBarItem = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const cmsHref = isAdmin ? "/cms" : "/cms/personal";
  const router = useRouter();

  const linkStyle =
    "hover:text-blue-600 transition-colors duration-200 underline-offset-4";

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

      <SignedOut>
        <Link href="/login">
          <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white hover:bg-blue-900 transition">
            Login ✋
          </button>
        </Link>
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );
};

export default NavBarItem;
