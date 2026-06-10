"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, Download, TrendingUp, Sparkles, 
  Leaf, Target, Award, Globe, Share2, 
  FileDown, BarChart3, Zap, ArrowUpRight, ArrowDownRight,
  Shield, CheckCircle2, ShieldCheck, Bookmark, CheckSquare
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ExecutiveReportTemplate } from "@/components/reports/ExecutiveReportTemplate"
import { exportExecutiveReportToPdf } from "@/lib/exportPdf"

const monthlyData = [
  { month: "Jan", reduction: 0.8 },
  { month: "Feb", reduction: 1.2 },
  { month: "Mar", reduction: 1.5 },
  { month: "Apr", reduction: 2.1 },
  { month: "May", reduction: 2.4 },
  { month: "Jun", reduction: 3.1 },
]

const scoreData = [
  { month: "Jan", score: 620 },
  { month: "Feb", score: 650 },
  { month: "Mar", score: 680 },
  { month: "Apr", score: 740 },
  { month: "May", score: 790 },
  { month: "Jun", score: 842 },
]

const reportHistory = [
  { date: "June 01, 2026", type: "Monthly Report", format: "PDF", status: "Verified", id: "CS-REP-2026-6A1", size: "1.4 MB", typeKey: "monthly" },
  { date: "May 01, 2026", type: "Monthly Report", format: "PDF", status: "Verified", id: "CS-REP-2026-5A8", size: "1.4 MB", typeKey: "monthly" },
  { date: "April 01, 2026", type: "Quarterly ESG Report", format: "PDF", status: "Verified", id: "CS-REP-2026-4Q1", size: "2.1 MB", typeKey: "quarterly" },
  { date: "March 01, 2026", type: "Monthly Report", format: "PDF", status: "Verified", id: "CS-REP-2026-3A2", size: "1.3 MB", typeKey: "monthly" },
]

// Custom document cover preview renderer (Notion style)
function DocumentCoverPreview({ title, colorClass, type }: { title: string; colorClass: string; type: string }) {
  return (
    <div className="w-[110px] h-[155px] rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between p-3 shrink-0 select-none relative overflow-hidden group-hover:border-zinc-700/80 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colorClass}`} />
      
      {/* Title block */}
      <div className="space-y-1 mt-1">
        <span className="text-[5px] text-zinc-500 font-extrabold tracking-widest uppercase block">CarbonSphere AI</span>
        <h4 className="text-[7.5px] font-black text-white leading-tight tracking-tight">{title}</h4>
      </div>

      {/* Visual representation based on category */}
      {type === "monthly" && (
        <div className="h-8 w-8 rounded-full border border-emerald-500/25 flex items-center justify-center mx-auto my-1.5 bg-emerald-950/15">
          <span className="text-[6.5px] font-black text-emerald-400">842</span>
        </div>
      )}
      {type === "quarterly" && (
        <div className="flex justify-center items-end gap-1 h-6 my-1.5 bg-zinc-900/40 rounded border border-zinc-850 p-1">
          <span className="h-4 w-1 bg-sky-500 rounded-sm" />
          <span className="h-2.5 w-1 bg-sky-600 rounded-sm" />
          <span className="h-3.5 w-1 bg-sky-400 rounded-sm" />
        </div>
      )}
      {type === "annual" && (
        <div className="relative flex items-center justify-center my-1.5">
          <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-xs" />
          <div className="h-8 w-8 rounded-full border border-dashed border-amber-500/35 flex items-center justify-center bg-zinc-950">
            <span className="text-[6px] font-extrabold text-amber-400">2026</span>
          </div>
        </div>
      )}
      {type === "offset" && (
        <div className="flex items-center justify-center my-1.5 text-violet-500/30">
          <Shield className="h-7 w-7 stroke-1" />
        </div>
      )}
      {type === "community" && (
        <div className="flex items-center justify-center my-1.5 text-orange-500/30">
          <Globe className="h-7 w-7 stroke-1" />
        </div>
      )}

      {/* Mini cover footer */}
      <div className="flex justify-between items-center text-[4.5px] text-zinc-600 border-t border-zinc-900 pt-1 font-mono">
        <span>EXECUTIVE BRIEF</span>
        <span>v1.4</span>
      </div>
    </div>
  )
}

