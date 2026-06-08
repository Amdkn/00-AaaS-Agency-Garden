import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A'Space AaaS OS — The Founder's Digital Garden",
  description: "A streamlined, sovereign operating system for agencies, digital product builders, and non-technical founders.",
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
        {/* AuthProvider mirrors Supabase auth state into React so any client
            component can call useAuth() to read user / session / loading.
            Server components still call createSupabaseServerClient() directly. */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
