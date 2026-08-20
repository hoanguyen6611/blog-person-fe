"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const nextLocale = locale === "en" ? "vi" : "en";

  return (
    <div className="flex gap-4">
      <Link
        href={pathname}
        locale={nextLocale}
        className="border border-gray-300 rounded-2xl px-2 py-1 bg-gray-200"
      >
        {nextLocale === "vi" ? "🇺🇸 EN → 🇻🇳 VN" : "🇻🇳 VN → 🇺🇸 EN"}
      </Link>
    </div>
  );
}
