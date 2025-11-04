"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const socials = [
    { icon: <FaFacebookF />, href: "https://facebook.com/huyhoa.dev" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com/in/huyhoa" },
    { icon: <FaGithub />, href: "https://github.com/nguyenhuyhoa" },
  ];

  return (
    <footer className="bg-neutral-900 text-gray-300 mt-16 border-t border-neutral-700">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
        {/* Logo + Description */}
        <div className="text-center md:text-left">
          <Link href="/" className="text-xl font-bold text-white">
            Blog<span className="text-blue-500"> Person</span>
          </Link>
          <p className="text-sm mt-1 text-gray-400 max-w-xs">
            {t("description") ||
              "A place to share knowledge, code and stories."}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/about" className="hover:text-blue-400 transition">
            {t("about") || "About"}
          </Link>
          <Link href="/contact" className="hover:text-blue-400 transition">
            {t("contact") || "Contact"}
          </Link>
          <Link href="/privacy" className="hover:text-blue-400 transition">
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
              className="p-2 bg-neutral-800 rounded-full hover:bg-blue-500 hover:text-white transition"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="text-center py-4 border-t border-neutral-800 text-sm text-gray-500">
        © {year} Blog Person. {t("rights") || "All rights reserved."}
      </div>
    </footer>
  );
}
