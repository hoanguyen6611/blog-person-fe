"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const NavBarItem = () => {
  return (
    <>
      <Link href="/">Home</Link>
      <Link href="#">Trending</Link>
      <Link href="#">Most Popular</Link>
      <Link href="#">About</Link>
      <SignedOut>
        <Link href="/login">
          <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
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
