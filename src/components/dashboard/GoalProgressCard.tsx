import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target } from "lucide-react"

interface GoalProgressCardProps {
  title: string
  current: number
  target: number
  unit: string
}

export function GoalProgressCard({ title, current, target, unit }: GoalProgressCardProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100)
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60 dark:bg-muted/40">
          <Target className="h-3.5 w-3.5 text-muted-foreground/70" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1.5 mb-4">
          <div className="text-2xl font-bold tracking-tight">{current}</div>
          <div className="text-xs font-medium text-muted-foreground">/ {target} {unit}</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Progress</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400" />
        </div>
      </CardContent>
    </Card>
  )
}
