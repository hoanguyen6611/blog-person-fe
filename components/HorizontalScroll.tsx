"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  const scroll = (offset: number) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="relative flex min-w-0 items-center">
      {canScrollLeft && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent dark:from-gray-800" />
          <button
            aria-label="Scroll left"
            onClick={() => scroll(-150)}
            className="absolute left-0 z-20 hidden -translate-x-1/2 rounded-full bg-white p-1.5 text-gray-600 shadow-md transition hover:scale-110 hover:text-slate-700 dark:bg-gray-700 dark:text-gray-200 sm:flex"
          >
            <ChevronLeft size={16} />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-2 overflow-x-auto scroll-smooth scrollbar-hide"
      >
        {children}
      </div>

      {canScrollRight && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent dark:from-gray-800" />
          <button
            aria-label="Scroll right"
            onClick={() => scroll(150)}
            className="absolute right-0 z-20 hidden translate-x-1/2 rounded-full bg-white p-1.5 text-gray-600 shadow-md transition hover:scale-110 hover:text-slate-700 dark:bg-gray-700 dark:text-gray-200 sm:flex"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}
