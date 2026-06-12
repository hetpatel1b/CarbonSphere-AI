"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, Download, Target, Award, Globe, 
  ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, Leaf, Plus, Loader2
} from "lucide-react"
import { fetchReports, generateReport, deleteReport, fetchReportById } from "@/services/reportService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { toast } from "sonner"

export default function ImpactReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Report viewing
  const [activeReport, setActiveReport] = useState<any>(null)

  const loadReports = async () => {
    try {
      setLoading(true)
      const res = await fetchReports()
      setReports(res.data)
    } catch (err: unknown) { setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => loadReports())
  }, [])

  const handleGenerate = async (type: string) => {
    setIsGenerating(true)
    try {
      const res = await generateReport(type)
      setActiveReport(res.data)
      loadReports() // Refresh history
      toast.success("Report generated successfully")
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to generate report")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    const printPromise = new Promise(resolve => setTimeout(resolve, 500));
    toast.promise(printPromise, {
      loading: "Preparing download...",
      success: () => {
        setTimeout(() => window.print(), 100);
        return "Report downloaded";
      },
      error: "Failed to download report"
    });
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return
    try {
      await deleteReport(id)
      if (activeReport?._id === id) setActiveReport(null)
      loadReports()
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to delete report')
    }
  }

  const renderActiveReport = () => {
    if (!activeReport) return null;
    const { reportData } = activeReport;

    return (
      <div className="print-section space-y-8 bg-white dark:bg-zinc-950 p-8 rounded-xl border border-border shadow-lg print:border-none print:shadow-none print:p-0 print:w-full print:m-0 print:block">
        {/* Report Header for Print */}
        <div className="flex justify-between items-center border-b pb-6">
          <div>
            <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">Sustainability Impact Report</h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm">
              TYPE: {activeReport.reportType.toUpperCase()} | ID: {activeReport._id.slice(-8).toUpperCase()} | DATE: {new Date(activeReport.generatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-4xl font-black text-emerald-500">{reportData.summary.sustainabilityScore}</span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Global ESG Score</span>
          </div>
        </div>

        {/* AI Executive Summary */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-6 rounded-xl">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-5 w-5" /> Executive Summary
          </h2>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {reportData.aiInsights.executiveSummary}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 border rounded-xl bg-muted/10">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Gross Emissions</p>
            <h3 className="text-2xl font-black text-rose-500">{reportData.summary.totalEmissions.toFixed(1)} <span className="text-sm">tCO₂e</span></h3>
          </div>
          <div className="p-5 border rounded-xl bg-muted/10">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Offsets</p>
            <h3 className="text-2xl font-black text-emerald-500">{reportData.offsetContributions.totalCredits.toFixed(1)} <span className="text-sm">tCO₂e</span></h3>
          </div>
          <div className="p-5 border rounded-xl bg-muted/10">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Net Carbon Impact</p>
            <h3 className="text-2xl font-black text-foreground">{reportData.summary.netCarbonImpact.toFixed(1)} <span className="text-sm">tCO₂e</span></h3>
          </div>
          <div className="p-5 border rounded-xl bg-muted/10">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Equivalent Trees</p>
            <h3 className="text-2xl font-black text-emerald-600">{reportData.offsetContributions.treesEquivalent} <span className="text-sm">trees</span></h3>
          </div>
        </div>

        {/* Breakdown & Community */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Emissions Analysis</h3>
            {reportData.emissionsAnalysis.categoryBreakdown.length > 0 ? (
              <div className="space-y-3">
                {reportData.emissionsAnalysis.categoryBreakdown.map((cat: { category: string; amount: number; percentage: number }) => (
                  <div key={(cat as any).category} className="flex justify-between items-center p-3 border rounded-lg bg-white/50 dark:bg-zinc-900/50">
                    <span className="text-sm font-semibold">{(cat as any).category}</span>
                    <span className="text-sm font-mono">{(cat as any).amount.toFixed(2)} tCO₂e ({(cat as any).activitiesCount} logs)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No activities logged.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Community & Achievements</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg bg-white/50 dark:bg-zinc-900/50">
                <span className="text-sm font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-sky-500"/> Challenges Joined</span>
                <span className="text-sm font-bold">{reportData.community.challengesJoined}</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg bg-white/50 dark:bg-zinc-900/50">
                <span className="text-sm font-semibold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Challenges Completed</span>
                <span className="text-sm font-bold">{reportData.community.challengesCompleted}</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg bg-white/50 dark:bg-zinc-900/50">
                <span className="text-sm font-semibold flex items-center gap-2"><Award className="w-4 h-4 text-amber-500"/> Badges Earned</span>
                <span className="text-sm font-bold">{reportData.community.achievementsEarned}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Key Findings & Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Key Findings</h3>
            <ul className="space-y-2">
              {reportData.aiInsights.keyFindings.map((finding: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Improvement Opportunities</h3>
            <ul className="space-y-2">
              {reportData.aiInsights.improvementOpportunities.map((opp: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Controls (Hidden in Print) */}
        <div className="print:hidden flex justify-end gap-4 border-t pt-6">
          <Button variant="outline" onClick={() => setActiveReport(null)}>Close Viewer</Button>
          <Button onClick={handlePrint} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Download className="w-4 h-4" /> Download PDF / Print
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>


      <div className="flex flex-col gap-8 pb-8 relative">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Impact Reporting</h1>
            <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
              Generate, audit and download investor-ready sustainability performance briefs powered by Groq AI.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              disabled={isGenerating}
              onClick={() => handleGenerate("monthly")}
              variant="outline"
              className="gap-2 rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4.5 w-4.5" />}
              {isGenerating ? "Synthesizing AI..." : "Generate Monthly"}
            </Button>
            <Button 
              disabled={isGenerating}
              onClick={() => handleGenerate("comprehensive")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm rounded-xl px-5 py-2.5 font-bold"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4.5 w-4.5" />}
              {isGenerating ? "Synthesizing AI..." : "Generate Comprehensive"}
            </Button>
          </div>
        </div>

        {/* View Active Report */}
        {activeReport && renderActiveReport()}

        {/* Main reporting deck */}
        {!activeReport && (
          <div className="space-y-4 print:hidden">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Report History Vault
            </h2>
            
            {loading ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
              </div>
            ) : error ? (
              <ErrorState 
                title="Error Loading Reports"
                message={error}
                onRetry={loadReports}
              />
            ) : reports.length === 0 ? (
              <div className="p-16 border border-dashed border-border/50 bg-muted/10 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">No reports generated yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">Generate your first AI-powered sustainability report to analyze your footprint and get recommendations.</p>
                </div>
                <Button onClick={() => handleGenerate("monthly")} variant="outline" className="mt-2" disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  {isGenerating ? "Generating..." : "Start Generation"}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {reports.map((report) => (
                  <Card key={report._id} className="border-border/40 hover:shadow-md transition-shadow bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm group">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/5 text-emerald-500 border-emerald-500/20">
                          {report.reportType}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">{new Date(report.generatedAt).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="text-base mt-2">Sustainability Report</CardTitle>
                      <CardDescription className="text-xs">ID: {report._id.slice(-8).toUpperCase()}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(report._id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                        Delete
                      </Button>
                      <Button onClick={async () => {
                        setIsGenerating(true);
                        try {
                          const res = await fetchReportById(report._id);
                          setActiveReport(res.data);
                        } catch (err: unknown) {
                          alert((err as Error).message || "Failed to load report");
                        } finally {
                          setIsGenerating(false);
                        }
                      }} size="sm" variant="outline" className="group-hover:border-emerald-500/50">
                        View Report
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
