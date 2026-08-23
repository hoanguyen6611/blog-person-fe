"use client";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { Eye, TrendingDown, TrendingUp, Users } from "lucide-react";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { cn } from "@/lib/utils";

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
  const { getToken, isSignedIn } = useAuth();
  const { data } = useSWR<TrafficStatsResponse>(
    isSignedIn ? ["traffic-stats", days] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/stats/traffic?days=${days}`,
        token!
      );
    }
  );

  if (!data) return null;

  return (
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
            Lượt xem {days} ngày
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
            Người đọc quay lại
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
              {data.uniqueVisitors.toLocaleString("vi-VN")} lượt truy cập
            </span>
          )}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted">
          <Users size={18} />
        </div>
      </div>
    </div>
  );
}
