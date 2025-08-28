import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NextIntlClientProvider } from 'next-intl';
import { inter } from "./fonts";
import NavigationLayout from '@/components/layout/NavigationLayout';
import Script from 'next/script';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: "TaskMaster Pro",
  description: "Master Your Tasks, Master Your Day"
};

async function getMessages(locale: string = 'en') {
  try {
    return (await import(`@/i18n/${locale}.json`)).default;
  } catch (error: unknown) {
    console.error('Error loading messages:', error);
    return (await import('@/i18n/en.json')).default;
  }
}

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const messages = await getMessages();

  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <AuthProvider>
              <NavigationLayout>{children}</NavigationLayout>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Script
          src="https://cdn.jsdelivr.net/gh/onlook-dev/onlook@main/apps/web/client/public/onlook-preload-script.js"
          strategy="afterInteractive"
          type="module"
          id="onlook-script"
          data-oid="nytlvnx"
        />
      </body>
    </html>
  );
}