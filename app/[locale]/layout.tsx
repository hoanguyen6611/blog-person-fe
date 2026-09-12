import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "../../components/NavBar";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "next-themes";
import AntdThemeProvider from "@/components/AntdThemeProvider";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import SlowRequestBanner from "@/components/SlowRequestBanner";
import OfflineBanner from "@/components/OfflineBanner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { ResolvedSiteSettings } from "@/interface/SiteSetting";
import { SITE_URL } from "@/lib/siteUrl";

const DEFAULT_TITLE = "Tech News";
const DEFAULT_DESCRIPTION = "Tech News";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // This runs on every page's metadata pass, so a slow/unreachable backend
  // must not hang the whole render — fall back to the hardcoded defaults.
  const settings: ResolvedSiteSettings | null = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/settings?locale=${locale}`,
    { next: { revalidate: 300 }, signal: AbortSignal.timeout(5000) }
  )
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  const title = settings?.seo?.metaTitle || DEFAULT_TITLE;
  const description = settings?.seo?.metaDescription || DEFAULT_DESCRIPTION;
  // Images uploaded via site-settings (like post covers) are stored as a
  // path relative to ImageKit, not an absolute URL — same convention as
  // ImageShow.tsx / PostCreate.tsx's cover image handling.
  const ogImage = settings?.seo?.ogImage
    ? `${process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}${settings.seo.ogImage}`
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${title}` },
    description,
    manifest: "/manifest.webmanifest",
    alternates: {
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title,
    },
    openGraph: {
      title,
      description,
      siteName: title,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#003cff",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "var(--color-accent)",
          colorBackground: "var(--color-surface)",
          colorText: "var(--color-ink)",
          colorTextSecondary: "var(--color-muted)",
          colorInputBackground: "var(--color-surface-2)",
          colorInputText: "var(--color-ink)",
          colorDanger: "#dc2626",
          colorSuccess: "var(--color-success)",
          colorWarning: "var(--color-warning)",
          borderRadius: "12px",
          fontFamily: "var(--font-sans)",
        },
        elements: {
          card: "shadow-lg border border-line-soft",
          userButtonPopoverCard: "shadow-lg border border-line-soft",
          userButtonPopoverActionButton: "hover:bg-surface-2",
          userButtonPopoverActionButtonText: "font-medium",
          userButtonPopoverFooter: "border-t border-line-soft",
          formButtonPrimary:
            "bg-gradient-to-b from-accent to-accent-dark hover:opacity-90 text-white",
        },
      }}
    >
      <html lang={locale} suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider locale={locale}>
              <AntdThemeProvider>
                <div className="flex min-h-screen flex-col pb-20 md:pb-0">
                  <ServiceWorkerRegister />
                  <NavBar />
                  <SlowRequestBanner />
                  <OfflineBanner />
                  <div className="flex-1 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
                    <main>
                      <Providers>{children}</Providers>
                      <ToastContainer position="top-right" />
                    </main>
                  </div>
                  <Footer />
                </div>
                <MobileTabBar />
              </AntdThemeProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
