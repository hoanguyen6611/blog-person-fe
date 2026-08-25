"use client";
import { useTranslations } from "next-intl";
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

const FollowList = ({
  data,
  loading,
}: {
  data: FollowListData;
  loading: boolean;
}) => {
  const t = useTranslations("FollowList");

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

  if (loading) return <p className="text-sm text-muted">Loading...</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {renderUserList(data?.followers || [], t("followers"))}
      {renderUserList(data?.following || [], t("following"))}
    </div>
  );
};

export default FollowList;
