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
    <Card className="col-span-full md:col-span-1 lg:col-span-1 relative overflow-hidden border border-emerald-500/30 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(16,185,129,0.1)] dark:border-emerald-500/20 dark:bg-zinc-950/60 dark:shadow-[0_8px_30px_rgba(16,185,129,0.05)] transition-all">
      {/* Background soft emerald glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/20 blur-[40px] dark:bg-emerald-500/15" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-[40px] dark:bg-emerald-500/10" />

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">AI Carbon Coach</CardTitle>
        </div>
        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-300">
          High Impact
        </div>
      </CardHeader>
      
      <CardContent className="relative flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {insight}
        </p>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 rounded-lg border border-emerald-100/50 bg-white/50 p-3 shadow-sm dark:border-emerald-800/30 dark:bg-black/20">
          <div className="flex flex-1 items-center gap-2">
            <TrendingDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Potential Saving</div>
              <div className="text-sm font-semibold text-foreground">{potentialSaving}</div>
            </div>
          </div>
          <div className="h-8 w-px bg-emerald-100 dark:bg-emerald-800/50" />
          <div className="flex flex-1 items-center gap-2">
            <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Confidence</div>
              <div className="text-sm font-semibold text-foreground">92%</div>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <button 
          className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:focus:ring-offset-zinc-950"
          aria-label="View AI Recommendation"
        >
          View Recommendation
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </CardContent>
    </Card>
  )
}
