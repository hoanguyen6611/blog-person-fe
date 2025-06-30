// components/FollowStats.tsx
"use client";

import { UserPlus, Users } from "lucide-react";

type FollowStatsProps = {
  followersCount: number;
  followingCount: number;
};

export default function FollowStats({
  followersCount,
  followingCount,
}: FollowStatsProps) {
  return (
    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
      <div className="flex items-center space-x-1">
        <Users className="w-4 h-4" />
        <span>
          <strong>{followersCount}</strong> followers
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <UserPlus className="w-4 h-4" />
        <span>
          <strong>{followingCount}</strong> following
        </span>
      </div>
    </div>
  );
}
