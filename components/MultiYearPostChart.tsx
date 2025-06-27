"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useMemo } from "react";

type RawPoint = {
  _id: string; // YYYY-MM
  count: number;
};

export default function MultiYearPostChart({ data }: { data: RawPoint[] }) {
  // Format về dạng { month: "01", "2023": 5, "2024": 3 }
  const mergedData = useMemo(() => {
    const byMonth: { [key: string]: any } = {};

    data.forEach(({ _id, count }) => {
      const [year, month] = _id.split("-");
      if (!byMonth[month]) byMonth[month] = { month };
      byMonth[month][year] = count;
    });

    return Object.values(byMonth).sort(
      (a, b) => Number(a.month) - Number(b.month)
    );
  }, [data]);

  const years = Array.from(
    new Set(data.map((item) => item._id.split("-")[0]))
  ).sort();

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        📊 So sánh bài viết theo tháng giữa các năm
      </h2>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              label={{ value: "Tháng", offset: 5, position: "bottom" }}
            />
            <YAxis
              allowDecimals={false}
              label={{ value: "Số bài", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            {years.map((year, index) => (
              <Bar
                key={year}
                dataKey={year}
                fill={colors[index % colors.length]}
                name={`Năm ${year}`}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
