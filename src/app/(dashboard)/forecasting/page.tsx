"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingDown, TrendingUp, Sparkles, AlertTriangle, Lightbulb, BarChart3, Leaf, Settings, CheckCircle2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchForecastSummary, fetchForecastTrends, fetchForecastPredictions, fetchForecastInsights } from "@/services/forecastService"

export default function ForecastingPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [summary, setSummary] = useState<any>(null)
  const [trends, setTrends] = useState<any>(null)
  const [predictions, setPredictions] = useState<any>(null)
  const [insights, setInsights] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [sumRes, trendRes, predRes, insRes] = await Promise.all([
          fetchForecastSummary(),
          fetchForecastTrends(),
          fetchForecastPredictions(),
          fetchForecastInsights()
        ])
        
        setSummary(sumRes.data)
        setTrends(trendRes.data)
        setPredictions(predRes.data)
        setInsights(insRes.data)
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load forecasting data.")
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertTriangle className="h-12 w-12 text-rose-500" />
        <h2 className="text-xl font-semibold">Error Loading Forecast</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    )
  }

  // Fallbacks if data is missing
  const hasSufficientData = predictions?.sufficientData
  
  // Prepare chart data
  // Combine historical and predicted into one timeline
  const chartData: any[] = []
  
  if (trends?.historicalTrend) {
    trends.historicalTrend.forEach((item: any) => {
      chartData.push({
        month: item.month,
        actual: parseFloat(item.actual.toFixed(2))
      })
    })
  }

  if (hasSufficientData && predictions?.predictions) {
    predictions.predictions.forEach((item: any) => {
      chartData.push({
        month: item.month,
        predicted: parseFloat(item.predicted.toFixed(2))
      })
    })
  }

  // Risk Level computation based on slope
  let riskLevel = "Low Risk"
  let riskColor = "text-emerald-500"
  let RiskIcon = TrendingDown
  if (hasSufficientData) {
    if (predictions.slope > 0) {
      riskLevel = "High Risk"
      riskColor = "text-rose-500"
      RiskIcon = TrendingUp
    } else if (predictions.slope > -0.05) { // very slow decrease
      riskLevel = "Moderate Risk"
      riskColor = "text-amber-500"
      RiskIcon = TrendingUp // Or a stable icon
    }
  }

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
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Current Emissions (Month)</p>
            <div className="flex items-center justify-between mt-1">
              <h4 className="text-2xl font-bold">{summary?.currentMonthCarbon?.toFixed(2) || "0.00"} <span className="text-sm font-normal text-muted-foreground">tCO₂e</span></h4>
              {summary?.monthlyTrend !== 0 && (
                <Badge variant="secondary" className={cn(
                  summary.monthlyTrend < 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                )}>
                  {summary.monthlyTrend < 0 ? <TrendingDown className="mr-1 h-3 w-3" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                  {Math.abs(summary.monthlyTrend).toFixed(1)}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Forecasted (Next Month)</p>
            {hasSufficientData ? (
               <h4 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{predictions?.nextMonth?.toFixed(2)} <span className="text-sm font-normal opacity-70">tCO₂e</span></h4>
            ) : (
               <h4 className="text-sm font-medium mt-2 text-muted-foreground">Need more data</h4>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Risk Level</p>
            {hasSufficientData ? (
              <div className="flex items-center mt-1 gap-2">
                <RiskIcon className={cn("h-5 w-5", riskColor)} />
                <h4 className={cn("text-2xl font-bold", riskColor)}>{riskLevel}</h4>
              </div>
            ) : (
              <h4 className="text-sm font-medium mt-2 text-muted-foreground">Insufficient Data</h4>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Goal Prediction</p>
            {hasSufficientData ? (
               <h4 className={`text-sm font-semibold mt-2 leading-tight ${predictions.slope < 0 ? 'text-emerald-500' : 'text-amber-500'}`}>{predictions?.goalPrediction}</h4>
            ) : (
               <h4 className="text-sm font-medium mt-2 text-muted-foreground">Keep logging to see predictions</h4>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Section 2: Chart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="flex flex-col flex-1 relative overflow-hidden border-border/40 bg-white/50 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.02)] dark:bg-zinc-950/50 dark:shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
            <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-emerald-500/5 blur-[80px] dark:bg-emerald-500/3" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">Emission Forecast Trend</CardTitle>
                <CardDescription>Historical data vs Future predictions</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-6 min-h-[350px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.15)" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}t`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                      formatter={(value: number, name: string) => [
                        `${value} tCO₂e`, 
                        name === "actual" ? "Actual" : "Predicted"
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
                      connectNulls
                    />
                    {/* Forecast future data */}
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      strokeDasharray="6 6" 
                      dot={{ r: 4, strokeWidth: 2 }} 
                      activeDot={{ r: 6, strokeWidth: 0 }} 
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No data available to display chart.</p>
                </div>
              )}
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
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Overall Insight</p>
                <h4 className="text-sm font-medium text-foreground leading-snug">{insights?.insight || "Insufficient data for detailed AI insights."}</h4>
              </div>
            </CardContent>
          </Card>

          {insights?.highestRiskArea && (
            <Card className="bg-rose-50/50 border-rose-200/60 dark:bg-rose-500/5 dark:border-rose-500/10 shadow-none">
              <CardContent className="p-4 flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40">
                  <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Highest Risk Area</p>
                  <h4 className="text-sm font-semibold text-foreground">{insights.highestRiskArea}</h4>
                  {insights.potentialIncrease && (
                    <p className="text-xs text-muted-foreground mt-1">Potential Increase: <span className="font-medium text-rose-600 dark:text-rose-400">+{insights.potentialIncrease}</span></p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {insights?.mostImpactfulArea && (
            <Card className="bg-muted/30 border-border/50 shadow-none">
              <CardContent className="p-4 flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/40">
                  <Lightbulb className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Most Impactful Area</p>
                  <h4 className="text-sm font-semibold text-foreground">{insights.mostImpactfulArea}</h4>
                  {insights.potentialReduction && (
                    <p className="text-xs text-muted-foreground mt-1">Potential Reduction: <span className="font-medium text-foreground">{insights.potentialReduction}</span></p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Section 4: Recommended Actions */}
      <div>
        <h2 className="text-base font-semibold mb-4">Recommended Actions</h2>
        {insights?.recommendations?.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {insights.recommendations.map((action: any, i: number) => (
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
        ) : (
          <div className="p-8 text-center border border-dashed rounded-lg border-border/50 bg-muted/20">
            <Leaf className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-3" />
            <p className="text-sm text-muted-foreground">More data is needed to generate personalized recommendations.</p>
          </div>
        )}
      </div>
    </div>
  )
}
