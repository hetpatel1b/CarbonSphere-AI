import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  TrendingDown,
  Target,
  Zap,
  Car,
  Home,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Flame,
  Lightbulb,
  Leaf,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/* Static mock data                                                    */
/* ------------------------------------------------------------------ */

const recommendations = [
  {
    id: "1",
    title: "Switch Friday commute to public transit",
    description: "Based on your travel patterns, switching your Friday drive to rail would eliminate 2.3 kg CO2e per trip.",
    saving: "0.12 tCO2e/mo",
    confidence: 94,
    category: "Transport",
    icon: Car,
  },
  {
    id: "2",
    title: "Optimize home heating schedule",
    description: "Reducing thermostat by 2°C during sleep hours could lower your energy footprint without comfort loss.",
    saving: "0.08 tCO2e/mo",
    confidence: 87,
    category: "Energy",
    icon: Home,
  },
  {
    id: "3",
    title: "Consolidate weekly grocery trips",
    description: "Combining two mid-week shops into one reduces driving emissions and food waste simultaneously.",
    saving: "0.05 tCO2e/mo",
    confidence: 79,
    category: "Lifestyle",
    icon: ShoppingBag,
  },
]

const weeklyGoals = [
  { id: "1", label: "Log 5 activities", current: 4, target: 5 },
  { id: "2", label: "Use public transit 3×", current: 2, target: 3 },
  { id: "3", label: "Meatless meals 4×", current: 4, target: 4 },
  { id: "4", label: "Energy audit check", current: 0, target: 1 },
]

const hotspots = [
  { source: "Daily car commute", share: 38, trend: "up" as const },
  { source: "Home electricity", share: 27, trend: "down" as const },
  { source: "Air travel", share: 19, trend: "neutral" as const },
  { source: "Food & diet", share: 16, trend: "down" as const },
]

const insights = [
  {
    id: "1",
    title: "Weekend driving spike",
    body: "Your weekend driving emissions are 2.4× higher than weekday averages. Consider carpooling or combining errands.",
    tag: "Pattern",
  },
  {
    id: "2",
    title: "Green energy opportunity",
    body: "Your utility provider now offers a 100% renewable tariff at only 3% premium. Switching would offset 0.4 tCO2e/year.",
    tag: "Opportunity",
  },
  {
    id: "3",
    title: "Streak momentum",
    body: "You've logged activities 12 days in a row — your longest streak. Consistency is the #1 predictor of long-term reduction.",
    tag: "Motivation",
  },
]

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AICoachPage() {
  const overallScore = 82
  const scoreRadius = 38
  const scoreCircumference = 2 * Math.PI * scoreRadius
  const scoreOffset = scoreCircumference - (overallScore / 100) * scoreCircumference

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">AI Coach</h1>
        <p className="text-sm text-muted-foreground">
          Personalized sustainability guidance powered by your activity data.
        </p>
      </div>

      {/* Row 1 — Score + Recommendations */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* AI Sustainability Score */}
        <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-b from-emerald-50/50 to-emerald-50/20 dark:border-emerald-500/10 dark:from-emerald-950/20 dark:to-emerald-950/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">AI Sustainability Score</CardTitle>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/80 dark:bg-emerald-900/30">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative flex h-36 w-36 items-center justify-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={scoreRadius} className="fill-none stroke-emerald-500/10 dark:stroke-emerald-500/8" strokeWidth="7" />
                  <circle cx="50" cy="50" r={scoreRadius} className="fill-none stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="7" strokeLinecap="round" strokeDasharray={scoreCircumference} strokeDashoffset={scoreOffset} />
                </svg>
                <div className="flex flex-col items-center text-center">
                  <span className="text-4xl font-bold tracking-tighter text-foreground">{overallScore}</span>
                  <span className="mt-1 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                    Great
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M6 9V3M6 3L3 6M6 3L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                +6 pts this week
              </div>
            </div>
            {/* Mini breakdown */}
            <div className="mt-2 grid grid-cols-3 gap-2 border-t border-border/30 pt-4">
              <div className="text-center">
                <div className="text-lg font-bold tracking-tight text-foreground">3</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Actions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold tracking-tight text-foreground">12</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold tracking-tight text-foreground">0.25</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">tCO2e Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Recommendations */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Top Recommendations</h2>
            <span className="text-xs font-medium text-muted-foreground">{recommendations.length} suggestions</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="group relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-emerald-500/50" />
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 dark:bg-emerald-900/30">
                      <rec.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <Badge className="bg-muted/60 text-muted-foreground border-border/30 text-[10px] font-medium uppercase tracking-wider hover:bg-muted/60">
                      {rec.category}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-sm font-semibold leading-snug">{rec.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">{rec.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-border/30 bg-muted/15 px-2.5 py-2 dark:border-white/5 dark:bg-white/[0.02]">
                      <div className="flex items-center gap-1.5">
                        <TrendingDown className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Saving</span>
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-foreground truncate">{rec.saving}</div>
                    </div>
                    <div className="rounded-md border border-border/30 bg-muted/15 px-2.5 py-2 dark:border-white/5 dark:bg-white/[0.02]">
                      <div className="flex items-center gap-1.5">
                        <Target className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Confidence</span>
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-foreground">{rec.confidence}%</div>
                    </div>
                  </div>
                  <button className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:hover:bg-emerald-500 dark:focus:ring-offset-zinc-950">
                    Apply
                    <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 — Weekly Goals + Emission Hotspots */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Weekly Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold">Weekly Goals</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">Your sustainability targets for this week.</CardDescription>
            </div>
            <div className="inline-flex items-center rounded-full bg-emerald-50/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {weeklyGoals.filter((g) => g.current >= g.target).length}/{weeklyGoals.length}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyGoals.map((goal) => {
              const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
              const complete = goal.current >= goal.target
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {complete ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-border/50" />
                      )}
                      <span className={`text-sm font-medium ${complete ? "text-foreground" : "text-muted-foreground"}`}>{goal.label}</span>
                    </div>
                    <span className="text-xs font-semibold tabular-nums">{goal.current}/{goal.target}</span>
                  </div>
                  <Progress
                    value={pct}
                    className={`h-2 ${complete ? "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400" : "[&>div]:bg-muted-foreground/30"}`}
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Emission Hotspots */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Emission Hotspots</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">Top sources contributing to your footprint.</CardDescription>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/80 dark:bg-amber-900/30">
                <Flame className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {hotspots.map((h, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{h.source}</span>
                  <div className="flex items-center gap-2">
                    {h.trend === "down" && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none"><path d="M6 3V9M6 9L3 6M6 9L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                    )}
                    {h.trend === "up" && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-red-500 dark:text-red-400">
                        <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none"><path d="M6 9V3M6 3L3 6M6 3L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                    )}
                    <span className="font-semibold tabular-nums">{h.share}%</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                    style={{ width: `${h.share}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — AI Insights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">AI Insights</h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5" />
            {insights.length} insights
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          {insights.map((insight) => (
            <Card key={insight.id} className="relative overflow-hidden">
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-500/5 blur-[40px] dark:bg-emerald-500/3" />
              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/80 dark:bg-emerald-900/30">
                      <Leaf className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-sm font-semibold">{insight.title}</CardTitle>
                  </div>
                  <Badge className="bg-muted/60 text-muted-foreground border-border/30 text-[10px] font-medium uppercase tracking-wider hover:bg-muted/60">
                    {insight.tag}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-muted-foreground">{insight.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
