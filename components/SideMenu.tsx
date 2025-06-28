import SearchInput from "@/components/Search";
import { useRouter } from "next/navigation";
import Categories from "./Categories";
import { Checkbox, CheckboxProps } from "antd";
const SideMenu = () => {
  const router = useRouter();
  const onChange: CheckboxProps["onChange"] = (e) => {
    router.push(`/posts?sort=${e.target.value}`);
  };
  return (
    <div>
      <h1 className="mb-4 text-sm font-bold">Search</h1>
      <SearchInput />
      <h1 className="mt-8 mb-4 text-sm font-bold">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <Checkbox name="sort" onChange={onChange} value="newest">
          Newest
        </Checkbox>
        <Checkbox name="sort" onChange={onChange} value="popular">
          Most Popular
        </Checkbox>
        <Checkbox name="sort" onChange={onChange} value="trending">
          Trending
        </Checkbox>
        <Checkbox name="sort" onChange={onChange} value="oldest">
          Oldest
        </Checkbox>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-bold">Categories</h1>
      <Categories />
    </div>
  );
};

export default SideMenu;
