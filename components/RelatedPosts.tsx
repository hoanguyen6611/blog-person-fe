import Link from "next/link";
import { RelatedPost } from "@/interface/RelatedPost";
import ImageShow from "./Image";

export default function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  if (!posts) return null;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">📚 Bài viết liên quan</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {posts?.map((post) => (
          <Link
            href={`/posts/${post._id}`}
            key={post._id}
            className="group rounded-lg overflow-hidden"
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
              <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                No image
              </div>
            )}
            <div className="p-3">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-blue-600">
                {post.title}
              </h4>
              {/* <p className="text-xs text-gray-500 mt-1">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </p> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
