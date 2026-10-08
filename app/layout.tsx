import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "House of Judah | Praise & Worship",
  description: "House of Judah: united to praise, worship, and glorify God. Explore our story, worship gatherings, music, and moments together.",
  icons: {
    icon: "/hoj-lion.png",
    shortcut: "/hoj-lion.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
