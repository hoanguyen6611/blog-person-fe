"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type PostFontSize = "sm" | "md" | "lg";

interface AppearanceSettings {
  postFontSize: PostFontSize;
  dimImages: boolean;
  focusMode: boolean;
}

const DEFAULTS: AppearanceSettings = {
  postFontSize: "md",
  dimImages: true,
  focusMode: false,
};

const STORAGE_KEY = "appearanceSettings";
const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined = undefined;
let cachedSettings: AppearanceSettings = DEFAULTS;

function readSettings(): AppearanceSettings {
  if (typeof window === "undefined") return cachedSettings;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedSettings;
  cachedRaw = raw;
  try {
    cachedSettings = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    cachedSettings = DEFAULTS;
  }
  return cachedSettings;
}

function writeSettings(next: AppearanceSettings) {
  const raw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedSettings = next;
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function useAppearanceSettings() {
  const settings = useSyncExternalStore(subscribe, readSettings, () => DEFAULTS);

  // Reflect settings onto <html> as data-attributes so plain CSS can react
  // to them (post font size scale, image dimming, focus mode).
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-post-font-size", settings.postFontSize);
    root.setAttribute("data-dim-images", settings.dimImages ? "on" : "off");
    root.setAttribute("data-focus-mode", settings.focusMode ? "on" : "off");
  }, [settings]);

  const update = useCallback((patch: Partial<AppearanceSettings>) => {
    writeSettings({ ...readSettings(), ...patch });
  }, []);

  return { settings, update };
}
