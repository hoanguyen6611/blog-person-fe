"use client";
import { useTranslations } from "next-intl";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import SavedPostsList from "@/components/SavedPostsList";

const SavePost = () => {
  useRequireAuth();
  const t = useTranslations("SavedPage");

  return (
    <div data-testid="cms-save-post-page">
      <h1
        className="font-display text-2xl font-bold tracking-tight text-ink"
        data-testid="cms-save-post-heading"
      >
        {t("title")}
      </h1>
      <SavedPostsList />
    </div>
  );
};

export default SavePost;
