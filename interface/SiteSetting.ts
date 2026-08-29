export interface LocalizedText {
  vi?: string;
  en?: string;
}

// Raw shape returned by GET /settings (both locales, used by the admin editor)
export interface BannerSettings {
  eyebrow?: LocalizedText;
  title?: LocalizedText;
  subtitle?: LocalizedText;
  primaryButtonText?: LocalizedText;
  primaryButtonLink?: LocalizedText;
  secondaryButtonText?: LocalizedText;
  secondaryButtonLink?: LocalizedText;
  image?: string;
}

export interface SiteInfoSettings {
  name?: LocalizedText;
  description?: LocalizedText;
  footerText?: LocalizedText;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
}

export interface SocialSettings {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  github?: string;
}

export interface SeoSettings {
  metaTitle?: LocalizedText;
  metaDescription?: LocalizedText;
  ogImage?: string;
}

export interface SiteSettings {
  banner?: BannerSettings;
  site?: SiteInfoSettings;
  social?: SocialSettings;
  seo?: SeoSettings;
}

// Resolved shape returned by GET /settings?locale=vi|en (flat strings, used
// by public-facing components — the server already picks the right
// language and falls back vi -> en -> empty).
export interface ResolvedBannerSettings {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image?: string;
}

export interface ResolvedSiteInfoSettings {
  name?: string;
  description?: string;
  footerText?: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
}

export interface ResolvedSeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface ResolvedSiteSettings {
  banner?: ResolvedBannerSettings;
  site?: ResolvedSiteInfoSettings;
  social?: SocialSettings;
  seo?: ResolvedSeoSettings;
}
