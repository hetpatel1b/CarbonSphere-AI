import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

interface CarbonScoreCardProps {
  score: number
  trendLabel: string
}

export function CarbonScoreCard({ score, trendLabel }: CarbonScoreCardProps) {
  return (
    <Card className="relative overflow-hidden border-emerald-500/20 bg-emerald-50/30 dark:border-emerald-500/10 dark:bg-emerald-950/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Sustainability Score</CardTitle>
        <Leaf className="h-4 w-4 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{score}</div>
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">{trendLabel}</p>
      </CardContent>
    </Card>
  )
}
