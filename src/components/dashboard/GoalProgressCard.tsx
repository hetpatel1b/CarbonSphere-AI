"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

interface GoalProgressCardProps {
  title: string
  current: number
  target: number
  unit: string
}

export function GoalProgressCard({ title, current, target, unit }: GoalProgressCardProps) {
  const [animatedCurrent, setAnimatedCurrent] = useState(0)

  const finalPercentage = Math.min(Math.round((current / target) * 100), 100)
  const animatedPercentage = Math.min(Math.round((animatedCurrent / target) * 100), 100)
  
  // Count up animation
  useEffect(() => {
    const duration = 1200 // 1.2s count up
    const steps = 60
    const stepTime = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = 1 - Math.pow(1 - currentStep / steps, 3) // easeOutCubic
      setAnimatedCurrent(progress * current)

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [current])

  return (
    <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 group">
      {/* Decorative background visual texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#80808008_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

      {/* Top hover accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/80 text-muted-foreground/80 group-hover:scale-115 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.1)] transition-all duration-300">
          <Target className="h-4 w-4" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex items-baseline gap-1.5 mb-4 select-none">
          <div className="text-2xl font-black tracking-tight text-foreground tabular-nums">
            {animatedCurrent.toFixed(1)}
          </div>
          <div className="text-xs font-bold text-muted-foreground/80">/ {target} {unit}</div>
        </div>
        
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground/80">
            <span>Progress</span>
            <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{animatedPercentage}%</span>
          </div>
          
          {/* Custom high-end animated progress track */}
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/50 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 rounded-full transition-all duration-300 relative overflow-hidden" 
              style={{ width: `${animatedPercentage}%` }}
            >
              {/* Shimmer Overlay */}
              <div 
                className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)] translate-x-[-100%] animate-shimmer" 
                style={{ animationDuration: "2.5s" }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
