"use client";
import { createFromIconfontCN } from "@ant-design/icons";
import { Linkedin } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ShareButtons({ title }: { title: string }) {
  const pathname = usePathname();
  const fullUrl = `https://blog-person-fe.vercel.app${pathname}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
  });

  return (
    <div className="flex gap-3 mt-4">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        <IconFont type="icon-facebook" style={{ color: "#1877F2" }} />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-500 underline"
      >
        <IconFont type="icon-twitter" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 underline"
      >
        <Linkedin size={20} />
      </a>
    </div>
  );
}
