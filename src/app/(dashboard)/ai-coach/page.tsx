"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles, TrendingDown, Target, Zap, Car, Home, 
  ShoppingBag, ArrowRight, Lightbulb, Leaf, Loader2, RefreshCw, AlertCircle
} from "lucide-react"
import { aiCoachService, AICoachResponse } from "@/services/aiCoachService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { toast } from "sonner"

export default function AICoachPage() {
  const [data, setData] = useState<AICoachResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [animatedScore, setAnimatedScore] = useState(0)

  const loadLatest = async () => {
    try {
      setIsLoading(true)
      const res = await aiCoachService.getLatestInsight()
      setData(res)
    } catch (err: unknown) {
      setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || "Failed to load AI insights")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    const genPromise = aiCoachService.generateNewAnalysis()
    
    toast.promise(genPromise, {
      loading: "Analyzing data...",
      success: (res) => {
        setData(res)
        return "AI analysis generated"
      },
      error: (err: Error | unknown) => {
        setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || "Failed to generate new analysis")
        return "AI service temporarily unavailable"
      }
    })

    try {
      setIsGenerating(true)
      setError(null)
      await genPromise
    } catch (err) {
      // Handled in toast error
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    let mounted = true;
    const fetchLatest = async () => {
      try {
        setIsLoading(true)
        const res = await aiCoachService.getLatestInsight()
        if (mounted) setData(res)
      } catch (err: unknown) {
        if (mounted) setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || "Failed to load AI insights")
      } finally {
        if (mounted) setIsLoading(false)
      }
    };
    fetchLatest();
    return () => { mounted = false; };
  }, [])

  // Animate score whenever it updates
  useEffect(() => {
    if (data?.insight?.score !== undefined) {
      const targetScore = data.insight.score
      const duration = 1200
      const steps = 60
      const stepTime = duration / steps
      let currentStep = 0

      const timer = setInterval(() => {
        currentStep++
        const progress = 1 - Math.pow(1 - currentStep / steps, 3) // easeOutCubic
        setAnimatedScore(Math.round(progress * targetScore))

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, stepTime)

      return () => clearInterval(timer)
    }
  }, [data?.insight?.score])

  const renderIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'transport':
      case 'transportation':
        return <Car className="h-4 w-4" />
      case 'energy':
        return <Home className="h-4 w-4" />
      default:
        return <ShoppingBag className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-16 w-64 rounded-md" />
          <Skeleton className="h-12 w-48 rounded-md" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-5 space-y-5">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <div className="xl:col-span-7 flex flex-col gap-5">
            <Skeleton className="h-32 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-scale-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            <span>CarbonSphere Copilot</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">AI Coach Workspace</h1>
          <p className="text-sm text-muted-foreground">
            Personalized, data-driven sustainability diagnostics generated by Groq AI.
          </p>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white dark:text-zinc-950 font-bold px-5 py-3 text-sm transition-all duration-300 hover:from-emerald-500 hover:to-emerald-400 shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
          )}
          {isGenerating ? "Groq AI is generating your sustainability analysis..." : "Generate New Analysis"}
        </button>
      </div>

      {error && (
        <ErrorState 
          title="Failed to run AI Coach"
          message={error}
          onRetry={loadLatest}
        />
      )}

      {/* Grid Layout */}
      {!data?.insight ? (
        <EmptyState
          icon={Sparkles}
          title="No AI Analysis Available"
          description="Generate your first sustainability analysis."
          actionLabel="Generate Analysis"
          onAction={handleGenerate}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Score and Strengths/Weaknesses (5/12 cols) */}
          <div className="xl:col-span-5 space-y-5">
            {/* AI Sustainability Score dial */}
            <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md">
              <div className="absolute top-0 right-0 w-[60px] h-[60px] bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Calculated Score</CardTitle>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-200/30 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-1.5">
                  <div className="relative flex h-40 w-40 items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={42} className="fill-none stroke-zinc-200 dark:stroke-zinc-800/40" strokeWidth="8" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r={42} 
                        className="fill-none stroke-emerald-500 dark:stroke-emerald-400" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        strokeDasharray={2 * Math.PI * 42} 
                        strokeDashoffset={(2 * Math.PI * 42) - (animatedScore / 100) * (2 * Math.PI * 42)}
                        style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
                      />
                    </svg>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-4xl font-black tracking-tight text-foreground tabular-nums">{animatedScore}</span>
                      <span className="mt-1 inline-flex items-center rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/10">
                        {animatedScore > 80 ? "Excellent" : animatedScore > 50 ? "Good" : "Needs Work"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Weaknesses */}
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md">
              <CardHeader className="pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Habit Diagnostics</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                {/* Strengths */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Leaf className="h-3.5 w-3.5" /> Strengths
                  </h4>
                  <ul className="space-y-2 pl-1">
                    {(data.insight.strengths || []).map((s, i) => (
                      <li key={i} className="text-sm text-foreground font-medium flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                    {(!data.insight.strengths || data.insight.strengths.length === 0) && (
                      <li className="text-sm text-muted-foreground italic">No specific strengths identified yet.</li>
                    )}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="space-y-3 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider flex items-center gap-2">
                    <TrendingDown className="h-3.5 w-3.5" /> Areas to Improve
                  </h4>
                  <ul className="space-y-2 pl-1">
                    {(data.insight.weaknesses || []).map((w, i) => (
                      <li key={i} className="text-sm text-foreground font-medium flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                     {(!data.insight.weaknesses || data.insight.weaknesses.length === 0) && (
                      <li className="text-sm text-muted-foreground italic">No specific weaknesses identified.</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Goals & Recommendations (7/12 cols) */}
          <div className="xl:col-span-7 flex flex-col gap-5">
            {/* Executive Summary & Monthly Plan Banner */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-emerald-50 dark:bg-emerald-950/20 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-inner">
                <Target className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-center sm:text-left space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-white/60 dark:bg-zinc-950/40 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Executive Summary & Plan
                </div>
                <h3 className="text-sm text-foreground leading-snug">
                  <span className="font-semibold block mb-1">Summary:</span>
                  {data.insight.executiveSummary || "Continue reducing your carbon footprint through steady daily actions."}
                </h3>
                <h3 className="text-sm text-foreground leading-snug mt-2">
                  <span className="font-semibold block mb-1">Monthly Plan:</span>
                  {data.insight.monthlyImprovementPlan || "Log more activities to generate a personalized plan."}
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingDown className="h-4 w-4" />
                    Potential Saving: {data.insight.carbonReductionOpportunities || "Unknown"}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <Zap className="h-4 w-4" />
                    Suggested: {data.insight.challengeSuggestion || "Explore Community Challenges"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Risk Assessment */}
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md">
                <CardHeader className="pb-2 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5" /> Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium text-foreground">{data.insight.riskAssessment || "No risk identified."}</p>
                </CardContent>
              </Card>

              {/* Top Emission Sources */}
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md">
                <CardHeader className="pb-2 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Lightbulb className="h-3.5 w-3.5" /> Top Emission Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-1">
                    {(data.insight.topEmissionSources || []).map((source, i) => (
                      <li key={i} className="text-sm text-foreground font-medium flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 mt-0.5 shrink-0" />
                        {source}
                      </li>
                    ))}
                    {(!data.insight.topEmissionSources || data.insight.topEmissionSources.length === 0) && (
                      <li className="text-sm text-muted-foreground italic">Insufficient data to identify top sources.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-foreground">Actionable Recommendations</h2>
                <span className="text-xs font-bold text-muted-foreground/75 uppercase tracking-wider">{data.recommendations?.length || 0} items verified</span>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {(data.recommendations || []).map((rec, idx) => (
                  <Card key={idx} className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md group relative overflow-hidden hover:border-emerald-500/20 transition-all duration-350 hover:-translate-y-0.5">
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 text-muted-foreground/80 group-hover:scale-105 group-hover:text-emerald-500 transition-all duration-300">
                          {renderIcon(rec.category || "Lifestyle")}
                        </div>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-900/50 border-zinc-300/30 dark:border-zinc-800/50">
                          {rec.category || "General"}
                        </Badge>
                      </div>
                      <CardTitle className="mt-3 text-sm font-bold leading-snug">{rec.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <p className="text-xs leading-relaxed text-muted-foreground font-medium line-clamp-3">{rec.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="rounded-xl border border-zinc-200/60 bg-zinc-100/20 px-3 py-2 dark:border-zinc-850 dark:bg-zinc-950/20">
                          <div className="flex items-center gap-1">
                            <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Saving</span>
                          </div>
                          <div className="mt-1 text-xs font-black text-foreground truncate">{rec.saving || `${rec.estimatedCarbonSaving} kg CO2e`}</div>
                        </div>
                        <div className="rounded-xl border border-zinc-200/60 bg-zinc-100/20 px-3 py-2 dark:border-zinc-850 dark:bg-zinc-950/20">
                          <div className="flex items-center gap-1">
                            <Target className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Confidence</span>
                          </div>
                          <div className="mt-1 text-xs font-black text-foreground">{rec.confidence || 85}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!data.recommendations || data.recommendations.length === 0) && (
                  <div className="col-span-full py-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <p className="text-muted-foreground text-sm font-medium">No recommendations generated. Keep logging activities!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
