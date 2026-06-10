import { MetricCard } from "@/components/dashboard/MetricCard"
import { CarbonScoreCard } from "@/components/dashboard/CarbonScoreCard"
import { GoalProgressCard } from "@/components/dashboard/GoalProgressCard"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { AIInsightCard } from "@/components/dashboard/AIInsightCard"
import { Cloud, Calendar } from "lucide-react"

const recentActivities = [
  {
    id: "1",
    title: "Commute Logged",
    description: "Logged 15km train commute.",
    time: "2 hours ago",
  },
  {
    id: "2",
    title: "Energy Bill Updated",
    description: "October electricity usage imported automatically.",
    time: "Yesterday",
  },
  {
    id: "3",
    title: "New Achievement",
    description: "Earned 'Public Transit Pro' badge.",
    time: "2 days ago",
  },
]

export default function DashboardPage() {
  const now = new Date()
  const hour = now.getHours()
  let greeting = "Good Evening"
  if (hour < 12) greeting = "Good Morning"
  else if (hour < 18) greeting = "Good Afternoon"

  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now)

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {greeting}, Alex
            </h1>
            <p className="text-sm text-muted-foreground">
              Your sustainability overview at a glance.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200/60 bg-emerald-50/50 px-4 py-3 dark:border-emerald-500/10 dark:bg-emerald-500/5">
            <div className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Carbon footprint decreased <span className="font-medium text-foreground">18%</span> this month — AI identified <span className="font-medium text-foreground">3</span> sustainability opportunities.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {currentDate}
          </div>
          <div className="inline-flex items-center rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-400">
            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Score Improving
          </div>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <CarbonScoreCard score={780} trendLabel="+15 pts this week" />
        
        <MetricCard 
          title="Monthly Emissions" 
          value="1.2 tCO2e" 
          icon={Cloud} 
          trend={{ value: "-5%", label: "from last month", isPositive: true }} 
        />
        
        <MetricCard 
          title="Active Streak" 
          value="12 Days" 
          icon={Calendar}
          description="Keep it up!" 
        />
        
        <GoalProgressCard 
          title="Emissions Goal" 
          current={1.2} 
          target={2.0} 
          unit="tCO2e" 
        />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4 items-start">
        <ActivityFeed activities={recentActivities} />
        <AIInsightCard />
      </div>
    </div>
  )
}
