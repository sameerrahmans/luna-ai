import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luna AI",
  description: "Luna AI — AI assistant built by Sameer Rahman",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">{children}</body>
    </html>
  );
}
