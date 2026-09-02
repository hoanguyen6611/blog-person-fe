"use client";

import { useAuth } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import axios from "axios";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { format } from "timeago.js";
import { isToday, isThisWeek } from "date-fns";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Notification } from "@/interface/Notification";
import { Heart, MessageCircle, UserPlus, Newspaper, Check } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<string, React.ElementType> = {
  comment: MessageCircle,
  like: Heart,
  follow: UserPlus,
  post: Newspaper,
};

type StatusFilter = "all" | "unread";

export default function NotificationsPage() {
  useRequireAuth();
  const t = useTranslations("NotificationsPage");
  const tNav = useTranslations("NavBar");
  const { getToken, isSignedIn, userId } = useAuth();
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  // Keyed by userId, not the raw token — see NavBarItem.tsx's NotificationBell
  // for why: Clerk's getToken() can mint a different JWT string per call, and
  // keying by it fragments the cache this page shares with the bell's badge.
  const { data, mutate } = useSWR<
    Notification[] | { notifications: Notification[] }
  >(
    userId
      ? ([`${process.env.NEXT_PUBLIC_API_URL}/notifications/all`, userId] as const)
      : null,
    async ([url]: readonly [string]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(url, token!);
    },
    { refreshInterval: 30000, revalidateOnFocus: true }
  );
  const notifications: Notification[] = useMemo(
    () => (Array.isArray(data) ? data : data?.notifications ?? []),
    [data]
  );

  const markAsRead = async (id: string) => {
    const token = await getToken();
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    mutate();
    globalMutate([`${process.env.NEXT_PUBLIC_API_URL}/notifications`, userId]);
  };

  const markAllAsRead = async () => {
    const token = await getToken();
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/readAll`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    mutate();
    globalMutate([`${process.env.NEXT_PUBLIC_API_URL}/notifications`, userId]);
  };

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notifications.forEach((n) => {
      counts[n.type] = (counts[n.type] ?? 0) + 1;
    });
    return counts;
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => {
    if (type !== "all" && n.type !== type) return false;
    if (status === "unread" && n.isRead) return false;
    return true;
  });

  const groups: { key: string; label: string; items: Notification[] }[] = [
    { key: "today", label: t("groupToday"), items: [] },
    { key: "week", label: t("groupThisWeek"), items: [] },
    { key: "earlier", label: t("groupEarlier"), items: [] },
  ];
  filtered.forEach((n) => {
    const date = new Date(n.createdAt);
    if (isToday(date)) groups[0].items.push(n);
    else if (isThisWeek(date)) groups[1].items.push(n);
    else groups[2].items.push(n);
  });

  if (!isSignedIn)
    return (
      <p className="py-16 text-center text-sm text-muted" data-testid="notification-not-logged-in">
        {t("notSignedIn")}
      </p>
    );

  const typeFilters = ["all", ...Object.keys(typeCounts)];

  return (
    <div className="grid gap-8 py-8 md:grid-cols-[236px_1fr]" data-testid="notifications-page">
      <aside className="hidden flex-col gap-5 md:flex md:sticky md:top-24 md:self-start">
        <div className="flex flex-col gap-1">
          <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
            {t("byType")}
          </span>
          {typeFilters.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              className={cn(
                "flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors",
                type === key ? "bg-surface font-semibold text-ink shadow-sm" : "text-muted hover:text-ink"
              )}
              data-testid={`notification-type-filter-${key}`}
            >
              {key === "all" ? t("allTypes") : t(`type.${key}`)}
              <span className="font-mono text-xs text-faintest">
                {key === "all" ? notifications.length : typeCounts[key]}
              </span>
            </button>
          ))}
        </div>

        <div className="h-px bg-line" />

        <div className="flex flex-col gap-2">
          <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
            {t("status")}
          </span>
          <div className="flex rounded-[10px] bg-surface-2 p-0.5">
            {(["all", "unread"] as StatusFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatus(key)}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors",
                  status === key ? "bg-surface text-ink shadow-sm" : "text-muted"
                )}
                data-testid={`notification-status-filter-${key}`}
              >
                {key === "all" ? tNav("tabAll") : tNav("tabUnread")}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              {tNav("notificationsTitle")}
            </h1>
            <span className="font-meta text-[13px] text-muted">
              {t("summary", { unread: unreadCount, total: notifications.length })}
            </span>
          </div>
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex h-9 items-center gap-1.5 rounded-[10px] border border-line bg-surface px-3.5 font-cta text-sm font-medium text-ink"
            data-testid="notification-mark-all-read-button"
          >
            <Check size={14} />
            {tNav("markAllAsRead")}
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">{tNav("noNotification")}</p>
        ) : (
          groups.map(
            (group) =>
              group.items.length > 0 && (
                <div key={group.key} className="flex flex-col gap-2.5">
                  <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
                    {group.label}
                  </span>
                  {group.items.map((n) => {
                    const Icon = TYPE_ICON[n.type] ?? Newspaper;
                    return (
                      <div
                        key={n._id}
                        className="flex items-center gap-3.5 rounded-xl border border-line-soft bg-surface p-4 shadow-sm"
                        data-testid={`notification-item-${n._id}`}
                      >
                        {!n.isRead && (
                          <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                        )}
                        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-surface-2 text-muted">
                          <Icon size={16} />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <Link
                            href={n.postId ? `/posts/${n.postId}` : "/user"}
                            onClick={() => !n.isRead && markAsRead(n._id)}
                            className={cn(
                              "text-sm leading-snug text-ink hover:text-accent-ink",
                              !n.isRead && "font-semibold"
                            )}
                          >
                            {n.message}
                          </Link>
                          <span className="font-meta text-xs text-faint">
                            {format(n.createdAt)}
                          </span>
                        </div>
                        {!n.isRead && (
                          <button
                            type="button"
                            onClick={() => markAsRead(n._id)}
                            className="flex-none text-xs font-medium text-accent hover:text-accent-dark"
                            data-testid={`notification-mark-read-button-${n._id}`}
                          >
                            {t("markRead")}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
          )
        )}
      </div>
    </div>
  );
}
