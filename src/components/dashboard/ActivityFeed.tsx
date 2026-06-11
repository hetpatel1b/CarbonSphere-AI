"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Activity {
  id: string
  title: string
  description: string
  time: string
  icon?: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="col-span-full md:col-span-2 lg:col-span-3 border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md">
      {/* Top hover accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
        <CardTitle className="text-base font-bold text-foreground">Recent Activity</CardTitle>
        <span className="inline-flex items-center rounded-full bg-zinc-200/60 dark:bg-zinc-900/60 px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground border border-zinc-300/30 dark:border-zinc-800/50">
          {activities.length} events
        </span>
      </CardHeader>
      
      <CardContent className="pt-5">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-1">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="group/item relative flex items-start gap-4 rounded-xl px-3 py-3.5 transition-all duration-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 hover:translate-x-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              >
                {/* Timeline connector with visual gradient */}
                {index < activities.length - 1 && (
                  <div className="absolute left-[29px] top-[48px] h-[calc(100%-22px)] w-[1.5px] bg-gradient-to-b from-zinc-200 via-zinc-200/50 to-transparent dark:from-zinc-800 dark:via-zinc-800/50 dark:to-transparent" />
                )}
                
                <Avatar className="h-8 w-8 mt-0.5 shrink-0 ring-2 ring-zinc-100 dark:ring-zinc-900 shadow-sm group-hover/item:scale-105 group-hover/item:ring-emerald-500/30 transition-all duration-300">
                  <AvatarImage src={activity.icon} alt="Icon" />
                  <AvatarFallback className="text-[11px] font-bold bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200/30 dark:border-emerald-500/10">
                    {activity.title?.charAt(0)?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-bold leading-none text-foreground group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-[13px] text-muted-foreground/80 leading-relaxed font-medium">
                    {activity.description}
                  </p>
                </div>
                
                <div className="text-[10px] font-bold text-muted-foreground/60 whitespace-nowrap shrink-0 pt-0.5">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
