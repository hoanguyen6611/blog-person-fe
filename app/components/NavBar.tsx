"use client";
import { useState } from "react";
import ImageShow from "./Image";
import NavBarItem from "./NavBarItem";
import Link from "next/link";
const NavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* LOGO */}
      <Link href="/" className="flex items-center gap-4 text-2xl font-bold">
        <ImageShow
          src="/logo.png"
          width={100}
          height={100}
          alt="Picture of the author"
          className="w-8 h-8"
        />
        <span>hoanene</span>
      </Link>
      {/* MENU MOBILE */}
      <div className="md:hidden">
        {/* MOBILE BUTTON */}
        <div className="cursor-pointer text-4xl" onClick={() => setOpen(!open)}>
          {open ? "X" : "＝"}
        </div>
        {/* MOBILE LINK LIST */}
        <div
          className={`w-full h-screen flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <NavBarItem />
        </div>
      </div>
      {/* MENU DESKTOP */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <NavBarItem />
      </div>
    </div>
  );
};

export default NavBar;
