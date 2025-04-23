import Navbar from "@/components/navbar";
import { Providers } from "@/components/providers";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CMS",
  description: "CMS System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <Navbar />
            <main>{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
