"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export interface DraftAutosavePayload {
  title: string;
  desc: string;
  category: string;
  content: string;
  tags: string[];
  cover: string;
}

interface StoredDraft {
  payload: DraftAutosavePayload;
  savedAt: number;
}

const DEBOUNCE_MS = 1500;

const isEmptyPayload = (payload: DraftAutosavePayload) =>
  !payload.title &&
  !payload.desc &&
  !payload.content &&
  !payload.category &&
  (!payload.tags || payload.tags.length === 0) &&
  !payload.cover;

// Local-only safety net against a crashed tab/browser while writing — NOT a
// sync mechanism with the backend. The real "Lưu nháp" button still creates
// the actual draft post; this just means a refresh or crash mid-edit doesn't
// lose unsaved work.
export function useDraftAutosave(storageKey: string) {
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (payload: DraftAutosavePayload) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (isEmptyPayload(payload)) return;
        try {
          const stored: StoredDraft = { payload, savedAt: Date.now() };
          localStorage.setItem(storageKey, JSON.stringify(stored));
          setSavedAt(stored.savedAt);
        } catch {
          // localStorage can throw (private mode, quota exceeded) —
          // autosave is a nice-to-have, never let it break the editor.
        }
      }, DEBOUNCE_MS);
    },
    [storageKey]
  );

  const restore = useCallback((): StoredDraft | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredDraft;
      if (!parsed?.payload || isEmptyPayload(parsed.payload)) return null;
      return parsed;
    } catch {
      return null;
    }
  }, [storageKey]);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setSavedAt(null);
  }, [storageKey]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { save, restore, clear, savedAt };
}
