"use client"

import { Sparkles, ArrowRight, TrendingDown, Target, Lightbulb, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AIInsight } from "@/services/aiCoachService"

interface AIInsightCardProps {
  insight?: AIInsight | null;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <Card className="col-span-full md:col-span-1 lg:col-span-1 relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md hover:shadow-[0_20px_40px_rgba(16,185,129,0.06)] hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-500 group">
      {/* Decorative hover grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#80808008_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

      {/* Dual neon background glow spots */}
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-500/5 dark:bg-emerald-500/8 blur-3xl pointer-events-none group-hover:bg-emerald-500/12 transition-colors duration-700 animate-pulse-glow" />
      <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-emerald-500/3 dark:bg-emerald-500/4 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Header */}
      <CardHeader className="relative pb-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100/80 dark:bg-emerald-950/40 border border-emerald-200/40 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-bold text-foreground">AI Insights</CardTitle>
          </div>
          {/* Live pulsing dot */}
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="relative flex flex-col gap-5 z-10">
        {!insight ? (
          <p className="text-[13px] leading-relaxed text-muted-foreground/90 font-medium">
            No recent AI insights available. Generate a new analysis in the AI Coach dashboard!
          </p>
        ) : (
          <>
            <p className="text-[13px] leading-relaxed text-muted-foreground/90 font-medium">
              Your latest AI analysis yielded a sustainability score of <span className="font-bold text-foreground">{insight.score}</span>.
            </p>
            
            {/* Insight Diagnostic Spotlight Box */}
            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/30 dark:bg-zinc-950/40 p-4 transition-all duration-300 group-hover:border-zinc-350 dark:group-hover:border-zinc-700">
              
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <TrendingDown className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">Reduction Potential</span>
                </div>
                <span className="text-xs font-black text-foreground shrink-0">{insight.carbonReductionPotential || "N/A"}</span>
              </div>
              
              <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-850" />
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Lightbulb className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">Monthly Goal</span>
                </div>
                <span className="text-xs font-bold text-foreground leading-snug truncate pl-6">{insight.monthlyGoal || "Keep logging activities!"}</span>
              </div>
              
              <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-850" />
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Zap className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">Top Recommendation</span>
                </div>
                <span className="text-xs font-bold text-foreground leading-snug truncate pl-6 text-emerald-600 dark:text-emerald-400">
                  {insight.challengeSuggestion || "Try a new challenge!"}
                </span>
              </div>
            </div>
          </>
        )}
        
        {/* CTA Button */}
        <Link 
          href="/ai-coach"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-50/50 hover:bg-emerald-100/60 dark:border-emerald-500/10 dark:bg-emerald-500/5 px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-inner"
        >
          Open AI Coach
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  )
}
