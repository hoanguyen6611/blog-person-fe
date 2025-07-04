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

type DataPoint = {
  _id: string; // YYYY-MM
  count: number;
};

export default function MonthlyPostChart({ data }: { data: DataPoint[] }) {
  const t = useTranslations("Statistic");
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    const yearNow = new Date().getFullYear().toString();
    return yearNow;
  });

  // Lọc danh sách năm có trong data
  const allYears = Array.from(
    new Set(data?.map((d) => d._id.split("-")[0]))
  ).sort((a, b) => Number(b) - Number(a));

  const filteredData = data
    ?.filter((item) => item._id.startsWith(selectedYear))
    .map((item) => ({
      ...item,
      month: item._id.split("-")[1], // chỉ lấy MM
    }));

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          📅 {t("articlesByMonth")} ({selectedYear})
        </h2>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {allYears.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              label={{ value: t("month"), position: "bottom", offset: 10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              label={{
                value: t("numberOfArticles"),
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { textAnchor: "middle" },
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              contentStyle={{ fontSize: 13 }}
            />
            <Bar
              dataKey="count"
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
