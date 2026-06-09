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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Target className="h-4 w-4 text-muted-foreground/70" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1 mb-3">
          <div className="text-3xl font-semibold tracking-tight">{current}</div>
          <div className="text-sm font-medium text-muted-foreground">/ {target} {unit}</div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Progress</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  )
}
