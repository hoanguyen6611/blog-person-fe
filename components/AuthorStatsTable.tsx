"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";

type AuthorStats = {
  _id: string; // username
  count: number;
};

const ROW_HEIGHT = 36;
const MIN_CHART_HEIGHT = 120;

export default function AuthorStatsTable({ data }: { data: AuthorStats[] }) {
  const t = useTranslations("Statistic");

  // Ranked descending — the plain table this replaced showed authors in
  // whatever order the backend aggregate returned them, not by article
  // count, which made "who writes the most" something you had to scan
  // for instead of just read off the top bar.
  const sorted = data
    ? [...data].sort((a, b) => b.count - a.count)
    : undefined;
  const chartHeight = sorted
    ? Math.max(MIN_CHART_HEIGHT, sorted.length * ROW_HEIGHT)
    : MIN_CHART_HEIGHT;

  return (
    <div
      className="rounded-2xl border border-line-soft bg-surface p-5 shadow-sm"
      data-testid="cms-author-stats-table"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-surface-2 text-muted">
          <Users size={16} />
        </span>
        <h2 className="text-sm font-bold text-ink">{t("articleByAuthor")}</h2>
      </div>

      {!data ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-surface-2" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Users size={22} className="text-faint" />
          <p className="text-sm text-muted">{t("noData")}</p>
        </div>
      ) : (
        <div style={{ height: chartHeight }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="var(--color-line-soft)"
              />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "var(--color-muted)" }}
                stroke="var(--color-line)"
              />
              <YAxis
                type="category"
                dataKey="_id"
                width={96}
                tick={{ fontSize: 12, fill: "var(--color-ink)" }}
                stroke="var(--color-line)"
              />
              <Tooltip
                cursor={{ fill: "var(--color-surface-2)" }}
                formatter={(value: number) => [
                  `${value} ${t("articles")}`,
                  t("numberOfArticles"),
                ]}
                contentStyle={{
                  fontSize: 13,
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-line-soft)",
                  borderRadius: 10,
                  color: "var(--color-ink)",
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--color-accent)"
                radius={[0, 6, 6, 0]}
                maxBarSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
