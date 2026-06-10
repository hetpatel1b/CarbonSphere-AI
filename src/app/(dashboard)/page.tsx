"use client"

import { MetricCard } from "@/components/dashboard/MetricCard"
import { CarbonScoreCard } from "@/components/dashboard/CarbonScoreCard"
import { GoalProgressCard } from "@/components/dashboard/GoalProgressCard"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { AIInsightCard } from "@/components/dashboard/AIInsightCard"
import { AIHeroSection } from "@/components/dashboard/AIHeroSection"
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
    <div className="flex flex-col gap-8">
      {/* AI Hero Section */}
      <div className="animate-scale-up">
        <AIHeroSection />
      </div>
      
      {/* Metrics Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Score Card */}
        <div className="animate-scale-up animation-delay-75">
          <CarbonScoreCard score={780} trendLabel="+15 pts this week" />
        </div>
        
        {/* Monthly Emissions */}
        <div className="animate-scale-up animation-delay-150">
          <MetricCard 
            title="Monthly Emissions" 
            value="1.2 tCO2e" 
            icon={Cloud} 
            trend={{ value: "-5%", label: "from last month", isPositive: true }} 
          />
        </div>
        
        {/* Active Streak */}
        <div className="animate-scale-up animation-delay-225">
          <MetricCard 
            title="Active Streak" 
            value="12 Days" 
            icon={Calendar}
            description="Keep it up!" 
          />
        </div>
        
        {/* Goal Progress */}
        <div className="animate-scale-up animation-delay-300">
          <GoalProgressCard 
            title="Emissions Goal" 
            current={1.2} 
            target={2.0} 
            unit="tCO2e" 
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4 items-start">
        {/* Activity Feed */}
        <div className="md:col-span-2 lg:col-span-3 animate-scale-up animation-delay-375">
          <ActivityFeed activities={recentActivities} />
        </div>
        
        {/* AI Insight Spotlight Card */}
        <div className="md:col-span-1 lg:col-span-1 animate-scale-up animation-delay-375">
          <AIInsightCard />
        </div>
      </div>
    </div>
  )
}
