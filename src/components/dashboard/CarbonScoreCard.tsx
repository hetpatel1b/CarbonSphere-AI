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
    <Card className="relative overflow-hidden border-emerald-500/20 bg-emerald-50/30 dark:border-emerald-500/10 dark:bg-emerald-950/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Sustainability Score</CardTitle>
        <Leaf className="h-4 w-4 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center pb-1 pt-2">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="fill-none stroke-emerald-500/15 dark:stroke-emerald-500/10"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="fill-none stroke-emerald-500/80 dark:stroke-emerald-400/80"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-semibold tracking-tight text-foreground">{score}</span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-600/90 dark:text-emerald-400/90">Excellent</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">{trendLabel}</p>
        </div>
      </CardContent>
    </Card>
  )
}
