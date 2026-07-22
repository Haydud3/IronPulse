import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/auth/AuthProvider";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IronPulse",
  description: "Your personal fitness companion.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="relative flex w-full flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <div className="mx-auto flex w-full max-w-md flex-col">
                <Header />
                <main className="flex-1 pb-20 md:pb-0 md:p-8">{children}</main>
                <BottomNavBar />
              </div>
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
