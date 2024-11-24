// ./src/app/layout.tsx
import React from "react";
import Providers from "./providers";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GlobalLoading from "./components/GlobalLoading";
import Notifications from "./components/Notifications";
import "./globals.css";
import { Metadata } from "next";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pin OS",
  description: "Pin OS",
  icons: {
    icon: "/icons/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  let theme = localStorage.getItem('theme');
                  if (!theme || (theme !== 'dark' && theme !== 'light')) {
                    theme = 'light';
                  }
                  document.documentElement.className = theme;
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {
                  console.error('Error setting theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased items-center flex flex-col min-h-screen w-full`}
      >
        <Providers>
          <GlobalLoading>
            <Header />
            <main className="w-full md:w-5/6">{children}</main>
            <Footer />
          </GlobalLoading>
          <Notifications />
        </Providers>
      </body>
    </html>
  );
}
