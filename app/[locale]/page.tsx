"use client";

import Banner from "@/components/Banner";
import MainCategories from "@/components/MainCategories";
import RecentPostsList from "@/components/RecentPostsList";
import TrendingWidget from "@/components/TrendingWidget";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="mt-8 space-y-12" data-testid="home-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        data-testid="home-hero-section"
      >
        <Banner />
      </motion.div>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        data-testid="home-categories-section"
      >
        <MainCategories />
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        data-testid="home-recent-posts-section"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
          <RecentPostsList />
          <div className="hidden lg:block lg:sticky lg:top-24">
            <TrendingWidget />
          </div>
        </div>
      </motion.section>
    </div>
  );
}
