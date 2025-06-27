"use client";
import { useUser } from "@clerk/nextjs";
import ImageShow from "@/components/Image";
import PostList from "@/components/PostList";

const UserPersonalPage = () => {
  const { user } = useUser();

  if (!user) return <p className="text-center">You are not signed in.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* 🧑 User Info */}
      <div className="flex items-center gap-6">
        <ImageShow
          src={user.imageUrl || ""}
          alt="Avatar"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <p className="text-gray-600">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      {/* 📝 Posts */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📝 Your Posts</h3>
        <PostList
          apiUrl="posts/user"
          showPagination={false}
          useAuthToken={true}
        />
      </div>
    </div>
  );
};

export default UserPersonalPage;
