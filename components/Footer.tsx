"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const socials = [
    { icon: <FaFacebookF />, href: "https://www.facebook.com/hoahuy2606", name: "facebook" },
    { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/in/hoanguyen6611/", name: "linkedin" },
    { icon: <FaGithub />, href: "https://github.com/hoanguyen6611", name: "github" },
  ];

  return (
    <footer className="mt-16 border-t border-line bg-surface text-muted">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
        {/* Logo + Description */}
        <div className="text-center md:text-left">
          <Link
            href="/"
            className="font-display text-lg font-bold text-ink"
            data-testid="footer-logo-link"
          >
            Blog<span className="text-accent"> Person</span>
          </Link>
          <p className="text-sm mt-1 text-muted max-w-xs">
            {t("description") ||
              "A place to share knowledge, code and stories."}
          </p>
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
        © {year} Blog Person. {t("rights") || "All rights reserved."}
      </div>
    </footer>
  );
}
