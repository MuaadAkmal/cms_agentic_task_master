"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <div className="w-full flex justify-center py-3">
      <nav className="max-w-6xl w-full mx-auto px-4 rounded-full border bg-white dark:bg-gray-950 shadow-md flex items-center justify-between h-14">
        <Link href="/" className="text-xl font-bold">
          MIS
        </Link>
        <div className="flex items-center space-x-1">
          <Link href="/" passHref>
            <Button variant="ghost" className="text-sm rounded-full">Home</Button>
          </Link>
          <Link href="#server" passHref>
            <Button variant="ghost" className="text-sm rounded-full">Server</Button>
          </Link>
          <Link href="#employee" passHref>
            <Button variant="ghost" className="text-sm rounded-full">Employee</Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}