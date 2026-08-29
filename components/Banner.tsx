"use client";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import useSWR from "swr";
import { fetcherUseSWR } from "@/api/useswr";
import { ResolvedSiteSettings } from "@/interface/SiteSetting";
import ImageShow from "./Image";
import { ArrowRight } from "lucide-react";

const CTALink = ({
  href,
  className,
  testId,
  children,
}: {
  href: string;
  className: string;
  testId: string;
  children: React.ReactNode;
}) => {
  if (/^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-testid={testId}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} data-testid={testId}>
      {children}
    </Link>
  );
};

const Banner = () => {
  const t = useTranslations("Banner");
  const locale = useLocale();
  const { data: settings } = useSWR<ResolvedSiteSettings>(
    `${process.env.NEXT_PUBLIC_API_URL}/settings?locale=${locale}`,
    fetcherUseSWR
  );

  const banner = settings?.banner;
  const eyebrow = banner?.eyebrow || "Tech News";
  const title = banner?.title || t("title");
  const description = banner?.subtitle || t("description");
  const primaryText = banner?.primaryButtonText || t("startWriting");
  const primaryLink = banner?.primaryButtonLink || "/write";
  const secondaryText = banner?.secondaryButtonText || t("explorePosts");
  const secondaryLink = banner?.secondaryButtonLink || "/posts";

  return (
    <div
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden"
      data-testid="banner-hero"
    >
      {/* Full-bleed background */}
      <div className="absolute inset-0 -z-10">
        {banner?.image ? (
          <ImageShow
            src={banner.image}
            alt=""
            width={2880}
            height={1040}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink to-surface-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
      </div>

      <div className="mx-auto flex min-h-[420px] max-w-7xl flex-col justify-center px-4 py-16 sm:min-h-[460px] md:px-8 lg:min-h-[520px] lg:px-16 xl:px-32 2xl:px-64">
        <div className="flex max-w-[640px] flex-col gap-5">
          <span className="w-fit rounded-full bg-white/15 px-3 py-1 font-mono text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm">
            {eyebrow}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight text-white text-balance">
            {title}
          </h1>
          <p className="text-lg text-white/80">{description}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <CTALink
              href={primaryLink}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-cta text-sm font-semibold text-neutral-900 hover:opacity-90"
              testId="banner-start-writing-button"
            >
              {primaryText}
              <ArrowRight size={16} />
            </CTALink>
            <CTALink
              href={secondaryLink}
              className="rounded-full border border-white/40 px-6 py-3 font-cta text-sm font-semibold text-white hover:bg-white/10"
              testId="banner-explore-posts-button"
            >
              {secondaryText}
            </CTALink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
