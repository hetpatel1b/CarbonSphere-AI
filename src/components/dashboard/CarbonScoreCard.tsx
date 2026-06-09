import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

interface CarbonScoreCardProps {
  score: number
  trendLabel: string
}

export function CarbonScoreCard({ score, trendLabel }: CarbonScoreCardProps) {
  // Score is out of 1000
  const percentage = Math.min(Math.max(score / 1000, 0), 1)
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const offset = circumference - percentage * circumference

  return (
    <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-b from-emerald-50/50 to-emerald-50/20 dark:border-emerald-500/10 dark:from-emerald-950/20 dark:to-emerald-950/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sustainability Score</CardTitle>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/80 dark:bg-emerald-900/30">
          <Leaf className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center pb-1 pt-1">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="fill-none stroke-emerald-500/10 dark:stroke-emerald-500/8"
                strokeWidth="7"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="fill-none stroke-emerald-500 dark:stroke-emerald-400"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-bold tracking-tighter text-foreground">{score}</span>
              <span className="mt-1 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Excellent</span>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M6 9V3M6 3L3 6M6 3L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {trendLabel}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
