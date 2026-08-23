"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { NavActions, NavLinks, NotificationBell, AuthSlot } from "./NavBarItem";
import { Link } from "@/i18n/navigation";
import SearchOverlay from "./SearchOverlay";

const NavBar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useTranslations("Search");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-line bg-surface text-ink">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-5 lg:gap-5">
        {/* Logo */}
        <Link
          href="/"
          data-testid="navbar-logo-link"
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-b from-accent to-accent-dark font-display text-sm font-bold text-white">
            T
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight text-ink">
            Tech News
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden min-w-0 shrink-0 items-center gap-0.5 lg:flex">
          <NavLinks />
        </div>

        {/* Search trigger */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden h-9 max-w-[360px] flex-1 items-center gap-2 rounded-[10px] bg-surface-2 px-3 text-left lg:flex"
          data-testid="navbar-search-trigger"
        >
          <Search size={16} className="text-faint" strokeWidth={1.8} />
          <span className="flex-1 truncate text-sm text-faint">
            {t("placeholder")}
          </span>
          <span className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] text-faintest">
            ⌘K
          </span>
        </button>

        {/* Desktop actions */}
        <div className="ml-auto hidden shrink-0 items-center gap-2.5 lg:flex">
          <NavActions />
        </div>

        {/* Mobile condensed row */}
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t("placeholder")}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface-2 text-ink"
            data-testid="navbar-mobile-search-button"
          >
            <Search size={17} strokeWidth={1.8} />
          </button>
          <NotificationBell variant="mobile" />
          <AuthSlot variant="mobile" />
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default NavBar;
