"use client";

import ImageShow from "@/components/Image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { BookOpen, Code2, Newspaper, Sparkles, LucideIcon } from "lucide-react";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  news: Newspaper,
  tutorials: BookOpen,
  notes: Code2,
  reviews: Sparkles,
};

const socials = [
  { icon: <FaFacebookF />, href: "https://www.facebook.com/hoahuy2606", name: "facebook" },
  {
    icon: <FaLinkedinIn />,
    href: "https://www.linkedin.com/in/hoanguyen6611/",
    name: "linkedin",
  },
  { icon: <FaGithub />, href: "https://github.com/hoanguyen6611", name: "github" },
];

interface AboutFeature {
  icon: string;
  title: string;
  desc: string;
}

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const features = t.raw("features") as AboutFeature[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <motion.section
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <ImageShow
          src="https://ik.imagekit.io/cjx1zgaos/IMG_58375.jpeg"
          alt="Nguyen Huy Hoa"
          width={140}
          height={140}
          className="h-36 w-36 rounded-full object-cover ring-4 ring-slate-100 dark:ring-gray-800"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">
            Nguyen Huy Hoa
          </h1>
          <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-400">
            {t("tagline")}
          </p>
        </div>

        <p className="max-w-2xl leading-relaxed text-gray-600 dark:text-gray-400">
          {t("intro")}
        </p>

        <div className="flex items-center gap-3">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-slate-600 hover:text-white dark:bg-gray-800 dark:text-gray-300"
              data-testid={`about-social-${s.name}-link`}
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/posts"
            className="rounded-full bg-slate-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            data-testid="about-view-posts-cta-link"
          >
            {t("ctaPosts")}
          </Link>
          <Link
            href="https://www.hoane.site/"
            className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-slate-600 hover:text-slate-600 dark:border-gray-700 dark:text-gray-300"
            data-testid="about-view-profile-cta-link"
          >
            {t("ctaInfo")}
          </Link>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-20"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {t("sectionTitle")}
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => {
            const Icon = FEATURE_ICONS[feature.icon] ?? Sparkles;
            return (
              <div
                key={i}
                className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
                data-testid={`about-feature-card-${i}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
