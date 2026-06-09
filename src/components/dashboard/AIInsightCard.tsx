import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface AIInsightCardProps {
  title: string
  insight: string
}

export function AIInsightCard({ title, insight }: AIInsightCardProps) {
  return (
    <Card className="col-span-full md:col-span-1 lg:col-span-1 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20">
      <CardHeader className="flex flex-row items-center space-x-2 pb-2">
        <Sparkles className="h-5 w-5 text-indigo-500" />
        <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/80">{insight}</p>
      </CardContent>
    </Card>
  )
}
