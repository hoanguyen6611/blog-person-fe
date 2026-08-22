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
        token: { colorPrimary: isDark ? "#85a2ff" : "#2f5fe0" },
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
