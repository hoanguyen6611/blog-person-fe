"use client";
import Siderbar from "@/components/Sidebar";
import "./cms.css";
import { useUser } from "@clerk/nextjs";

export default function CMSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin" || false;
  return (
    <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
      <Siderbar admin={isAdmin} />
      <div className="mt-4 flex flex-col gap-4 ml-[100px] w-full">
        {children}
      </div>
    </div>
  );
}
