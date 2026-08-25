import type { Metadata } from "next";
import "./globals.css";

const pagesBasePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://wlyd-bridge-docs.hufuhao2026.chatgpt.site"),
  title: { default: "WLYD Bridge · Flutter 原生能力桥接", template: "%s · WLYD Bridge" },
  description: "Flutter App WebView 与 H5 的统一桥接层：复用 uni.xxx 风格，统一原生能力调用、双轨导航与新旧回包。",
  icons: { icon: `${pagesBasePath}/favicon.svg`, shortcut: `${pagesBasePath}/favicon.svg` },
  openGraph: {
    title: "WLYD Bridge · Flutter 原生能力桥接",
    description: "Flutter App WebView 与 H5 的统一桥接层：统一原生能力调用、双轨导航与新旧回包。",
    url: "https://wlyd-bridge-docs.hufuhao2026.chatgpt.site",
    siteName: "WLYD Bridge",
    type: "website",
    images: [{ url: "https://wlyd-bridge-docs.hufuhao2026.chatgpt.site/og.png", width: 1200, height: 630, alt: "WLYD Bridge 文档" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WLYD Bridge · Flutter 原生能力桥接",
    description: "Flutter App WebView 与 H5 的统一桥接层：统一原生能力调用、双轨导航与新旧回包。",
    images: ["https://wlyd-bridge-docs.hufuhao2026.chatgpt.site/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
