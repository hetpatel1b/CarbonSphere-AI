"use client";

import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { UserAccountMenu } from "./UserAccountMenu";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-[var(--layout-header-height)] w-full items-center justify-between border-b border-border/30 bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="flex items-center gap-4">
        <MobileNav />
      </div>
      <div className="flex items-center gap-1.5">
        <NotificationDropdown />
        <ThemeToggle />
        <UserAccountMenu />
      </div>
    </header>
  );
}
