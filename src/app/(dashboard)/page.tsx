"use client"

import { useState, useEffect, useRef } from "react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { CarbonScoreCard } from "@/components/dashboard/CarbonScoreCard"
import { GoalProgressCard } from "@/components/dashboard/GoalProgressCard"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { AIInsightCard } from "@/components/dashboard/AIInsightCard"
import { AIHeroSection } from "@/components/dashboard/AIHeroSection"
import { ActiveActionsWidget } from "@/components/dashboard/ActiveActionsWidget"
import { Cloud, Calendar, Trophy, Target, Loader2 } from "lucide-react"
import { dashboardService, DashboardSummary, DashboardAnalytics } from "@/services/dashboardService"

// Helper to format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const fetchDashboardData = async () => {
      try {
        const [summaryData, analyticsData] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getAnalytics()
        ]);
        
        setSummary(summaryData);
        setAnalytics(analyticsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    const isRateLimited = error.toLowerCase().includes('too many requests') || error.includes('429');
    
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4 text-center">
        <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          <Cloud className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">
          {isRateLimited ? "Too Many Requests" : "Failed to load dashboard"}
        </h2>
        <p className="text-muted-foreground max-w-md">
          {isRateLimited 
            ? "You've hit the API rate limit for this IP address. Please wait 15 minutes before trying again."
            : error}
        </p>
        {!isRateLimited && (
          <button 
            onClick={() => {
              loadingRef.current = false;
              setIsLoading(true);
              setError('');
            }} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  // Format activities for the feed
  const recentActivities = (analytics?.recentActivities || []).map(act => ({
    id: act._id,
    title: act.activityType,
    description: act.description || `Logged ${act.carbonEmission}kg CO2e`,
    time: formatRelativeTime(act.date)
  }));

  // Calculate trends (comparing this month to something else could be complex, keeping static trend label for UI integrity or making it dynamic if possible)
  // For the sake of UI we'll show current Month carbon. We'll format to tCO2e if > 1000kg
  const currentMonthValue = summary?.currentMonthCarbon || 0;
  const currentMonthDisplay = currentMonthValue > 1000 
    ? `${(currentMonthValue / 1000).toFixed(2)} tCO2e` 
    : `${currentMonthValue.toFixed(1)} kgCO2e`;

  return (
    <div className="flex flex-col gap-8">
      {/* AI Hero Section */}
      <div className="animate-scale-up">
        <AIHeroSection />
      </div>
      
      {/* Metrics Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Score Card */}
        <div className="animate-scale-up animation-delay-75">
          <CarbonScoreCard 
            score={summary?.sustainabilityScore || 0} 
            trendLabel="Current Score" 
          />
        </div>
        
        {/* Monthly Emissions */}
        <div className="animate-scale-up animation-delay-150">
          <MetricCard 
            title="Monthly Emissions" 
            value={currentMonthDisplay} 
            icon={Cloud} 
            trend={{ value: "", label: "this month", isPositive: true }} 
          />
        </div>
        
        {/* Active Streak */}
        <div className="animate-scale-up animation-delay-225">
          <MetricCard 
            title="Total Activities" 
            value={summary?.totalActivities.toString() || "0"} 
            icon={Calendar}
            description="Keep logging!" 
          />
        </div>
        
        {/* Goal Progress */}
        <div className="animate-scale-up animation-delay-300">
          <GoalProgressCard 
            title="Emissions Goal" 
            current={currentMonthValue > 1000 ? parseFloat((currentMonthValue / 1000).toFixed(2)) : currentMonthValue} 
            target={currentMonthValue > 1000 ? 2.0 : 2000} 
            unit={currentMonthValue > 1000 ? "tCO2e" : "kg"} 
          />
        </div>

        {/* Achievements Unlocked */}
        <div className="animate-scale-up animation-delay-375">
          <MetricCard 
            title="Achievements" 
            value={summary?.totalAchievementsUnlocked?.toString() || "0"} 
            icon={Trophy}
            description="Badges earned" 
          />
        </div>

        {/* Active Challenges */}
        <div className="animate-scale-up animation-delay-450">
          <MetricCard 
            title="Active Challenges" 
            value={summary?.activeChallengesCount?.toString() || "0"} 
            icon={Target}
            description={`${summary?.completedChallengesCount || 0} completed`} 
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 items-start">
        {/* Activity Feed */}
        <div className="md:col-span-1 lg:col-span-2 animate-scale-up animation-delay-500">
          <ActivityFeed activities={recentActivities} />
        </div>
        
        {/* Active Actions Widget */}
        <div className="md:col-span-1 lg:col-span-1 animate-scale-up animation-delay-375">
          <ActiveActionsWidget actions={(summary as any)?.activeActions || []} />
        </div>
        
        {/* AI Insight Spotlight Card */}
        <div className="md:col-span-1 lg:col-span-1 animate-scale-up animation-delay-450">
          <AIInsightCard insight={summary?.aiInsight} />
        </div>
      </div>
    </div>
  )
}
