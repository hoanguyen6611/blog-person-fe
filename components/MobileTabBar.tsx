"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth, useUser } from "@clerk/nextjs";
import { Home, TrendingUp, Bookmark, User as UserIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const tabClass = (active: boolean) =>
  cn(
    "flex min-w-[56px] flex-col items-center gap-1 text-[11px] font-medium",
    active ? "text-ink" : "text-faint"
  );

export default function MobileTabBar() {
  const pathname = usePathname();
  const t = useTranslations("TabBar");
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const meHref = isSignedIn ? (isAdmin ? "/cms" : "/cms/personal") : "/login";

  const isHome = pathname === "/";
  const isTrending = pathname.startsWith("/posts");
  const isSaved = pathname.startsWith("/saved");
  const isMe = pathname.startsWith("/cms") || pathname === "/login";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-line bg-surface pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 md:hidden"
      data-testid="mobile-tab-bar"
    >
      <Link href="/" className={tabClass(isHome)} data-testid="tab-bar-home">
        <Home size={21} strokeWidth={1.6} />
        {t("home")}
      </Link>
      <Link
        href="/posts?sort=trending"
        className={tabClass(isTrending)}
        data-testid="tab-bar-trending"
      >
        <TrendingUp size={21} strokeWidth={1.6} />
        {t("trending")}
      </Link>
      <Link
        href="/write"
        aria-label={t("home")}
        className="-mt-[18px] flex h-[52px] w-[52px] flex-none items-center justify-center rounded-2xl bg-gradient-to-b from-accent to-accent-dark text-white shadow-[0_4px_12px_rgba(0,60,255,.28)]"
        data-testid="tab-bar-write"
      >
        <Plus size={24} />
      </Link>
      <Link
        href="/saved"
        className={tabClass(isSaved)}
        data-testid="tab-bar-saved"
      >
        <Bookmark size={21} strokeWidth={1.6} />
        {t("saved")}
      </Link>
      <Link href={meHref} className={tabClass(isMe)} data-testid="tab-bar-me">
        <UserIcon size={21} strokeWidth={1.6} />
        {t("me")}
      </Link>
    </nav>
  );
}
