"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Shield, Globe, CheckCircle, Sparkles, Loader2, Filter, Activity, Target, Leaf, LeafyGreen, Droplets, Zap, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { toast } from "sonner"
import { 
  fetchOffsetProjects, 
  fetchOffsetRecommendations, 
  purchaseOffset, 
  fetchOffsetHistory, 
  fetchOffsetStats 
} from "@/services/offsetService"
import { OffsetStats, OffsetProject, OffsetPurchase } from "@/types"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"

const MarketplaceCard = dynamic(() => import('@/components/marketplace/MarketplaceCard'), { 
  ssr: false, 
  loading: () => <Skeleton className="w-full aspect-[4/3] rounded-2xl bg-zinc-900/50" /> 
})

const CERTIFICATES = [
  { title: "Verified Impact", description: "Gold Standard Certified", icon: CheckCircle },
  { title: "Transparency", description: "Blockchain Verified", icon: Shield },
  { title: "Global Reach", description: "20+ Countries", icon: Globe },
]

const CATEGORIES = ["All", "Renewable Energy", "Reforestation", "Ocean Cleanup", "Sustainable Agriculture", "Water Conservation"]

export default function OffsetMarketplacePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [stats, setStats] = useState<OffsetStats | null>(null)
  const [projects, setProjects] = useState<OffsetProject[]>([])
  const [history, setHistory] = useState<OffsetPurchase[]>([])
  const [recommendations, setRecommendations] = useState<{ insight?: { suggestedCategory?: string, reason?: string } } | null>(null)
  
  // Filtering
  const [activeCategory, setActiveCategory] = useState("All")
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Project Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<OffsetProject | null>(null)
  
  // Purchase State
  const [creditsToBuy, setCreditsToBuy] = useState<number>(1)
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsRes, projectsRes, historyRes, recRes] = await Promise.all([
        fetchOffsetStats(),
        fetchOffsetProjects(),
        fetchOffsetHistory(page, 5),
        fetchOffsetRecommendations()
      ])

      setStats(statsRes.data)
      setProjects(projectsRes.data)
      setHistory(historyRes.data)
      setTotalPages(historyRes.pagination?.pages || 1)
      setRecommendations(recRes.data as { insight?: { suggestedCategory?: string, reason?: string } })
    } catch (err: unknown) {
      setError((err instanceof Error ? (err as Error).message : String(err)) || "Failed to load marketplace data.")
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    Promise.resolve().then(() => loadData())
  }, [loadData])

  const openProjectDetail = (project: OffsetProject) => {
    setSelectedProject(project)
    setCreditsToBuy(1)
    setPurchaseSuccess(false)
    setDetailModalOpen(true)
  }

  const handlePurchase = async () => {
    if (!selectedProject || creditsToBuy <= 0) return
    
    const purchasePromise = purchaseOffset(selectedProject._id, creditsToBuy)

    toast.promise(purchasePromise, {
      loading: "Processing investment...",
      success: () => {
        setPurchaseSuccess(true)
        
        // Reload stats and history in background
        Promise.all([fetchOffsetStats(), fetchOffsetHistory(1, 5), fetchOffsetProjects()]).then(
          ([sRes, hRes, pRes]) => {
            setStats(sRes.data)
            setHistory(hRes.data)
            setProjects(pRes.data)
            setPage(1)
            setTotalPages(hRes.pagination?.pages || 1)
          }
        )
        
        setTimeout(() => setDetailModalOpen(false), 2500)
        return "Investment portfolio updated"
      },
      error: (err: Error | unknown) => {
        return (err as Error).message || "Transaction failed"
      }
    })

    try {
      setPurchasing(true)
      await purchasePromise
    } catch (err) {
      // Handled in toast error
    } finally {
      setPurchasing(false)
    }
  }

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects
    return projects.filter(p => p.category === activeCategory)
  }, [projects, activeCategory])

  const getCategoryImageUrl = (category: string) => {
    switch (category) {
      case 'Reforestation': return "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
      case 'Renewable Energy': return "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80"
      case 'Ocean Cleanup': return "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80"
      case 'Water Conservation': return "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
      case 'Sustainable Agriculture': return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
      default: return "https://images.unsplash.com/photo-1536696120663-882436d53b9f?w=800&q=80"
    }
  }

  if (loading && !stats) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-8 w-full">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-10 w-72 rounded-md bg-zinc-900" />
          <Skeleton className="h-4 w-96 rounded-md mt-1 bg-zinc-900" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-3xl bg-zinc-900/50" />)}
        </div>
        <Skeleton className="h-32 rounded-3xl bg-zinc-900/50" />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-2xl bg-zinc-900/50" />)}
        </div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="pt-10">
        <ErrorState 
          title="Marketplace Unavailable"
          message={error}
          onRetry={() => { Promise.resolve().then(() => loadData()) }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 pb-12 w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            Impact Investments
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider text-[10px] hidden sm:flex">Verified Global Portfolio</Badge>
          </h1>
          <p className="text-base text-zinc-400 max-w-xl mt-3 font-medium">
            Neutralize your carbon footprint by funding world-class, rigorously verified climate projects globally.
          </p>
        </div>
      </div>

      {/* Section 1: ROI-Style Sustainability Metrics */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Offset Volume", value: stats?.totalCredits || 0, unit: "tCO₂e", color: "text-emerald-400", icon: <Globe className="w-5 h-5" />, bg: "from-emerald-500/10 to-transparent" },
          { label: "Net Emissions Legacy", value: stats?.totalEmissions?.toFixed(1) || 0, unit: "tCO₂e", color: "text-white", icon: <Activity className="w-5 h-5 text-rose-400" />, bg: "from-rose-500/5 to-transparent" },
          { label: "Environmental ROI", value: stats?.offsetPercentage || 0, unit: "%", color: "text-sky-400", icon: <Target className="w-5 h-5 text-sky-400" />, bg: "from-sky-500/10 to-transparent" },
          { label: "Ecosystem Impact", value: stats?.treesEquivalent || 0, unit: "Trees", color: "text-amber-400", icon: <LeafyGreen className="w-5 h-5 text-amber-400" />, bg: "from-amber-500/10 to-transparent" },
        ].map((stat, i) => (
          <div key={i} className="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl hover:border-zinc-700 hover:-translate-y-1 transition-all shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</p>
                {stat.icon}
              </div>
              <h4 className={cn("text-3xl font-black tracking-tight flex items-baseline gap-1", stat.color)}>
                {stat.value} <span className="text-sm font-bold opacity-60">{stat.unit}</span>
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* AI Recommendation Panel */}
      {recommendations && recommendations.insight && (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-zinc-950 shadow-[0_0_40px_rgba(16,185,129,0.1)] group">
          <div className="absolute inset-0 z-0">
             <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
             <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full group-hover:bg-sky-500/20 transition-colors" />
          </div>
          <div className="relative z-10 bg-zinc-900/40 backdrop-blur-3xl p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-xs font-black text-emerald-400 tracking-widest uppercase">Intelligence Directives</h3>
              <p className="text-lg text-zinc-300 leading-relaxed font-medium">
                {recommendations.insight.reason}{' '}
                <br className="hidden md:block" />
                Consider diversifying your portfolio by prioritizing <span className="text-white font-bold px-2 py-0.5 rounded bg-white/10">{recommendations.insight.suggestedCategory}</span> initiatives this quarter.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Marketplace Filtering & Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-white/5 mr-2 shrink-0">
            <Filter className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Filters</span>
          </div>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm shrink-0",
                activeCategory === category 
                  ? "bg-white text-zinc-950" 
                  : "bg-zinc-900/50 text-zinc-400 border border-white/5 hover:bg-zinc-800 hover:text-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p) => {
              const isRecommended = recommendations?.insight?.suggestedCategory === p.category;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={p._id}
                >
                  <MarketplaceCard 
                    project={p} 
                    isRecommended={isRecommended} 
                    onClick={openProjectDetail} 
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filteredProjects.length === 0 && (
             <div className="col-span-full py-20 text-center flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                 <Filter className="w-6 h-6 text-zinc-500" />
               </div>
               <p className="text-lg font-bold text-white mb-1">No projects found</p>
               <p className="text-sm text-zinc-500">Try selecting a different category filter.</p>
             </div>
          )}
        </div>
      </div>

      {/* Section 3: Ledger & Guarantees Grid */}
      <div className="grid gap-10 lg:grid-cols-12 pt-8">
        {/* Transaction Ledger */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            Investment Ledger
          </h2>
          <div className="rounded-3xl border border-white/5 bg-zinc-900/40 overflow-hidden backdrop-blur-xl shadow-2xl">
            {history.length > 0 ? (
              <>
                <div className="w-full overflow-x-auto">
                  <Table className="min-w-[700px]">
                    <TableHeader className="bg-zinc-950/50 border-b border-white/5">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] h-12">Date</TableHead>
                        <TableHead className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] h-12">Project</TableHead>
                        <TableHead className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] h-12">Category</TableHead>
                        <TableHead className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] h-12 text-right">Volume</TableHead>
                        <TableHead className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] h-12 text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((h) => (
                        <TableRow key={h._id} className="border-b border-white/5 hover:bg-zinc-800/30 transition-colors">
                          <TableCell className="text-sm text-zinc-400 py-4 font-medium">{new Date(h.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm font-bold text-white py-4">{(h.projectId as OffsetProject)?.title || h.projectName || "Unknown Project"}</TableCell>
                          <TableCell className="text-sm text-zinc-400 py-4">
                            <Badge variant="outline" className="bg-zinc-900/50 border-white/10 text-zinc-300 font-medium">{((h.projectId as OffsetProject)?.category) || "-"}</Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm font-black text-emerald-400 py-4">+{h.credits || 0} tCO₂e</TableCell>
                          <TableCell className="text-right text-sm font-bold text-zinc-300 py-4">${(h.totalCost || 0).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-white/5 bg-zinc-950/50">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Page {page} / {totalPages}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10 text-zinc-300 rounded-full" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                      <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10 text-zinc-300 rounded-full" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center mb-6 shadow-xl">
                  <Globe className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Portfolio Empty</h3>
                <p className="text-sm text-zinc-400 max-w-sm">Build your sustainability portfolio by backing world-class climate initiatives.</p>
              </div>
            )}
          </div>
        </div>

        {/* Platform Guarantees */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            Guarantees
          </h2>
          <div className="flex flex-col gap-4">
            {CERTIFICATES.map((c, i) => (
              <div key={i} className="flex items-center gap-5 p-5 rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl hover:bg-zinc-800/60 transition-colors shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shrink-0 flex items-center justify-center">
                  <c.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-sm text-white">{c.title}</h4>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-0.5">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Detail & Purchase Modal (Tesla/Airbnb Style) */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 bg-zinc-950 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden rounded-3xl">
          {purchaseSuccess ? (
            <div className="flex flex-col items-center justify-center py-20 px-10 gap-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative h-24 w-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </motion.div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">Investment Confirmed</h3>
                <p className="text-base text-zinc-400 mt-4 leading-relaxed max-w-md mx-auto">
                  Portfolio updated. You have successfully neutralized <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">{creditsToBuy} tCO₂e</span> through {selectedProject?.title}.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col max-h-[90vh] overflow-y-auto hide-scrollbar">
              {/* Header Image Cover */}
              <div 
                className="w-full h-64 md:h-80 relative shrink-0"
                style={{ 
                  backgroundImage: `url(${selectedProject ? getCategoryImageUrl(selectedProject.category) : ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                   <Badge className="bg-black/50 backdrop-blur-xl border border-white/10 text-white font-bold">{selectedProject?.category}</Badge>
                   <Badge className="bg-emerald-500/80 backdrop-blur-xl border-none text-white font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</Badge>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 md:p-10 -mt-20 relative z-10 flex flex-col gap-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">{selectedProject?.title}</h2>
                  <div className="flex items-center gap-3 text-zinc-400 font-medium">
                    <div className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {selectedProject?.location}</div>
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> {selectedProject?.rating}</div>
                  </div>
                </div>

                {/* Project Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex flex-col">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Price per ton</span>
                     <span className="text-xl font-black text-white">${selectedProject?.costPerTon}</span>
                   </div>
                   <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex flex-col">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Available Yield</span>
                     <span className="text-xl font-black text-white">{(selectedProject?.availableCredits || 0).toLocaleString()} <span className="text-xs font-bold text-zinc-500">tCO₂e</span></span>
                   </div>
                   <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex flex-col">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Project Type</span>
                     <span className="text-sm font-bold text-white mt-1 leading-tight">{selectedProject?.category}</span>
                   </div>
                   <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                     <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
                     <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Audited</span>
                   </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">Investment Thesis</h3>
                  <p className="text-base text-zinc-400 leading-relaxed">
                    {selectedProject?.description}
                    <br/><br/>
                    By investing in this initiative, you directly fund verified climate action, offsetting your footprint while supporting local communities and biodiversity in {selectedProject?.location}.
                  </p>
                </div>

                {/* Purchase Action Box */}
                <div className="bg-zinc-900 rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col md:flex-row items-end gap-6 mt-4">
                  <div className="flex-1 w-full flex flex-col gap-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Capital Allocation (tCO₂e)</label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        min={1} 
                        max={selectedProject?.availableCredits} 
                        value={creditsToBuy} 
                        onChange={(e) => setCreditsToBuy(parseInt(e.target.value) || 0)} 
                        className="h-14 bg-zinc-950 border-white/10 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 text-xl font-black px-6 rounded-2xl"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">
                        Total: ${(creditsToBuy * (selectedProject?.costPerTon || 0)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePurchase} 
                    disabled={purchasing || creditsToBuy <= 0 || creditsToBuy > (selectedProject?.availableCredits ?? 0)}
                    className="w-full md:w-auto h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-10 rounded-2xl text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] shrink-0"
                  >
                    {purchasing ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authorizing</>
                    ) : (
                      <>Execute Trade</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
