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
    <Card className="col-span-full md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
        <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {activities.length} events
        </span>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-1">
            {activities.map((activity, index) => (
              <div key={activity.id} className="group relative flex items-start gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted/30">
                {/* Timeline connector */}
                {index < activities.length - 1 && (
                  <div className="absolute left-[22px] top-[44px] h-[calc(100%-20px)] w-px bg-border/40" />
                )}
                <Avatar className="h-8 w-8 mt-0.5 shrink-0 ring-2 ring-background">
                  <AvatarImage src={activity.icon} alt="Icon" />
                  <AvatarFallback className="text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">{activity.title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold leading-none text-foreground">{activity.title}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{activity.description}</p>
                </div>
                <div className="text-[11px] font-medium text-muted-foreground/70 whitespace-nowrap shrink-0 pt-0.5">{activity.time}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
