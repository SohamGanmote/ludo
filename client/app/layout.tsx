import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SocketProvider from "@/src/providers/SocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ludo Multiplayer",
  description:
    "Play Ludo online with friends. Create a room, share the code, and enjoy real-time multiplayer.",

  authors: [
    {
      name: "Soham Ganmote",
      url: "https://sohamg.in",
    },
  ],

  keywords: [
    "Ludo",
    "Online Ludo",
    "Multiplayer",
    "Ludo with Friends",
    "Board Game",
  ],

  openGraph: {
    title: "Ludo Multiplayer",
    description:
      "Play Ludo online with friends in real time.",
    url: "https://ludo.sohamg.in",
    siteName: "Ludo Multiplayer",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Ludo Multiplayer",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ludo Multiplayer",
    description: "Play Ludo online with friends.",
    images: ["/banner.jpg"],
  },

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
