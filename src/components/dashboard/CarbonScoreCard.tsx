import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

interface CarbonScoreCardProps {
  score: number
  trendLabel: string
}

export function CarbonScoreCard({ score, trendLabel }: CarbonScoreCardProps) {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sustainability Score</CardTitle>
        <Leaf className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{score}</div>
        <p className="text-xs text-muted-foreground mt-1">{trendLabel}</p>
      </CardContent>
    </Card>
  )
}
