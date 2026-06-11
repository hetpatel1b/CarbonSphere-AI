"use client"

import { useState, useEffect } from "react"
import { Bot, TrendingDown, Zap, Droplet, Users, Sparkles, Activity, Car, ArrowRight } from "lucide-react"

export function AIHeroSection() {
  const [confidence, setConfidence] = useState(0)
  const [reduction, setReduction] = useState(0)

  // Counter animation effect for numbers
  useEffect(() => {
    const duration = 1500 // 1.5s animation
    const steps = 60
    const stepTime = duration / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      
      // Easing function (easeOutQuart)
      const progress = 1 - Math.pow(1 - currentStep / steps, 4)
      
      setConfidence(Math.round(progress * 92))
      setReduction(Math.round(progress * 18))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-950/80 dark:to-zinc-900/40 backdrop-blur-xl shadow-xl transition-all duration-500 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-[0_20px_50px_rgba(16,185,129,0.05)] group animate-scale-up">
      {/* Animated gradient glow effect behind the card */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/8 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl pointer-events-none" />

      {/* SVG Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Decorative floating AI icon background */}
      <div className="absolute -right-8 -top-8 opacity-[0.03] dark:opacity-[0.06] transform group-hover:scale-105 group-hover:rotate-6 transition-transform duration-1000 pointer-events-none">
        <Bot className="w-48 h-48 sm:w-64 sm:h-64 text-emerald-600 dark:text-emerald-400 animate-float" />
      </div>

      <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 z-10">
        
        {/* Left Content: Greeting & AI Summary */}
        <div className="space-y-4 max-w-xl">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 dark:border-emerald-500/20 bg-emerald-100/30 dark:bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse-glow" />
            <span>CarbonSphere AI Sustainability Brief</span>
          </div>
          
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight text-foreground leading-tight">
            Your sustainability performance is{" "}
            <span className="text-emerald-600 dark:text-emerald-400 relative inline-block">
              improving.
              <div className="absolute bottom-1.5 left-0 w-full h-[6px] bg-emerald-400/25 dark:bg-emerald-400/20 rounded-full -rotate-1"></div>
            </span>
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            AI analysis shows high compliance in transit logs. Scheduling operations during green grid hours remains your top expansion potential.
          </p>
          
          {/* AI Insights Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60 px-3 py-1 text-xs font-medium text-muted-foreground border border-zinc-200/50 dark:border-zinc-800/50 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all cursor-default shadow-sm hover:scale-[1.02]">
              <Car className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" /> Transportation
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60 px-3 py-1 text-xs font-medium text-muted-foreground border border-zinc-200/50 dark:border-zinc-800/50 hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-all cursor-default shadow-sm hover:scale-[1.02]">
              <Zap className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" /> Renewable Energy
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60 px-3 py-1 text-xs font-medium text-muted-foreground border border-zinc-200/50 dark:border-zinc-800/50 hover:border-sky-500/30 dark:hover:border-sky-500/30 transition-all cursor-default shadow-sm hover:scale-[1.02]">
              <Droplet className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" /> Water Saving
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60 px-3 py-1 text-xs font-medium text-muted-foreground border border-zinc-200/50 dark:border-zinc-800/50 hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all cursor-default shadow-sm hover:scale-[1.02]">
              <Users className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" /> Community Impact
            </div>
          </div>
        </div>

        {/* Right Content: AI Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 shrink-0 w-full lg:w-auto">
          {/* Metric 1 */}
          <div className="flex flex-col gap-1 p-4 rounded-2xl bg-zinc-100/40 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-sm shadow-sm hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 hover:scale-[1.03]">
            <span className="text-[11px] font-semibold text-muted-foreground">Predicted Reduction</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums">{reduction}%</span>
              <TrendingDown className="h-4.5 w-4.5 text-emerald-500 mb-1" />
            </div>
          </div>
          
          {/* Metric 2 */}
          <div className="flex flex-col gap-1 p-4 rounded-2xl bg-zinc-100/40 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-sm shadow-sm hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 hover:scale-[1.03]">
            <span className="text-[11px] font-semibold text-muted-foreground">Biggest Opportunity</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-sm sm:text-base font-extrabold text-foreground leading-none">Transportation</span>
            </div>
          </div>
          
          {/* Metric 3 */}
          <div className="flex flex-col gap-1 p-4 rounded-2xl bg-zinc-100/40 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-sm shadow-sm hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 hover:scale-[1.03]">
            <span className="text-[11px] font-semibold text-muted-foreground">Potential Reduction</span>
            <div className="flex items-end gap-1.5 mt-1">
              <span className="text-xl font-bold text-foreground tracking-tight tabular-nums">0.35</span>
              <span className="text-xs font-semibold text-muted-foreground mb-0.5">tCO₂e</span>
            </div>
          </div>
          
          {/* Metric 4 */}
          <div className="flex flex-col gap-1 p-4 rounded-2xl bg-zinc-100/40 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-sm shadow-sm hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 hover:scale-[1.03] relative overflow-hidden group/conf">
            <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 translate-y-[100%] group-hover/conf:translate-y-0 transition-transform duration-500"></div>
            <span className="relative text-[11px] font-semibold text-muted-foreground">AI Confidence</span>
            <div className="relative flex items-end gap-2 mt-1">
              <span className="text-xl font-bold text-foreground tracking-tight tabular-nums">{confidence}%</span>
              <Activity className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mb-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Trends & Action */}
      <div className="relative border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-100/30 dark:bg-zinc-950/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
        {/* Trend Indicators */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Score Rising</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Emissions Falling</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Rank Improving</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => {
            window.location.href = '/forecasting#recommended-actions';
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 group/btn hover:scale-[1.02] active:scale-[0.98]"
        >
          View Action Plan
          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
