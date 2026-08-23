"use client";
import {
  BarChart,
  User,
  Shapes,
  FileText,
  Users,
  UserPlus,
  CalendarClock,
} from "lucide-react";
import { useTranslations } from "next-intl";

const StatCard = ({
  label,
  value,
  icon,
  testId,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  testId?: string;
}) => (
  <div
    className="flex items-center justify-between rounded-2xl border border-line-soft bg-surface p-4 shadow-sm"
    data-testid={testId}
  >
    <div className="flex flex-col gap-1">
      <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
        {label}
      </span>
      <span className="font-display text-2xl font-bold tracking-tight text-ink">
        {value}
      </span>
    </div>
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted">
      {icon}
    </div>
  </div>
);
type DashBoardProps = {
  name: string;
  subtitle?: string;
  posts: {
    totalPosts: number;
  };
  categories?: {
    totalCategories: number;
  };
  views?: {
    totalVisits: number;
  };
  users?: {
    totalUsers: number;
  };
  followers?: number;
  following?: number;
  scheduled?: number;
};
const DashBoard = ({
  name,
  subtitle,
  posts,
  categories,
  views,
  users,
  followers,
  following,
  scheduled,
}: DashBoardProps) => {
  const t = useTranslations("Dashboard");
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
          {name}
        </h1>
        {subtitle && (
          <p
            className="font-meta text-sm text-faint"
            data-testid="cms-dashboard-subtitle"
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          testId="cms-dashboard-total-posts"
          label={t("totalPosts")}
          value={posts?.totalPosts}
          icon={<FileText size={18} />}
        />

        {users && (
          <StatCard
            testId="cms-dashboard-total-users"
            label={t("totalUsers")}
            value={users?.totalUsers}
            icon={<User size={18} />}
          />
        )}

        {categories && (
          <StatCard
            testId="cms-dashboard-total-categories"
            label={t("totalCategories")}
            value={categories?.totalCategories}
            icon={<Shapes size={18} />}
          />
        )}

        {views && (
          <StatCard
            testId="cms-dashboard-total-views"
            label={t("totalViews")}
            value={views?.totalVisits}
            icon={<BarChart size={18} />}
          />
        )}
        {(followers || followers === 0) && (
          <StatCard
            testId="cms-dashboard-total-followers"
            label={t("totalFollowers")}
            value={followers}
            icon={<Users size={18} />}
          />
        )}
        {(following || following === 0) && (
          <StatCard
            testId="cms-dashboard-total-following"
            label={t("totalFollowing")}
            value={following}
            icon={<UserPlus size={18} />}
          />
        )}
        {(scheduled || scheduled === 0) && (
          <StatCard
            testId="cms-dashboard-total-scheduled"
            label={t("totalScheduled")}
            value={scheduled}
            icon={<CalendarClock size={18} />}
          />
        )}
      </div>
    </div>
  );
};

export default DashBoard;
