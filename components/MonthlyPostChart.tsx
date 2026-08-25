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
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";

type DataPoint = {
  _id: string; // YYYY-MM
  count: number;
};

export default function MonthlyPostChart({
  data,
  label,
  nameOfYAxis,
}: {
  data: DataPoint[];
  label: string;
  nameOfYAxis: string;
}) {
  const t = useTranslations("Statistic");
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    const yearNow = new Date().getFullYear().toString();
    return yearNow;
  });

  const allYears = Array.from(
    new Set(data?.map((d) => d._id.split("-")[0]))
  ).sort((a, b) => Number(b) - Number(a));

  const filteredData = data
    ?.filter((item) => item._id.startsWith(selectedYear))
    .map((item) => ({
      ...item,
      month: item._id.split("-")[1],
    }));

  return (
    <div
      className="rounded-2xl border border-line-soft bg-surface p-5 shadow-sm"
      data-testid="cms-monthly-post-chart"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-surface-2 text-muted">
            <CalendarDays size={16} />
          </span>
          <h2 className="text-sm font-bold text-ink">
            {label} <span className="text-muted">({selectedYear})</span>
          </h2>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="h-8 rounded-lg border border-line bg-page px-2 text-xs text-ink outline-none focus:border-accent"
        >
          {allYears.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
      </div>

      {!data ? (
        <div className="h-72 w-full animate-pulse rounded-xl bg-surface-2" />
      ) : filteredData?.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center gap-2 text-center">
          <CalendarDays size={22} className="text-faint" />
          <p className="text-sm text-muted">{t("noData")}</p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-line-soft)"
              />
              <XAxis
                dataKey="month"
                label={{ value: t("month"), position: "bottom", offset: 10 }}
                tick={{ fontSize: 12, fill: "var(--color-muted)" }}
                stroke="var(--color-line)"
              />
              <YAxis
                allowDecimals={false}
                label={{
                  value: nameOfYAxis,
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { textAnchor: "middle", fill: "var(--color-muted)" },
                }}
                tick={{ fontSize: 12, fill: "var(--color-muted)" }}
                stroke="var(--color-line)"
              />
              <Tooltip
                cursor={{ fill: "var(--color-surface-2)" }}
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
                radius={[8, 8, 0, 0]}
                maxBarSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
