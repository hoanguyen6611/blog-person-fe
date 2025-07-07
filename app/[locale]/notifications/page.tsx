"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { format } from "timeago.js";
import Link from "next/link";
import { Notification } from "@/interface/Notification";
import { Button, Empty } from "antd";
import { Heart, MessageCircle, UserPlus, Newspaper } from "lucide-react";

export default function NotificationsPage() {
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);

  const { data: notifications = [], mutate } = useSWR(
    token
      ? [`${process.env.NEXT_PUBLIC_API_URL}/notifications/all`, token]
      : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
  );

  const markAsRead = async (id: string) => {
    const token = await getToken();
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    mutate();
  };

  const markAllAsRead = async () => {
    const token = await getToken();
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/readAll`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    mutate();
  };
  if (!isSignedIn) return <p>You are not logged in</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🔔 Thông báo của bạn</h1>
        <Button type="default" onClick={markAllAsRead}>
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      {notifications.length === 0 ? (
        <Empty description="Không có thông báo nào" />
      ) : (
        <ul className="space-y-4">
          {notifications.map((n: Notification) => (
            <li
              key={n._id}
              className={`p-4 rounded-lg flex gap-4 items-start ${
                n.isRead ? "bg-white text-gray-500" : "bg-blue-50 font-semibold"
              }`}
            >
              {/* ICON theo loại */}
              <div className="mt-1">
                {n.type === "comment" && (
                  <MessageCircle className="text-blue-500" size={20} />
                )}
                {n.type === "like" && (
                  <Heart className="text-pink-500" size={20} />
                )}
                {n.type === "follow" && (
                  <UserPlus className="text-green-500" size={20} />
                )}
                {n.type === "post" && (
                  <Newspaper className="text-green-500" size={20} />
                )}
              </div>

              {/* Nội dung */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <Link
                    href={n.postId ? `/posts/${n.postId}` : "/user"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {n.message}
                  </Link>
                  {!n.isRead && (
                    <Button
                      size="small"
                      type="link"
                      onClick={() => markAsRead(n._id)}
                    >
                      Đánh dấu đã đọc
                    </Button>
                  )}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {format(n.createdAt)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
