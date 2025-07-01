"use client";

type AuthorStats = {
  _id: string; // authorId
  count: number;
};

export default function AuthorStatsTable({ data }: { data: AuthorStats[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        👤 Thống kê bài viết theo tác giả
      </h2>

      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="py-1 pr-4">#</th>
            <th className="py-1 pr-4">Tác giả (username)</th>
            <th className="py-1">Số bài viết</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((author, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 pr-4">{index + 1}</td>
              <td className="py-2 pr-4">{author._id || "Không rõ"}</td>
              <td className="py-2">{author.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
