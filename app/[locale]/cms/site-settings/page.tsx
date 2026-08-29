"use client";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import useSWR from "swr";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { fetcherUseSWR } from "@/api/useswr";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import UploadV1 from "@/components/UploadV1";
import ImageShow from "@/components/Image";
import { cn } from "@/lib/utils";
import {
  BannerSettings,
  LocalizedText,
  SeoSettings,
  SiteInfoSettings,
  SiteSettings,
  SocialSettings,
} from "@/interface/SiteSetting";

const fieldClass =
  "w-full rounded-[10px] border border-line bg-page p-3 text-sm text-ink outline-none focus:border-accent";

const Field = ({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div className={cn("flex flex-col gap-1.5", full && "md:col-span-2")}>
    <label className="text-xs font-medium text-muted">{label}</label>
    {children}
  </div>
);

const LocalizedField = ({
  label,
  value,
  onChange,
  multiline,
  full,
  testId,
}: {
  label: string;
  value: LocalizedText;
  onChange: (next: LocalizedText) => void;
  multiline?: boolean;
  full?: boolean;
  testId: string;
}) => (
  <div className={cn("flex flex-col gap-1.5", full && "md:col-span-2")}>
    <label className="text-xs font-medium text-muted">{label}</label>
    <div className="grid gap-2 sm:grid-cols-2">
      {(["vi", "en"] as const).map((locale) =>
        multiline ? (
          <div key={locale} className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase text-faintest">
              {locale}
            </span>
            <textarea
              className={cn(fieldClass, "min-h-[72px] resize-none")}
              value={value?.[locale] || ""}
              onChange={(e) =>
                onChange({ ...value, [locale]: e.target.value })
              }
              data-testid={`${testId}-${locale}`}
            />
          </div>
        ) : (
          <div key={locale} className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase text-faintest">
              {locale}
            </span>
            <input
              className={fieldClass}
              value={value?.[locale] || ""}
              onChange={(e) =>
                onChange({ ...value, [locale]: e.target.value })
              }
              data-testid={`${testId}-${locale}`}
            />
          </div>
        )
      )}
    </div>
  </div>
);

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface p-5 shadow-sm">
    <span className="font-meta text-[11px] font-medium uppercase tracking-wide text-faintest">
      {title}
    </span>
    {children}
  </section>
);

