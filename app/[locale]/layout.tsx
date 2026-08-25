import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Blog Personal",
  description: "Blog Personal Hoane",
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
    <ClerkProvider>
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
                  <NavBar />
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
