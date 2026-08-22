import { Link } from "@/i18n/navigation";
import { RelatedPost } from "@/interface/RelatedPost";
import ImageShow from "./Image";
import { useTranslations } from "next-intl";

export default function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  const t = useTranslations("PostDetail");
  if (!posts) return null;

  return (
    <div className="container mx-auto px-4 lg:px-8 mt-10">
      <h3 className="font-display text-lg font-bold text-ink mb-4">
        {t("relatedPosts")}
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {posts?.map((post) => (
          <Link
            href={`/posts/${post._id}`}
            key={post._id}
            className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition hover:shadow-md"
            data-testid={`related-post-${post._id}`}
          >
            {post.img ? (
              <ImageShow
                src={post.img}
                alt={post.title}
                width={400}
                height={250}
                className="h-40 w-full object-cover transition group-hover:scale-105"
              />
            ) : (
              <div className="h-40 bg-surface-2 flex items-center justify-center text-muted text-sm">
                No image
              </div>
            )}
            <div className="p-3">
              <h4 className="font-display text-sm font-semibold line-clamp-2 text-ink group-hover:text-accent-ink">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
