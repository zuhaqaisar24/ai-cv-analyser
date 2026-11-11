import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";

import "./globals.css";

const sourceSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-source",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CVAnalyser",
    template: "%s · CVAnalyser",
  },
  description:
    "Read a CV into a structured profile and line it up against a job advert.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
