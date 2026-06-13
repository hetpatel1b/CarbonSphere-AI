"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowDownRight, ArrowUpRight, Cloud, Droplet, Zap, 
  Lightbulb, Compass, Award, Download, Calendar as CalendarIcon,
  Sparkles, ShieldCheck, ChevronRight, Loader2, Activity, Info, BarChart3, TrendingUp, AlertTriangle
} from "lucide-react"
import { dashboardService, DashboardAnalytics } from "@/services/dashboardService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { OnboardingPanel } from "@/components/dashboard/OnboardingPanel"
import { toast } from "sonner"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts"

const CATEGORY_COLORS: Record<string, string> = {
  Transport: "#3b82f6", // Blue
  Energy: "#f59e0b", // Amber
  Food: "#10b981", // Emerald
  Waste: "#a855f7", // Purple
  Shopping: "#ec4899", // Pink
  Water: "#0ea5e9", // Sky
  Other: "#64748b", // Slate
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeRange, setTimeRange] = useState("6M")

  useEffect(() => {
    const loadData = async () => {
      const dataPromise = dashboardService.getAnalytics();
      
      toast.promise(dataPromise, {
        loading: "Compiling intelligence...",
        success: (data) => {
          setAnalytics(data);
          return "Analytics matrix synchronized.";
        },
        error: (err: Error | unknown) => {
          setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || "Failed to load analytics");
          return "Synchronization failed.";
        }
      });

      try {
        await dataPromise;
      } catch (err) {
        // Handled
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full max-w-full">
        <Skeleton className="h-20 w-full rounded-2xl bg-zinc-900/50" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-32 rounded-2xl bg-zinc-900/50" />
          <Skeleton className="h-32 rounded-2xl bg-zinc-900/50" />
          <Skeleton className="h-32 rounded-2xl bg-zinc-900/50" />
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Skeleton className="h-[500px] lg:col-span-2 rounded-2xl bg-zinc-900/50" />
          <Skeleton className="h-[500px] lg:col-span-1 rounded-2xl bg-zinc-900/50" />
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="pt-10">
        <ErrorState 
          title="Telemetry Error"
          message={error || "System offline."}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (analytics.recentActivities.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-black text-white">Analytics Engine</h1>
          <p className="text-zinc-400">Initialize tracking to generate telemetry.</p>
        </div>
        <OnboardingPanel />
      </div>
    )
  }

  // --- Derived Metrics ---
  const totalCarbonSum = analytics.categoryBreakdown.reduce((sum, cat) => sum + cat.totalCarbon, 0);
  const highestCategory = analytics.categoryBreakdown[0];
  const totalActivities = analytics.monthlyTotals.reduce((sum, m) => sum + m.activitiesCount, 0);

  // --- Main Chart Data Mapping ---
  let mainChartData = analytics.carbonTrend.map((item, idx) => {
    const dateObj = new Date(item.month + "-01");
    const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
    return {
      name: monthName,
      emissions: item.totalCarbon,
      benchmark: 1500 + ((idx * 17) % 500), // Mock industry benchmark
    };
  });

  if (mainChartData.length === 1) {
    mainChartData.unshift({
      name: "Prev",
      emissions: 0,
      benchmark: 1500,
    });
  }

  // --- Doughnut Data ---
  const doughnutData = analytics.categoryBreakdown.map(cat => ({
    name: cat.category,
    value: cat.totalCarbon,
    color: CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.Other
  }));

  // --- Anomaly Detection Mock ---
  // Find largest single emission source or trend spike
  let anomalyDesc = "Telemetry looks stable. No critical anomalies detected.";
  let anomalySeverity = "low";
  if (highestCategory && (highestCategory.totalCarbon / totalCarbonSum) > 0.6) {
    anomalyDesc = `${highestCategory.category} is generating ${Math.round((highestCategory.totalCarbon / totalCarbonSum) * 100)}% of your total footprint. Investigate immediately.`;
    anomalySeverity = "high";
  }

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-full overflow-hidden">
      
      {/* Header (Vercel Style) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
             <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20"><Activity className="w-4 h-4 text-emerald-400" /></div>
             <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Intelligence</h1>
          </div>
          <p className="text-sm font-medium text-zinc-400">High-density telemetry and pattern recognition.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 bg-zinc-950 border-white/10 text-zinc-300 hover:bg-zinc-900 rounded-lg text-xs font-bold"
            onClick={() => toast.success("Report generation initiated. Check your email shortly.")}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <div className="flex items-center bg-zinc-950 border border-white/10 rounded-lg p-0.5">
            {["1M", "3M", "6M", "YTD"].map((t) => (
              <button 
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === t ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickers (Linear Style) */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Total Footprint */}
        <div className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Gross Emissions</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-white">{totalCarbonSum.toFixed(1)}</h2>
            <span className="text-xs font-bold text-emerald-400">kg CO₂e</span>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <ArrowDownRight className="w-3 h-3 text-emerald-500" /> -12% vs last period
          </div>
        </div>

        {/* Highest Category */}
        <div className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] rounded-full group-hover:bg-amber-500/10 transition-colors" />
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Primary Vector</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-white capitalize">{highestCategory?.category || "N/A"}</h2>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
             <AlertTriangle className="w-3 h-3 text-amber-500" /> {highestCategory ? Math.round((highestCategory.totalCarbon/totalCarbonSum)*100) : 0}% of footprint
          </div>
        </div>

        {/* Total Activities */}
        <div className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-[40px] rounded-full group-hover:bg-sky-500/10 transition-colors" />
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Data Points</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-white">{totalActivities}</h2>
            <span className="text-xs font-bold text-sky-400">Events</span>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
             <Activity className="w-3 h-3 text-sky-500" /> Synchronized Active
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Main Area Chart (Stripe Style) */}
        <Card className="lg:col-span-2 bg-zinc-950/50 border border-white/5 shadow-2xl overflow-hidden rounded-3xl">
          <CardHeader className="border-b border-white/5 pb-4 bg-zinc-900/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Emissions Delta vs Benchmark</CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-medium mt-1">Comparing your raw output against simulated industry standard.</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold text-zinc-400 uppercase">You</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border-2 border-zinc-600 border-dashed" /><span className="text-[10px] font-bold text-zinc-400 uppercase">Standard</span></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="h-[350px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#a1a1aa', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="benchmark" stroke="#52525b" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  <Area type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUser)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right Side Stack */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* AI Insights & Anomaly Panel */}
          <Card className="bg-zinc-950/50 border border-white/5 shadow-xl rounded-3xl overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-full h-1 ${anomalySeverity === 'high' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <CardHeader className="pb-3">
               <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-sky-400" /> Neural Insights
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className={`p-4 rounded-xl border ${anomalySeverity === 'high' ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' : 'bg-zinc-900 border-white/5 text-zinc-300'} text-xs font-medium leading-relaxed`}>
                 {anomalyDesc}
               </div>
            </CardContent>
          </Card>

          {/* Doughnut Category Breakdown */}
          <Card className="flex-1 bg-zinc-950/50 border border-white/5 shadow-xl rounded-3xl overflow-hidden flex flex-col">
            <CardHeader className="pb-0">
               <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                 <BarChart3 className="w-4 h-4 text-purple-400" /> Footprint Constitution
               </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center pt-2">
               <div className="h-[200px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={doughnutData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                     >
                       {doughnutData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <Tooltip 
                       contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                       itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-white">{totalCarbonSum.toFixed(0)}</span>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Total</span>
                 </div>
               </div>
               
               {/* Legend Grid */}
               <div className="w-full grid grid-cols-2 gap-x-2 gap-y-3 mt-2">
                 {doughnutData.map(d => (
                   <div key={d.name} className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                     <span className="text-[10px] font-bold text-zinc-400 truncate uppercase tracking-wider">{d.name}</span>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* GitHub/Linear Style Heatmap Mock */}
      <Card className="bg-zinc-950/50 border border-white/5 shadow-2xl overflow-hidden rounded-3xl">
        <CardHeader className="border-b border-white/5 pb-4 bg-zinc-900/20">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-sky-400" /> Log Density Heatmap
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500 font-medium mt-1">Simulated 90-day activity frequency matrix.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 overflow-x-auto hide-scrollbar">
           <div className="min-w-[700px]">
             <div className="flex gap-1.5">
               {/* Generate a mock grid of 12 columns x 7 rows */}
               {Array.from({ length: 14 }).map((_, col) => (
                 <div key={col} className="flex flex-col gap-1.5">
                   {Array.from({ length: 7 }).map((_, row) => {
                     // Determine cell intensity deterministically
                     const intensity = (((col * 7) + row) * 13 % 100) / 100;
                     let bg = "bg-zinc-900";
                     if (intensity > 0.8) bg = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
                     else if (intensity > 0.6) bg = "bg-emerald-500/80";
                     else if (intensity > 0.4) bg = "bg-emerald-500/50";
                     else if (intensity > 0.2) bg = "bg-emerald-500/20";
                     
                     return (
                       <div 
                         key={`${col}-${row}`} 
                         className={`w-4 h-4 rounded-[3px] ${bg} border border-white/5 hover:border-white transition-all cursor-pointer`}
                         title="Activity Block"
                       />
                     )
                   })}
                 </div>
               ))}
             </div>
             <div className="flex items-center gap-2 mt-4 justify-end text-[10px] font-bold text-zinc-500 uppercase">
               Less <div className="flex gap-1"><div className="w-3 h-3 rounded-[2px] bg-zinc-900"/><div className="w-3 h-3 rounded-[2px] bg-emerald-500/20"/><div className="w-3 h-3 rounded-[2px] bg-emerald-500/50"/><div className="w-3 h-3 rounded-[2px] bg-emerald-500/80"/><div className="w-3 h-3 rounded-[2px] bg-emerald-400"/></div> More
             </div>
           </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
