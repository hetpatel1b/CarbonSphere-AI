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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60 dark:bg-muted/40">
            <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {trend ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            <span className={`inline-flex items-center gap-1 ${trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${trend.isPositive ? "bg-emerald-500" : "bg-red-500"}`} />
              {trend.value}
            </span>
            <span className="text-muted-foreground font-normal">{trend.label}</span>
          </p>
        ) : description ? (
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
