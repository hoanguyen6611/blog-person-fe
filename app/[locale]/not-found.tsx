"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";

export default function NotFound() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/posts?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 bg-white dark:bg-black"
      data-testid="not-found-page"
    >
      <motion.div
        className="text-center space-y-6 max-w-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-400">
          404
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Oops! Trang bạn đang tìm không tồn tại.
        </p>

        <motion.img
          src="https://ik.imagekit.io/cjx1zgaos/undraw_page-not-found_6wni.svg?updatedAt=1751122656195"
          alt="404 illustration"
          className="w-72 mx-auto"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <form onSubmit={handleSearch} className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Tìm bài viết..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-gray-400"
            data-testid="not-found-search-input"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-600 text-white rounded-r-lg hover:bg-slate-700 transition"
            data-testid="not-found-search-button"
          >
            🔍
          </button>
        </form>

        <div className="space-x-4 mt-6">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400 rounded-xl hover:opacity-90 transition"
            data-testid="not-found-home-link"
          >
            ⬅️ Trang chủ
          </Link>
          <Link
            href="/posts"
            className="inline-block px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition"
            data-testid="not-found-posts-link"
          >
            📚 Xem bài viết
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
