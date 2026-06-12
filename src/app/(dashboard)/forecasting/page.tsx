"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingDown, TrendingUp, Sparkles, AlertTriangle, Lightbulb, Leaf, ArrowRight, Activity as ActivityIcon, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchForecastData, applyAction, generateForecast } from "@/services/forecastService"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"

interface RecommendationAction {
  title: string;
  description: string;
  reduction: string;
  difficulty: string;
  impact: string;
}

interface ForecastData {
  historicalSeries: { month: string; actual: number }[];
  predictionSeries: { month: string; predicted: number }[];
  riskLevel: string;
  previousMonth: number;
  currentMonth: number;
  forecastNextMonth: number;
  trendDirection: string;
  aiInsights: {
    insight: string;
    highestRiskArea: string;
    potentialIncrease?: string;
    potentialReduction?: string;
  };
  recommendations: RecommendationAction[];
}

export default function ForecastingPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  
  const [selectedAction, setSelectedAction] = useState<RecommendationAction | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [needsGeneration, setNeedsGeneration] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleApplyAction = async () => {
    if (!selectedAction) return;

    const reductionMatch = selectedAction.reduction?.match(/[\d.]+/);
    const reductionValue = reductionMatch ? parseFloat(reductionMatch[0]) : 0;

    const applyPromise = applyAction({
      title: selectedAction.title,
      reduction: reductionValue,
      difficulty: selectedAction.difficulty,
      impact: selectedAction.impact
    });

    toast.promise(applyPromise, {
      loading: "Applying action...",
      success: () => {
        setSelectedAction(null);
        return `Successfully added "${selectedAction.title}" to your plan.`;
      },
      error: (err: Error | unknown) => {
        return (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error).message || "Failed to apply action";
      }
    });

    try {
      setIsApplying(true);
      await applyPromise;
    } catch (err) {
      // Handled in toast error
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchForecastData()
        if (res.needsGeneration) {
          setNeedsGeneration(true)
        } else {
          setForecast(res as unknown as ForecastData)
        }
      } catch (err: unknown) {
        setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error).message || "Failed to load forecasting data.")
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const handleGenerateForecast = async () => {
    setIsGenerating(true)
    try {
      const res = await generateForecast()
      setForecast(res.data as unknown as ForecastData)
      setNeedsGeneration(false)
      toast.success("Forecast generated successfully")
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to generate forecast")
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-8">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md mt-1" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <Skeleton className="h-[400px] lg:col-span-8 rounded-2xl" />
          <Skeleton className="h-[400px] lg:col-span-4 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-10">
        <ErrorState 
          title="Failed to load forecast"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (needsGeneration) {
    return (
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Carbon Forecasting</h1>
          <p className="text-sm text-muted-foreground">
            Predict future emissions and discover opportunities for improvement.
          </p>
        </div>
        <EmptyState
          icon={TrendingUp}
          title="No forecast available yet"
          description="Generate your first AI-driven forecast from your activity history."
          actionLabel={isGenerating ? "Generating..." : "Generate Forecast"}
          onAction={handleGenerateForecast}
          className="my-8"
        />
      </div>
    )
  }

  // Fallbacks if data is missing
  const hasSufficientData = (forecast?.historicalSeries?.length || 0) > 0
  
  // Prepare chart data
  const chartMap = new Map<string, { month: string; actual?: number; predicted?: number }>();
  let lastActual: { month: string; val: number } | null = null;

  if (forecast?.historicalSeries) {
    forecast.historicalSeries.forEach((item) => {
      chartMap.set(item.month, { month: item.month, actual: parseFloat(item.actual.toFixed(2)) });
      lastActual = { month: item.month, val: parseFloat(item.actual.toFixed(2)) };
    });
  }

  if (forecast?.predictionSeries) {
    // To connect lines visually, inject the last actual point as the first prediction point
    if (lastActual) {
      const la = lastActual as { month: string; val: number };
      if (chartMap.has(la.month)) {
        const item = chartMap.get(la.month);
        if (item) item.predicted = la.val;
      }
    }

    forecast.predictionSeries.forEach((item) => {
      if (chartMap.has(item.month)) {
        const ci = chartMap.get(item.month);
        if (ci) ci.predicted = parseFloat(item.predicted.toFixed(2));
      } else {
        chartMap.set(item.month, { month: item.month, predicted: parseFloat(item.predicted.toFixed(2)) });
      }
    });
  }

  const chartData = Array.from(chartMap.values()).sort((a, b) => a.month.localeCompare(b.month));

  if (chartData.length === 1) {
    chartData.unshift({
      month: "Prev",
      actual: 0,
      predicted: chartData[0].actual || chartData[0].predicted || 0
    });
  }

  // Risk Level computation
  let riskLevel = forecast?.riskLevel || "LOW"
  let riskColor = "text-emerald-500"
  let RiskIcon = TrendingDown

  if (riskLevel === "CRITICAL") {
    riskColor = "text-rose-600 dark:text-rose-500"
    RiskIcon = AlertTriangle
  } else if (riskLevel === "HIGH") {
    riskColor = "text-rose-500"
    RiskIcon = TrendingUp
  } else if (riskLevel === "MEDIUM") {
    riskColor = "text-amber-500"
    RiskIcon = ActivityIcon
  }

  // Monthly trend calculation
  let monthlyTrend = 0;
  if ((forecast?.previousMonth || 0) > 0) {
    monthlyTrend = (((forecast?.currentMonth || 0) - (forecast?.previousMonth || 0)) / (forecast?.previousMonth || 1)) * 100;
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

      {!hasSufficientData ? (
        <EmptyState
          icon={TrendingUp}
          title="No forecast available yet"
          description="Generate your first AI-driven forecast from your activity history."
          actionLabel={isGenerating ? "Generating..." : "Generate Forecast"}
          onAction={handleGenerateForecast}
          className="my-8"
        />
      ) : (
        <>
          {/* Section 1: Forecast Summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Current Emissions (Month)</p>
            <div className="flex items-center justify-between mt-1">
              <h4 className="text-2xl font-bold">{forecast?.currentMonth?.toFixed(2) || "0.00"} <span className="text-sm font-normal text-muted-foreground">tCO₂e</span></h4>
              {monthlyTrend !== 0 && (
                <Badge variant="secondary" className={cn(
                  monthlyTrend < 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                )}>
                  {monthlyTrend < 0 ? <TrendingDown className="mr-1 h-3 w-3" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                  {Math.abs(monthlyTrend).toFixed(1)}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Forecasted (Next Month)</p>
            {hasSufficientData ? (
               <h4 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{forecast?.forecastNextMonth?.toFixed(2)} <span className="text-sm font-normal opacity-70">tCO₂e</span></h4>
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
                <h4 className={cn("text-2xl font-bold", riskColor)}>{riskLevel} Risk</h4>
              </div>
            ) : (
              <h4 className="text-sm font-medium mt-2 text-muted-foreground">Insufficient Data</h4>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Trend Direction</p>
            {hasSufficientData ? (
               <h4 className={`text-xl font-bold mt-2 leading-tight ${forecast?.trendDirection === 'Decreasing' ? 'text-emerald-500' : (forecast?.trendDirection === 'Stable' ? 'text-amber-500' : 'text-rose-500')}`}>{forecast?.trendDirection}</h4>
            ) : (
               <h4 className="text-sm font-medium mt-2 text-muted-foreground">Keep logging activities</h4>
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
            <CardContent className="pt-4 pb-6 min-h-[300px] md:min-h-[350px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart role="img" aria-label="Forecasting Data Chart" data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <h4 className="text-sm font-medium text-foreground leading-snug">{forecast?.aiInsights?.insight || "Insufficient data for detailed AI insights."}</h4>
              </div>
            </CardContent>
          </Card>

          {forecast?.aiInsights?.highestRiskArea && forecast.aiInsights.highestRiskArea !== "None" && (
            <Card className="bg-rose-50/50 border-rose-200/60 dark:bg-rose-500/5 dark:border-rose-500/10 shadow-none">
              <CardContent className="p-4 flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40">
                  <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Highest Risk Area</p>
                  <h4 className="text-sm font-semibold text-foreground">{forecast.aiInsights.highestRiskArea}</h4>
                  {forecast.aiInsights.potentialIncrease && (
                    <p className="text-xs text-muted-foreground mt-1">Potential Increase: <span className="font-medium text-rose-600 dark:text-rose-400">+{forecast.aiInsights.potentialIncrease}</span></p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {forecast?.aiInsights?.potentialReduction && (
            <Card className="bg-muted/30 border-border/50 shadow-none">
              <CardContent className="p-4 flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/40">
                  <Lightbulb className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Potential Reduction</p>
                  <h4 className="text-sm font-semibold text-foreground">{forecast.aiInsights.potentialReduction}</h4>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Section 4: Recommended Actions */}
      <div>
        <h2 className="text-base font-semibold mb-4">Recommended Actions</h2>
        {(forecast?.recommendations?.length || 0) > 0 ? (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {forecast?.recommendations?.map((action, i: number) => (
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
                  <Button 
                    onClick={() => setSelectedAction(action)}
                    variant="ghost" 
                    className="w-full mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50 justify-between"
                  >
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

      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply Sustainability Action</DialogTitle>
            <DialogDescription>
              Commit to this action and track its impact on your forecast.
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                  <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{selectedAction.title}</h4>
                  <p className="text-xs text-muted-foreground">{selectedAction.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50 border border-border/50">
                  <span className="text-[10px] uppercase text-muted-foreground font-medium">Reduction</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedAction.reduction}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50 border border-border/50">
                  <span className="text-[10px] uppercase text-muted-foreground font-medium">Difficulty</span>
                  <span className="text-xs font-bold mt-0.5">{selectedAction.difficulty}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50 border border-border/50">
                  <span className="text-[10px] uppercase text-muted-foreground font-medium">Impact</span>
                  <span className="text-xs font-bold mt-0.5">{selectedAction.impact}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setSelectedAction(null)}>Cancel</Button>
            <Button 
              onClick={handleApplyAction} 
              disabled={isApplying}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isApplying ? "Applying..." : "Apply Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  )
}
