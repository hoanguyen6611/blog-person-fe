"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/api/useswr";
import { Category } from "@/interface/Category";
import SelectOption from "@/components/SelectOption";
import { useAuth } from "@clerk/nextjs";
import { User } from "@/interface/User";

export default function AdvancedSearchBar() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const { data: dataCategories, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);
  const { data: authors, mutate: mutateAuthors } = useSWR(
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
    <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <input
        type="text"
        placeholder="Từ khóa"
        className="input border p-2 border-gray-300 rounded-lg"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <SelectOption
        name="Select a category"
        label="Danh mục"
        categories={categoryOptions}
        onChangeCategory={changeCategory}
      />
      <SelectOption
        name="Select a author"
        label="Tác giả"
        categories={authorOptions}
        onChangeCategory={changeAuthor}
      />
      <input
        type="date"
        className="input border p-2 border-gray-300 rounded-lg"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <input
        type="date"
        className="input border p-2 border-gray-300 rounded-lg"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="btn btn-primary col-span-full border p-2 border-gray-300 rounded-lg bg-blue-500 text-gray-200"
      >
        Tìm kiếm
      </button>
    </div>
  );
}
