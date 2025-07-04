import { Category } from "@/interface/Category";
import Link from "next/link";
import useSWR from "swr";
import { fetcherUseSWR } from "../api/useswr";
import { useTranslations } from "next-intl";

const Categories = () => {
  const t = useTranslations("PostDetail");
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  return (
    <div className="flex flex-col gap-2 text-sm">
      <Link href="/posts" className="hover:text-blue-600 font-bold">
        {t("all")}
      </Link>
      {(data?.categories || []).map((category: Category) => (
        <Link
          href={`/posts?cat=${category._id}`}
          key={category._id}
          className="hover:text-blue-600"
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
};

export default Categories;
