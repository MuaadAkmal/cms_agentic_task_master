"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { AiFillAliwangwang } from "react-icons/ai";
import { cn } from "@/lib/utils";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/", label: "Stats" },
  { href: "http://192.168.48.122:4000", label: "Chat" },
  { href: "http://192.168.48.122:6677", label: "MIS" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const { isSignedIn } = useAuth();

  return (
    <div className="w-full flex justify-center py-3">
      <nav className="font-nerd max-w-7xl w-full mx-auto px-4 rounded-full border bg-white dark:bg-gray-950 shadow-md flex items-center justify-between h-14">
        <Link href="/" className="text-3xl font-bold ml-2">
          <AiFillAliwangwang />
        </Link>

        <div className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive(link.href) ? "text-foreground" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <div className="ml-2">
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="text-sm font-medium px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary/90">
                  Sign in
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
