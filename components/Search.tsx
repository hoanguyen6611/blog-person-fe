import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Suspense } from "react";

const SearchInput = () => {
  const router = useRouter();
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = e.currentTarget.value;
      router.push(`/posts?search=${query}`);
    }
  };
  const t = useTranslations("Common");
  return (
    <div className="bg-surface-2 border border-line p-2 rounded-full flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        className="text-muted shrink-0"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      <input
        type="text"
        placeholder={t("search")}
        className="bg-transparent text-ink placeholder:text-muted text-sm w-full outline-none"
        onKeyDown={handleKeyPress}
        data-testid="search-input"
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
