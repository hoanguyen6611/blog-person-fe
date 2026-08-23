"use client";

import { Bookmark } from "lucide-react";
import { useSavePost } from "@/hooks/useSavePost";
import { cn } from "@/lib/utils";

export default function BookmarkButton({
  postId,
  className,
}: {
  postId: string;
  className?: string;
}) {
  const { isSaved, toggleSaved } = useSavePost();
  const saved = isSaved(postId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(postId);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved posts" : "Save post"}
      data-testid={`bookmark-button-${postId}`}
      className={cn(
        "flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-line text-muted transition-colors hover:text-ink",
        saved && "border-accent-soft bg-accent-soft text-accent hover:text-accent",
        className
      )}
    >
      <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
