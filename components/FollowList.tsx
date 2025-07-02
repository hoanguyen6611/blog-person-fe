"use client";
import useSWR from "swr";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import ImageShow from "./Image";

type UserItem = {
  _id: string;
  username: string;
  fullname: string;
  img?: string;
};

const FollowList = ({ data, loading }: { data: any; loading: boolean }) => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);

  const { data: followers, isLoading: loadingFollowers } = useSWR(
    () => (token ? ["/users/followers", token] : null),
    ([url, token]) =>
      fetcherWithTokenUseSWR(`${process.env.NEXT_PUBLIC_API_URL}${url}`, token)
  );

  // const { data: following, isLoading: loadingFollowing } = useSWR(
  //   () => (token ? ["/users/following", token] : null),
  //   ([url, token]) =>
  //     fetcherWithTokenUseSWR(`${process.env.NEXT_PUBLIC_API_URL}${url}`, token)
  // );
  // const { data, isLoading: loading } = useSWR(
  //   () =>
  //     token ? [`${process.env.NEXT_PUBLIC_API_URL}/users/follow`, token] : null,
  //   ([url, token]) => fetcherWithTokenUseSWR(url, token)
  // );

  const renderUserList = (users: UserItem[], title: string) => (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-gray-500">No users.</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-sm"
            >
              <ImageShow
                src={user.img || "/default-avatar.png"}
                alt={user.username}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-gray-500 text-sm">{user.fullname}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {renderUserList(data?.followers || [], "👥 Người đang theo dõi bạn")}
          {renderUserList(data?.following || [], "🚶‍♂️ Bạn đang theo dõi")}
        </>
      )}
    </div>
  );
};

export default FollowList;
