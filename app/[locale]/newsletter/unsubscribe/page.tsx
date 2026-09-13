"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

type Status = "loading" | "success" | "error";

const UnsubscribeContent = () => {
  const t = useTranslations("NewsletterUnsubscribe");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!id) {
      setStatus("error");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/newsletter/unsubscribe/${id}`
        );
        setStatus(res.ok ? "success" : "error");
      } catch {
        setStatus("error");
      }
    })();
  }, [id]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      {status === "loading" && (
        <p className="text-sm text-muted" data-testid="unsubscribe-loading">
          {t("loading")}
        </p>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 size={40} className="text-success" />
          <h1 className="font-display text-xl font-bold text-ink">
            {t("successTitle")}
          </h1>
          <p className="text-sm text-muted">{t("successBody")}</p>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle size={40} className="text-red-500" />
          <h1 className="font-display text-xl font-bold text-ink">
            {t("errorTitle")}
          </h1>
          <p className="text-sm text-muted">{t("errorBody")}</p>
        </>
      )}
      {status !== "loading" && (
        <Link
          href="/"
          className="mt-2 rounded-[10px] bg-ink px-4 py-2 font-cta text-sm font-medium text-bg"
          data-testid="unsubscribe-back-home-link"
        >
          {t("backHome")}
        </Link>
      )}
    </div>
  );
};

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeContent />
    </Suspense>
  );
}
