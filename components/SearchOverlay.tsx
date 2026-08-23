"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Search as SearchIcon } from "lucide-react";
import { Post } from "@/interface/Post";
import { PostListResponse } from "@/interface/APIResponse";
import { cn } from "@/lib/utils";

const RECENT_KEY = "recentSearches";

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function pushRecent(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const next = [trimmed, ...readRecent().filter((q) => q !== trimmed)].slice(
    0,
    5
  );
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

type Tab = "posts" | "tags" | "authors";

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Search");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("posts");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setTab("posts");
      return;
    }
    setRecent(readRecent());
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const trimmed = query.trim();
  const endpoint = trimmed
    ? `${process.env.NEXT_PUBLIC_API_URL}/posts?search=${encodeURIComponent(
        trimmed
      )}&limit=8`
    : null;
  const { data, isLoading } = useSWR<PostListResponse>(
    endpoint,
    fetcherUseSWR
  );

  const results = useMemo(() => {
    const posts = data?.posts ?? [];
    const q = trimmed.toLowerCase();
    if (tab === "tags") {
      return posts.filter((p) =>
        p.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (tab === "authors") {
      return posts.filter((p) =>
        p.user?.username?.toLowerCase().includes(q)
      );
    }
    return posts;
  }, [data, tab, trimmed]);

  if (!open) return null;

  const goToPost = (post: Post) => {
    pushRecent(query);
    onClose();
    router.push(`/posts/${post._id}`);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      data-testid="search-overlay"
    >
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        data-testid="search-overlay-backdrop"
      />
      <div className="relative flex max-h-[70vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-[0_8px_24px_-4px_rgba(15,23,42,.10),0_2px_6px_-2px_rgba(15,23,42,.06)]">
        <div className="flex flex-none items-center gap-2.5 border-b border-line-soft px-4 py-3.5">
          <SearchIcon size={18} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
            data-testid="search-overlay-input"
          />
          <span className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-faint">
            {t("esc")}
          </span>
        </div>

        <div className="flex flex-none items-center gap-1.5 border-b border-line-soft px-4 py-2.5">
          {(["posts", "tags", "authors"] as Tab[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                tab === key
                  ? "bg-ink text-bg"
                  : "border border-line text-muted hover:text-ink"
              )}
              data-testid={`search-overlay-tab-${key}`}
            >
              {t(
                key === "posts"
                  ? "tabPosts"
                  : key === "tags"
                  ? "tabTags"
                  : "tabAuthors"
              )}
            </button>
          ))}
          {trimmed && (
            <span className="ml-auto font-mono text-xs text-faint">
              {results.length}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-2">
          {!trimmed ? (
            recent.length > 0 && (
              <div className="flex flex-col gap-2 px-2 py-2">
                <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
                  {t("recentSearches")}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recent.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuery(q)}
                      className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted hover:text-ink"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : isLoading ? (
            <p className="px-2 py-6 text-center text-sm text-muted">…</p>
          ) : results.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted">
              {t("noResults", { query: trimmed })}
            </p>
          ) : (
            results.map((post) => (
              <button
                key={post._id}
                type="button"
                onClick={() => goToPost(post)}
                className="flex items-center gap-3 rounded-lg p-2.5 text-left hover:bg-page"
                data-testid={`search-overlay-result-${post._id}`}
              >
                <div className="h-11 w-11 flex-none rounded-lg border border-line-soft bg-gradient-to-b from-page to-surface-2" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-semibold text-ink">
                    {post.title}
                  </span>
                  <span className="font-meta text-xs text-faint">
                    {post.category} · {post.user?.username}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex-none border-t border-line-soft px-4 py-2.5">
          <Link
            href="/search"
            onClick={onClose}
            className="text-xs font-medium text-accent hover:text-accent-dark"
          >
            {t("advancedSearch")} →
          </Link>
        </div>
      </div>
    </div>
  );
}