export default function ImpactReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState("Annual Sustainability Report")
  const [generationProgress, setGenerationProgress] = useState(0)
  const reportContainerRef = useRef<HTMLDivElement>(null)

  // Animated metric score states
  const [animatedScore, setAnimatedScore] = useState(0)
  const [animatedSaved, setAnimatedSaved] = useState(0)
  const [animatedReadiness, setAnimatedReadiness] = useState(0)

  // Trigger metrics count-up
  useEffect(() => {
    const duration = 1200
    const steps = 60
    const stepTime = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = 1 - Math.pow(1 - currentStep / steps, 3) // easeOutCubic
      
      setAnimatedScore(Math.round(progress * 842))
      setAnimatedSaved(progress * 12.4)
      setAnimatedReadiness(Math.round(progress * 94))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [])

  const handleGeneratePdf = async (type: string) => {
    setSelectedReportType(type)
    setIsGenerating(true)
    setGenerationProgress(0)
    
    // Tiny timeout to let React render the off-screen component and resolve Recharts elements
    setTimeout(async () => {
      try {
        await exportExecutiveReportToPdf(reportContainerRef.current, {
          reportType: type,
          onProgress: (progress) => setGenerationProgress(progress),
          onComplete: () => setIsGenerating(false),
          onError: () => setIsGenerating(false),
        })
      } catch (err) {
        console.error("PDF export failed:", err)
        setIsGenerating(false)
      }
    }, 600)
  }

  return (
    <div className="flex flex-col gap-8 pb-8 relative animate-scale-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Impact Reporting</h1>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Compile, audit and download investor-ready sustainability performance briefs.
          </p>
        </div>
        <Button 
          onClick={() => handleGeneratePdf("Annual Sustainability Report")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm rounded-xl px-5 py-2.5 font-bold hover:scale-[1.01] transition-all"
        >
          <FileText className="h-4.5 w-4.5" />
          Generate Report
        </Button>
      </div>

      {/* Executive Metrics Overview */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {/* Metric 1 */}
        <Card className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm border-border/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-5 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total CO₂ Saved</span>
              <div className="p-2 rounded-xl bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20 dark:border-emerald-500/10">
                <Leaf className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight tabular-nums">
              {animatedSaved.toFixed(1)} <span className="text-sm font-bold text-muted-foreground">tCO₂e</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1 text-[10px] text-emerald-500 font-semibold uppercase">
              <ArrowDownRight className="h-3 w-3" />
              <span>+14% vs last year</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm border-border/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-5 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sustainability Score</span>
              <div className="p-2 rounded-xl bg-sky-100/50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border border-sky-200/20 dark:border-sky-500/10">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight tabular-nums">
              {animatedScore}
            </div>
            <div className="mt-2.5 flex items-center gap-1 text-[10px] text-sky-400 font-semibold uppercase">
              <Award className="h-3.5 w-3.5" />
              <span>Top 5% Global Rank</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm border-border/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-5 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ESG Readiness Score</span>
              <div className="p-2 rounded-xl bg-amber-100/50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200/20 dark:border-amber-500/10">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight tabular-nums">
              {animatedReadiness}%
            </div>
            <div className="mt-2.5 flex items-center gap-1 text-[10px] text-amber-400 font-semibold uppercase">
              <Bookmark className="h-3.5 w-3.5" />
              <span>SASB & GRI Compliant</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm border-border/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-5 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Maturity rating</span>
              <div className="p-2 rounded-xl bg-violet-100/50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-200/20 dark:border-violet-500/10">
                <Globe className="h-4 w-4" />
              </div>
            </div>
            <div className="text-base sm:text-lg font-black text-foreground tracking-tight">
              Level 3 <span className="text-xs font-semibold text-violet-400">(Gold Grade)</span>
            </div>
            {/* Miniature progress bar represent maturity alignment */}
            <div className="mt-3.5 space-y-1">
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-zinc-200/40 dark:border-zinc-800/40">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Generated Insights Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-500" /> Executive Analytics spotlight
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-100 dark:border-emerald-900/50">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Primary Savings Driver</p>
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-foreground">Transportation Shift</p>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100 dark:border-amber-900/50">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Compliance Rating</p>
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-foreground">Audit Grade: High</p>
                <Award className="h-4 w-4 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-sky-100 dark:border-sky-900/50">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2">Expansion Opportunity</p>
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-foreground">Green Cloud Computing</p>
                <Zap className="h-4 w-4 text-sky-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30 border-violet-100 dark:border-violet-900/50">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-2">ESG Score forecast</p>
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-foreground">+33 pts Next Quarter</p>
                <ArrowDownRight className="h-4 w-4 text-violet-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sustainability Performance Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/40 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Monthly CO₂ Reduction</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Tonnes of CO₂ equivalent saved over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40 dark:text-border/20" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <Tooltip 
                    cursor={{ fill: 'currentColor', opacity: 0.05 }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="reduction" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Sustainability Score Growth</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Your sustainability score progression</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40 dark:text-border/20" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="text-muted-foreground" domain={['dataMin - 50', 'dataMax + 50']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main reporting deck & Export panel */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        
        {/* Premium Report Deck (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold">Report Compile Deck</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Card 1: Monthly */}
            <Card 
              onClick={() => handleGeneratePdf("Monthly Report")}
              className="border-border/40 hover:border-emerald-500/30 transition-all duration-300 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm group cursor-pointer hover:shadow-md hover:-translate-y-0.5"
            >
              <CardContent className="p-5 flex gap-4 items-center justify-between">
                <div className="flex gap-4 items-center min-w-0">
                  <DocumentCoverPreview title="Monthly Sustainability Report" colorClass="from-emerald-500 to-teal-500" type="monthly" />
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/5">SASB Compliant</Badge>
                    <h3 className="font-bold text-sm text-foreground">Monthly Report</h3>
                    <p className="text-xs text-muted-foreground leading-normal">Last 30 days operational summary.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-emerald-600 shrink-0"><Download className="h-4 w-4" /></Button>
              </CardContent>
            </Card>

            {/* Card 2: Quarterly ESG */}
            <Card 
              onClick={() => handleGeneratePdf("Quarterly ESG Report")}
              className="border-border/40 hover:border-emerald-500/30 transition-all duration-300 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm group cursor-pointer hover:shadow-md hover:-translate-y-0.5"
            >
              <CardContent className="p-5 flex gap-4 items-center justify-between">
                <div className="flex gap-4 items-center min-w-0">
                  <DocumentCoverPreview title="Quarterly ESG Compliance Brief" colorClass="from-sky-500 to-blue-500" type="quarterly" />
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/5">GRI Certified</Badge>
                    <h3 className="font-bold text-sm text-foreground">Quarterly ESG Report</h3>
                    <p className="text-xs text-muted-foreground leading-normal">Detailed compliance diagnostics.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-sky-600 shrink-0"><Download className="h-4 w-4" /></Button>
              </CardContent>
            </Card>

            {/* Card 3: Annual */}
            <Card 
              onClick={() => handleGeneratePdf("Annual Sustainability Report")}
              className="border-border/40 hover:border-emerald-500/30 transition-all duration-300 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm group cursor-pointer hover:shadow-md hover:-translate-y-0.5"
            >
              <CardContent className="p-5 flex gap-4 items-center justify-between">
                <div className="flex gap-4 items-center min-w-0">
                  <DocumentCoverPreview title="Annual Corporate Sustainability Review" colorClass="from-amber-500 to-orange-500" type="annual" />
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/5">SEC Ready</Badge>
                    <h3 className="font-bold text-sm text-foreground">Annual Sustainability</h3>
                    <p className="text-xs text-muted-foreground leading-normal">Year in review investor portfolio.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-amber-600 shrink-0"><Download className="h-4 w-4" /></Button>
              </CardContent>
            </Card>

            {/* Card 4: Carbon Offset */}
            <Card 
              onClick={() => handleGeneratePdf("Carbon Offset Report")}
              className="border-border/40 hover:border-emerald-500/30 transition-all duration-300 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm group cursor-pointer hover:shadow-md hover:-translate-y-0.5"
            >
              <CardContent className="p-5 flex gap-4 items-center justify-between">
                <div className="flex gap-4 items-center min-w-0">
                  <DocumentCoverPreview title="Carbon Offset Retirement Audit" colorClass="from-violet-500 to-fuchsia-500" type="offset" />
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/5">Gold Standard</Badge>
                    <h3 className="font-bold text-sm text-foreground">Carbon Offset Report</h3>
                    <p className="text-xs text-muted-foreground leading-normal">Certificate logs and retirements.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-violet-600 shrink-0"><Download className="h-4 w-4" /></Button>
              </CardContent>
            </Card>

            {/* Card 5: Community */}
            <Card 
              onClick={() => handleGeneratePdf("Community Impact Report")}
              className="border-border/40 hover:border-emerald-500/30 transition-all duration-300 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm group cursor-pointer sm:col-span-2 hover:shadow-md hover:-translate-y-0.5"
            >
              <CardContent className="p-5 flex gap-4 items-center justify-between">
                <div className="flex gap-4 items-center min-w-0">
                  <DocumentCoverPreview title="Community Impact & Team Portfolio" colorClass="from-orange-500 to-red-500" type="community" />
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/5">Net Zero Rated</Badge>
                    <h3 className="font-bold text-sm text-foreground">Community Impact Report</h3>
                    <p className="text-xs text-muted-foreground leading-normal">Your shared contribution to team-level carbon goals.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-orange-600 shrink-0"><Download className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Export Center (1/3 width) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Export Console</h2>
          <Card className="border-border/40 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm h-full">
            <CardContent className="p-5 flex flex-col gap-3 h-full">
              <Button 
                onClick={() => handleGeneratePdf("Executive Sustainability Report")}
                variant="outline" 
                className="w-full justify-start gap-3 h-12 bg-white/50 dark:bg-zinc-900/50 hover:bg-muted/50 border-border/50 rounded-xl"
              >
                <FileText className="h-4.5 w-4.5 text-emerald-500" />
                Generate PDF
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-white/50 dark:bg-zinc-900/50 hover:bg-muted/50 border-border/50 rounded-xl">
                <FileDown className="h-4.5 w-4.5 text-sky-500" />
                Generate CSV
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-white/50 dark:bg-zinc-900/50 hover:bg-muted/50 border-border/50 rounded-xl">
                <BarChart3 className="h-4.5 w-4.5 text-amber-500" />
                Generate ESG Report
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-white/50 dark:bg-zinc-900/50 hover:bg-muted/50 border-border/50 rounded-xl">
                <Share2 className="h-4.5 w-4.5 text-violet-500" />
                Share Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visual Timeline History */}
      <div className="space-y-5">
        <h2 className="text-lg font-bold">Report history portfolio</h2>
        
        <div className="relative pl-6 space-y-6">
          {/* Vertical timeline visual line */}
          <div className="absolute left-[34px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-zinc-200 via-zinc-200/50 to-transparent dark:from-zinc-800 dark:via-zinc-800/50 dark:to-transparent" />

          {reportHistory.map((report, index) => (
            <div 
              key={index} 
              className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300 group/timeline pl-8 md:pl-10"
            >
              {/* Timeline indicator node */}
              <div className="absolute left-[5.5px] md:left-[6.5px] top-[26px] md:top-1/2 md:-translate-y-1/2 h-4 w-4 rounded-full bg-zinc-950 border-[3px] border-zinc-300 dark:border-zinc-800 group-hover/timeline:border-emerald-500 transition-colors duration-300 z-10" />

              <div className="flex gap-4 items-center min-w-0">
                {/* Visual Thumbnail */}
                <div className="scale-75 origin-left shadow-sm">
                  <DocumentCoverPreview 
                    title={report.type} 
                    colorClass={report.typeKey === "monthly" ? "from-emerald-500 to-teal-500" : "from-sky-500 to-blue-500"} 
                    type={report.typeKey} 
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase">{report.date}</div>
                  <h4 className="font-bold text-sm text-foreground truncate">{report.type}</h4>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold font-mono text-muted-foreground/85">
                    <span>{report.id}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-zinc-200/50 dark:border-zinc-850 pt-4 md:pt-0">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10 shadow-inner">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {report.status}
                </span>

                <Button 
                  onClick={() => handleGeneratePdf(report.type)}
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-4 text-xs font-bold text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 bg-zinc-200/30 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 hover:border-emerald-500/20 dark:hover:border-emerald-500/20 rounded-xl"
                >
                  Download PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Off-screen high-fidelity PDF Template Container */}
      <div className="fixed left-[-9999px] top-[-9999px] w-[794px] h-[1123px] overflow-hidden pointer-events-none">
        <ExecutiveReportTemplate
          ref={reportContainerRef}
          reportType={selectedReportType}
          userName="Alex Patel"
          date={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          score={842}
          co2Saved="12.4 tCO₂e"
          achievementsCount={14}
          communityRank="#42"
          monthlyData={monthlyData}
          scoreData={scoreData}
        />
      </div>

      {/* Stripe-style step-by-step export compiler Status Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-zinc-950 border border-zinc-850 p-6 space-y-6 shadow-[0_0_60px_rgba(16,185,129,0.18)]">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
                <div className="h-16 w-16 rounded-full border-4 border-dashed border-emerald-500/30 flex items-center justify-center bg-zinc-950">
                  <Sparkles className="h-7 w-7 text-emerald-400 animate-spin" style={{ animationDuration: "3s" }} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">ESG Compliance Compiler</h3>
              <p className="text-xs text-zinc-400">Assembling investor-ready sustainability portfolio...</p>
            </div>

            {/* Step-by-Step Compile Checklist */}
            <div className="space-y-2.5 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-900 text-xs font-semibold text-zinc-400">
              
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                {generationProgress >= 15 ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded border border-zinc-700 shrink-0" />
                )}
                <span className={generationProgress >= 15 ? "text-zinc-200" : ""}>Initializing compilation pipeline</span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                {generationProgress >= 30 ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded border border-zinc-700 shrink-0 animate-pulse" />
                )}
                <span className={generationProgress >= 30 ? "text-zinc-200" : ""}>Rendering A4 cover sheet coordinates</span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3">
                {generationProgress >= 45 ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded border border-zinc-700 shrink-0" />
                )}
                <span className={generationProgress >= 45 ? "text-zinc-200" : ""}>Generating carbon trend graph canvases</span>
              </div>

              {/* Step 4 */}
              <div className="flex items-center gap-3">
                {generationProgress >= 65 ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded border border-zinc-700 shrink-0" />
                )}
                <span className={generationProgress >= 65 ? "text-zinc-200" : ""}>Analyzing AI insights & forecast models</span>
              </div>

              {/* Step 5 */}
              <div className="flex items-center gap-3">
                {generationProgress >= 80 ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded border border-zinc-700 shrink-0" />
                )}
                <span className={generationProgress >= 80 ? "text-zinc-200" : ""}>Compiling milestone checklist lists</span>
              </div>

              {/* Step 6 */}
              <div className="flex items-center gap-3">
                {generationProgress >= 95 ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded border border-zinc-700 shrink-0" />
                )}
                <span className={generationProgress >= 95 ? "text-zinc-200" : ""}>Encrypting trust stamp signatures</span>
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-zinc-400">
                <span>Total Compile Progress</span>
                <span className="text-emerald-400">{generationProgress}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
            
            <p className="text-[10px] text-zinc-500 text-center font-medium">Please do not close this window. Your browser will download the PDF automatically.</p>
          </Card>
        </div>
      )}
    </div>
  )
}
