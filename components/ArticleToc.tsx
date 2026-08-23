"use client";

import { useEffect, useState } from "react";
import { TocHeading } from "@/lib/postContentToc";
import { cn } from "@/lib/utils";

export default function ArticleToc({
  headings,
  label,
}: {
  headings: TocHeading[];
  label: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2" data-testid="article-toc">
      <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
        {label}
      </span>
      <div className="flex flex-col gap-0.5 border-l border-line">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={cn(
              "-ml-px border-l-2 py-1.5 text-sm transition-colors",
              h.level === 3 ? "pl-6" : "pl-3",
              activeId === h.id
                ? "border-accent font-semibold text-accent-ink"
                : "border-transparent text-muted hover:text-ink"
            )}
          >
            {h.text}
          </a>
        ))}
      </div>
    </div>
  );
}
