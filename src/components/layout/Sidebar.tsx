"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Leaf, 
  BarChart3, 
  Award, 
  Settings,
  MoreHorizontal
} from "lucide-react";
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[var(--layout-sidebar-width)] flex-col border-r border-border/50 bg-card h-screen sticky top-0">
      {/* Logo Area */}
      <div className="flex h-[var(--layout-header-height)] items-center px-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-3 font-semibold text-foreground tracking-tight transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-500/20">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg">CarbonSphere</span>
        </Link>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:shadow-[0_0_12px_rgba(16,185,129,0.05)] dark:ring-emerald-500/20"
                    : "text-muted-foreground hover:-translate-y-[1px] hover:bg-muted/60 hover:text-foreground dark:hover:bg-zinc-800/50"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 transition-colors", 
                  isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Avatar Section */}
      <div className="border-t border-border/40 p-4">
        <div className="flex items-center justify-between gap-3 rounded-xl p-2 transition-all duration-200 hover:-translate-y-[1px] hover:bg-muted/60 hover:shadow-sm cursor-pointer dark:hover:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground leading-tight">Alex</span>
              <span className="text-xs text-muted-foreground">Pro Plan</span>
            </div>
          </div>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}
