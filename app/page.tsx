"use client";

import Banner from "@/components/Banner";
import MainCategories from "@/components/MainCategories";
import FeaturedPostV1 from "@/components/FeaturePostV1";
import PostList from "@/components/PostList";
import { useEffect } from "react";
import { io as clientIO } from "socket.io-client";

export default function Home() {
  return (
    <div className="mt-4 space-y-12">
      <Banner />
      <MainCategories />
      <FeaturedPostV1 />
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-700">
          Recent Posts
        </h2>
        <PostList apiUrl="posts" showPagination />
      </section>
    </div>
  );
}
