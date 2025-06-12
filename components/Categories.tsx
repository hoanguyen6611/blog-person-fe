import { Category } from "@/interface/Category";
import Link from "next/link";
import useSWR from "swr";
import { fetcherUseSWR } from "../app/api/useswr";

const Categories = () => {
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  return (
    <div className="flex flex-col gap-2 text-sm">
      <Link href="/posts" className="underline">
        All
      </Link>
      {(data?.categories || []).map((category: Category) => (
        <Link
          href={`/posts?cat=${category._id}`}
          className="underline"
          key={category._id}
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
};

export default Categories;
