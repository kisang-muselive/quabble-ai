import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Quabble - Your Mental Wellness AI Companion",
  description: "A supportive AI companion for your mental wellness journey. Practice mindfulness, breathing exercises, and get personalized support when you need it most.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fredoka.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
