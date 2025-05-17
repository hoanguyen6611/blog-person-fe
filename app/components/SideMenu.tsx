import SearchInput from "@/app/components/Search";
import Link from "next/link";
const SideMenu = () => {
  return (
    <div>
      <h1 className="mb-4 text-sm font-bold">Search</h1>
      <SearchInput />
      <h1 className="mt-8 mb-4 text-sm font-bold">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Newest
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="most-popular"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Most Popular
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Trending
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Oldest
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-bold">Categories</h1>
      <div className="flex flex-col gap-2 text-sm">
        <Link href="/posts" className="underline">
          All
        </Link>
        <Link href="/posts?cat=web-design" className="underline">
          Web Design
        </Link>
        <Link href="/posts?cat=web-development" className="underline">
          Web Development
        </Link>
        <Link href="/posts?cat=database" className="underline">
          Database
        </Link>
        <Link href="/posts?cat=ai" className="underline">
          AI
        </Link>
        <Link href="/posts?cat=security" className="underline">
          Security
        </Link>
        <Link href="/posts?cat=marketing" className="underline">
          Marketing
        </Link>
        <Link href="/posts?cat=business" className="underline">
          Business
        </Link>
      </div>
    </div>
  );
};

export default SideMenu;
