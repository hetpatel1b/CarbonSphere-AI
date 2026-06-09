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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-2">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            🌍 {greeting}, Alex
          </h1>
          <p className="text-muted-foreground text-base">
            Your carbon footprint decreased <span className="font-medium text-foreground">18%</span> this month and AI identified <span className="font-medium text-foreground">3</span> sustainability opportunities.
          </p>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-2.5">
          <div className="text-sm font-medium text-muted-foreground">
            {currentDate}
          </div>
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Carbon Score Improving
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CarbonScoreCard score={780} trendLabel="+15 pts this week" />
        
        <MetricCard 
          title="Monthly Emissions" 
          value="1.2 tCO2e" 
          icon={Cloud} 
          trend={{ value: "-5", label: "from last month", isPositive: true }} 
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

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <ActivityFeed activities={recentActivities} />
        <AIInsightCard 
          title="AI Suggestion" 
          insight="You could save an estimated 0.1 tCO2e this week by switching to public transit for your Friday commute based on your historical patterns." 
        />
      </div>
    </div>
  )
}
