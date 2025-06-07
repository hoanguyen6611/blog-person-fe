"use client";
import { useTranslation } from "react-i18next";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
import { useState } from "react";
const PostListPage = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="">
      {t("all-post")}
      <h1 className="mb-8 text-2xl ">Development Blog</h1>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
      >
        {open ? "Close" : "Filter or Search"}
      </button>
      <div className="flex flex-col-reverse gap-8 md:flex-row">
        <div className="w-[80%]">
          <PostList />
        </div>
        <div className={`${open ? "block" : "hidden"} md:block w-[20%]`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
