import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "WhatsApp Sandbox Apps", description: "Apps built by AI" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="he" dir="rtl"><body>{children}</body></html>;
}
