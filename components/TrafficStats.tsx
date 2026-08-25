"use client";
import useSWR from "swr";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Eye, TrendingDown, TrendingUp, Users } from "lucide-react";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const PERIOD_OPTIONS = [7, 30, 90];

interface TrafficStatsResponse {
  totalViews?: number;
  trendPercent?: number;
  uniqueVisitors?: number;
  returningVisitors?: number;
  returningRatePercent?: number;
  returningRateTrendPercent?: number;
}

const TrendBadge = ({ value, suffix = "%" }: { value?: number; suffix?: string }) => {
  if (value === undefined || value === null) return null;
  const isUp = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        isUp ? "text-success" : "text-red-500"
      )}
    >
      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {isUp ? "+" : ""}
      {value}
      {suffix}
    </span>
  );
};

export default function TrafficStats({ days = 30 }: { days?: number }) {
  const t = useTranslations("TrafficStats");
  const { getToken, isSignedIn, userId } = useAuth();
  const [period, setPeriod] = useState(days);
  const { data } = useSWR<TrafficStatsResponse>(
    isSignedIn ? ["traffic-stats", userId, period] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/stats/traffic?days=${period}`,
        token!
      );
    }
  );

  const periodToggle = (
    <div
      className="flex rounded-[10px] bg-surface-2 p-0.5"
      data-testid="cms-traffic-period-toggle"
    >
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setPeriod(option)}
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
            period === option ? "bg-surface text-ink shadow-sm" : "text-muted"
          )}
          data-testid={`cms-traffic-period-option-${option}`}
        >
          {t("periodOptionDays", { days: option })}
        </button>
      ))}
    </div>
  );

  if (!data)
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">{periodToggle}</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-testid="cms-traffic-stats-loading">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-[74px] animate-pulse rounded-2xl border border-line-soft bg-surface-2"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">{periodToggle}</div>
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        data-testid="cms-traffic-stats"
      >
        <div
          className="flex items-center justify-between rounded-2xl border border-line-soft bg-surface p-4 shadow-sm"
          data-testid="cms-traffic-views-card"
        >
          <div className="flex flex-col gap-1">
            <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
              {t("viewsLabel", { days: period })}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                {data.totalViews?.toLocaleString("vi-VN") ?? "—"}
              </span>
              <TrendBadge value={data.trendPercent} />
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted">
            <Eye size={18} />
          </div>
        </div>

        <div
          className="flex items-center justify-between rounded-2xl border border-line-soft bg-surface p-4 shadow-sm"
          data-testid="cms-traffic-returning-card"
        >
          <div className="flex flex-col gap-1">
            <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
              {t("returningLabel")}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                {data.returningRatePercent ?? "—"}%
              </span>
              <TrendBadge value={data.returningRateTrendPercent} suffix="đ" />
            </div>
            {data.returningVisitors !== undefined && data.uniqueVisitors !== undefined && (
              <span className="font-meta text-xs text-faint">
                {data.returningVisitors.toLocaleString("vi-VN")}/
                {data.uniqueVisitors.toLocaleString("vi-VN")} {t("visitsSuffix")}
              </span>
            )}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted">
            <Users size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
