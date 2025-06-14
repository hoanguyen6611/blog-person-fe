"use client";
import { useState } from "react";
import ImageShow from "./Image";
import NavBarItem from "./NavBarItem";
import Link from "next/link";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-gray-100 shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-5 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-800"
        >
          <ImageShow
            src="/logo.png"
            width={100}
            height={100}
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <span>hoadev</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          <NavBarItem />
        </div>

        {/* Mobile Button */}
        <div
          className="md:hidden text-3xl cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-3/4 sm:w-1/2 bg-white z-40 shadow-lg transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center gap-8 mt-24 font-medium text-lg px-4">
          <NavBarItem />
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </nav>
  );
};

export default NavBar;
