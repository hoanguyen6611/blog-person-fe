"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import ImageShow from "@/components/Image";
import PostList from "@/components/PostList";
import { useParams } from "next/navigation";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import useSWR from "swr";

const UserPage = () => {
  const params = useParams();
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const { data } = useSWR(
    isSignedIn && params?.id ? [`post`, params.id] : null,
    async ([, id]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        token!
      );
    }
  );
  if (!user) return <p className="text-center">You are not signed in.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* 🧑 User Info */}
      <div className="flex items-center gap-6">
        <ImageShow
          src={data?.img || ""}
          alt="Avatar"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{data?.username}</h2>
          <p className="text-gray-600">{data?.email}</p>
        </div>
      </div>

      {/* 📝 Posts */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📝 Your Posts</h3>
        <PostList
          apiUrl={`posts/user/${params.id}`}
          showPagination={false}
          useAuthToken={true}
        />
      </div>
    </div>
  );
};

export default UserPage;
