"use client";

import ImageShow from "@/components/Image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { BookOpen, Code2, Newspaper, Sparkles, LucideIcon } from "lucide-react";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { PostListResponse } from "@/interface/APIResponse";
import { Category } from "@/interface/Category";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  news: Newspaper,
  tutorials: BookOpen,
  notes: Code2,
  reviews: Sparkles,
};

const socials = [
  {
    icon: <FaFacebookF />,
    href: "https://www.facebook.com/hoahuy2606",
    label: "Facebook",
    name: "facebook",
  },
  {
    icon: <FaLinkedinIn />,
    href: "https://www.linkedin.com/in/hoanguyen6611/",
    label: "LinkedIn",
    name: "linkedin",
  },
  {
    icon: <FaGithub />,
    href: "https://github.com/hoanguyen6611",
    label: "GitHub",
    name: "github",
  },
];

interface AboutFeature {
  icon: string;
  title: string;
  desc: string;
}

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const features = t.raw("features") as AboutFeature[];

  const { data: postsData } = useSWR<PostListResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?limit=1`,
    fetcherUseSWR
  );
  const { data: categoriesData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const { data: oldestData } = useSWR<PostListResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?limit=1&sort=oldest`,
    fetcherUseSWR
  );

  const activeSinceYear = oldestData?.posts?.[0]?.createdAt
    ? new Date(oldestData.posts[0].createdAt).getFullYear()
    : undefined;

  const stats = [
    { label: t("statPosts"), value: postsData?.totalPosts },
    { label: t("statCategories"), value: categoriesData?.categories?.length },
    { label: t("statActiveSince"), value: activeSinceYear },
  ];
  const topics: Category[] = categoriesData?.categories ?? [];

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
          className="h-36 w-36 rounded-full object-cover ring-4 ring-surface-2"
        />

        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Nguyen Huy Hoa
          </h1>
          <p className="mt-2 text-lg font-medium text-muted">{t("tagline")}</p>
        </div>

        <p className="max-w-2xl leading-relaxed text-muted">{t("intro")}</p>

        <div className="grid w-full max-w-md grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line-soft bg-surface p-3.5 shadow-sm"
              data-testid={`about-stat-${stat.label}`}
            >
              <span className="block font-display text-xl font-bold tracking-tight text-ink">
                {stat.value ?? "—"}
              </span>
              <span className="font-meta text-xs text-muted">{stat.label}</span>
            </div>
          ))}
        </div>

        {topics.length > 0 && (
          <div className="flex flex-col items-center gap-2 pt-2">
            <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
              {t("topicsLabel")}
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {topics.map((topic) => (
                <span
                  key={topic._id}
                  className="rounded-full border border-line px-3 py-1 text-sm text-muted"
                >
                  {topic.title}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/posts"
            className="rounded-[12px] bg-gradient-to-b from-accent to-accent-dark px-6 py-2.5 font-cta text-sm font-medium text-white transition hover:opacity-90"
            data-testid="about-view-posts-cta-link"
          >
            {t("ctaPosts")}
          </Link>
          <Link
            href="https://www.hoane.site/"
            className="rounded-[12px] border border-line px-6 py-2.5 font-cta text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
            data-testid="about-view-profile-cta-link"
          >
            {t("ctaInfo")}
          </Link>
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-[12px] border border-line px-4 py-2.5 font-cta text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
              data-testid={`about-social-${s.name}-link`}
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-20"
      >
        <h2 className="text-center font-display text-2xl font-bold tracking-tight text-ink">
          {t("sectionTitle")}
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((feature, i) => {
            const Icon = FEATURE_ICONS[feature.icon] ?? Sparkles;
            return (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-line-soft bg-surface p-6 shadow-sm"
                data-testid={`about-feature-card-${i}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-display font-semibold tracking-tight text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
