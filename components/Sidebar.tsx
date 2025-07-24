"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Users,
  Settings,
  Shapes,
  Heart,
  PersonStanding,
  Tag,
  AlarmClockCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Sidebar({ admin }: { admin: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  const links = [
    ...(admin
      ? [
          { href: "/cms", label: t("dashboard"), icon: <Home size={20} /> },
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
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-56 bg-gray-100 shadow-md p-4 hidden md:block z-20 dark:bg-black">
      <div className="text-xl font-bold text-blue-700 mb-6 text-center pt-4">
        CMS Blog
      </div>
      <nav className="flex flex-col gap-2">
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
              pathname === href
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-100 dark:hover:bg-gray-800"
            }`}
          >
            <span className="dark:text-gray-200">{icon}</span>
            <span className="dark:text-gray-200">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
