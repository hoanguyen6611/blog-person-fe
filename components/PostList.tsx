"use client";
import PostListItem from "./PostListItem";
import useSWR from "swr";
import { Post } from "@/interface/Post";
import { PostListResponse } from "@/interface/APIResponse";
import { Suspense } from "react";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "../api/useswr";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_PARAM = "page";

interface PostListProps {
  apiUrl: string;
  showPagination?: boolean;
  useAuthToken?: boolean;
}

type FetchKey = string | readonly ["authPosts", string];

const PostListContent = ({
  apiUrl,
  showPagination,
  useAuthToken,
}: PostListProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { getToken } = useAuth();

  const pageIndex = Math.max(1, Number(searchParams.get(PAGE_PARAM)) || 1);

  const apiSearchParams = new URLSearchParams(searchParams.toString());
  apiSearchParams.set(PAGE_PARAM, String(pageIndex));
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/${apiUrl}?${apiSearchParams}`;
  const endpointToken = `${process.env.NEXT_PUBLIC_API_URL}/${apiUrl}`;

  const { data, error, isLoading } = useSWR<PostListResponse>(
    useAuthToken ? (["authPosts", endpointToken] as const) : endpoint,
    async (key: FetchKey) => {
      if (typeof key === "string") {
        return fetcherUseSWR(key);
      }
      const [, url] = key;
      const token = await getToken();
      return fetcherWithTokenUseSWR(url, token!);
    }
  );

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PAGE_PARAM, String(page));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (isLoading)
    return (
      <p className="text-muted" data-testid="post-list-loading">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="text-muted" data-testid="post-list-error">
        Failed to load
      </p>
    );

  return (
    <div
      className="grid grid-cols-1 gap-5 mb-8 md:grid-cols-2 lg:grid-cols-3"
      data-testid="post-list-container"
    >
      {(data?.posts || []).map((post: Post) => (
        <PostListItem key={post._id} post={post} />
      ))}
      {showPagination && !!data && data.totalPages > 1 && (
        <Pagination
          currentPage={pageIndex}
          totalPages={data.totalPages}
          onChange={goToPage}
        />
      )}
    </div>
  );
};

type PageEntry = number | "ellipsis";

const getPageEntries = (current: number, total: number): PageEntry[] => {
  const entries: PageEntry[] = [];
  for (let page = 1; page <= total; page++) {
    if (page === 1 || page === total || Math.abs(page - current) <= 1) {
      entries.push(page);
    } else if (entries[entries.length - 1] !== "ellipsis") {
      entries.push("ellipsis");
    }
  }
  return entries;
};

const navButtonClass =
  "flex h-9 min-w-9 items-center justify-center rounded-full font-mono text-sm font-medium text-muted transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40";

const Pagination = ({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => {
  const entries = getPageEntries(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 pt-2"
    >
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(navButtonClass, "px-2")}
        data-testid="pagination-prev-button"
      >
        <ChevronLeft size={18} />
      </button>

      {entries.map((entry, i) =>
        entry === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 min-w-9 items-center justify-center font-mono text-sm text-muted"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            aria-current={entry === currentPage ? "page" : undefined}
            onClick={() => onChange(entry)}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-full font-mono text-sm font-medium transition-colors",
              entry === currentPage
                ? "bg-ink text-bg"
                : "text-muted hover:bg-surface-2"
            )}
            data-testid={`pagination-page-${entry}`}
          >
            {entry}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(navButtonClass, "px-2")}
        data-testid="pagination-next-button"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

const PostList = (props: PostListProps) => {
  return (
    <Suspense fallback={<div>Loading posts...</div>}>
      <PostListContent {...props} />
    </Suspense>
  );
};

export default PostList;
