// ./src/app/layout.tsx
import React from "react";
import Providers from "./providers";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
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
  title: "PinPictures",
  description: "PinPictures - The best place to share your photos",
  icons: {
    icon: "https://storage.yandexcloud.net/pinpictures/otherImages/icon.ico", // Указываем URL для favicon
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <link rel="icon" href="https://storage.yandexcloud.net/pinpictures/otherImages/icon.ico" type="image/x-icon" sizes="16x16"/>
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