const ImageField = ({
  label,
  value,
  onChange,
  uploadLabel,
  changeLabel,
  testId,
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
  uploadLabel: string;
  changeLabel: string;
  testId: string;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-medium text-muted">{label}</label>
    <UploadV1
      type="image"
      buttonText={value ? changeLabel : uploadLabel}
      onSuccess={(res) => onChange(res.filePath || "")}
      testId={`${testId}-upload`}
    />
    {value && (
      <ImageShow
        src={value}
        alt={label}
        width={400}
        height={200}
        className="h-32 w-full max-w-sm rounded-xl border border-line-soft object-cover"
      />
    )}
  </div>
);

const SiteSettingsPage = () => {
  useRequireAuth();
  const t = useTranslations("SiteSettings");
  const tCms = useTranslations("Cms");
  const { user } = useUser();
  const { getToken } = useAuth();
  const isAdmin = user?.publicMetadata?.role === "admin" || false;

  const { data, isLoading, error, mutate } = useSWR<SiteSettings>(
    `${process.env.NEXT_PUBLIC_API_URL}/settings`,
    fetcherUseSWR
  );

  const [banner, setBanner] = useState<BannerSettings>({});
  const [site, setSite] = useState<SiteInfoSettings>({});
  const [social, setSocial] = useState<SocialSettings>({});
  const [seo, setSeo] = useState<SeoSettings>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    setBanner(data.banner || {});
    setSite(data.site || {});
    setSocial(data.social || {});
    setSeo(data.seo || {});
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/settings`,
        { banner, site, social, seo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        toast.success(t("toastSaved"));
        await mutate();
      } else {
        toast.error(t("toastFailed"));
      }
    } catch {
      toast.error(t("toastFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin)
    return (
      <p
        className="py-16 text-center text-sm text-muted"
        data-testid="site-settings-not-admin"
      >
        {tCms("notAdmin")}
      </p>
    );
  if (isLoading)
    return (
      <p
        className="py-16 text-center text-sm text-muted"
        data-testid="site-settings-page"
      >
        {t("loading")}
      </p>
    );
  if (error)
    return (
      <p
        className="py-16 text-center text-sm text-muted"
        data-testid="site-settings-page"
      >
        {t("error")}
      </p>
    );

  return (
    <div className="flex flex-col gap-6 pb-8" data-testid="site-settings-page">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
          {t("pageTitle")}
        </h1>
        <p className="font-meta text-sm text-faint">{t("pageSubtitle")}</p>
      </div>

      <SectionCard title={t("bannerSectionTitle")}>
        <div className="grid gap-4 md:grid-cols-2">
          <LocalizedField
            label={t("eyebrowLabel")}
            value={banner.eyebrow || {}}
            onChange={(next) => setBanner((p) => ({ ...p, eyebrow: next }))}
            testId="site-settings-banner-eyebrow"
          />
          <LocalizedField
            label={t("titleLabel")}
            value={banner.title || {}}
            onChange={(next) => setBanner((p) => ({ ...p, title: next }))}
            testId="site-settings-banner-title"
          />
          <LocalizedField
            label={t("subtitleLabel")}
            value={banner.subtitle || {}}
            onChange={(next) => setBanner((p) => ({ ...p, subtitle: next }))}
            multiline
            full
            testId="site-settings-banner-subtitle"
          />
          <LocalizedField
            label={t("primaryButtonTextLabel")}
            value={banner.primaryButtonText || {}}
            onChange={(next) =>
              setBanner((p) => ({ ...p, primaryButtonText: next }))
            }
            testId="site-settings-banner-primary-text"
          />
          <LocalizedField
            label={t("primaryButtonLinkLabel")}
            value={banner.primaryButtonLink || {}}
            onChange={(next) =>
              setBanner((p) => ({ ...p, primaryButtonLink: next }))
            }
            testId="site-settings-banner-primary-link"
          />
          <LocalizedField
            label={t("secondaryButtonTextLabel")}
            value={banner.secondaryButtonText || {}}
            onChange={(next) =>
              setBanner((p) => ({ ...p, secondaryButtonText: next }))
            }
            testId="site-settings-banner-secondary-text"
          />
          <LocalizedField
            label={t("secondaryButtonLinkLabel")}
            value={banner.secondaryButtonLink || {}}
            onChange={(next) =>
              setBanner((p) => ({ ...p, secondaryButtonLink: next }))
            }
            testId="site-settings-banner-secondary-link"
          />
        </div>
        <ImageField
          label={t("bannerImageLabel")}
          value={banner.image || ""}
          onChange={(path) => setBanner((p) => ({ ...p, image: path }))}
          uploadLabel={t("uploadImage")}
          changeLabel={t("changeImage")}
          testId="site-settings-banner-image"
        />
      </SectionCard>

      <SectionCard title={t("siteSectionTitle")}>
        <div className="grid gap-4 md:grid-cols-2">
          <LocalizedField
            label={t("siteNameLabel")}
            value={site.name || {}}
            onChange={(next) => setSite((p) => ({ ...p, name: next }))}
            testId="site-settings-site-name"
          />
          <Field label={t("contactEmailLabel")}>
            <input
              type="email"
              className={fieldClass}
              value={site.contactEmail || ""}
              onChange={(e) =>
                setSite((p) => ({ ...p, contactEmail: e.target.value }))
              }
              data-testid="site-settings-contact-email"
            />
          </Field>
          <LocalizedField
            label={t("siteDescriptionLabel")}
            value={site.description || {}}
            onChange={(next) => setSite((p) => ({ ...p, description: next }))}
            multiline
            full
            testId="site-settings-site-description"
          />
          <LocalizedField
            label={t("footerTextLabel")}
            value={site.footerText || {}}
            onChange={(next) => setSite((p) => ({ ...p, footerText: next }))}
            multiline
            full
            testId="site-settings-footer-text"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ImageField
            label={t("logoLabel")}
            value={site.logo || ""}
            onChange={(path) => setSite((p) => ({ ...p, logo: path }))}
            uploadLabel={t("uploadImage")}
            changeLabel={t("changeImage")}
            testId="site-settings-logo"
          />
          <ImageField
            label={t("faviconLabel")}
            value={site.favicon || ""}
            onChange={(path) => setSite((p) => ({ ...p, favicon: path }))}
            uploadLabel={t("uploadImage")}
            changeLabel={t("changeImage")}
            testId="site-settings-favicon"
          />
        </div>
      </SectionCard>

      <SectionCard title={t("socialSectionTitle")}>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label={t("facebookLabel")}>
            <input
              className={fieldClass}
              value={social.facebook || ""}
              onChange={(e) =>
                setSocial((p) => ({ ...p, facebook: e.target.value }))
              }
              data-testid="site-settings-social-facebook"
            />
          </Field>
          <Field label={t("twitterLabel")}>
            <input
              className={fieldClass}
              value={social.twitter || ""}
              onChange={(e) =>
                setSocial((p) => ({ ...p, twitter: e.target.value }))
              }
              data-testid="site-settings-social-twitter"
            />
          </Field>
          <Field label={t("instagramLabel")}>
            <input
              className={fieldClass}
              value={social.instagram || ""}
              onChange={(e) =>
                setSocial((p) => ({ ...p, instagram: e.target.value }))
              }
              data-testid="site-settings-social-instagram"
            />
          </Field>
          <Field label={t("youtubeLabel")}>
            <input
              className={fieldClass}
              value={social.youtube || ""}
              onChange={(e) =>
                setSocial((p) => ({ ...p, youtube: e.target.value }))
              }
              data-testid="site-settings-social-youtube"
            />
          </Field>
          <Field label={t("linkedinLabel")}>
            <input
              className={fieldClass}
              value={social.linkedin || ""}
              onChange={(e) =>
                setSocial((p) => ({ ...p, linkedin: e.target.value }))
              }
              data-testid="site-settings-social-linkedin"
            />
          </Field>
          <Field label={t("githubLabel")}>
            <input
              className={fieldClass}
              value={social.github || ""}
              onChange={(e) =>
                setSocial((p) => ({ ...p, github: e.target.value }))
              }
              data-testid="site-settings-social-github"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title={t("seoSectionTitle")}>
        <div className="grid gap-4 md:grid-cols-2">
          <LocalizedField
            label={t("metaTitleLabel")}
            value={seo.metaTitle || {}}
            onChange={(next) => setSeo((p) => ({ ...p, metaTitle: next }))}
            full
            testId="site-settings-seo-meta-title"
          />
          <LocalizedField
            label={t("metaDescriptionLabel")}
            value={seo.metaDescription || {}}
            onChange={(next) =>
              setSeo((p) => ({ ...p, metaDescription: next }))
            }
            multiline
            full
            testId="site-settings-seo-meta-description"
          />
        </div>
        <ImageField
          label={t("ogImageLabel")}
          value={seo.ogImage || ""}
          onChange={(path) => setSeo((p) => ({ ...p, ogImage: path }))}
          uploadLabel={t("uploadImage")}
          changeLabel={t("changeImage")}
          testId="site-settings-og-image"
        />
      </SectionCard>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex h-11 items-center justify-center rounded-[10px] bg-gradient-to-b from-accent to-accent-dark px-6 font-cta text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          data-testid="site-settings-save-button"
        >
          {isSaving ? t("saving") : t("saveButton")}
        </button>
      </div>
    </div>
  );
};

export default SiteSettingsPage;
