"use client";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { format } from "timeago.js";
import { Heart, MessageCircle, Newspaper, UserPlus, Inbox } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { Notification } from "@/interface/Notification";

const TYPE_ICON: Record<string, React.ElementType> = {
  comment: MessageCircle,
  like: Heart,
  follow: UserPlus,
  post: Newspaper,
};

const MAX_ITEMS = 6;

export default function RecentActivity() {
  const t = useTranslations("RecentActivity");
  const { getToken, isSignedIn, userId } = useAuth();
  const { data } = useSWR(
    isSignedIn ? ["recent-activity", userId] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
        token!
      );
    },
    { refreshInterval: 30000, revalidateOnFocus: true }
  );

  const items: Notification[] = (
    Array.isArray(data) ? data : data?.notifications ?? []
  ).slice(0, MAX_ITEMS);

  return (
    <div
      className="rounded-2xl border border-line-soft bg-surface p-5 shadow-sm"
      data-testid="cms-recent-activity"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-ink">{t("title")}</h2>
        <Link
          href="/notifications"
          className="text-xs font-medium text-accent-ink hover:underline"
          data-testid="cms-recent-activity-view-all"
        >
          {t("viewAll")}
        </Link>
      </div>

      {!data ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[52px] animate-pulse rounded-xl bg-surface-2"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className="flex flex-col items-center gap-2 py-8 text-center"
          data-testid="cms-recent-activity-empty"
        >
          <Inbox size={22} className="text-faint" />
          <p className="text-sm text-muted">{t("empty")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((n) => {
            const Icon = TYPE_ICON[n.type] ?? Newspaper;
            return (
              <Link
                key={n._id}
                href={n.postId ? `/posts/${n.postId}` : "/user"}
                className="flex items-center gap-3 rounded-xl px-1 py-2 hover:bg-surface-2"
                data-testid={`cms-recent-activity-item-${n._id}`}
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-surface-2 text-muted">
                  <Icon size={14} />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink">
                  {n.message}
                </span>
                <span className="flex-none font-meta text-xs text-faint">
                  {format(n.createdAt)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
