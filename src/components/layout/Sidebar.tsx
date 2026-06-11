"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Leaf, 
  BarChart3, 
  Sparkles,
  Calculator,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  Award, 
  Settings,
  FileText
} from "lucide-react";
import type { Route } from "next";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

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
  { name: "Offset Marketplace", href: "/offset-marketplace" as Route, icon: Leaf },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Impact Reports", href: "/reports" as Route, icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  return (
    <aside className="hidden lg:flex w-[var(--layout-sidebar-width)] flex-col border-r border-border/30 bg-card h-screen sticky top-0 print:hidden">
      {/* Logo Area */}
      <div className="flex h-[var(--layout-header-height)] items-center px-6 border-b border-border/30">
        <Link href="/" className="flex items-center gap-3 font-semibold text-foreground tracking-tight transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 shadow-md shadow-emerald-500/25">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-[17px] font-semibold tracking-[-0.01em]">CarbonSphere</span>
        </Link>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-5 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-[0_0_8px_rgba(16,185,129,0.08)] ring-1 ring-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:shadow-[0_0_8px_rgba(16,185,129,0.06)] dark:ring-emerald-500/15"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground dark:hover:bg-zinc-800/50"
                )}
              >
                <item.icon className={cn(
                  "w-[18px] h-[18px] transition-colors", 
                  isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/70 group-hover:text-foreground"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Avatar Section */}
      <div className="border-t border-border/30 p-3">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-lg p-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-3 rounded-lg p-2.5 transition-colors duration-200 hover:bg-muted/60 cursor-pointer dark:hover:bg-zinc-800/50">
            <Avatar className="h-8 w-8 rounded-full ring-2 ring-emerald-500/20 dark:ring-emerald-500/15 shrink-0">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-sm font-semibold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
              <span className="text-sm font-medium text-foreground leading-none truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-lg p-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground leading-none">Guest</span>
              <span className="text-xs text-muted-foreground">Not signed in</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
