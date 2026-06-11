"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, ShoppingBag, Sparkles, Target, Award, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, Notification } from "@/services/notificationService";
import { useAuth } from "@/contexts/AuthContext";

export function NotificationDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // We filter out notifications if the user explicitly disabled them in settings, 
  // though typically the backend wouldn't even create them.
  // For safety, we can filter them here based on user.notifications preferences.
  // Wait, user.notifications is part of the Profile object which we have in AuthContext,
  // but let's just display what the backend gives us, as backend filtering is the proper way.

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await fetchNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadNotifications();
      // Polling could be added here, e.g. setInterval
    } else {
      setNotifications([]);
    }
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="h-4 w-4 text-amber-500" />;
      case 'challenge': return <Target className="h-4 w-4 text-sky-500" />;
      case 'recommendation': return <Sparkles className="h-4 w-4 text-emerald-500" />;
      case 'system': return <Info className="h-4 w-4 text-zinc-500" />;
      case 'report': return <CheckCircle2 className="h-4 w-4 text-violet-500" />;
      default: return <Bell className="h-4 w-4 text-zinc-500" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative w-9 h-9 rounded-lg">
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white ring-2 ring-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0 rounded-2xl shadow-xl overflow-hidden border-border/30">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-muted/20">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground">
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[350px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 p-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center text-muted-foreground">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-1">
                <Bell className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">No notifications yet</p>
              <p className="text-xs">When you get updates, they&apos;ll show up here.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`flex gap-3 p-4 transition-colors hover:bg-muted/30 border-b border-border/30 last:border-0 ${notification.isRead ? 'opacity-70' : 'bg-emerald-500/5'}`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                >
                  <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-background border border-border shadow-sm">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-sm ${notification.isRead ? 'font-medium' : 'font-semibold'} leading-tight`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 mt-1 font-medium">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
