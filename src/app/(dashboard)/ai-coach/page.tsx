"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles, TrendingDown, Target, Zap, Car, Home, 
  ShoppingBag, Lightbulb, Leaf, Loader2, RefreshCw, AlertCircle
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
      setError((err as Error).message || "Failed to load AI insights")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    const genPromise = aiCoachService.generateNewAnalysis()
    
    toast.promise(genPromise, {
      loading: "Synthesizing neural diagnostics...",
      success: (res) => {
        setData(res)
        return "AI analysis complete."
      },
      error: (err: Error | unknown) => {
        setError((err instanceof Error ? err.message : String(err)) || "Failed to generate new analysis")
        return "AI service unavailable."
      }
    })

    try {
      setIsGenerating(true)
      setError(null)
      await genPromise
    } catch (err) {
      // Handled
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
        if (mounted) setError((err as Error).message || "Failed to load AI insights")
      } finally {
        if (mounted) setIsLoading(false)
      }
    };
    fetchLatest();
    return () => { mounted = false; };
  }, [])

  useEffect(() => {
    if (data?.insight?.score !== undefined) {
      const targetScore = data.insight.score
      const duration = 1500
      let startTimestamp: number;
      let animationFrameId: number;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        setAnimatedScore(Math.round(easeProgress * targetScore));

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(step);
        } else {
          setAnimatedScore(targetScore);
        }
      };
      animationFrameId = window.requestAnimationFrame(step);
      return () => window.cancelAnimationFrame(animationFrameId);
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
      <div className="flex flex-col gap-8 animate-in fade-in w-full max-w-full">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64 bg-zinc-900/50 rounded-xl" />
          <Skeleton className="h-12 w-48 bg-zinc-900/50 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-4 space-y-6">
            <Skeleton className="h-64 bg-zinc-900/50 rounded-[2rem]" />
            <Skeleton className="h-48 bg-zinc-900/50 rounded-[2rem]" />
          </div>
          <div className="xl:col-span-8 flex flex-col gap-6">
            <Skeleton className="h-32 bg-zinc-900/50 rounded-[2rem]" />
            <Skeleton className="h-64 bg-zinc-900/50 rounded-[2rem]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-full overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-purple-400 uppercase w-fit">
            <Sparkles className="h-3.5 w-3.5" /> CarbonSphere Copilot
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Diagnostics Hub</h1>
          <p className="text-sm font-medium text-zinc-400">Deep neural analysis of your carbon footprint vectors.</p>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 text-zinc-950 font-black px-6 h-11 transition-all duration-300 hover:bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 w-full md:w-auto"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
          )}
          {isGenerating ? "Synthesizing..." : "Run Diagnostic"}
        </button>
      </div>

      {error && (
        <ErrorState 
          title="Diagnostic Failure"
          message={error}
          onRetry={loadLatest}
        />
      )}

      {!data?.insight ? (
        <EmptyState
          icon={Sparkles}
          title="No Telemetry Available"
          description="Initiate a diagnostic run to generate actionable insights."
          actionLabel="Run Diagnostic"
          onAction={handleGenerate}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* AI Score */}
            <Card className="bg-zinc-950/50 border border-white/5 shadow-2xl rounded-[2rem] overflow-hidden relative group hover:border-purple-500/30 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-colors" />
              <CardHeader className="pb-2">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center justify-between">
                   System Efficiency
                   <Sparkles className="w-4 h-4 text-purple-400" />
                 </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative flex h-48 w-48 items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90 transform drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={42} className="fill-none stroke-zinc-900" strokeWidth="8" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r={42} 
                        className="fill-none stroke-purple-500 transition-all duration-1000 ease-out" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        strokeDasharray={2 * Math.PI * 42} 
                        strokeDashoffset={(2 * Math.PI * 42) - (animatedScore / 100) * (2 * Math.PI * 42)}
                      />
                    </svg>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-5xl font-black text-white">{animatedScore}</span>
                      <span className="mt-2 inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-purple-400 border border-purple-500/20">
                        {animatedScore > 80 ? "Optimal" : animatedScore > 50 ? "Stable" : "Critical"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Weaknesses */}
            <Card className="bg-zinc-950/50 border border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                    <Leaf className="h-3.5 w-3.5" /> Positive Vectors
                  </h4>
                  <ul className="space-y-2.5">
                    {(data.insight.strengths || []).map((s, i) => (
                      <li key={i} className="text-xs text-zinc-300 font-medium flex items-start gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                    <TrendingDown className="h-3.5 w-3.5" /> Sub-Optimal Vectors
                  </h4>
                  <ul className="space-y-2.5">
                    {(data.insight.weaknesses || []).map((w, i) => (
                      <li key={i} className="text-xs text-zinc-300 font-medium flex items-start gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                        <span className="leading-relaxed">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            
            {/* Executive Banner */}
            <div className="rounded-[2rem] border border-white/5 bg-zinc-900/40 p-6 md:p-8 flex flex-col md:flex-row items-start gap-6 shadow-2xl backdrop-blur-md">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 shadow-inner">
                <Target className="h-8 w-8 text-sky-400" />
              </div>
              <div className="space-y-4 flex-1">
                <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md rounded-md px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-sky-400 border border-white/5">
                  Executive Brief
                </div>
                <div>
                   <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Analysis</span>
                   <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                     {data.insight.executiveSummary || "Continue reducing your carbon footprint through steady daily actions."}
                   </p>
                </div>
                <div className="pt-2">
                   <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Directive</span>
                   <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                     {data.insight.monthlyImprovementPlan || "Log more activities to generate a personalized plan."}
                   </p>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-4">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Suggested Operations
              </h2>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {(data.recommendations || []).map((rec, idx) => (
                  <Card key={idx} className="bg-zinc-950/50 border border-white/5 shadow-xl rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                          {renderIcon(rec.category || "Lifestyle")}
                        </div>
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-transparent bg-zinc-900 text-zinc-400">
                          {rec.category || "General"}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm font-bold text-white leading-tight">{rec.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 flex flex-col gap-4">
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed line-clamp-3">{rec.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Impact</span>
                          <span className="text-xs font-bold text-white truncate">{rec.saving || `${rec.estimatedCarbonSaving} kg CO₂e`}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-sky-500 flex items-center gap-1"><Target className="w-3 h-3" /> Probability</span>
                          <span className="text-xs font-bold text-white">{rec.confidence || 85}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
