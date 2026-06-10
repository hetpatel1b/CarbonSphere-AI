"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Leaf, LayoutDashboard, BarChart3, Sparkles, Calculator, MessageSquare, Target, TrendingUp, Users, Award, Settings } from "lucide-react";
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
  { name: "AI Coach", href: "/ai-coach" as Route, icon: Sparkles },
  { name: "Simulator", href: "/simulator" as Route, icon: Calculator },
  { name: "AI Assistant", href: "/assistant" as Route, icon: MessageSquare },
  { name: "Challenges", href: "/challenges" as Route, icon: Target },
  { name: "Forecasting", href: "/forecasting" as Route, icon: TrendingUp },
  { name: "Community", href: "/community" as Route, icon: Users },
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
        <div className="h-[var(--layout-header-height)] flex items-center px-6 border-b border-border/30">
          <Link href="/" className="flex items-center gap-3 font-semibold text-lg tracking-tight" onClick={() => setOpen(false)}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/25">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.01em]">CarbonSphere</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-5 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/15"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/70")} />
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
