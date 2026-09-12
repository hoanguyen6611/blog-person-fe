"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import useSWR from "swr";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { fetcherUseSWR } from "@/api/useswr";
import { ResolvedSiteSettings } from "@/interface/SiteSetting";
import { Category } from "@/interface/Category";
import ImageShow from "./Image";
import { toast } from "react-toastify";

const DEFAULT_SOCIALS = {
  facebook: "https://www.facebook.com/hoahuy2606",
  linkedin: "https://www.linkedin.com/in/hoanguyen6611/",
  github: "https://github.com/hoanguyen6611",
};

const columnHeadingClass =
  "font-meta text-[11px] font-semibold uppercase tracking-wide text-faintest";
const columnLinkClass = "text-sm text-muted transition-colors hover:text-ink";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { data: settings } = useSWR<ResolvedSiteSettings>(
    `${process.env.NEXT_PUBLIC_API_URL}/settings?locale=${locale}`,
    fetcherUseSWR
  );
  const { data: categoriesData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category/getLimit`,
    fetcherUseSWR
  );

  const siteName = settings?.site?.name;
  const description = settings?.site?.footerText || t("description");
  const logo = settings?.site?.logo;
  const categories: Category[] = (categoriesData?.categories ?? []).slice(0, 4);

  const socials = [
    {
      icon: <FaFacebookF />,
      href: settings?.social?.facebook || DEFAULT_SOCIALS.facebook,
      name: "facebook",
    },
    {
      icon: <FaTwitter />,
      href: settings?.social?.twitter,
      name: "twitter",
    },
    {
      icon: <FaInstagram />,
      href: settings?.social?.instagram,
      name: "instagram",
    },
    {
      icon: <FaYoutube />,
      href: settings?.social?.youtube,
      name: "youtube",
    },
    {
      icon: <FaLinkedinIn />,
      href: settings?.social?.linkedin || DEFAULT_SOCIALS.linkedin,
      name: "linkedin",
    },
    {
      icon: <FaGithub />,
      href: settings?.social?.github || DEFAULT_SOCIALS.github,
      name: "github",
    },
  ].filter((s) => s.href);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubscribing) return;
    setIsSubscribing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: newsletterEmail }),
        }
      );
      if (res.ok) {
        toast.success(t("newsletterSuccess"));
        setNewsletterEmail("");
      } else if (res.status === 400) {
        toast.error(t("newsletterInvalidEmail"));
      } else {
        toast.error(t("newsletterError"));
      }
    } catch {
      toast.error(t("newsletterError"));
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="mt-16 border-t border-line bg-surface text-muted">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        {/* Logo + description */}
        <div className="text-center md:text-left">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 font-display text-lg font-bold text-ink md:justify-start"
            data-testid="footer-logo-link"
          >
            {logo && (
              <ImageShow
                src={logo}
                alt={siteName || "logo"}
                width={28}
                height={28}
                className="h-7 w-7 rounded object-cover"
              />
            )}
            {siteName ? (
              siteName
            ) : (
              <>
                Blog<span className="text-accent-ink"> Person</span>
              </>
            )}
          </Link>
          <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-4">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line bg-surface-2 p-2 text-muted transition-colors hover:border-accent hover:bg-accent hover:text-white"
              data-testid={`footer-social-${s.name}-link`}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-line-soft">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-3 md:px-8 lg:grid-cols-6 lg:px-16 xl:px-32 2xl:px-64">
          <div className="flex flex-col gap-3">
            <span className={columnHeadingClass}>{t("contentHeading")}</span>
            <Link href="/posts?sort=newest" className={columnLinkClass}>
              {t("newest")}
            </Link>
            <Link href="/posts?sort=popular" className={columnLinkClass}>
              {t("mostPopular")}
            </Link>
            <Link href="/saved" className={columnLinkClass}>
              {t("saved")}
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className={columnHeadingClass}>{t("categoriesHeading")}</span>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/posts?cat=${cat._id}`}
                className={columnLinkClass}
              >
                {cat.title}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className={columnHeadingClass}>{t("communityHeading")}</span>
            <Link
              href="/write"
              className={`${columnLinkClass} flex items-center gap-1.5`}
            >
              {t("writePost")}
              <span className="rounded-[5px] bg-accent px-1.5 py-0.5 font-meta text-[10px] font-bold text-white">
                {t("newBadge")}
              </span>
            </Link>
            <Link href="/user" className={columnLinkClass}>
              {t("myProfile")}
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className={columnHeadingClass}>{t("aboutHeading")}</span>
            <Link href="/about" className={columnLinkClass}>
              {t("about")}
            </Link>
            <Link href="/contact" className={columnLinkClass}>
              {t("contact")}
            </Link>
            <a href="/feed.xml" className={columnLinkClass}>
              RSS
            </a>
          </div>

          {/* Twice as wide as the link columns at every breakpoint — an
              email input needs real room, not a 1/N link-column's worth. */}
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-3 lg:col-span-2">
            <span className={columnHeadingClass}>{t("newsletterHeading")}</span>
            <p className="text-sm leading-snug text-muted">
              {t("newsletterDescription")}
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col gap-2"
              data-testid="footer-newsletter-form"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t("newsletterPlaceholder")}
                className="h-10 rounded-[10px] border border-line bg-page px-3 text-sm text-ink outline-none placeholder:text-faint focus:border-accent"
                data-testid="footer-newsletter-email-input"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="h-10 rounded-[10px] bg-gradient-to-b from-accent to-accent-dark font-cta text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                data-testid="footer-newsletter-submit-button"
              >
                {isSubscribing
                  ? t("newsletterSubscribing")
                  : t("newsletterSubscribe")}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-4 py-4 text-center font-mono text-xs text-muted">
        © {year} {siteName || "Blog Person"}. {t("rights") || "All rights reserved."}
      </div>
    </footer>
  );
}
