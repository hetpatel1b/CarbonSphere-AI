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
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to CarbonSphere AI. Here is your footprint overview.</p>
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
