import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wlyd-bridge-docs.hufuhao2026.chatgpt.site"),
  title: { default: "WLYD Bridge · Flutter 原生能力桥接", template: "%s · WLYD Bridge" },
  description: "@wlydfe/flutter-bridge 接入指南、API 参考、通信协议与最佳实践。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "WLYD Bridge · Flutter 原生能力桥接",
    description: "Flutter × WebView × JavaScript：接入指南、API 参考、通信协议与最佳实践。",
    url: "https://wlyd-bridge-docs.hufuhao2026.chatgpt.site",
    siteName: "WLYD Bridge",
    type: "website",
    images: [{ url: "https://wlyd-bridge-docs.hufuhao2026.chatgpt.site/og.png", width: 1200, height: 630, alt: "WLYD Bridge 文档" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WLYD Bridge · Flutter 原生能力桥接",
    description: "Flutter × WebView × JavaScript：接入指南、API 参考、通信协议与最佳实践。",
    images: ["https://wlyd-bridge-docs.hufuhao2026.chatgpt.site/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
