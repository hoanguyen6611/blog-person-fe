import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import I18nProvider from "@/i18n-provider";

export const metadata: Metadata = {
  title: "Blog Personal",
  description: "Blog Personal Hoane",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
            <NavBar />
            <main>
              <Providers>
                <I18nProvider>{children}</I18nProvider>
              </Providers>
              <ToastContainer position="top-right" />
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
