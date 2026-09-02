"use client";
import {
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Dropdown } from "antd";
import { Bell, FileText, Heart, MessageSquare, UserPlus, Plus } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { isToday, isThisWeek } from "date-fns";
import { format } from "timeago.js";
import { toast } from "react-toastify";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { Notification } from "@/interface/Notification";
import axios from "axios";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import FilterSheet from "./FilterSheet";

const navPillClass = (active: boolean) =>
  cn(
    "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
    active ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
  );

export const NavLinks = () => {
  const { user } = useUser();
  const t = useTranslations("NavBar");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort");
  const isAdmin = user?.publicMetadata?.role === "admin";
  const cmsHref = isAdmin ? "/cms" : "/cms/personal";

  return (
    <>
      <Link
        href="/"
        className={navPillClass(pathname === "/")}
        data-testid="navbar-home-link"
      >
        {t("home")}
      </Link>
      <Link
        href="/posts?sort=trending"
        className={navPillClass(pathname === "/posts" && sort === "trending")}
        data-testid="navbar-trending-link"
      >
        {t("trending")}
      </Link>
      <Link
        href="/posts?sort=popular"
        className={navPillClass(pathname === "/posts" && sort === "popular")}
        data-testid="navbar-popular-link"
      >
        {t("mostPopular")}
      </Link>
      <Link
        href="/about"
        className={navPillClass(pathname === "/about")}
        data-testid="navbar-about-link"
      >
        {t("about")}
      </Link>
      <Link
        href={cmsHref}
        className={navPillClass(pathname.startsWith("/cms"))}
        data-testid="navbar-cms-link"
      >
        {t("cms")}
      </Link>
    </>
  );
};

export const NewPostButton = () => {
  const t = useTranslations("NavBar");
  return (
    <Link
      href="/write"
      className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[10px] bg-gradient-to-b from-accent to-accent-dark px-3.5 font-cta text-sm font-medium text-white shadow-[0_.5px_1px_rgba(0,0,0,.05)] transition-opacity hover:opacity-90"
      data-testid="navbar-write-button"
    >
      <Plus size={15} strokeWidth={2} />
      {t("newPost")}
    </Link>
  );
};

const typeAvatarClass: Record<string, string> = {
  post: "bg-avatar-amber-bg border border-avatar-amber-border text-avatar-amber-text",
  comment: "bg-avatar-blue-bg text-avatar-blue-text",
};

const typeIcon: Record<string, typeof MessageSquare> = {
  comment: MessageSquare,
  post: FileText,
  like: Heart,
  follow: UserPlus,
};

const NotificationAvatar = ({ type }: { type: string }) => {
  const Icon = typeIcon[type] ?? UserPlus;
  return (
    <div
      className={cn(
        "flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full",
        typeAvatarClass[type] ?? "bg-avatar-gray-bg text-avatar-gray-text"
      )}
    >
      <Icon size={15} />
    </div>
  );
};

