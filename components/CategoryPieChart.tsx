"use client";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
  const total = data?.reduce((sum, item) => sum + item.count, 0);
  const t = useTranslations("Statistic");
  const formattedData = data?.map((item) => ({
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
        <div className="h-80 w-full animate-pulse rounded-xl bg-surface-2" />
      ) : data.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center gap-2 text-center">
          <Tags size={22} className="text-faint" />
          <p className="text-sm text-muted">{t("noData")}</p>
        </div>
      ) : (
        <>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => {
                    const totalCount = data.reduce(
                      (sum, item) => sum + item.count,
                      0
                    );
                    const percentage = Math.round(
                      ((value || 0) / totalCount) * 100
                    );
                    return `${name}: ${percentage}%`;
                  }}
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
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: 12, color: "var(--color-muted)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-4 text-sm text-muted">
            {t("total")}: {total} {t("articles")}
          </p>
        </>
      )}
    </div>
  );
}
