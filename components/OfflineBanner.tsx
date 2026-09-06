"use client";
import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const t = useTranslations("OfflineBanner");

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[72px] z-[60] flex justify-center px-4"
      data-testid="offline-banner"
    >
      <div className="flex items-center gap-2 rounded-full border border-warning bg-warning-bg px-4 py-2 text-xs text-ink shadow-md">
        <WifiOff size={14} className="flex-none" />
        {t("message")}
      </div>
    </div>
  );
}
