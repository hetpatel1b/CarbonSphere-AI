"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Leaf, Shield, Globe, CheckCircle, AlertTriangle, Sparkles, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
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

const MarketplaceCard = dynamic(() => import('@/components/marketplace/MarketplaceCard'), { 
  ssr: false, 
  loading: () => <Skeleton className="w-full h-80 rounded-xl" /> 
})

const CERTIFICATES = [
  { title: "Verified Impact", description: "Gold Standard Certified", icon: CheckCircle },
  { title: "Transparency", description: "Blockchain Verified", icon: Shield },
  { title: "Global Reach", description: "20+ Countries", icon: Globe },
]

export default function OffsetMarketplacePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [stats, setStats] = useState<OffsetStats | null>(null)
  const [projects, setProjects] = useState<OffsetProject[]>([])
  const [history, setHistory] = useState<OffsetPurchase[]>([])
  const [recommendations, setRecommendations] = useState<{ insight?: { suggestedCategory?: string, reason?: string } } | null>(null)
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Purchase Modal State
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<OffsetProject | null>(null)
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
      setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || "Failed to load marketplace data.")
    } finally {
      setLoading(false)
    }
  }, [page])

  // Effect to load data, specifically separating it so it doesn't trigger synchronous setState warnings
  useEffect(() => {
    Promise.resolve().then(() => loadData())
  }, [loadData])

  const openPurchaseModal = (project: OffsetProject) => {
    setSelectedProject(project)
    setCreditsToBuy(1)
    setPurchaseSuccess(false)
    setPurchaseModalOpen(true)
  }

  const handlePurchase = async () => {
    if (!selectedProject || creditsToBuy <= 0) return
    
    const purchasePromise = purchaseOffset(selectedProject._id, creditsToBuy)

    toast.promise(purchasePromise, {
      loading: "Processing transaction...",
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
        
        setTimeout(() => setPurchaseModalOpen(false), 2000)
        return "Offset purchased successfully"
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



  if (loading && !stats) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-8 w-full">
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
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="pt-10">
        <ErrorState 
          title="Error Loading Marketplace"
          message={error}
          onRetry={() => { Promise.resolve().then(() => loadData()) }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Carbon Offset Marketplace</h1>
        <p className="text-sm text-muted-foreground">
          Offset your carbon footprint by supporting verified sustainability projects.
        </p>
      </div>

      {/* Section 1: Top Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-muted/10 border-border/40">
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Offset Purchased</p>
            <h4 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
              {stats?.totalCredits || 0} <span className="text-sm font-normal opacity-70">tCO₂e</span>
            </h4>
          </CardContent>
        </Card>
        <Card className="bg-muted/10 border-border/40">
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Emissions Logged</p>
            <h4 className="text-2xl font-bold mt-1 text-rose-500 dark:text-rose-400">
              {stats?.totalEmissions?.toFixed(1) || 0} <span className="text-sm font-normal opacity-70">tCO₂e</span>
            </h4>
          </CardContent>
        </Card>
        <Card className="bg-muted/10 border-border/40">
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Footprint Offset Progress</p>
            <div className="flex items-center gap-3 mt-1">
              <h4 className="text-2xl font-bold">{stats?.offsetPercentage || 0}%</h4>
              <Progress value={stats?.offsetPercentage || 0} className="h-2 flex-1 [&>div]:bg-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted/10 border-border/40">
          <CardContent className="p-5 flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Trees Planted Equivalent</p>
            <h4 className="text-2xl font-bold mt-1">{stats?.treesEquivalent || 0}</h4>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation */}
      {recommendations && recommendations.insight && (
        <Card className="border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <CardContent className="p-5 flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-bold">AI Recommended Strategy</h3>
              <p className="text-sm text-muted-foreground">
                {recommendations.insight.reason} 
                We recommend prioritizing <span className="font-semibold text-emerald-700 dark:text-emerald-400">{recommendations.insight.suggestedCategory}</span> projects for maximum personal impact.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Offset Projects */}
      <div>
        <h2 className="text-base font-semibold mb-4">Available Projects</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const isRecommended = recommendations?.insight?.suggestedCategory === p.category;
            return (
              <MarketplaceCard 
                key={p._id} 
                project={p} 
                isRecommended={isRecommended} 
                onPurchase={openPurchaseModal} 
              />
            );
          })}
        </div>
      </div>

      {/* Section 3: Your Offset History */}
      <div>
        <h2 className="text-base font-semibold mb-4">Your Offset History</h2>
        <Card className="border-border/40 bg-white/50 dark:bg-zinc-950/30 overflow-hidden">
          {history.length > 0 ? (
            <>
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[600px]">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Credits (tCO₂e)</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h._id}>
                      <TableCell className="text-xs">{new Date(h.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs font-medium">{(h.projectId as OffsetProject)?.title || h.projectName || "Unknown Project"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{(h.projectId as OffsetProject)?.category || "-"}</TableCell>
                      <TableCell className="text-right text-xs font-bold text-emerald-600 dark:text-emerald-400">{h.credits || 0}</TableCell>
                      <TableCell className="text-right text-xs">${(h.totalCost || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-end p-4 border-t gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                  <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center p-8">
              <EmptyState 
                icon={Globe}
                title="No Marketplace Purchases"
                description="No offsets purchased yet. Start investing in our planet today!"
                className="bg-transparent border-none"
              />
            </div>
          )}
        </Card>
      </div>

      {/* Section 4: Certificates */}
      <div>
        <h2 className="text-base font-semibold mb-4">Platform Guarantees</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {CERTIFICATES.map((c, i) => (
            <Card key={i} className="flex items-start gap-4 p-4 border-border/40 bg-muted/10">
              <c.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <h4 className="font-semibold text-sm">{c.title}</h4>
                <p className="text-xs text-muted-foreground">{c.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Purchase Modal */}
      <Dialog open={purchaseModalOpen} onOpenChange={setPurchaseModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {purchaseSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/50 dark:text-emerald-400">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Purchase Successful!</h3>
                <p className="text-sm text-muted-foreground mt-2">Thank you for supporting {selectedProject?.title}. You have officially offset {creditsToBuy} tCO₂e.</p>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Fund Project</DialogTitle>
                <DialogDescription>
                  You are supporting <span className="font-semibold text-foreground">{selectedProject?.title}</span>.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Amount to Offset (tCO₂e)</label>
                  <Input 
                    type="number" 
                    min={1} 
                    max={selectedProject?.availableCredits} 
                    value={creditsToBuy} 
                    onChange={(e) => setCreditsToBuy(parseInt(e.target.value) || 0)} 
                  />
                  <p className="text-[10px] text-muted-foreground flex justify-between">
                    <span>Available: {selectedProject?.availableCredits}</span>
                    <span>Cost: ${selectedProject?.costPerTon} / ton</span>
                  </p>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-lg flex justify-between items-center border">
                  <span className="text-sm font-semibold">Total Cost:</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${(creditsToBuy * (selectedProject?.costPerTon || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPurchaseModalOpen(false)}>Cancel</Button>
                <Button onClick={handlePurchase} disabled={purchasing || creditsToBuy <= 0 || creditsToBuy > (selectedProject?.availableCredits ?? 0)}>
                  {purchasing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {purchasing ? "Processing..." : "Confirm Purchase"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
