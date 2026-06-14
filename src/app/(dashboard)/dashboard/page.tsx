"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Cloud, Calendar, Trophy, Target, Loader2, Activity, 
  Sparkles, Zap, ArrowRight, TrendingUp, Compass, Award, Plus
} from "lucide-react"
import { dashboardService, DashboardSummary, DashboardAnalytics } from "@/services/dashboardService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { OnboardingPanel } from "@/components/dashboard/OnboardingPanel"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"

// Custom Animated Number Component
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);
  
  useEffect(() => {
    let startTimestamp: number;
    let animationFrameId: number;
    const duration = 1500;
    const startValue = startValueRef.current;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = startValue + (value - startValue) * easeProgress;
      setDisplayValue(currentVal);
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
        startValueRef.current = value;
      }
    };
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <span>{displayValue % 1 !== 0 ? displayValue.toFixed(1) : Math.floor(displayValue)}</span>;
};

// Formatter
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
  return "Long ago";
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
      const dataPromise = Promise.all([
        dashboardService.getSummary(),
        dashboardService.getAnalytics()
      ]);

      toast.promise(dataPromise, {
        loading: "Establishing link...",
        success: (data) => {
          setSummary(data[0]);
          setAnalytics(data[1]);
          return "Systems synchronized";
        },
        error: (err: Error | unknown) => {
          setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || 'Failed to load dashboard');
          return "Telemetry failure";
        }
      });

      try {
        await dataPromise;
      } catch (e) {
        // Handled
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 w-full max-w-full">
        <Skeleton className="h-64 w-full rounded-[2rem] bg-zinc-900/50" />
        <Skeleton className="h-16 w-full rounded-2xl bg-zinc-900/50" />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-[1.5rem] bg-zinc-900/50" />)}
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-[2rem] bg-zinc-900/50" />
          <Skeleton className="h-[400px] lg:col-span-1 rounded-[2rem] bg-zinc-900/50" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-10">
        <ErrorState 
          title="Telemetry Interrupted"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!summary || !analytics) return null;

  if (summary.totalActivities === 0) {
    return (
      <div className="flex flex-col gap-8 animate-scale-up">
        <OnboardingPanel />
      </div>
    )
  }

  const currentMonthValue = summary.currentMonthCarbon || 0;
  const isHighVolume = currentMonthValue > 1000;
  const displayValue = isHighVolume ? currentMonthValue / 1000 : currentMonthValue;
  const displayUnit = isHighVolume ? "tCO₂e" : "kgCO₂e";

  const score = summary?.sustainabilityScore || 0;
  const level = Math.floor(score / 200) + 1;
  const titles = ["Novice", "Initiate", "Pioneer", "Guardian", "Architect", "Champion"];
  const levelTitle = titles[Math.min(level - 1, titles.length - 1)];

  return (
    <div data-testid="dashboard-loaded" className="flex flex-col gap-6 md:gap-8 pb-12 overflow-hidden max-w-full">
      
      {/* 1. Dynamic Tesla-Style Hero */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-white/10 shadow-2xl p-8 md:p-12 min-h-[300px] flex flex-col md:flex-row items-center gap-10 md:gap-16 group">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-teal-500/10 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full group-hover:bg-emerald-500/30 transition-colors" />
        
        {/* Arc Progress Visualization */}
        <div className="relative shrink-0 w-48 h-48 md:w-56 md:h-56">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <circle cx="50" cy="50" r="45" className="fill-none stroke-zinc-900" strokeWidth="6" />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              className="fill-none stroke-emerald-500 transition-all duration-1500 ease-out" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeDasharray={`${(score / 1000) * 283} 283`} 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Impact Score</span>
            <span className="text-4xl md:text-5xl font-black text-white"><AnimatedNumber value={score} /></span>
            <div className="flex items-center gap-1 mt-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
               <Trophy className="w-3 h-3 text-emerald-400" />
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Lvl {level}: {levelTitle}</span>
            </div>
          </div>
        </div>

        {/* Hero Copy & Quick Actions */}
        <div className="flex-1 w-full relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
             Good morning,<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Your systems are optimal.</span>
           </h1>
           <p className="mt-4 text-zinc-400 font-medium max-w-lg">
             You are tracking <span className="text-white font-bold">{displayValue.toFixed(1)} {displayUnit}</span> of emissions this month across {summary?.totalActivities} distinct activities.
           </p>

           {/* Quick Actions Shortcuts */}
           <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start w-full">
             <Link href="/log">
               <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all h-11 px-6">
                 <Plus className="w-4 h-4 mr-2" /> Log Activity
               </Button>
             </Link>
             <Link href="/analytics">
               <Button variant="outline" className="rounded-xl bg-zinc-950 border-white/10 hover:bg-zinc-900 text-white font-bold h-11 px-6">
                 <Activity className="w-4 h-4 mr-2" /> View Analytics
               </Button>
             </Link>
             <Link href="/challenges">
               <Button variant="outline" className="rounded-xl bg-zinc-950 border-white/10 hover:bg-zinc-900 text-white font-bold h-11 px-6">
                 <Target className="w-4 h-4 mr-2" /> Quests
               </Button>
             </Link>
           </div>
        </div>
      </div>

      {/* 2. Notion-Style AI Highlight Banner */}
      {summary?.aiInsight && (
        <div className="w-full flex items-center justify-between gap-4 p-4 md:p-5 rounded-2xl bg-zinc-900/60 border border-white/5 shadow-md hover:bg-zinc-800/80 transition-colors group cursor-pointer backdrop-blur-xl">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
               <Sparkles className="w-5 h-5 text-purple-400" />
             </div>
             <div>
               <h2 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-0.5">AI Copilot Insight</h2>
               <p className="text-sm font-semibold text-zinc-200 line-clamp-1">{summary.aiInsight.executiveSummary || summary.aiInsight.challengeSuggestion || "Analyze your footprint to find savings."}</p>
             </div>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
        </div>
      )}

      {/* 3. Glassmorphism Metric Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
         
         <div className="p-6 rounded-[1.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all hover:-translate-y-1 shadow-lg">
           <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 blur-[30px] rounded-full group-hover:bg-sky-500/20 transition-colors pointer-events-none" />
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 rounded-xl bg-zinc-950 border border-white/5"><Cloud className="w-4 h-4 text-sky-400" /></div>
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Monthly Footprint</span>
           </div>
           <h3 className="text-3xl font-black text-white"><AnimatedNumber value={displayValue} /> <span className="text-sm font-bold text-sky-400">{displayUnit}</span></h3>
         </div>

         <div className="p-6 rounded-[1.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all hover:-translate-y-1 shadow-lg">
           <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-[30px] rounded-full group-hover:bg-amber-500/20 transition-colors pointer-events-none" />
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 rounded-xl bg-zinc-950 border border-white/5"><Calendar className="w-4 h-4 text-amber-400" /></div>
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Events</span>
           </div>
           <h3 className="text-3xl font-black text-white"><AnimatedNumber value={summary.totalActivities} /></h3>
           <p className="text-[10px] font-bold text-amber-500 mt-2 uppercase tracking-widest">Logs Captured</p>
         </div>

         <div className="p-6 rounded-[1.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all hover:-translate-y-1 shadow-lg">
           <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-[30px] rounded-full group-hover:bg-purple-500/20 transition-colors pointer-events-none" />
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 rounded-xl bg-zinc-950 border border-white/5"><Target className="w-4 h-4 text-purple-400" /></div>
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Quests</span>
           </div>
           <h3 className="text-3xl font-black text-white"><AnimatedNumber value={summary.activeChallengesCount || 0} /></h3>
           <p className="text-[10px] font-bold text-purple-500 mt-2 uppercase tracking-widest">{summary.completedChallengesCount || 0} Completed</p>
         </div>

         <div className="p-6 rounded-[1.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all hover:-translate-y-1 shadow-lg">
           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[30px] rounded-full group-hover:bg-emerald-500/20 transition-colors pointer-events-none" />
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 rounded-xl bg-zinc-950 border border-white/5"><Award className="w-4 h-4 text-emerald-400" /></div>
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Trophies</span>
           </div>
           <h3 className="text-3xl font-black text-white"><AnimatedNumber value={summary.totalAchievementsUnlocked || 0} /></h3>
           <p className="text-[10px] font-bold text-emerald-500 mt-2 uppercase tracking-widest">Badges Earned</p>
         </div>

      </div>

      {/* 4. Journey Tracker & Activity Feed */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Left Side: Journey & Feed */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           
           {/* Sustainability Journey Tracker */}
           <Card className="bg-zinc-950/50 border border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
             <div className="p-6 md:p-8">
               <h3 className="text-lg font-black text-white flex items-center gap-2 mb-8">
                 <Compass className="w-5 h-5 text-sky-400" /> Sustainability Journey
               </h3>
               
               <div className="relative">
                  {/* Timeline Track */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-zinc-900 rounded-full" />
                  <div className="absolute top-4 left-4 h-1 bg-sky-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(14,165,233,0.5)]" style={{ width: '66%' }} />
                  
                  {/* Milestones */}
                  <div className="flex justify-between relative z-10">
                    <div className="flex flex-col items-center gap-3 group cursor-default">
                      <div className="w-9 h-9 rounded-full bg-sky-500 text-zinc-950 flex items-center justify-center font-black shadow-[0_0_15px_rgba(14,165,233,0.4)]">✓</div>
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Onboarded</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group cursor-default">
                      <div className="w-9 h-9 rounded-full bg-sky-500 text-zinc-950 flex items-center justify-center font-black shadow-[0_0_15px_rgba(14,165,233,0.4)]">✓</div>
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">First Log</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group cursor-default">
                      <div className="w-9 h-9 rounded-full bg-zinc-900 border-2 border-sky-500 text-sky-400 flex items-center justify-center font-black">3</div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Level 2</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group cursor-default">
                      <div className="w-9 h-9 rounded-full bg-zinc-900 border-2 border-zinc-800 text-zinc-600 flex items-center justify-center font-black">4</div>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Net Zero</span>
                    </div>
                  </div>
               </div>
             </div>
           </Card>

           {/* Live Feed */}
           <Card className="bg-zinc-950/50 border border-white/5 shadow-2xl rounded-[2rem] overflow-hidden flex-1">
             <div className="p-6 md:p-8">
               <h3 className="text-lg font-black text-white flex items-center gap-2 mb-6">
                 <Zap className="w-5 h-5 text-emerald-400" /> Live Feed
               </h3>
               {/* Extracting ActivityFeed styling inline for full aesthetic control */}
               <div className="space-y-6">
                 {(analytics?.recentActivities || []).map((act, i) => (
                   <div key={act._id} className="flex items-start gap-4 group">
                     <div className="w-2 h-2 mt-2 rounded-full bg-zinc-700 group-hover:bg-emerald-500 transition-colors shadow-[0_0_10px_rgba(16,185,129,0)] group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)] shrink-0" />
                     <div className="flex-1">
                       <div className="flex items-center justify-between">
                         <h4 className="text-sm font-bold text-white">{act.activityType}</h4>
                         <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{formatRelativeTime(act.date)}</span>
                       </div>
                       <p className="text-xs text-zinc-400 mt-1">{act.description || `Generated ${act.carbonEmission} kg CO2e`}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </Card>
        </div>

        {/* Right Side: Weekly Summary Widget */}
        <div className="lg:col-span-1">
          <Card className="bg-zinc-950/50 border border-white/5 shadow-2xl rounded-[2rem] overflow-hidden sticky top-6">
             <div className="p-6 md:p-8">
               <h3 className="text-lg font-black text-white flex items-center gap-2 mb-6">
                 <TrendingUp className="w-5 h-5 text-amber-400" /> Weekly Summary
               </h3>
               
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Quota</span>
                     <span className="text-xs font-black text-amber-400">{(displayValue / 4).toFixed(1)} <span className="text-[9px] text-amber-600">{displayUnit}</span></span>
                   </div>
                   <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                   </div>
                 </div>

                 <div>
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Logs</span>
                     <span className="text-xs font-black text-emerald-400">{Math.floor(summary.totalActivities / 4)} / 5</span>
                   </div>
                   <div className="flex gap-1 h-2">
                     <div className="flex-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                     <div className="flex-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                     <div className="flex-1 bg-zinc-900 rounded-full" />
                     <div className="flex-1 bg-zinc-900 rounded-full" />
                     <div className="flex-1 bg-zinc-900 rounded-full" />
                   </div>
                 </div>

                 <div className="pt-6 border-t border-white/5">
                   <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                     <p className="text-xs font-bold text-amber-400 mb-1">On Track!</p>
                     <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">You are projected to finish the week 12% below your emissions quota.</p>
                   </div>
                 </div>
               </div>
             </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
