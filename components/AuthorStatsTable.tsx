"use client";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";

type AuthorStats = {
  _id: string; // authorId
  count: number;
};

export default function AuthorStatsTable({ data }: { data: AuthorStats[] }) {
  const t = useTranslations("Statistic");
  return (
    <div className="rounded-2xl border border-line-soft bg-surface p-5 shadow-sm">
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
        <table
          className="w-full text-left text-sm"
          data-testid="cms-author-stats-table"
        >
          <thead>
            <tr className="border-b border-line-soft text-xs text-faint">
              <th className="py-2 pr-4 font-medium">#</th>
              <th className="py-2 pr-4 font-medium">{t("author")}</th>
              <th className="py-2 font-medium">{t("numberOfArticles")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((author, index) => (
              <tr key={index} className="border-b border-line-soft last:border-b-0">
                <td className="py-2.5 pr-4 text-faint">{index + 1}</td>
                <td className="py-2.5 pr-4 font-medium text-ink">
                  {author._id || "Unknown"}
                </td>
                <td className="py-2.5 text-muted">{author.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
