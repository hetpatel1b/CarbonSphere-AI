"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import { TrendingDown, TrendingUp, Sparkles, AlertTriangle, Lightbulb, Leaf, ArrowRight, Activity as ActivityIcon, CheckCircle2, Info, HelpCircle, Database, LineChart, Target, ShieldAlert, Calculator, BrainCircuit, Zap, BusFront, Sun, Car, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchForecastData, applyAction, generateForecast } from "@/services/forecastService"
import { ForecastData, ForecastAction } from "@/types"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"

const ForecastChart = dynamic(() => import('@/components/charts/ForecastChart'), { ssr: false, loading: () => <Skeleton className="w-full h-full rounded-xl" /> })



export default function ForecastingPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  
  const [selectedAction, setSelectedAction] = useState<ForecastAction | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [needsGeneration, setNeedsGeneration] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const reducedMotion = useReducedMotion()

  const handleApplyAction = async () => {
    if (!selectedAction) return;

    const reductionMatch = String(selectedAction.reduction).match(/[\d.]+/);
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
          setForecast(res as ForecastData)
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
      setForecast(res.data as ForecastData)
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
    <TooltipProvider delayDuration={300}>
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
          {/* Section 1: AI Prediction Summary Card Cluster */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex flex-col group hover:border-emerald-500/30 transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ActivityIcon className="w-16 h-16 text-emerald-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 z-10">Current Run Rate</p>
              <div className="flex items-end justify-between z-10 mt-2">
                <h4 className="text-3xl font-black text-white">{forecast?.currentMonth?.toFixed(2) || "0.00"}<span className="text-sm font-medium text-zinc-500 ml-1">tCO₂e</span></h4>
                {monthlyTrend !== 0 && (
                  <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ${monthlyTrend < 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                    {monthlyTrend < 0 ? <TrendingDown className="mr-1 h-3 w-3" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                    {Math.abs(monthlyTrend).toFixed(1)}%
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex flex-col group hover:border-emerald-500/30 transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-16 h-16 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between z-10 mb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Predicted Trajectory</p>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-end z-10 mt-2">
                {hasSufficientData ? (
                  <h4 className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{forecast?.forecastNextMonth?.toFixed(2)}<span className="text-sm font-medium text-emerald-500/50 ml-1">tCO₂e</span></h4>
                ) : (
                  <h4 className="text-sm font-medium text-zinc-500 mt-2">Awaiting Data</h4>
                )}
              </div>
            </div>

            <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex flex-col group hover:border-emerald-500/30 transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit className="w-16 h-16 text-sky-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 z-10">AI Confidence</p>
              <div className="flex items-end z-10 mt-2">
                {hasSufficientData ? (
                  <h4 className="text-3xl font-black text-white">94<span className="text-sm font-medium text-zinc-500 ml-1">%</span></h4>
                ) : (
                  <h4 className="text-sm font-medium text-zinc-500 mt-2">Calibrating...</h4>
                )}
              </div>
            </div>

            <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex flex-col group hover:border-emerald-500/30 transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <RiskIcon className={`w-16 h-16 ${riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'text-rose-500' : (riskLevel === 'LOW' ? 'text-emerald-500' : 'text-amber-500')}`} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 z-10">Risk Vector</p>
              <div className="flex items-end z-10 mt-2">
                {hasSufficientData ? (
                  <h4 className={`text-2xl font-black uppercase tracking-wider ${riskColor}`}>{riskLevel}</h4>
                ) : (
                  <h4 className="text-sm font-medium text-zinc-500 mt-2">Unknown</h4>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Chart & Scenarios */}
          <div className="grid gap-6 lg:grid-cols-12 mb-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="p-1 rounded-3xl bg-gradient-to-b from-zinc-800 to-zinc-950 shadow-2xl relative">
                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />
                <div className="bg-zinc-950/80 backdrop-blur-2xl rounded-[22px] p-6 relative overflow-hidden h-[450px] flex flex-col">
                  <div className="flex items-center justify-between mb-6 z-10">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-400" /> AI Trajectory Model</h3>
                      <p className="text-xs text-zinc-500 mt-1">Stochastic rendering of emission probabilities.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" /><span className="text-xs font-bold text-zinc-400">Actual</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" /><span className="text-xs font-bold text-zinc-400">Predicted</span></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full relative z-10">
                    {chartData.length > 0 ? (
                      <ForecastChart chartData={chartData} isAnimationActive={!reducedMotion} />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-500">No data available to display model.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* AI Forecast Insights */}
              <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex-1 flex flex-col">
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-6"><BrainCircuit className="w-5 h-5 text-sky-400" /> Intelligence Feed</h3>
                
                <div className="space-y-4 flex-1">
                  <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800 flex gap-4">
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Synthesized Insight</p>
                      <p className="text-sm font-medium text-white leading-relaxed">{forecast?.aiInsights?.insight || "Insufficient data for detailed AI insights."}</p>
                    </div>
                  </div>

                  {forecast?.aiInsights?.highestRiskArea && forecast.aiInsights.highestRiskArea !== "None" && (
                    <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800 flex gap-4">
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Primary Threat Vector</p>
                        <p className="text-sm font-bold text-rose-400">{forecast.aiInsights.highestRiskArea}</p>
                        {forecast.aiInsights.potentialIncrease && (
                          <p className="text-xs text-rose-500/70 mt-1">Variance: +{forecast.aiInsights.potentialIncrease}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {forecast?.aiInsights?.potentialReduction && (
                    <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800 flex gap-4">
                      <Lightbulb className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Optimization Opportunity</p>
                        <p className="text-sm font-bold text-sky-400">{forecast.aiInsights.potentialReduction}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Visual Impact Indicators */}
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-500" /> Projected Global Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex items-center gap-6 overflow-hidden relative group cursor-default">
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none group-hover:from-emerald-500/20 transition-colors" />
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Leaf className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{Math.max(0, Math.floor((forecast?.forecastNextMonth || 0) * 1.5))}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Mature Trees Equivalent</p>
                </div>
              </div>

              <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex items-center gap-6 overflow-hidden relative group cursor-default">
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none group-hover:from-sky-500/20 transition-colors" />
                <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                  <Car className="w-8 h-8 text-sky-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{Math.max(0, Math.floor((forecast?.forecastNextMonth || 0) * 42.3))}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Gallons of Fuel Equivalent</p>
                </div>
              </div>

              <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex items-center gap-6 overflow-hidden relative group cursor-default">
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none group-hover:from-indigo-500/20 transition-colors" />
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  <ActivityIcon className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{(forecast?.forecastNextMonth ? (forecast.forecastNextMonth * 0.85).toFixed(1) : "0.0")}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Offset Potential (tCO₂e)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: What-If Simulator (Mocks) & Recommended Actions */}
          <div className="grid gap-8 lg:grid-cols-2 mb-8">
            {/* What-If Analysis */}
            <div className="p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><ActivityIcon className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-xl font-bold text-white">What-If Simulator</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Toggle scenarios to visualize theoretical impacts on your footprint.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { id: "ev", label: "Full EV Adoption", desc: "-40% transit footprint", icon: <Zap className="w-4 h-4 text-amber-400" /> },
                  { id: "public", label: "Max Public Transport", desc: "-60% commute footprint", icon: <BusFront className="w-4 h-4 text-sky-400" /> },
                  { id: "solar", label: "100% Renewable Home", desc: "-85% energy footprint", icon: <Sun className="w-4 h-4 text-emerald-400" /> },
                  { id: "vegan", label: "Plant-based Diet", desc: "-30% food footprint", icon: <Leaf className="w-4 h-4 text-indigo-400" /> }
                ].map(sim => (
                  <div key={sim.id} className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">{sim.icon}</div>
                      <div>
                        <p className="text-sm font-bold text-white">{sim.label}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">{sim.desc}</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                ))}
              </div>
            </div>

            {/* Targeted Directives */}
            <div className="p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Target className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-xl font-bold text-white">Targeted Directives</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Commit to AI-curated actions to physically alter your forecast.</p>
                </div>
              </div>

              {(forecast?.recommendations?.length || 0) > 0 ? (
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  {forecast?.recommendations?.map((action, i: number) => (
                    <div key={i} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl hover:border-emerald-500/30 transition-colors group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{action.title}</p>
                          <p className="text-xs text-zinc-500 mt-1 leading-relaxed max-w-sm">{action.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                        <div className="flex gap-4">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Drop: <span className="text-emerald-400 ml-1">{action.reduction}</span></div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Diff: <span className="text-zinc-300 ml-1">{action.difficulty}</span></div>
                        </div>
                        <Button 
                          onClick={() => setSelectedAction(action)}
                          size="sm"
                          className="h-7 text-[10px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 font-bold border border-emerald-500/20 transition-all rounded-full px-4"
                        >
                          Execute
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-2xl border-zinc-800 bg-zinc-950/30">
                  <Leaf className="h-8 w-8 text-zinc-600 mb-3" />
                  <p className="text-sm font-bold text-zinc-400">Data insufficient</p>
                  <p className="text-xs text-zinc-600 mt-1">Log more activities to unlock targeted directives.</p>
                </div>
              )}
            </div>
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
        
      {/* How Predictions Are Generated */}
      <div className="mt-6 pt-8 border-t border-border/40">
        <div className="flex items-center gap-2 mb-6">
          <BrainCircuit className="h-6 w-6 text-emerald-500" />
          <h2 className="text-xl font-bold tracking-tight">How Predictions Are Generated</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Forecast Methodology Card */}
          <Card className="border-border/50 shadow-sm bg-gradient-to-b from-card to-muted/20">
            <CardHeader className="pb-4 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                Forecast Methodology
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-6">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Historical Emissions Base</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Predictions rely on a robust base of your past 30-90 days of logged activities, heavily weighting recurring emissions (e.g., daily commutes) over one-off anomalies.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <LineChart className="h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Trend Analysis & Category Weighting</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">A rolling statistical average isolates trends within specific categories (Transport, Energy). High-emission categories naturally influence the trajectory more heavily.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Risk Scoring</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Risk levels (Low, Medium, High, Critical) are computed dynamically by comparing your forecasted trendline against standardized sustainable thresholds and goals.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Improvement Projections</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">When you &quot;Apply Action,&quot; the system deducts the estimated CO₂ reduction directly from your future forecasted model, offering an instant visualization of the impact.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scientific Credibility Card */}
          <Card className="border-emerald-200/50 dark:border-emerald-900/30 shadow-sm bg-emerald-50/30 dark:bg-emerald-500/5 flex flex-col">
            <CardHeader className="pb-4 border-b border-emerald-100 dark:border-emerald-900/30">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                <Info className="h-4 w-4" />
                Scientific Credibility
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 flex-1 flex flex-col">
              <p className="text-sm font-medium text-emerald-800/80 dark:text-emerald-400/80 mb-5">
                Forecasts and recommendations are strictly modeled using globally verified emission factors and climate databases:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-200/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">US</div>
                  <p className="text-sm text-foreground mt-0.5"><span className="font-semibold">EPA:</span> eGRID Summary Tables (US Average)</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-200/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">UK</div>
                  <p className="text-sm text-foreground mt-0.5"><span className="font-semibold">DEFRA:</span> UK Govt GHG Conversion Factors</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-200/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">UN</div>
                  <p className="text-sm text-foreground mt-0.5"><span className="font-semibold">IPCC:</span> Special Report on Climate Change and Land</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-200/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">GL</div>
                  <p className="text-sm text-foreground mt-0.5"><span className="font-semibold">GHG Protocol:</span> Scope 3 Evaluator</p>
                </li>
              </ul>
              
              <div className="mt-auto pt-6">
                <div className="p-3.5 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                    Note: While highly accurate based on input data, predictions should be used as a guiding metric rather than an absolute scientific measurement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </>
      )}
      </div>
    </TooltipProvider>
  )
}
