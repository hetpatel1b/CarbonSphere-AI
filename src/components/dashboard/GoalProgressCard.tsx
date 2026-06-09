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
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Target className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold">{current} <span className="text-lg font-normal text-muted-foreground">{unit}</span></div>
          <div className="text-sm text-muted-foreground">/ {target} {unit}</div>
        </div>
        <Progress value={percentage} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">{percentage}% of goal reached</p>
      </CardContent>
    </Card>
  )
}
