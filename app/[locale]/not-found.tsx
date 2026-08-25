"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, BookOpen, Search, SearchX } from "lucide-react";

export default function NotFound() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const t = useTranslations("NotFound");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/posts?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-page px-4 py-16"
      data-testid="not-found-page"
    >
      <motion.div
        className="flex max-w-xl flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-2xl border border-line-soft bg-surface text-accent-ink shadow-sm"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <SearchX size={36} strokeWidth={1.5} />
        </motion.div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-6xl font-bold tracking-tight text-ink">
            404
          </h1>
          <p className="text-base text-muted">{t("description")}</p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-line-soft bg-surface p-1.5 shadow-sm"
        >
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full flex-1 rounded-xl bg-transparent px-3 text-sm text-ink outline-none placeholder:text-faint"
            data-testid="not-found-search-input"
          />
          <button
            type="submit"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-b from-accent to-accent-dark text-white transition-opacity hover:opacity-90"
            data-testid="not-found-search-button"
            aria-label={t("searchPlaceholder")}
          >
            <Search size={16} />
          </button>
        </form>

        <div className="mt-2 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-line-soft bg-surface px-5 py-2.5 text-sm font-medium text-ink shadow-sm transition-opacity hover:opacity-90"
            data-testid="not-found-home-link"
          >
            <ArrowLeft size={14} />
            {t("backHome")}
          </Link>
          <Link
            href="/posts"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-accent to-accent-dark px-5 py-2.5 font-cta text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            data-testid="not-found-posts-link"
          >
            <BookOpen size={14} />
            {t("browsePosts")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