export const NotificationBell = ({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) => {
  const { getToken, isSignedIn, userId } = useAuth();
  const t = useTranslations("NavBar");
  const [tab, setTab] = useState<"all" | "unread" | "comments">("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // Keyed by userId, not the raw token: Clerk's getToken() can mint a
  // different signed JWT string on each call even for the same session, and
  // this bell is always mounted twice (desktop + mobile variants both live
  // in the DOM). If the key included the token, each instance ended up with
  // its own separate SWR cache entry, so marking a notification read (and
  // mutating) on one instance never updated the other's badge count.
  const { data: notifications, mutate } = useSWR(
    userId ? [`${process.env.NEXT_PUBLIC_API_URL}/notifications`, userId] : null,
    async ([url]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(url, token!);
    }
  );

  const list: Notification[] = Array.isArray(notifications)
    ? notifications
    : notifications?.notifications ?? [];
  const unreadCount = list.filter((n) => !n.isRead).length;

  const filtered = list.filter((n) => {
    if (tab === "unread") return !n.isRead;
    if (tab === "comments") return n.type === "comment";
    return true;
  });

  const groups: { key: string; label: string; items: Notification[] }[] = [
    { key: "today", label: t("groupToday"), items: [] },
    { key: "week", label: t("groupThisWeek"), items: [] },
    { key: "earlier", label: t("groupEarlier"), items: [] },
  ];
  filtered.slice(0, 6).forEach((n) => {
    const date = new Date(n.createdAt);
    if (isToday(date)) groups[0].items.push(n);
    else if (isThisWeek(date)) groups[1].items.push(n);
    else groups[2].items.push(n);
  });

  const markAllAsRead = async () => {
    const token = await getToken();
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/readAll`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    mutate();
  };

  const markAsRead = async (id: string) => {
    try {
      const token = await getToken();
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mutate();
    } catch (error) {
      toast.error("Something went wrong while marking as read");
      console.error("Error in markAsRead:", error);
    }
  };

  useNotificationSocket(() => {
    mutate();
  });

  const openNotification = (n: Notification) => {
    if (!n.isRead) markAsRead(n._id);
    router.push(n.type === "comment" || n.type === "like" || n.type === "post" ? `/posts/${n.postId}` : "/user");
  };

  if (!isSignedIn) return null;

  const tabsRow = (
    <div className="flex gap-1.5 px-4 py-2.5" data-testid="navbar-notifications-tabs">
      {(["all", "unread", "comments"] as const).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => setTab(key)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            tab === key ? "bg-ink text-bg" : "border border-line text-muted"
          )}
        >
          {key === "all" ? t("tabAll") : key === "unread" ? t("tabUnread") : t("tabComments")}
        </button>
      ))}
    </div>
  );

  const notificationList = (
    <div className="p-1.5">
      {filtered.length === 0 ? (
        <p className="px-3 py-8 text-center text-sm text-muted">
          {t("noNotification")}
        </p>
      ) : (
        groups.map(
          (group) =>
            group.items.length > 0 && (
              <div key={group.key}>
                <div className="px-2 pb-1 pt-2 font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
                  {group.label}
                </div>
                {group.items.map((n) => (
                  <button
                    key={n._id}
                    type="button"
                    onClick={() => openNotification(n)}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-[10px] p-2.5 text-left",
                      !n.isRead && "bg-page"
                    )}
                    data-testid={`navbar-notification-item-${n._id}`}
                  >
                    <NotificationAvatar type={n.type} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className={cn(
                          "text-[13.5px] leading-snug text-ink",
                          !n.isRead && "font-medium"
                        )}
                      >
                        {n.message}
                      </span>
                      <span className="font-meta text-[11.5px] text-faint">
                        {format(n.createdAt)}
                      </span>
                    </div>
                    {!n.isRead && (
                      <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                    )}
                  </button>
                ))}
              </div>
            )
        )
      )}
    </div>
  );

  const bellButton = (
    <button
      type="button"
      onClick={variant === "mobile" ? () => setMobileOpen(true) : undefined}
      className="relative flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-surface-2 text-ink"
      data-testid={`navbar-notifications-bell-${variant}`}
      aria-label={t("notificationsTitle")}
    >
      <Bell size={18} strokeWidth={1.6} />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-surface bg-gradient-to-b from-accent to-accent-dark px-1 font-meta text-[10px] font-semibold text-white">
          {unreadCount}
        </span>
      )}
    </button>
  );

  if (variant === "mobile") {
    return (
      <>
        {bellButton}
        <FilterSheet
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          title={t("notificationsTitle")}
        >
          <div data-testid="notification-panel-mobile" className="flex flex-col">
            <div className="flex items-center gap-2.5 pb-2">
              {unreadCount > 0 && (
                <span className="rounded-full bg-accent-soft px-1.5 py-0.5 font-meta text-[11px] font-semibold text-accent-ink">
                  {unreadCount} {t("tabUnread").toLowerCase()}
                </span>
              )}
              <button
                type="button"
                onClick={markAllAsRead}
                className="ml-auto text-xs font-medium text-accent hover:text-accent-dark"
                data-testid="navbar-notifications-mark-all-read-button-mobile"
              >
                {t("markAllAsRead")}
              </button>
            </div>
            <div className="-mx-4 border-t border-line-soft">
              <div className="px-4">{tabsRow}</div>
              <div className="border-t border-line-soft px-2.5">{notificationList}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                router.push("/notifications");
              }}
              className="mt-3 flex h-11 w-full items-center justify-center rounded-[10px] border border-line font-cta text-sm font-medium text-ink"
              data-testid="navbar-notifications-view-all-button-mobile"
            >
              {t("viewAll")}
            </button>
          </div>
        </FilterSheet>
      </>
    );
  }

  const panel = (
    <div
      className="w-[360px] overflow-hidden rounded-[14px] border border-line-soft bg-surface shadow-[0_8px_24px_-4px_rgba(15,23,42,.10),0_2px_6px_-2px_rgba(15,23,42,.06)]"
      data-testid="notification-panel-desktop"
    >
      <div className="flex items-center gap-2.5 border-b border-line-soft px-4 py-3">
        <span className="font-display text-[15px] font-bold tracking-tight text-ink">
          {t("notificationsTitle")}
        </span>
        {unreadCount > 0 && (
          <span className="rounded-full bg-accent-soft px-1.5 py-0.5 font-meta text-[11px] font-semibold text-accent-ink">
            {unreadCount} {t("tabUnread").toLowerCase()}
          </span>
        )}
        <button
          type="button"
          onClick={markAllAsRead}
          className="ml-auto text-xs font-medium text-accent hover:text-accent-dark"
          data-testid="navbar-notifications-mark-all-read-button"
        >
          {t("markAllAsRead")}
        </button>
      </div>

      <div className="border-b border-line-soft">{tabsRow}</div>

      <div className="max-h-[380px] overflow-y-auto">{notificationList}</div>

      <div className="flex items-center justify-between border-t border-line-soft bg-page px-4 py-2.5">
        <button
          type="button"
          onClick={() => router.push("/notifications")}
          className="text-xs font-medium text-accent hover:text-accent-dark"
          data-testid="navbar-notifications-view-all-button"
        >
          {t("viewAll")}
        </button>
        <span className="text-xs text-muted">{t("notificationSettings")}</span>
      </div>
    </div>
  );

  return (
    <Dropdown trigger={["click"]} popupRender={() => panel} placement="bottomRight">
      {bellButton}
    </Dropdown>
  );
};

export const AuthSlot = ({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) => {
  const t = useTranslations("NavBar");
  return (
    <>
      <SignedOut>
        <Link href="/login" data-testid={`navbar-login-button-${variant}`}>
          <span className="flex h-9 items-center rounded-[10px] bg-ink px-4 font-cta text-sm font-medium text-bg">
            {t("login")}
          </span>
        </Link>
      </SignedOut>
      <SignedIn>
        <div data-testid={`navbar-user-menu-${variant}`}>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </SignedIn>
    </>
  );
};

export const NavActions = () => {
  return (
    <>
      <NewPostButton />
      <NotificationBell variant="desktop" />
      <LanguageSwitcher />
      <ThemeToggle />
      <AuthSlot variant="desktop" />
    </>
  );
};

const NavBarItem = () => (
  <>
    <NavLinks />
    <NavActions />
  </>
);

export default NavBarItem;
