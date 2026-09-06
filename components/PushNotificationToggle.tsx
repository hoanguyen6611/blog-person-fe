"use client";
import { Bell, BellOff } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const PushNotificationToggle = () => {
  const t = useTranslations("PushNotifications");
  const { status, loading, supported, subscribe, unsubscribe } =
    usePushNotifications();

  if (!supported) return null;

  if (status === "denied") {
    return (
      <div
        className="flex flex-col gap-1 rounded-xl border border-line-soft bg-page p-3.5"
        data-testid="push-notification-denied"
      >
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
          <BellOff size={14} />
          {t("title")}
        </span>
        <span className="font-meta text-xs leading-normal text-faint">
          {t("deniedText")}
        </span>
      </div>
    );
  }

  const handleClick = async () => {
    if (status === "subscribed") {
      const ok = await unsubscribe();
      toast[ok ? "success" : "error"](
        ok ? t("toastUnsubscribed") : t("toastFailed")
      );
    } else {
      const ok = await subscribe();
      toast[ok ? "success" : "error"](
        ok ? t("toastSubscribed") : t("toastFailed")
      );
    }
  };

  return (
    <div
      className="flex flex-col gap-2 rounded-xl border border-line-soft bg-page p-3.5"
      data-testid="push-notification-toggle"
    >
      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
        <Bell size={14} />
        {t("title")}
      </span>
      <span className="font-meta text-xs leading-normal text-faint">
        {status === "subscribed" ? t("subscribedText") : t("description")}
      </span>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex h-8 items-center justify-center rounded-lg border border-line text-xs font-medium text-ink hover:border-accent hover:text-accent disabled:opacity-50"
        data-testid="push-notification-toggle-button"
      >
        {status === "subscribed" ? t("disableButton") : t("enableButton")}
      </button>
    </div>
  );
};

export default PushNotificationToggle;
