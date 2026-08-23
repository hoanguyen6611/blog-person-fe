"use client";
import { Link, usePathname } from "@/i18n/navigation";
import {
  ChartArea,
  FileText,
  Users,
  Settings,
  Shapes,
  Heart,
  PersonStanding,
  Tag,
  AlarmClockCheck,
  MessageCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { Post } from "@/interface/Post";
import { computeWritingStreak } from "@/lib/writingStreak";
import { cn } from "@/lib/utils";

const WritingStreak = () => {
  const t = useTranslations("Sidebar");
  const { getToken, isSignedIn } = useAuth();
  const { data } = useSWR(
    isSignedIn
      ? [`${process.env.NEXT_PUBLIC_API_URL}/posts/user?page=1&limit=200`, "streak"]
      : null,
    ([url]) => getToken().then((token) => fetcherWithTokenUseSWR(url, token!))
  );

  if (!data?.posts?.length) return null;

  const { streak, weeks } = computeWritingStreak(
    data.posts.map((p: Post) => p.createdAt)
  );
  if (streak === 0) return null;

  return (
    <div className="mt-auto flex flex-col gap-2.5 rounded-xl border border-line-soft bg-page p-3.5">
      <span className="font-meta text-[13px] font-semibold tracking-tight text-ink">
        {t("writingStreak")}
      </span>
      <div className="flex gap-1">
        {weeks.map((active, i) => (
          <span
            key={i}
            className={cn(
              "h-[26px] flex-1 rounded",
              active ? "bg-gradient-to-b from-accent to-accent-dark" : "bg-line-soft"
            )}
          />
        ))}
      </div>
      <span className="font-meta text-xs leading-normal text-faint">
        {t("writingStreakBody", { count: streak })}
      </span>
    </div>
  );
};

export default function Sidebar({ admin }: { admin: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  const testIdByHref: Record<string, string> = {
    "/cms": "cms-sidebar-dashboard-link",
    "/cms/user": "cms-sidebar-users-link",
    "/cms/category": "cms-sidebar-categories-link",
    "/cms/tag": "cms-sidebar-tags-link",
    "/cms/comments": "cms-sidebar-comments-link",
    "/cms/personal": "cms-sidebar-personal-dashboard-link",
    "/cms/posts": "cms-sidebar-my-posts-link",
    "/cms/post-schedule": "cms-sidebar-schedule-link",
    "/cms/settings": "cms-sidebar-settings-link",
    "/cms/save-post": "cms-sidebar-save-post-link",
  };

  const links = [
    ...(admin
      ? [
          {
            href: "/cms",
            label: t("dashboard"),
            icon: <ChartArea size={20} />,
          },
          { href: "/cms/user", label: t("users"), icon: <Users size={20} /> },
          {
            href: "/cms/category",
            label: t("categories"),
            icon: <Shapes size={20} />,
          },
          {
            href: "/cms/tag",
            label: t("tags"),
            icon: <Tag size={20} />,
          },
          {
            href: "/cms/comments",
            label: t("comments"),
            icon: <MessageCircle size={20} />,
          },
        ]
      : []),
    ...(!admin
      ? [
          {
            href: "/cms/personal",
            label: t("dashboardPersonal"),
            icon: <PersonStanding size={20} />,
          },
        ]
      : []),
    { href: "/cms/posts", label: t("myPosts"), icon: <FileText size={20} /> },
    {
      href: "/cms/post-schedule",
      label: t("myPostsSchedule"),
      icon: <AlarmClockCheck size={20} />,
    },
    {
      href: "/cms/settings",
      label: t("settings"),
      icon: <Settings size={20} />,
    },
    { href: "/cms/save-post", label: t("savePost"), icon: <Heart size={20} /> },
  ];

  return (
    <aside className="sticky top-24 hidden w-60 flex-none flex-col gap-1 self-start rounded-2xl border border-line bg-surface p-3 md:flex">
      <div className="mb-2 flex items-center gap-2.5 px-1.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-b from-accent to-accent-dark font-display text-sm font-bold text-white">
          T
        </span>
        <span className="font-display text-base font-bold tracking-tight text-ink">
          CMS Blog
        </span>
      </div>
      <nav className="flex flex-col gap-0.5">
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            data-testid={testIdByHref[href]}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
              pathname === href
                ? "bg-page text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
      <WritingStreak />
    </aside>
  );
}
