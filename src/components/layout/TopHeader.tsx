"use client";

import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-[var(--layout-header-height)] w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <MobileNav />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative w-9 h-9">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ThemeToggle />
        <Avatar className="w-8 h-8 ml-2 cursor-pointer ring-2 ring-transparent transition-all hover:ring-primary/50">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
