"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AntdThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        token: isDark
          ? {
              colorPrimary: "#3b6bff",
              colorBgContainer: "#16181c",
              colorBgElevated: "#1d2026",
              colorBgLayout: "#0e1013",
              colorBorder: "#32373e",
              colorBorderSecondary: "#262a30",
              colorText: "#edeef0",
              colorTextSecondary: "#9da1aa",
              colorTextTertiary: "#8a8e97",
              colorTextPlaceholder: "#6e727a",
            }
          : { colorPrimary: "#003cff" },
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
