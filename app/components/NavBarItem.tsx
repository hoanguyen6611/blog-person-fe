"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const NavBarItem = () => {
  return (
    <>
      <Link href="/">Home</Link>
      <Link href="posts?sort=trending">Trending</Link>
      <Link href="posts?sort=popular">Most Popular</Link>
      <Link href="#">About</Link>
      <Link href="/cms">CMS</Link>
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
