"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Leaf, 
  BarChart3, 
  Award, 
  Settings 
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
    <aside className="hidden lg:flex w-[var(--layout-sidebar-width)] flex-col border-r bg-card h-screen sticky top-0">
      <div className="h-[var(--layout-header-height)] flex items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          CarbonSphere AI
        </Link>
      </div>
      <div className="flex-1 py-6 px-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
