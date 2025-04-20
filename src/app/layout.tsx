import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";


export const metadata: Metadata = {
  title: "CMS Track Master",
  description: "for task management and communication  , made with 💓 by mdak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
              enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="flex justify-center">
            <main className="w-full max-w-6xl mx-auto px-4 py-2">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
