"use client";

import Banner from "@/components/Banner";
import MainCategories from "@/components/MainCategories";
import FeaturedPostV1 from "@/components/FeaturePostV1";
import PostList from "@/components/PostList";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <div className="mt-8 space-y-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Banner />
      </motion.div>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="mb-6 text-3xl font-semibold text-gray-800 tracking-tight dark:text-gray-400">
          {t("exploreCategories")}
        </h2>
        <MainCategories />
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="mb-6 text-3xl font-semibold text-gray-800 tracking-tight dark:text-gray-400">
          {t("featuredPosts")}
        </h2>
        <FeaturedPostV1 />
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <h2 className="mb-6 text-3xl font-semibold text-gray-800 tracking-tight dark:text-gray-400">
          {t("recentPosts")}
        </h2>
        <PostList apiUrl="posts" showPagination />
      </motion.section>
    </div>
  );
}
