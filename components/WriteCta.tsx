"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NotebookPen, MessagesSquare, Mail, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: NotebookPen,
    titleKey: "ctaFeatureEditorTitle",
    descKey: "ctaFeatureEditorDesc",
  },
  {
    icon: MessagesSquare,
    titleKey: "ctaFeatureDiscussionTitle",
    descKey: "ctaFeatureDiscussionDesc",
  },
  {
    icon: Mail,
    titleKey: "ctaFeatureNewsletterTitle",
    descKey: "ctaFeatureNewsletterDesc",
  },
] as const;

const WriteCta = () => {
  const t = useTranslations("HomePage");
  const tNav = useTranslations("NavBar");

  return (
    // Deliberately fixed dark (not the ink/bg tokens, which flip meaning
    // between themes) — the design keeps this one block dark-on-any-theme,
    // same as its own "khối CTA giữ nền tối" rule for the light variant.
    <div
      className="flex flex-col gap-8 rounded-[20px] border border-white/10 bg-[#16161a] p-8 text-white md:p-10"
      data-testid="write-cta-section"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-[22px] bg-gradient-to-b from-accent to-accent-dark font-display text-4xl font-bold text-white">
          T
        </div>
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-lg bg-white/10 px-3 py-1.5 font-meta text-xs font-medium text-white/70">
            {t("ctaBadge")}
          </span>
          <h2 className="font-display text-[28px] font-bold leading-[1.15] tracking-tight text-white md:text-4xl">
            {t("ctaHeading")}
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed text-white/70">
            {t("ctaDescription")}
          </p>
          <Link
            href="/write"
            className="flex w-fit items-center gap-2 rounded-full bg-gradient-to-b from-accent to-accent-dark px-5 py-2.5 font-cta text-sm font-semibold text-white transition-opacity hover:opacity-90"
            data-testid="write-cta-button"
          >
            {tNav("newPost")}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, titleKey, descKey }) => (
          <div
            key={titleKey}
            className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold tracking-tight text-white">
                {t(titleKey)}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-accent to-accent-dark text-white">
                <Icon size={15} />
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-white/70">
              {t(descKey)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WriteCta;
