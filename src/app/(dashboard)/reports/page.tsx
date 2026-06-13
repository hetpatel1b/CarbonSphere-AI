"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, Download, Target, Award, Globe, 
  ShieldCheck, Sparkles, CheckCircle2, Leaf, Plus, Loader2, ArrowRight, TrendingDown, Eye, Trash2, Activity, Zap
} from "lucide-react"
import { fetchReports, generateReport, deleteReport, fetchReportById } from "@/services/reportService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

import { Report } from "@/types"

export default function ImpactReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Report viewing
  const [activeReport, setActiveReport] = useState<Report | null>(null)

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
      toast.success("Intelligence report synthesized successfully")
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to generate report")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    const printPromise = new Promise(resolve => setTimeout(resolve, 500));
    toast.promise(printPromise, {
      loading: "Rendering investor-grade PDF...",
      success: () => {
        setTimeout(() => window.print(), 100);
        return "Report ready for download";
      },
      error: "Failed to render PDF"
    });
  }

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this intelligence report?")) return
    try {
      await deleteReport(id)
      if (activeReport?._id === id) setActiveReport(null)
      loadReports()
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to delete report')
    }
  }

  const handleViewReport = async (id: string) => {
    setIsGenerating(true);
    try {
      const res = await fetchReportById(id);
      setActiveReport(res.data);
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to load report");
    } finally {
      setIsGenerating(false);
    }
  }

  const renderActiveReport = () => {
    if (!activeReport) return null;
    const { reportData } = activeReport;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="print-section space-y-8 bg-zinc-950 p-8 md:p-12 rounded-3xl border border-zinc-800 shadow-2xl print:border-none print:shadow-none print:p-0 print:w-full print:m-0 print:block"
      >
        {/* Report Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-8 gap-6">
          <div className="space-y-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-mono text-[10px] uppercase tracking-widest">
              Executive Brief • {activeReport.reportType}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Sustainability Impact Report</h1>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-4">
              <span>ID: {activeReport._id.slice(-8)}</span>
              <span>Generated: {new Date(activeReport.generatedAt).toLocaleDateString()}</span>
            </p>
          </div>
          <div className="flex flex-col md:items-end text-left md:text-right shrink-0 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl w-full md:w-auto">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Global ESG Score</span>
            <span className="text-5xl font-black text-emerald-400">{reportData.summary.sustainabilityScore}</span>
          </div>
        </div>

        {/* AI Executive Summary */}
        <div className="relative overflow-hidden bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <h2 className="text-sm font-bold flex items-center gap-2 mb-4 text-emerald-400 uppercase tracking-widest">
            <Sparkles className="h-4 w-4" /> AI Executive Summary
          </h2>
          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-medium">
            &quot;{reportData.aiInsights.executiveSummary}&quot;
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/30">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Gross Emissions</p>
            <h3 className="text-3xl font-black text-rose-400 flex items-baseline gap-1">
              {reportData.summary.totalEmissions.toFixed(1)} <span className="text-sm font-medium text-zinc-500">tCO₂e</span>
            </h3>
          </div>
          <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/30">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Offsets</p>
            <h3 className="text-3xl font-black text-emerald-400 flex items-baseline gap-1">
              {reportData.offsetContributions.totalCredits.toFixed(1)} <span className="text-sm font-medium text-zinc-500">tCO₂e</span>
            </h3>
          </div>
          <div className="p-6 border border-emerald-500/30 rounded-2xl bg-emerald-500/5">
            <p className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mb-2">Net Carbon Impact</p>
            <h3 className="text-3xl font-black text-white flex items-baseline gap-1">
              {reportData.summary.netCarbonImpact.toFixed(1)} <span className="text-sm font-medium text-zinc-500">tCO₂e</span>
            </h3>
          </div>
          <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/30">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Equivalent Trees</p>
            <h3 className="text-3xl font-black text-teal-400 flex items-baseline gap-1">
              {reportData.offsetContributions.treesEquivalent} <span className="text-sm font-medium text-zinc-500">planted</span>
            </h3>
          </div>
        </div>

        {/* Breakdown & Community */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-3">Emissions Ledger</h3>
            {reportData.emissionsAnalysis.categoryBreakdown.length > 0 ? (
              <div className="space-y-2">
                {reportData.emissionsAnalysis.categoryBreakdown.map((cat: { category: string; amount: number; percentage: number }, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-4 border border-zinc-800 rounded-xl bg-zinc-900/50">
                    <span className="text-sm font-semibold text-white">{cat.category}</span>
                    <span className="text-sm font-mono text-zinc-400">{cat.amount.toFixed(2)} tCO₂e <span className="text-zinc-600 ml-2">({(cat as { activitiesCount?: number }).activitiesCount || 0} logs)</span></span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 border border-zinc-800 rounded-xl text-center bg-zinc-900/30">
                <p className="text-sm text-zinc-500">No activities logged during this period.</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-3">Social & Achievement Metrics</h3>
            <div className="grid gap-2">
              <div className="flex justify-between items-center p-4 border border-zinc-800 rounded-xl bg-zinc-900/50">
                <span className="text-sm font-semibold text-zinc-300 flex items-center gap-3"><Target className="w-4 h-4 text-sky-400"/> Challenges Joined</span>
                <span className="text-lg font-bold text-white">{reportData.community.challengesJoined}</span>
              </div>
              <div className="flex justify-between items-center p-4 border border-zinc-800 rounded-xl bg-zinc-900/50">
                <span className="text-sm font-semibold text-zinc-300 flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Challenges Completed</span>
                <span className="text-lg font-bold text-white">{reportData.community.challengesCompleted}</span>
              </div>
              <div className="flex justify-between items-center p-4 border border-zinc-800 rounded-xl bg-zinc-900/50">
                <span className="text-sm font-semibold text-zinc-300 flex items-center gap-3"><Award className="w-4 h-4 text-amber-400"/> Badges Earned</span>
                <span className="text-lg font-bold text-white">{reportData.community.achievementsEarned}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Key Findings & Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-800">
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" /> Key Discoveries
            </h3>
            <ul className="space-y-3">
              {reportData.aiInsights.keyFindings.map((finding: string, i: number) => (
                <li key={i} className="text-sm text-zinc-300 flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="leading-relaxed">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Strategic Opportunities
            </h3>
            <ul className="space-y-3">
              {reportData.aiInsights.improvementOpportunities.map((opp: string, i: number) => (
                <li key={i} className="text-sm text-zinc-300 flex items-start gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="leading-relaxed">{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Controls (Hidden in Print) */}
        <div className="print:hidden flex flex-col sm:flex-row justify-end gap-3 border-t border-zinc-800 pt-8 mt-8">
          <Button variant="outline" onClick={() => setActiveReport(null)} className="h-12 px-6 border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl">
            Close Viewer
          </Button>
          <Button onClick={handlePrint} className="h-12 px-6 bg-white text-zinc-950 hover:bg-zinc-200 font-bold gap-2 rounded-xl">
            <Download className="w-4 h-4" /> Download Executive PDF
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-10 pb-12 max-w-7xl mx-auto">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden border-b border-zinc-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" /> Investor-Grade Intelligence
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Impact Reports</h1>
          <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
            Generate, audit, and download comprehensive sustainability performance briefs powered by Groq AI. All documents are cryptographically verified and investor-ready.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Button 
            disabled={isGenerating}
            onClick={() => handleGenerate("monthly")}
            variant="outline"
            className="h-12 rounded-xl border-zinc-700 text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white transition-all shadow-sm"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
            {isGenerating ? "Synthesizing..." : "Standard Report"}
          </Button>
          <Button 
            disabled={isGenerating}
            onClick={() => handleGenerate("comprehensive")}
            className="h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 gap-2 rounded-xl px-6 font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
            {isGenerating ? "Synthesizing AI..." : "Comprehensive Brief"}
          </Button>
        </div>
      </div>

      {/* View Active Report */}
      <AnimatePresence mode="wait">
        {activeReport && (
          <motion.div
            key="viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderActiveReport()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Vault */}
      {!activeReport && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 print:hidden"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" /> Intelligence Vault
            </h2>
            <Badge variant="outline" className="border-zinc-800 text-zinc-500 bg-zinc-900">{reports.length} Documents</Badge>
          </div>
          
          {loading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-[280px] rounded-2xl bg-zinc-900 border border-zinc-800" />)}
            </div>
          ) : error ? (
            <ErrorState 
              title="Intelligence Vault Offline"
              message={error}
              onRetry={loadReports}
            />
          ) : reports.length === 0 ? (
            <div className="py-20 border border-dashed border-zinc-800 bg-zinc-900/20 rounded-3xl flex flex-col items-center justify-center text-center gap-5">
              <div className="h-20 w-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shadow-inner">
                <FileText className="h-8 w-8 text-zinc-600" />
              </div>
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-white tracking-tight">No Reports Synthesized</h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">Engage the AI core to generate your first sustainability brief based on your historical footprint data.</p>
              </div>
              <Button onClick={() => handleGenerate("monthly")} className="mt-2 h-11 px-6 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                {isGenerating ? "Synthesizing..." : "Initialize Generation"}
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {reports.map((report) => (
                <div 
                  key={report._id} 
                  onClick={() => handleViewReport(report._id)}
                  className="group cursor-pointer relative flex flex-col bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1"
                >
                  {/* Dynamic CSS Thumbnail Header */}
                  <div className="h-32 bg-zinc-900 border-b border-zinc-800 relative overflow-hidden flex items-center justify-center">
                    {/* Abstract Data Visualization */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                      {report.reportType === 'comprehensive' ? (
                        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-zinc-900 to-zinc-900" />
                      ) : (
                        <div className="w-full h-full bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-zinc-800 via-emerald-900 to-zinc-900" />
                      )}
                    </div>
                    {/* Status Indicator */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-pulse" />
                      <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">Ready</span>
                    </div>
                    <FileText className="w-8 h-8 text-zinc-700 group-hover:text-emerald-500/50 transition-colors z-10" />
                    
                    {/* Hover Quick Actions */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                      <div className="p-2 bg-emerald-500 text-zinc-950 rounded-full shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div 
                        onClick={(e) => handleDelete(report._id, e)}
                        className="p-2 bg-zinc-800 text-zinc-300 hover:bg-rose-500 hover:text-white rounded-full shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300 delay-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between bg-zinc-950 z-30">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-widest border-transparent px-2 py-0.5 rounded-md ${
                          report.reportType === 'comprehensive' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {report.reportType}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-white leading-tight">Sustainability Brief</h3>
                      <p className="text-xs text-zinc-500 font-mono mt-1">ID: {report._id.slice(-8).toUpperCase()}</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between items-center text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Data Analyzed</span>
                      <span className="font-mono text-zinc-300">{new Date(report.generatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
