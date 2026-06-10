"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingDown, TrendingUp, Sparkles, AlertTriangle, Lightbulb, BarChart3, Leaf, Settings, CheckCircle2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Scenario = "current" | "improved" | "aggressive"

const CHART_DATA = [
  { month: "Jan", actual: 2.4 },
  { month: "Feb", actual: 2.2 },
  { month: "Mar", actual: 2.1 },
  { month: "Apr", actual: 1.9 },
  { month: "May", actual: 1.7 },
  { month: "Jun", actual: 1.5, current: 1.5, improved: 1.5, aggressive: 1.5 },
  { month: "Jul", current: 1.3, improved: 1.1, aggressive: 0.9 },
  { month: "Aug", current: 1.2, improved: 0.9, aggressive: 0.6 },
  { month: "Sep", current: 1.05, improved: 0.7, aggressive: 0.4 },
]

const SCENARIO_METRICS = {
  current: {
    nextMonth: "1.05",
    trend: "-12%",
    annual: "0.8",
    confidence: "92%",
    outlook: "Good",
    outlookColor: "text-emerald-500"
  },
  improved: {
    nextMonth: "0.70",
    trend: "-24%",
    annual: "1.5",
    confidence: "85%",
    outlook: "Excellent",
    outlookColor: "text-emerald-500"
  },
  aggressive: {
    nextMonth: "0.40",
    trend: "-45%",
    annual: "2.8",
    confidence: "70%",
    outlook: "Outstanding",
    outlookColor: "text-emerald-400"
  }
}

const RECOMMENDED_ACTIONS = [
  {
    title: "Switch to public transport",
    description: "Replace your daily commute with local transit.",
    reduction: "0.4 tCO₂e/yr",
    difficulty: "Medium",
    impact: "High",
  },
  {
    title: "Reduce home energy usage",
    description: "Optimize heating and switch to LED lighting.",
    reduction: "0.3 tCO₂e/yr",
    difficulty: "Easy",
    impact: "Medium",
  },
  {
    title: "Optimize weekly travel",
    description: "Combine errands and reduce unnecessary driving.",
    reduction: "0.2 tCO₂e/yr",
    difficulty: "Easy",
    impact: "Medium",
  },
  {
    title: "Increase renewable energy",
    description: "Opt-in to a green energy tariff with your provider.",
    reduction: "0.8 tCO₂e/yr",
    difficulty: "Hard",
    impact: "High",
  }
]

export default function ForecastingPage() {
  const [scenario, setScenario] = useState<Scenario>("current")
  const metrics = SCENARIO_METRICS[scenario]

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Carbon Forecasting</h1>
        <p className="text-sm text-muted-foreground">
          Predict future emissions and discover opportunities for improvement.
        </p>
      </div>

      {/* Section 1: Forecast Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Predicted Next Month</p>
            <div className="flex items-center justify-between mt-1">
              <h4 className="text-2xl font-bold">{metrics.nextMonth} <span className="text-sm font-normal text-muted-foreground">tCO₂e</span></h4>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingDown className="mr-1 h-3 w-3" />
                {metrics.trend.replace("-", "")}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Expected Annual Reduction</p>
            <h4 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{metrics.annual} <span className="text-sm font-normal opacity-70">tCO₂e</span></h4>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Forecast Confidence</p>
            <h4 className="text-2xl font-bold mt-1">{metrics.confidence}</h4>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Sustainability Outlook</p>
            <h4 className={`text-2xl font-bold mt-1 ${metrics.outlookColor}`}>{metrics.outlook}</h4>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Section 2 & 4: Chart and Scenarios */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="flex flex-col flex-1 relative overflow-hidden border-border/40 bg-white/50 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.02)] dark:bg-zinc-950/50 dark:shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
            <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-emerald-500/5 blur-[80px] dark:bg-emerald-500/3" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">Emission Forecast Trend</CardTitle>
                <CardDescription>Past 6 months vs Future 3 months</CardDescription>
              </div>
              
              {/* Section 4: Scenario Comparison */}
              <div className="flex bg-muted/40 p-1 rounded-lg border border-border/50">
                <button
                  onClick={() => setScenario("current")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    scenario === "current" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Current
                </button>
                <button
                  onClick={() => setScenario("improved")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    scenario === "improved" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Improved
                </button>
                <button
                  onClick={() => setScenario("aggressive")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    scenario === "aggressive" ? "bg-background shadow-sm text-emerald-600 dark:text-emerald-400" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Aggressive
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-6 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.15)" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}t`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    formatter={(value: number, name: string) => [
                      `${value} tCO₂e`, 
                      name === "actual" ? "Actual" : "Forecast"
                    ]}
                    labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
                  />
                  {/* Actual past data */}
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="hsl(var(--foreground))" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                  />
                  {/* Forecast future data */}
                  <Line 
                    type="monotone" 
                    dataKey={scenario} 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    strokeDasharray="6 6" 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: AI Forecast Insights */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h2 className="text-base font-semibold pt-1">AI Forecast Insights</h2>
          
          <Card className="bg-emerald-50/50 border-emerald-200/60 dark:bg-emerald-500/5 dark:border-emerald-500/10 shadow-none">
            <CardContent className="p-4 flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Most Impactful Area</p>
                <h4 className="text-sm font-semibold text-foreground">Transportation</h4>
                <p className="text-xs text-muted-foreground mt-1">Potential Reduction: <span className="font-medium text-emerald-600 dark:text-emerald-400">0.35 tCO₂e</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-rose-50/50 border-rose-200/60 dark:bg-rose-500/5 dark:border-rose-500/10 shadow-none">
            <CardContent className="p-4 flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40">
                <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Highest Risk Area</p>
                <h4 className="text-sm font-semibold text-foreground">Air Travel</h4>
                <p className="text-xs text-muted-foreground mt-1">Potential Increase: <span className="font-medium text-rose-600 dark:text-rose-400">+0.20 tCO₂e</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border/50 shadow-none">
            <CardContent className="p-4 flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/40">
                <Lightbulb className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Forecast Recommendation</p>
                <h4 className="text-sm font-semibold text-foreground">Use public transit 3x/week</h4>
                <p className="text-xs text-muted-foreground mt-1">Potential Reduction: <span className="font-medium text-foreground">0.12 tCO₂e/month</span></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 5: Recommended Actions */}
      <div>
        <h2 className="text-base font-semibold mb-4">Recommended Actions</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {RECOMMENDED_ACTIONS.map((action, i) => (
            <Card key={i} className="flex flex-col group hover:border-emerald-500/30 transition-colors">
              <CardHeader className="pb-3 flex-1">
                <CardTitle className="text-sm font-semibold leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{action.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-1">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted/30 border border-border/40">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Reduction</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{action.reduction}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Difficulty</span>
                    <span className="font-medium">{action.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Impact</span>
                    <span className="font-medium">{action.impact}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-border/30 mt-auto flex">
                <Button variant="ghost" className="w-full mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50 justify-between">
                  Apply Action
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
