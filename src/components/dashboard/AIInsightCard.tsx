import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowRight, TrendingDown, Target, Lightbulb } from "lucide-react"
import Link from "next/link"

export function AIInsightCard() {
  return (
    <Card className="col-span-full md:col-span-1 lg:col-span-1 relative overflow-hidden border border-border/40 bg-white/50 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.02)] dark:bg-zinc-950/50 dark:shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
      {/* Background soft emerald glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/5 blur-[60px] dark:bg-emerald-500/3" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-emerald-500/3 blur-[60px] dark:bg-emerald-500/2" />

      {/* Header */}
      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-sm font-semibold text-foreground">AI Insights</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="relative flex flex-col gap-5">
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          You have <span className="font-medium text-foreground">3</span> new sustainability recommendations available.
        </p>
        
        {/* Content Box */}
        <div className="flex flex-col gap-3 rounded-lg border border-border/30 bg-muted/15 p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <TrendingDown className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">Potential Savings</span>
            </div>
            <span className="text-sm font-semibold text-foreground shrink-0">0.32 tCO2e</span>
          </div>
          
          <div className="h-px w-full bg-border/40 dark:bg-white/5" />
          
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Lightbulb className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">Top Opportunity</span>
            </div>
            <span className="text-[13px] font-medium text-foreground leading-snug">Reduce transportation emissions</span>
          </div>
          
          <div className="h-px w-full bg-border/40 dark:bg-white/5" />
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Target className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">Confidence</span>
            </div>
            <span className="text-sm font-semibold text-foreground shrink-0">92%</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <Link 
          href="/ai-coach"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200/60 bg-emerald-50/50 px-4 py-2.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-emerald-500/10 dark:bg-emerald-500/5 dark:text-emerald-400 dark:hover:bg-emerald-500/10 dark:focus:ring-offset-zinc-950"
        >
          Open AI Coach
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
