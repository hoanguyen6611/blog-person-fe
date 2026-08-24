"use client";

import { useTranslations } from "next-intl";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import SavedPostsList from "@/components/SavedPostsList";

export default function SavedPage() {
  useRequireAuth();
  const t = useTranslations("SavedPage");

  return (
    <div className="mx-auto max-w-4xl py-10" data-testid="saved-page">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
        {t("title")}
      </h1>
      <SavedPostsList />
    </div>
  );
}
