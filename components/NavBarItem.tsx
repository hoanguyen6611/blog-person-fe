"use client";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button, Flex } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NavBarItem = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const cmsHref = isAdmin ? "/cms" : "/cms/personal";
  const router = useRouter();
  return (
    <>
      <Link href="/">Home</Link>
      <Link href="posts?sort=trending">Trending</Link>
      <Link href="posts?sort=popular">Most Popular</Link>
      <Link href="#">About</Link>
      <Link href={cmsHref}>CMS</Link>
      <Flex gap="small" wrap>
        <Button onClick={() => router.push("/write")}>New Post</Button>
      </Flex>
      <SignedOut>
        <Link href="/login">
          <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white cursor-pointer">
            Login✋
          </button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
};

export default NavBarItem;
