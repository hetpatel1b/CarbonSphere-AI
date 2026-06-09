"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Leaf, LayoutDashboard, BarChart3, Award, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Route } from "next";

type NavItem = {
  name: string;
  href: Route;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Log Activity", href: "/log", icon: Leaf },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0 flex flex-col">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Access CarbonSphere AI main navigation.</SheetDescription>
        <div className="h-[var(--layout-header-height)] flex items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight" onClick={() => setOpen(false)}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            CarbonSphere AI
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6 px-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
