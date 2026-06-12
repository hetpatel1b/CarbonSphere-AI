"use client";

import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/utils/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, Settings, FileText, LogOut, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function UserAccountMenu() {
  const { user, isLoading } = useAuth();

  const handleLogout = () => {
    const logoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        logout();
        resolve(true);
      }, 500);
    });

    toast.promise(logoutPromise, {
      loading: "Logging out...",
      success: () => {
        window.location.href = "/login";
        return "Logged out successfully";
      },
      error: "Failed to logout"
    });
  };
  const handleResetDemoData = () => {
    const resetPromise = fetch(process.env.NEXT_PUBLIC_API_URL + '/demo/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to reset demo data');
      }
      return res.json();
    }).then(() => {
      window.location.href = "/";
    });

    toast.promise(resetPromise, {
      loading: "Resetting Demo Data...",
      success: "Demo Data Restored Successfully",
      error: (err: Error | unknown) => (err as Error).message || "Failed to reset demo data"
    });
  };

  if (isLoading) {
    return <Skeleton className="w-8 h-8 rounded-full ml-1.5" />;
  }

  if (!user) {
    return (
      <Avatar className="w-8 h-8 ml-1.5 ring-2 ring-transparent transition-all hover:ring-emerald-500/40">
        <AvatarFallback>G</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-8 h-8 ml-1.5 cursor-pointer ring-2 ring-transparent transition-all hover:ring-emerald-500/40 focus:outline-none">
          <AvatarImage src={user.avatar || undefined} alt={user.name} />
          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 font-semibold text-sm">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl p-1 shadow-xl border-border/30">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border/30" />
        
        <DropdownMenuItem asChild className="cursor-pointer p-2 rounded-lg m-0.5">
          <Link href="/settings" className="flex items-center w-full">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer p-2 rounded-lg m-0.5">
          <Link href="/settings" className="flex items-center w-full">
            <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer p-2 rounded-lg m-0.5">
          <Link href="/reports" className="flex items-center w-full">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Impact Reports</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border/30" />
        
        {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
          <>
            <DropdownMenuItem 
              onClick={handleResetDemoData} 
              className="cursor-pointer p-2 rounded-lg m-0.5 text-emerald-600 dark:text-emerald-400 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-500/10 dark:focus:text-emerald-300"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Reset Demo Data</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/30" />
          </>
        )}
        
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="cursor-pointer p-2 rounded-lg m-0.5 text-red-600 dark:text-red-400 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-500/10 dark:focus:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
