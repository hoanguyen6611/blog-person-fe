"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import ImageShow from "./Image";

type UserItem = {
  _id: string;
  username: string;
  fullname: string;
  img?: string;
};

type FollowListData = {
  followers?: UserItem[];
  following?: UserItem[];
};

const tabPillClass = (active: boolean) =>
  cn(
    "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
    active ? "bg-ink text-bg" : "border border-line text-muted"
  );

const UserRow = ({ user }: { user: UserItem }) => (
  <div
    className="flex items-center gap-3"
    data-testid={`follow-list-item-${user._id}`}
  >
    <ImageShow
      src={user.img || "/default-avatar.png"}
      alt={user.username}
      width={36}
      height={36}
      className="h-9 w-9 flex-none rounded-full object-cover"
    />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-ink">
        {user.username}
      </p>
      <p className="truncate text-xs text-muted">{user.fullname}</p>
    </div>
  </div>
);

const FollowList = ({
  data,
  loading,
  variant = "grid",
}: {
  data: FollowListData;
  loading: boolean;
  variant?: "grid" | "tabs";
}) => {
  const t = useTranslations("FollowList");
  const [tab, setTab] = useState<"followers" | "following">("followers");

  if (loading) return <p className="text-sm text-muted">Loading...</p>;

  if (variant === "tabs") {
    const followers = data?.followers || [];
    const following = data?.following || [];
    const activeUsers = tab === "followers" ? followers : following;
    return (
      <div className="flex flex-col gap-3" data-testid="follow-list-tabs">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setTab("followers")}
            className={tabPillClass(tab === "followers")}
            data-testid="follow-list-tab-followers"
          >
            {t("followers")} ({followers.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("following")}
            className={tabPillClass(tab === "following")}
            data-testid="follow-list-tab-following"
          >
            {t("following")} ({following.length})
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {activeUsers.length === 0 ? (
            <p className="text-sm text-muted">{t("empty")}</p>
          ) : (
            activeUsers.map((user) => <UserRow key={user._id} user={user} />)
          )}
        </div>
      </div>
    );
  }

  const renderUserList = (users: UserItem[], title: string) => (
    <div className="flex flex-col gap-3">
      <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
        {title}
      </span>
      <div className="flex flex-col gap-2.5">
        {users.length === 0 ? (
          <p className="text-sm text-muted">{t("empty")}</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 rounded-2xl border border-line-soft bg-surface p-3 shadow-sm"
              data-testid={`follow-list-item-${user._id}`}
            >
              <ImageShow
                src={user.img || "/default-avatar.png"}
                alt={user.username}
                width={40}
                height={40}
                className="h-10 w-10 flex-none rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {user.username}
                </p>
                <p className="truncate text-xs text-muted">{user.fullname}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {renderUserList(data?.followers || [], t("followers"))}
      {renderUserList(data?.following || [], t("following"))}
    </div>
  );
};

export default FollowList;
