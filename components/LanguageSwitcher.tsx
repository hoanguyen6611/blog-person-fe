"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <div className="flex gap-4">
      {pathname === "/en" && (
        <Link
          href={`/vi${pathname.replace(/^\/(en|vi)/, "")}`}
          className="border border-gray-300 rounded-2xl px-2 py-1 bg-gray-200"
        >
          🇺🇸 EN → 🇻🇳 VN
        </Link>
      )}
      {pathname === "/vi" && (
        <Link
          href={`/en${pathname.replace(/^\/(en|vi)/, "")}`}
          className="border border-gray-300 rounded-2xl px-2 py-1 bg-gray-200"
        >
          🇻🇳 VN → 🇺🇸 EN
        </Link>
      )}
    </div>
  );
}
