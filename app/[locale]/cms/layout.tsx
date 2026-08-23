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
    <div
      className="mx-auto flex max-w-[1440px] items-start gap-6 px-4 md:px-6"
      data-testid="cms-layout"
    >
      <Siderbar admin={isAdmin} />
      <div className="flex min-w-0 flex-1 flex-col gap-4 py-6">
        {children}
      </div>
    </div>
  );
}
