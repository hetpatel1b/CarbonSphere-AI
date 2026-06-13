"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Car, Zap, Apple, ShoppingBag, Leaf, Trash2, Edit2, RefreshCw, Loader2, Droplet, Trash, Activity } from "lucide-react"
import { activityService, ActivityDocument } from "@/services/activityService"
import { LogActivityModal } from "@/components/dashboard/LogActivityModal"
import { EmptyState } from "@/components/ui/empty-state"

const getCategoryDetails = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'transport': return { icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    case 'energy': return { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    case 'food': return { icon: Apple, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    case 'shopping': return { icon: ShoppingBag, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' };
    case 'water': return { icon: Droplet, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' };
    case 'waste': return { icon: Trash, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
    default: return { icon: Leaf, color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' };
  }
}

export default function LogActivityPage() {
  const [activities, setActivities] = useState<ActivityDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityToEdit, setActivityToEdit] = useState<ActivityDocument | null>(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadActivities = useCallback(async (currentPage = page) => {
    setIsLoading(true)
    setError("")
    try {
      const res = await activityService.getActivities(currentPage, 10)
      setActivities(res.data)
      if (res.pagination) {
        setTotalPages(res.pagination.pages || 1)
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || "Failed to load activities")
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    Promise.resolve().then(() => loadActivities(page))
  }, [page, loadActivities])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await activityService.deleteActivity(id);
      loadActivities();
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to delete");
    }
  }

  const openEditModal = (activity: ActivityDocument) => {
    setActivityToEdit(activity);
    setIsModalOpen(true);
  }

  const openCreateModal = () => {
    setActivityToEdit(null);
    setIsModalOpen(true);
  }

  const filteredActivities = activities.filter(act => {
    const matchesCategory = categoryFilter === "all" || act.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = (act.title || act.activityType).toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (act.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["all", "transport", "energy", "food", "shopping", "waste", "water", "other"];

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-full overflow-hidden">
      <LogActivityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={loadActivities}
        activityToEdit={activityToEdit}
      />

      {/* Header (Linear Style) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
             <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20"><Activity className="w-4 h-4 text-emerald-400" /></div>
             <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Ledger</h1>
          </div>
          <p className="text-sm font-medium text-zinc-400">Immutable record of your sustainability transactions.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button onClick={openCreateModal} className="w-full md:w-auto rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all h-11 px-6">
            <Plus className="w-4 h-4 mr-2" /> Log Event
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-950/50 p-2 rounded-2xl border border-white/5 shadow-xl backdrop-blur-xl">
         <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              type="search" 
              placeholder="Filter ledger..." 
              className="pl-9 bg-zinc-900/50 border-white/5 text-white h-10 rounded-xl focus-visible:ring-emerald-500" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar w-full p-1">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                  categoryFilter === cat 
                    ? 'bg-zinc-800 text-white shadow-sm border border-white/10' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
         <Button variant="ghost" size="icon" onClick={() => loadActivities(page)} disabled={isLoading} className="shrink-0 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
         </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-semibold flex items-center gap-3">
          <Zap className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Transactions Feed */}
      <div className="flex flex-col rounded-[2rem] border border-white/5 bg-zinc-950/30 overflow-hidden shadow-2xl backdrop-blur-md">
         
         {/* Feed Header */}
         <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-zinc-900/40 text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden md:grid">
           <div className="col-span-1 text-center">Vector</div>
           <div className="col-span-5">Identity / Payload</div>
           <div className="col-span-2">Timestamp</div>
           <div className="col-span-2 text-right">Impact</div>
           <div className="col-span-2 text-right">Controls</div>
         </div>

         {/* Feed Body */}
         <div className="flex flex-col relative min-h-[400px]">
           {isLoading ? (
             <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/20 backdrop-blur-sm z-10">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
             </div>
           ) : null}

           {filteredActivities.length === 0 && !isLoading ? (
             <div className="p-12 flex items-center justify-center">
               <EmptyState
                  icon={Activity}
                  title="Ledger Empty"
                  description="No transactions match your current filters. Initiate tracking to populate the matrix."
                  actionLabel="Create Entry"
                  onAction={openCreateModal}
                  className="border-none bg-transparent"
               />
             </div>
           ) : (
             filteredActivities.map((act) => {
               const { icon: Icon, color, bg, border } = getCategoryDetails(act.category);
               return (
                 <div key={act._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center border-b border-white/5 hover:bg-zinc-900/40 transition-colors group">
                    
                    {/* Category Icon */}
                    <div className="col-span-1 flex md:justify-center">
                      <div className={`p-2.5 rounded-xl border ${bg} ${border} ${color} shadow-lg shrink-0`}>
                         <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="col-span-5 flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{act.title || act.activityType}</h4>
                      {act.description && <p className="text-xs text-zinc-500 font-medium line-clamp-1">{act.description}</p>}
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center text-xs font-bold text-zinc-400">
                      {new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    {/* Impact Badge */}
                    <div className="col-span-2 flex md:justify-end items-center">
                       <div className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest border flex items-center gap-1.5 ${
                         act.carbonEmission > 0 
                           ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                           : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                       }`}>
                         {act.carbonEmission > 0 ? '+' : ''}{act.carbonEmission} <span className="opacity-60">kgCO₂e</span>
                       </div>
                    </div>

                    {/* Controls */}
                    <div className="col-span-2 flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" onClick={() => openEditModal(act)} className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
                         <Edit2 className="h-3.5 w-3.5" />
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => handleDelete(act._id)} className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                         <Trash2 className="h-3.5 w-3.5" />
                       </Button>
                    </div>

                 </div>
               )
             })
           )}
         </div>
         
         {/* Pagination */}
         <div className="p-4 border-t border-white/5 bg-zinc-900/20 flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Matrix View {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 rounded-lg h-8 text-xs font-bold"
              >
                Back
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
                className="bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 rounded-lg h-8 text-xs font-bold"
              >
                Next
              </Button>
            </div>
         </div>

      </div>

    </div>
  )
}
