import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalSidebar from "@/components/ConditionalSidebar";
import { GlobalConfig } from "@/config/config";
import ThemeProvider from "@/providers/theme-provider";
import MainWrapper from "@/components/MainWrapper";
import { SiteProvider } from "@/context/site-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Pegue o site padrão para metadata
const defaultSite = GlobalConfig.sites.find(site => site.id === GlobalConfig.defaultSiteId) || GlobalConfig.sites[0];

export const metadata: Metadata = {
  title: `${defaultSite.siteName} | Dashboard`,
  description: `${defaultSite.description}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteProvider>
          <ThemeProvider />
          <ConditionalSidebar />
          <MainWrapper>
            {children}
          </MainWrapper>
        </SiteProvider>
      </body>
    </html>
  );
}