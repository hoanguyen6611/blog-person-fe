"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import ImageShow from "./Image";

const RecentlyViewedWidget = () => {
  const t = useTranslations("HomePage");
  const items = useReadingHistory();

  if (items.length === 0) return null;

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm"
      data-testid="recently-viewed-widget"
    >
      <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
        {t("recentlyViewed")}
      </span>
      {items.slice(0, 5).map((item, i) => (
        <div key={item.postId}>
          {i > 0 && <div className="my-3 h-px bg-line-soft" />}
          <Link
            href={`/posts/${item.postId}`}
            className="flex items-center gap-3"
            data-testid={`recently-viewed-item-${item.postId}`}
          >
            <ImageShow
              src={item.img || ""}
              alt={item.title}
              width={40}
              height={40}
              className="h-10 w-10 flex-none rounded-lg object-cover"
            />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold leading-snug tracking-tight text-ink hover:text-accent-ink">
              {item.title}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecentlyViewedWidget;
