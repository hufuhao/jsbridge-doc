import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "WLYD Bridge · Flutter 原生能力桥接", template: "%s · WLYD Bridge" },
  description: "@wlydfe/flutter-bridge 接入指南、API 参考、通信协议与最佳实践。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}

