"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: string
    label: string
    isPositive: boolean
  }
}

export function MetricCard({ title, value, description, icon: Icon, trend }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(value)

  // Smart count-up animation that extracts numbers from formatting (e.g. "1.2 tCO2e", "12 Days")
  useEffect(() => {
    if (typeof value === "number") {
      const duration = 1200
      const steps = 60
      const stepTime = duration / steps
      let currentStep = 0

      const timer = setInterval(() => {
        currentStep++
        const progress = 1 - Math.pow(1 - currentStep / steps, 3) // easeOutCubic
        setDisplayValue(Math.round(progress * value))

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, stepTime)

      return () => clearInterval(timer)
    } else {
      const numMatch = String(value).match(/([\d.]+)/)
      if (!numMatch) {
        const t = setTimeout(() => {
          setDisplayValue(value)
        }, 0)
        return () => clearTimeout(t)
      }

      const targetNum = parseFloat(numMatch[1])
      const duration = 1200
      const steps = 60
      const stepTime = duration / steps
      let currentStep = 0

      const timer = setInterval(() => {
        currentStep++
        const progress = 1 - Math.pow(1 - currentStep / steps, 3) // easeOutCubic
        const currentNum = (progress * targetNum).toFixed(numMatch[1].includes(".") ? 1 : 0)
        
        setDisplayValue(String(value).replace(numMatch[1], currentNum))

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, stepTime)

      return () => clearInterval(timer)
    }
  }, [value])

  return (
    <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 group">
      {/* Decorative hover grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#80808008_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

      {/* Top micro-line gradient on card hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/80 text-muted-foreground/80 group-hover:scale-115 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.1)] transition-all duration-300">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-2xl font-black tracking-tight text-foreground tabular-nums transition-transform duration-300 group-hover:translate-x-0.5">
          {displayValue}
        </div>
        
        {trend ? (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              trend.isPositive 
                ? "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/10" 
                : "bg-rose-100/80 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/10"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${trend.isPositive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              {trend.value}
            </span>
            <span className="text-muted-foreground/85 font-medium">{trend.label}</span>
          </p>
        ) : description ? (
          <p className="mt-3 text-xs text-muted-foreground/85 font-medium">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
