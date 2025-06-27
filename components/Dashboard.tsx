"use client";
import { BarChart, User, Folder, FileText } from "lucide-react";
import { Card, CardContent } from "./Card";

type DashBoardProps = {
  name: string;
  posts: any;
  categories?: any;
  views?: any;
  users?: any;
};
const DashBoard = ({
  name,
  posts,
  categories,
  views,
  users,
}: DashBoardProps) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">📊 {name}</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total posts</p>
              <p className="text-xl font-semibold">{posts?.totalPosts}</p>
            </div>
            <FileText className="w-6 h-6 text-blue-600" />
          </CardContent>
        </Card>

        {users && (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Users</p>
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
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-xl font-semibold">
                  {categories?.totalCategories}
                </p>
              </div>
              <Folder className="w-6 h-6 text-yellow-600" />
            </CardContent>
          </Card>
        )}

        {views && (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Views</p>
                <p className="text-xl font-semibold">{views?.totalVisits}</p>
              </div>
              <BarChart className="w-6 h-6 text-red-600" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
