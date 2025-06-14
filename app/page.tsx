"use client";
import MainCategories from "../components/MainCategories";
import FeaturedPost from "../components/FeaturedPost";
import PostList from "../components/PostList";
import Banner from "@/components/Banner";

export default function Home() {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <Banner />
      <MainCategories />
      <FeaturedPost />
      <div className="">
        <h1 className="my-8 text-2xl text-gray-600">Recent Posts</h1>
        <PostList apiUrl="posts" showPagination={true} />
      </div>
    </div>
  );
}
