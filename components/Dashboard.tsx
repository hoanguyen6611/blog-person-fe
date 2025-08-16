"use client";
import {
  BarChart,
  User,
  Shapes,
  FileText,
  Users,
  UserPlus,
} from "lucide-react";
import { Card, CardContent } from "./Card";
import { useTranslations } from "next-intl";
type DashBoardProps = {
  name: string;
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
};
const DashBoard = ({
  name,
  posts,
  categories,
  views,
  users,
  followers,
  following,
}: DashBoardProps) => {
  const t = useTranslations("Dashboard");
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">📊 {name}</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t("totalPosts")}</p>
              <p className="text-xl font-semibold">{posts?.totalPosts}</p>
            </div>
            <FileText className="w-6 h-6 text-blue-600" />
          </CardContent>
        </Card>

        {users && (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t("totalUsers")}</p>
                <p className="text-xl font-semibold">{users?.totalUsers}</p>
              </div>
              <User className="w-6 h-6 text-green-600" />
            </CardContent>
          </Card>
        )}

        {categories && (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t("totalCategories")}</p>
                <p className="text-xl font-semibold">
                  {categories?.totalCategories}
                </p>
              </div>
              <Shapes className="w-6 h-6 text-yellow-600" />
            </CardContent>
          </Card>
        )}

        {views && (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t("totalViews")}</p>
                <p className="text-xl font-semibold">{views?.totalVisits}</p>
              </div>
              <BarChart className="w-6 h-6 text-red-600" />
            </CardContent>
          </Card>
        )}
        {(followers || followers === 0) && (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t("totalFollowers")}</p>
                <p className="text-xl font-semibold">{followers}</p>
              </div>
              <Users className="w-6 h-6 " />
            </CardContent>
          </Card>
        )}
        {(following || following === 0) && (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t("totalFollowing")}</p>
                <p className="text-xl font-semibold">{following}</p>
              </div>
              <UserPlus className="w-6 h-6" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
