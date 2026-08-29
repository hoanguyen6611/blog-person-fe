"use client";

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
import ImageShow from "./Image";

const DEFAULT_SOCIALS = {
  facebook: "https://www.facebook.com/hoahuy2606",
  linkedin: "https://www.linkedin.com/in/hoanguyen6611/",
  github: "https://github.com/hoanguyen6611",
};

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const { data: settings } = useSWR<ResolvedSiteSettings>(
    `${process.env.NEXT_PUBLIC_API_URL}/settings?locale=${locale}`,
    fetcherUseSWR
  );

  const siteName = settings?.site?.name;
  const description = settings?.site?.footerText || t("description");
  const logo = settings?.site?.logo;

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

  return (
    <footer className="mt-16 border-t border-line bg-surface text-muted">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
        {/* Logo + Description */}
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
                Blog<span className="text-accent"> Person</span>
              </>
            )}
          </Link>
          <p className="text-sm mt-1 text-muted max-w-xs">{description}</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link
            href="/about"
            className="hover:text-ink transition"
            data-testid="footer-about-link"
          >
            {t("about") || "About"}
          </Link>
          <Link
            href="/contact"
            className="hover:text-ink transition"
            data-testid="footer-contact-link"
          >
            {t("contact") || "Contact"}
          </Link>
          <Link
            href="/privacy"
            className="hover:text-ink transition"
            data-testid="footer-privacy-link"
          >
            {t("privacy") || "Privacy Policy"}
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-line bg-surface-2 text-muted hover:bg-accent hover:text-white hover:border-accent transition"
              data-testid={`footer-social-${s.name}-link`}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="text-center py-4 border-t border-line font-mono text-xs text-muted">
        © {year} {siteName || "Blog Person"}. {t("rights") || "All rights reserved."}
      </div>
    </footer>
  );
}
