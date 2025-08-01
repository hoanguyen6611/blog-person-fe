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
    <div className="bg-white p-6 rounded-xl shadow mt-8 dark:text-gray-400 dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        🏷️ {t("articleByCategory")}
      </h2>

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
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        {t("total")}: {total} {t("articles")}
      </p>
    </div>
  );
}
