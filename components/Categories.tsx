import { Category } from "@/interface/Category";
import { Link } from "@/i18n/navigation";
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
    <div className="flex flex-col gap-2 text-sm text-muted">
      <Link
        href="/posts"
        className="font-semibold text-ink hover:text-accent-ink"
        data-testid="categories-link-all"
      >
        {t("all")}
      </Link>
      {(data?.categories || []).map((category: Category) => (
        <Link
          href={`/posts?cat=${category._id}`}
          key={category._id}
          className="hover:text-accent-ink"
          data-testid={`categories-link-${category._id}`}
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
};

export default Categories;
