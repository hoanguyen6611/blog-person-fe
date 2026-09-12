"use client";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useTranslations } from "next-intl";
import { Tags } from "lucide-react";

type Category = {
  _id: string;
  count: number;
};

const COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#6366F1", // indigo
  "#EC4899", // pink
  "#F97316", // orange
  "#22D3EE", // cyan
];

export default function CategoryPieChart({ data }: { data: Category[] }) {
  const t = useTranslations("Statistic");

  // Sorted descending so the pie's biggest wedge starts at 12 o'clock and
  // the legend below reads as a ranked list — both derived from the same
  // order, so a row in the legend always matches the wedge you'd expect.
  const sorted = data
    ? [...data].sort((a, b) => b.count - a.count)
    : undefined;
  const total = sorted?.reduce((sum, item) => sum + item.count, 0) ?? 0;
  const formattedData = sorted?.map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
  }));

  return (
    <div
      className="rounded-2xl border border-line-soft bg-surface p-5 shadow-sm"
      data-testid="cms-category-pie-chart"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-surface-2 text-muted">
          <Tags size={16} />
        </span>
        <h2 className="text-sm font-bold text-ink">{t("articleByCategory")}</h2>
      </div>

      {!data ? (
        <div className="h-64 w-full animate-pulse rounded-xl bg-surface-2" />
      ) : data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
          <Tags size={22} className="text-faint" />
          <p className="text-sm text-muted">{t("noData")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Donut — no on-slice labels (that's what was overlapping and
              clipping past the card edge with 12+ thin slices); the total
              sits in the hole instead, and per-category detail lives only
              in the legend + tooltip. */}
          <div className="relative h-52 w-52 flex-none self-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={96}
                  paddingAngle={1.5}
                  stroke="var(--color-surface)"
                  strokeWidth={2}
                >
                  {formattedData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `${value} ${t("articles")}`,
                    `${t("numberOfArticles")}`,
                  ]}
                  contentStyle={{
                    fontSize: 13,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-line-soft)",
                    borderRadius: 10,
                    color: "var(--color-ink)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-bold text-ink">
                {total}
              </span>
              <span className="text-[11px] text-faint">{t("articles")}</span>
            </div>
          </div>

          {/* Legend — ranked list, each row's own percentage instead of
              cramming it onto the wedge. */}
          <div
            className="flex min-w-0 flex-1 flex-col gap-1.5"
            data-testid="cms-category-pie-legend"
          >
            {sorted!.map((item, index) => {
              const percentage = total
                ? Math.round((item.count / total) * 100)
                : 0;
              return (
                <div
                  key={item._id || index}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="h-2.5 w-2.5 flex-none rounded-full"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="min-w-0 flex-1 truncate text-ink">
                    {item._id || "Unknown"}
                  </span>
                  <span className="flex-none font-mono text-xs text-muted">
                    {item.count}
                  </span>
                  <span className="w-9 flex-none text-right font-mono text-xs text-faint">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
