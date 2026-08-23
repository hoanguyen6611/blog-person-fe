"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useAppearanceSettings, PostFontSize } from "@/hooks/useAppearanceSettings";
import { cn } from "@/lib/utils";

const MODES = [
  { key: "light", label: "Sáng", icon: Sun },
  { key: "dark", label: "Tối", icon: Moon },
  { key: "system", label: "Hệ thống", icon: Monitor },
] as const;

const FONT_SIZES: { key: PostFontSize; label: string }[] = [
  { key: "sm", label: "A" },
  { key: "md", label: "A" },
  { key: "lg", label: "A" },
];

const Toggle = ({
  checked,
  onChange,
  testId,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  testId?: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    data-testid={testId}
    className={cn(
      "flex h-[26px] w-11 flex-none items-center rounded-full p-[3px] transition-colors",
      checked ? "justify-end bg-gradient-to-b from-accent to-accent-dark" : "justify-start bg-surface-2"
    )}
  >
    <span className="h-5 w-5 rounded-full bg-white" />
  </button>
);

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { settings, update } = useAppearanceSettings();

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex max-w-2xl flex-col gap-6 py-6" data-testid="cms-settings-page">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
        Giao diện
      </h1>

      <div className="flex flex-col gap-3">
        <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
          Chế độ hiển thị
        </span>
        <div className="grid grid-cols-3 gap-3">
          {MODES.map(({ key, label, icon: Icon }) => {
            const active = mounted && theme === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                data-testid={`settings-theme-${key}`}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-colors",
                  active
                    ? "border-accent bg-surface-2"
                    : "border-line-soft bg-surface hover:border-line"
                )}
              >
                <Icon size={20} className={active ? "text-accent" : "text-muted"} />
                <span className={cn("text-sm", active ? "font-semibold text-ink" : "text-muted")}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-line-soft" />

      <div className="flex flex-col gap-3">
        <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
          Đọc bài
        </span>

        <div className="flex items-center gap-3 rounded-2xl border border-line-soft bg-surface p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-ink">Cỡ chữ</span>
            <span className="text-xs text-muted">Áp dụng cho nội dung bài viết</span>
          </div>
          <div className="ml-auto flex items-center gap-0.5 rounded-[9px] bg-surface-2 p-[3px]">
            {FONT_SIZES.map((size, i) => (
              <button
                key={size.key}
                type="button"
                onClick={() => update({ postFontSize: size.key })}
                data-testid={`settings-font-size-${size.key}`}
                className={cn(
                  "flex h-7 w-8 items-center justify-center rounded-md",
                  settings.postFontSize === size.key
                    ? "bg-surface font-semibold text-ink shadow-sm"
                    : "text-muted"
                )}
                style={{ fontSize: 11 + i * 2 }}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-line-soft bg-surface p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-ink">Giảm sáng ảnh</span>
            <span className="text-xs text-muted">Ảnh bìa mờ 12% khi ở nền tối</span>
          </div>
          <Toggle
            checked={settings.dimImages}
            onChange={(v) => update({ dimImages: v })}
            testId="settings-dim-images-toggle"
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-line-soft bg-surface p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-ink">Chế độ tập trung</span>
            <span className="text-xs text-muted">Ẩn mục lục và cột gợi ý khi đọc bài</span>
          </div>
          <Toggle
            checked={settings.focusMode}
            onChange={(v) => update({ focusMode: v })}
            testId="settings-focus-mode-toggle"
          />
        </div>
      </div>
    </div>
  );
}
