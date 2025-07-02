import { useRouter } from "next/navigation";
import { Suspense } from "react";

const SearchInput = () => {
  const router = useRouter();
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = e.currentTarget.value;
      router.push(`/posts?search=${query}`);
    }
  };
  return (
    <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="gray"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      <input
        type="text"
        placeholder="search a post ..."
        className="bg-transparent"
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

const Search = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchInput />
    </Suspense>
  );
};

export default Search;
