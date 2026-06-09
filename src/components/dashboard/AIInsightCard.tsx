import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowRight, TrendingDown, Target } from "lucide-react"

interface AIInsightCardProps {
  title: string
  insight: string
}

export function AIInsightCard({ title, insight }: AIInsightCardProps) {
  // Extract potential saving from text if possible, or fallback to "0.1 tCO2e"
  const savingMatch = insight.match(/(\d+\.\d+\s*tCO2e)/)
  const potentialSaving = savingMatch ? savingMatch[1] : "0.1 tCO2e"

  return (
    <Card className="col-span-full md:col-span-1 lg:col-span-1 relative overflow-hidden border border-emerald-500/15 bg-white/50 backdrop-blur-xl shadow-[0_2px_16px_rgba(16,185,129,0.04)] dark:border-emerald-500/10 dark:bg-zinc-950/50 dark:shadow-[0_2px_16px_rgba(16,185,129,0.03)]">
      {/* Background soft emerald glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/8 blur-[60px] dark:bg-emerald-500/5" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-emerald-500/5 blur-[60px] dark:bg-emerald-500/3" />

      {/* Header */}
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold text-foreground truncate">AI Carbon Coach</CardTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">Personalized insight</p>
          </div>
        </div>
        <div className="inline-flex shrink-0 items-center rounded-full border border-emerald-200/60 bg-emerald-50/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-900/30 dark:text-emerald-300">
          High Impact
        </div>
      </CardHeader>
      
      {/* Body — flex column with justify-between anchors CTA at bottom */}
      <CardContent className="relative flex flex-col justify-between gap-4 min-h-0">
        {/* Recommendation text — clamped to 3 lines */}
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {insight}
        </p>
        
        {/* Stats Grid — equal height columns, no text wrapping */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 rounded-lg border border-border/30 bg-muted/15 px-3 py-2.5 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100/80 dark:bg-emerald-900/30">
              <TrendingDown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground truncate">Saving</div>
              <div className="text-sm font-semibold text-foreground truncate">{potentialSaving}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-border/30 bg-muted/15 px-3 py-2.5 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100/80 dark:bg-emerald-900/30">
              <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground truncate">Confidence</div>
              <div className="text-sm font-semibold text-foreground">92%</div>
            </div>
          </div>
        </div>
        
        {/* CTA Button — anchored at bottom, consistent height */}
        <button 
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-emerald-500/20 transition-all hover:shadow-md hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:from-emerald-600 dark:to-emerald-500 dark:focus:ring-offset-zinc-950"
          aria-label="View AI Recommendation"
        >
          View Recommendation
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </CardContent>
    </Card>
  )
}
