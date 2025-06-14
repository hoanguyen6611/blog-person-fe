"use client";
import PostList from "@/components/PostList";

const SavePost = () => {
  return (
    <div className="px-10 md:px-16 lg:px-24 lx:px-32 2xl:px-64">
      <h1 className="my-8 text-2xl text-gray-600">Saved Posts</h1>
      <PostList
        apiUrl="users/savedInf"
        showPagination={false}
        useAuthToken={true}
      />
    </div>
  );
};

export default SavePost;
