"use client";

import { useRef } from "react";

export default function HorizontalScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll(-150)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-black shadow-md rounded-full p-2 hover:scale-95 transition hidden sm:block"
      >
        ◀
      </button>
      <button
        onClick={() => scroll(150)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-black shadow-md rounded-full p-2 hover:scale-110 transition hidden sm:block"
      >
        ▶
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-10 py-4 scroll-smooth scrollbar-hide"
      >
        {children}
      </div>
    </div>
  );
}
