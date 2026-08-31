import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "重庆大学 EF 邦多利马群｜纳新中",
  description: "重庆大学 EF 邦多利同好会纳新：从打歌到追番，从 live 到声优，在校园里找到同路人。",
  metadataBase: new URL("https://efbg.tano.asia"),
  openGraph: {
    title: "重庆大学 EF 邦多利同好会｜纳新中",
    description: "一起击穿梦想，叩响明日的门扉吧！QQ群：824993838",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "重庆大学 EF 邦多利同好会纳新" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "重庆大学 EF 邦多利同好会｜纳新中",
    description: "一起击穿梦想，叩响明日的门扉吧！QQ群：824993838",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
