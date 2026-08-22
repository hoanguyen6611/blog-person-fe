"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ImageShow from "./Image";
import NavBarItem, { NavActions, NavLinks } from "./NavBarItem";
import { Link } from "@/i18n/navigation";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const logoSrc =
    mounted && resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-new.png";
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-line bg-surface text-ink">
      <div className="max-w-7xl mx-auto px-5 h-16 md:h-[76px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          data-testid="navbar-logo-link"
          className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-ink"
        >
          <ImageShow
            src={logoSrc}
            width={400}
            height={400}
            alt="Logo"
            className="w-9 h-9 object-contain"
          />
          <span>Tech News</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 font-medium lg:flex lg:gap-4 xl:gap-6">
          <div className="min-w-0 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-4 py-3 xl:gap-6">
              <NavLinks />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 xl:gap-4">
            <NavActions />
          </div>
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2 text-ink lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-testid="navbar-mobile-menu-button"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-3/4 sm:w-1/2 bg-surface z-40 shadow-lg transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        data-testid="navbar-mobile-menu"
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
