"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const LOCALES = [
  { code: "vi", label: "VI" },
  { code: "en", label: "EN" },
] as const;

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-line bg-surface-2 p-0.5 font-mono text-xs font-medium"
      data-testid="language-switcher"
    >
      {LOCALES.map(({ code, label }) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          aria-current={locale === code}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === code
              ? "bg-ink text-bg"
              : "text-muted hover:text-ink"
          }`}
          data-testid={`language-switcher-${code}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
