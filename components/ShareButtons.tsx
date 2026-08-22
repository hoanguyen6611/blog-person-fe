"use client";
import { createFromIconfontCN } from "@ant-design/icons";
import { Linkedin } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ShareButtons({ title }: { title: string }) {
  const pathname = usePathname();
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://blog-person-fe.vercel.app";
  const fullUrl = `${origin}${pathname}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
  });

  const iconLinkClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-2 text-muted transition hover:text-ink";

  return (
    <div className="flex gap-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconLinkClass}
        data-testid="share-facebook-link"
      >
        <IconFont type="icon-facebook" style={{ color: "#1877F2" }} />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconLinkClass}
        data-testid="share-twitter-link"
      >
        <IconFont type="icon-twitter" style={{ color: "#0EA5E9" }} />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconLinkClass}
        data-testid="share-linkedin-link"
      >
        <Linkedin size={16} />
      </a>
    </div>
  );
}
