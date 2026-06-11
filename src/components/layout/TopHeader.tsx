"use client";

import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-[var(--layout-header-height)] w-full items-center justify-between border-b border-border/30 bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="flex items-center gap-4">
        <MobileNav />
      </div>
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="relative w-9 h-9 rounded-lg">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-background" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ThemeToggle />
        <Avatar className="w-8 h-8 ml-1.5 cursor-pointer ring-2 ring-transparent transition-all hover:ring-emerald-500/40">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
