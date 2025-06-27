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
} from "lucide-react";

export default function Sidebar({ admin }: { admin: boolean }) {
  const pathname = usePathname();

  const links = [
    ...(admin
      ? [
          { href: "/cms", label: "Dashboard", icon: <Home size={20} /> },
          { href: "/cms/user", label: "Users", icon: <Users size={20} /> },
          {
            href: "/cms/category",
            label: "Categories",
            icon: <Shapes size={20} />,
          },
          {
            href: "/cms/tag",
            label: "Tags",
            icon: <Tag size={20} />,
          },
        ]
      : []),
    ...(!admin
      ? [
          {
            href: "/cms/personal",
            label: "Dashboard Personal",
            icon: <PersonStanding size={20} />,
          },
        ]
      : []),
    { href: "/cms/posts", label: "My Posts", icon: <FileText size={20} /> },
    { href: "/cms/settings", label: "Settings", icon: <Settings size={20} /> },
    { href: "/cms/save-post", label: "Save Post", icon: <Heart size={20} /> },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-56 bg-gray-100 shadow-md p-4 hidden md:block z-20">
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
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
