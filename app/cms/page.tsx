"use client";
import useSWR from "swr";
import { fetcherUseSWR } from "../api/useswr";
import DashBoard from "@/components/Dashboard";
import { useUser } from "@clerk/nextjs";

const CMSPage = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin" || false;
  const { data: posts } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts`,
    fetcherUseSWR
  );
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const { data: views } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/sumVisit`,
    fetcherUseSWR
  );
  const { data: users } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/users/sumUser`,
    fetcherUseSWR
  );
  if (!isAdmin) {
    return <div>You are not admin</div>;
  }
  return (
    <div>
      <DashBoard
        name="CMS Statistics"
        posts={posts}
        categories={categories}
        views={views}
        users={users}
      />
    </div>
  );
};

export default CMSPage;
