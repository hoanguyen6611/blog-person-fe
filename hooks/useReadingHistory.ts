"use client";
import { useEffect, useState } from "react";

export interface ReadingHistoryItem {
  postId: string;
  title: string;
  img?: string;
  viewedAt: number;
}

const STORAGE_KEY = "reading-history";
const MAX_ITEMS = 12;

function readHistory(): ReadingHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(items: ReadingHistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // private mode / quota exceeded — reading history is a nice-to-have.
  }
}

// Dedupes by postId (most recent view wins the slot) and keeps most-recent
// first, capped so the list can't grow unbounded.
export function recordPostView(item: Omit<ReadingHistoryItem, "viewedAt">) {
  if (typeof window === "undefined") return;
  const existing = readHistory().filter((h) => h.postId !== item.postId);
  const next = [{ ...item, viewedAt: Date.now() }, ...existing].slice(
    0,
    MAX_ITEMS
  );
  writeHistory(next);
}

// Purely client-local (localStorage), so this only reflects what THIS
// browser has viewed — no backend account-level sync.
export function useReadingHistory(): ReadingHistoryItem[] {
  const [items, setItems] = useState<ReadingHistoryItem[]>([]);
  useEffect(() => {
    setItems(readHistory());
  }, []);
  return items;
}
