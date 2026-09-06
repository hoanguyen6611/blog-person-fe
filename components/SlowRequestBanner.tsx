"use client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSlowRequestStore } from "@/store/useSlowRequestStore";

export default function SlowRequestBanner() {
  const count = useSlowRequestStore((s) => s.count);
  const t = useTranslations("SlowRequestBanner");

  if (count === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[72px] z-[60] flex justify-center px-4"
      data-testid="slow-request-banner"
    >
      <div className="flex items-center gap-2 rounded-full border border-line-soft bg-surface px-4 py-2 text-xs text-muted shadow-[0_8px_24px_-4px_rgba(15,23,42,.10),0_2px_6px_-2px_rgba(15,23,42,.06)]">
        <Loader2 size={14} className="flex-none animate-spin text-accent-ink" />
        {t("message")}
      </div>
    </div>
  );
}
