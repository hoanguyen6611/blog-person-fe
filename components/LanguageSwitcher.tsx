// src/components/LanguageSwitcher.tsx
"use client"; // Nếu bạn dùng App Router
import { useTranslation } from "next-i18next";
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: "vi" | "en") => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage("vi")}
        className="text-sm underline"
      >
        🇻🇳 Tiếng Việt
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className="text-sm underline"
      >
        🇺🇸 English
      </button>
    </div>
  );
};

export default LanguageSwitcher;
