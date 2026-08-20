"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import useSWR from "swr";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/api/useswr";
import { Category } from "@/interface/Category";
import SelectOption from "@/components/SelectOption";
import { useAuth } from "@clerk/nextjs";
import { User } from "@/interface/User";
import { useTranslations } from "next-intl";
import { CalendarDays, Search, SearchIcon } from "lucide-react";

const fieldLabel =
  "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block";
const fieldInput =
  "w-full h-11 rounded-xl border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";
const fieldIcon =
  "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";

export default function AdvancedSearchBar() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("AdvancedSearch");
  const { data: dataCategories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);
  const { data: authors } = useSWR(
    () =>
      token
        ? [`${process.env.NEXT_PUBLIC_API_URL}/users/sumUser`, token]
        : null,
    ([url, token]) => fetcherWithTokenUseSWR(url, token)
  );
  const categoryOptions = dataCategories?.categories.map(
    (category: Category) => ({
      value: category._id,
      label: category.title,
    })
  );
  const authorOptions = authors?.users.map((user: User) => ({
    value: user._id,
    label: user.username,
  }));

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (keyword) query.append("search", keyword);
    if (category) query.append("cat", category);
    if (author) query.append("author", author);
    if (fromDate) query.append("from", fromDate);
    if (toDate) query.append("to", toDate);

    router.push(`/posts?${query.toString()}`);
  };
  const changeCategory = (value: string) => {
    setCategory(value);
  };
  const changeAuthor = (value: string) => {
    setAuthor(value);
  };

  return (
    <div className="mx-auto mt-6 max-w-5xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            <SearchIcon size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t("title")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <label className={fieldLabel}>{t("keywordPlaceholder")}</label>
            <div className="relative">
              <Search size={16} className={fieldIcon} />
              <input
                type="text"
                placeholder={t("keywordPlaceholder")}
                className={fieldInput}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <SelectOption
            direction="col"
            name={t("categoryPlaceholder")}
            label={t("categoryLabel")}
            categories={categoryOptions ?? []}
            value={category || undefined}
            onChangeCategory={changeCategory}
          />

          <SelectOption
            direction="col"
            name={t("authorPlaceholder")}
            label={t("authorLabel")}
            categories={authorOptions ?? []}
            value={author || undefined}
            onChangeCategory={changeAuthor}
          />

          <div>
            <label className={fieldLabel}>{t("fromDate")}</label>
            <div className="relative">
              <CalendarDays size={16} className={fieldIcon} />
              <input
                type="date"
                className={fieldInput}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={fieldLabel}>{t("toDate")}</label>
            <div className="relative">
              <CalendarDays size={16} className={fieldIcon} />
              <input
                type="date"
                className={fieldInput}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
        >
          <Search size={18} />
          {t("search")}
        </button>
      </div>
    </div>
  );
}
