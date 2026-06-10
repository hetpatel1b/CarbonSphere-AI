"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TrendingUp } from "lucide-react"

interface CarbonScoreCardProps {
  score: number
  trendLabel: string
}

export function CarbonScoreCard({ score, trendLabel }: CarbonScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  // Score is out of 1000
  const percentage = Math.min(Math.max(animatedScore / 1000, 0), 1)
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const offset = circumference - percentage * circumference

  // Count up animation on mount
  useEffect(() => {
    const duration = 1200 // 1.2s count up
    const steps = 60
    const stepTime = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = 1 - Math.pow(1 - currentStep / steps, 3) // easeOutCubic
      setAnimatedScore(Math.round(progress * score))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [score])

  return (
    <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md transition-all duration-300 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-[0_15px_30px_rgba(16,185,129,0.05)] hover:-translate-y-1 group">
      {/* Decorative background visual texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#80808008_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
      
      {/* Glow dot overlay */}
      <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-500 pointer-events-none" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sustainability Score</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100/80 dark:bg-emerald-950/40 border border-emerald-200/30 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
          <Leaf className="h-4 w-4" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex flex-col items-center justify-center pb-2 pt-2">
          
          {/* Animated Progress Ring */}
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="scoreRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="60%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="fill-none stroke-zinc-200/50 dark:stroke-zinc-800/50"
                strokeWidth="6.5"
              />
              {/* Animated Foreground Circle with Glow */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="fill-none"
                stroke="url(#scoreRingGrad)"
                strokeWidth="6.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ 
                  transition: "stroke-dashoffset 0.1s ease-out",
                  filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.3))" 
                }}
              />
            </svg>
            
            {/* Centered Score Label */}
            <div className="flex flex-col items-center justify-center text-center select-none">
              <span className="text-4xl font-black tracking-tight text-foreground tabular-nums transition-all group-hover:scale-105 duration-350">
                {animatedScore}
              </span>
              <span className="mt-1 inline-flex items-center rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/10">
                Excellent
              </span>
            </div>
          </div>

          {/* Trend Tagline */}
          <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5 animate-pulse" />
            {trendLabel}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
