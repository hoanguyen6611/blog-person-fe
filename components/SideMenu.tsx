import SearchInput from "@/components/Search";
import { useRouter } from "next/navigation";
import Categories from "./Categories";
import { Checkbox, CheckboxProps } from "antd";
import { useState } from "react";
const SideMenu = () => {
  const router = useRouter();
  const [selectedSort, setSelectedSort] = useState<string | null>();

  const handleChange = (value: string) => {
    console.log(value);
    setSelectedSort((prev) => (prev === value ? null : value));
    router.push(value ? `/posts?sort=${value}` : "/posts");
  };

  return (
    <div>
      <h1 className="mb-4 text-sm font-bold">Search</h1>
      <SearchInput />
      <h1 className="mt-8 mb-4 text-sm font-bold">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <Checkbox
          name="sort"
          onChange={() => handleChange("newest")}
          checked={selectedSort === "newest"}
        >
          <span className="dark:text-gray-400">Newest</span>
        </Checkbox>
        <Checkbox
          name="sort"
          onChange={() => handleChange("popular")}
          checked={selectedSort === "popular"}
        >
          <span className="dark:text-gray-400">Most Popular</span>
        </Checkbox>
        <Checkbox
          name="sort"
          onChange={() => handleChange("trending")}
          checked={selectedSort === "trending"}
        >
          <span className="dark:text-gray-400">Trending</span>
        </Checkbox>
        <Checkbox
          name="sort"
          onChange={() => handleChange("oldest")}
          checked={selectedSort === "oldest"}
        >
          <span className="dark:text-gray-400">Oldest</span>
        </Checkbox>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-bold">Categories</h1>
      <Categories />
    </div>
  );
};

export default SideMenu;
