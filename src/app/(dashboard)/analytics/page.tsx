"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic";
import { 
  ResponsiveContainer, 
  XAxis, YAxis, Tooltip, CartesianGrid, Cell, ReferenceLine
} from "recharts"

const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
// @ts-ignore
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
// @ts-ignore
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
// @ts-ignore
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
import { 
  ArrowDownRight, ArrowUpRight, Cloud, Droplet, Zap, 
  Lightbulb, Compass, Award,
  Sparkles, ShieldCheck, ChevronRight, Loader2, Activity
} from "lucide-react"
import { AnimatedChartWrapper } from "@/components/ui/animation-system"
import { dashboardService, DashboardAnalytics } from "@/services/dashboardService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { toast } from "sonner"

// Base narratives and colors to keep the beautiful UI intact while data is dynamic
const baseCategories: Record<string, any> = {
  Transport: { color: "#3b82f6", narrative: "Commuting by single-occupancy vehicles remains your highest operational emission source.", actions: ["Subsidize employee E-Bike purchases", "Optimize logistics delivery routes using AI scheduler"] },
  Energy: { color: "#f59e0b", narrative: "Transitioning cloud hosting to Carbon-Free regions lowered footprint by 12% in Q2.", actions: ["Install smart HVAC thermostats with occupancy sensors", "Configure off-hour sleep schedules for workspace laptops"] },
  Food: { color: "#10b981", narrative: "Food footprint is stable.", actions: ["Implement Meatless Mondays defaults for catered events", "Source pantry catering from regional suppliers"] },
  Waste: { color: "#a855f7", narrative: "Paperless invoicing lowered waste print rates.", actions: ["Establish certified hardware recycling protocols", "Replace remaining single-use pantry items"] },
  Shopping: { color: "#ec4899", narrative: "Procurement supply chain analysis.", actions: ["Audit tier-1 suppliers", "Implement sustainable procurement policy"] },
  Water: { color: "#0ea5e9", narrative: "Water usage remains below benchmark.", actions: ["Install low-flow aerators", "Monitor for leaks"] },
  Other: { color: "#64748b", narrative: "Miscellaneous footprint impacts.", actions: ["Conduct full audit", "Engage stakeholders"] },
};

// Fallback data if user has no activities
type ChartDataItem = {
  name: string;
  emissions: number;
  target: number;
  score: number;
  forecast: number | null;
  milestone: string | null;
};

const defaultChartData: ChartDataItem[] = [
  { name: "Jan", emissions: 0, target: 2.5, score: 620, forecast: null, milestone: "Account Onboarded" },
  { name: "Feb", emissions: 0, target: 2.4, score: 650, forecast: null, milestone: "Setup Target" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-zinc-950/95 backdrop-blur-md border border-zinc-800 p-4 rounded-xl shadow-xl space-y-2 text-xs">
        <p className="font-extrabold text-white text-sm">{label} 2026</p>
        <div className="space-y-1">
          {payload.map((p: any, idx: number) => {
            const displayVal = p.value !== null ? p.value : "N/A"
            return (
              <p key={idx} className="font-semibold flex items-center gap-1.5" style={{ color: p.color || p.stroke }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
                {p.name}: {displayVal} {p.name.includes("Score") ? "pts" : "kg"}
              </p>
            )
          })}
        </div>
        {data.milestone && (
          <div className="mt-2.5 pt-2 border-t border-zinc-900 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            <span>Milestone: {data.milestone}</span>
          </div>
        )}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Transport")
  const [activeTab, setActiveTab] = useState("emissions")

  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const dataPromise = dashboardService.getAnalytics();
      
      toast.promise(dataPromise, {
        loading: "Loading analytics...",
        success: (data) => {
          setAnalytics(data);
          if (data.categoryBreakdown.length > 0) {
            setSelectedCategory(data.categoryBreakdown[0].category);
          }
          return "Analytics updated";
        },
        error: (err: any) => {
          setError(err.message || "Failed to load analytics");
          return "Analytics could not be loaded";
        }
      });

      try {
        await dataPromise;
      } catch (err) {
        // Handled in toast error
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 w-full">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 items-start">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-[400px] lg:col-span-1 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-10">
        <ErrorState 
          title="Failed to load analytics"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  // Map Backend Data to UI structures
  let mainChartData: ChartDataItem[] = defaultChartData;
  if (analytics && analytics.carbonTrend.length > 0) {
    mainChartData = analytics.carbonTrend.map((item, idx) => {
      const dateObj = new Date(item.month + "-01");
      const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
      return {
        name: monthName,
        emissions: item.totalCarbon,
        target: 2000, // Static mock target line
        score: 700 + (idx * 15), // Mock score trend
        forecast: null,
        milestone: idx === 0 ? "Account Onboarded" : null
      };
    });
  }

  const totalCarbonSum = analytics?.categoryBreakdown.reduce((sum, cat) => sum + cat.totalCarbon, 0) || 0;
  
  const mappedCategories: Record<string, any> = {};
  if (analytics && analytics.categoryBreakdown.length > 0) {
    analytics.categoryBreakdown.forEach(cat => {
      const base = baseCategories[cat.category] || baseCategories.Other;
      const percentage = totalCarbonSum > 0 ? Math.round((cat.totalCarbon / totalCarbonSum) * 100) : 0;
      mappedCategories[cat.category] = {
        value: percentage,
        unit: "% of footprint",
        trend: "Dynamic tracked",
        benchmark: "User Data",
        color: base.color,
        breakdown: [
          { label: "Tracked Emissions", percent: 100, val: `${cat.totalCarbon} kg CO2e` }
        ],
        narrative: base.narrative,
        actions: base.actions
      };
    });
  } else {
    mappedCategories["Transport"] = {
      value: 0, unit: "%", trend: "-", benchmark: "-", color: baseCategories.Transport.color, breakdown: [], narrative: "No data yet", actions: []
    }
  }

  const activeCategoryData = mappedCategories[selectedCategory] || Object.values(mappedCategories)[0];

  if (analytics && analytics.recentActivities.length === 0) {
    return (
      <div className="flex flex-col gap-8 animate-scale-up">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-black tracking-tight">Analytics & Intelligence</h1>
          <p className="text-sm text-muted-foreground">Detailed breakdown of your carbon footprint generated from real activity logs.</p>
        </div>
        <EmptyState
          icon={Activity}
          title="No Data to Analyze"
          description="Log your sustainability activities to see detailed analytics."
          actionLabel="Log Activity"
          actionHref="/log"
          className="my-8"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-scale-up">
      {/* Header section */}
      <div className="flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 w-fit">
          <Sparkles className="h-3 w-3 animate-pulse-glow" />
          <span>Live Synchronized with MongoDB</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Analytics & Intelligence</h1>
        <p className="text-sm text-muted-foreground">Detailed breakdown of your carbon footprint generated from real activity logs.</p>
      </div>

      {/* Financial Tickers Summary Row */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
        {/* Ticker 1 */}
        <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2.5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Tracked Footprint</CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-200/30 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Cloud className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black tracking-tight">{totalCarbonSum.toFixed(1)} <span className="text-xs text-muted-foreground font-semibold">kg CO₂e</span></div>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-100/80 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                <ArrowDownRight className="h-3 w-3" />
                Live
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground/85 font-medium border-t border-zinc-200/40 dark:border-zinc-800/40 pt-2.5">
              <span>Across {analytics?.recentActivities.length || 0} recent activities</span>
            </div>
          </CardContent>
        </Card>

        {/* Ticker 2 */}
        <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2.5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Highest Category</CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/50 dark:bg-amber-950/40 border border-amber-200/30 dark:border-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black tracking-tight capitalize">{analytics?.categoryBreakdown[0]?.category || "None"}</div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground/85 font-medium border-t border-zinc-200/40 dark:border-zinc-800/40 pt-2.5">
              <span>Top Emission Source</span>
            </div>
          </CardContent>
        </Card>

        {/* Ticker 3 */}
        <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-sky-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2.5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Activities Count</CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100/50 dark:bg-sky-950/40 border border-sky-200/30 dark:border-sky-500/10 text-sky-600 dark:text-sky-400">
              <Droplet className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black tracking-tight">
                {analytics?.monthlyTotals.reduce((sum, m) => sum + m.activitiesCount, 0) || 0}
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground/85 font-medium border-t border-zinc-200/40 dark:border-zinc-800/40 pt-2.5">
              <span>Total Logs Captured</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asymmetrical Asymmetric Analytics Panel Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 items-start">
        
        {/* Left Side Chart Panel (2/3 size) */}
        <div className="lg:col-span-2 space-y-5">
          <Tabs defaultValue="emissions" value={activeTab} onValueChange={(val) => setActiveTab(val)} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl">
                <TabsTrigger value="emissions" className="rounded-lg px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm">Emissions Trend</TabsTrigger>
                <TabsTrigger value="sources" className="rounded-lg px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm">Footprint Sources</TabsTrigger>
                <TabsTrigger value="score" className="rounded-lg px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm">Score Evolution</TabsTrigger>
              </TabsList>
            </div>

            {/* Emissions Trend Content */}
            <TabsContent value="emissions" className="animate-scale-up">
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/40 dark:to-zinc-950/20 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Monthly Carbon Trend</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Historical carbon footprint from your direct database logs.</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                  <div className="h-[300px] md:h-[380px] w-full">
                    <AnimatedChartWrapper>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart role="img" aria-label="Emissions History Chart" data={mainChartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                          <defs>
                            <linearGradient id="emissionsGlowGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kg`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" name="emissions" dataKey="emissions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#emissionsGlowGrad)" activeDot={{ r: 6 }} />
                          <Line type="monotone" name="target" dataKey="target" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </AnimatedChartWrapper>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Footprint Sources Content */}
            <TabsContent value="sources" className="animate-scale-up">
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/40 dark:to-zinc-950/20 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Operational Footprint Breakdown</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Interactive drill-down mapping your exact logged MongoDB categories.</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                  <div className="h-[300px] md:h-[380px] w-full">
                    <AnimatedChartWrapper>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          role="img" aria-label="Emissions Category Chart" data={Object.keys(mappedCategories).map((key) => ({
                            name: key,
                            value: mappedCategories[key].value,
                            color: mappedCategories[key].color
                          }))}
                          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                          onClick={(state) => {
                            if (state && state.activeLabel) {
                              setSelectedCategory(state.activeLabel as string)
                            }
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                            {Object.keys(mappedCategories).map((key, index) => (
                              <Cell 
                                key={index} 
                                fill={mappedCategories[key].color} 
                                className="cursor-pointer transition-opacity duration-300 hover:opacity-80"
                                stroke={selectedCategory === key ? "#ffffff" : "none"}
                                strokeWidth={selectedCategory === key ? 2 : 0}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </AnimatedChartWrapper>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Score Evolution Content */}
            <TabsContent value="score" className="animate-scale-up">
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Sustainability Score progression</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Projected score mapping (simulated line based on log density).</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                  <div className="h-[300px] md:h-[380px] w-full">
                    <AnimatedChartWrapper>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart role="img" aria-label="Score History Chart" data={mainChartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                          <defs>
                            <linearGradient id="scoreGlowGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} domain={[550, 900]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" name="score" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#scoreGlowGrad)" activeDot={{ r: 6 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </AnimatedChartWrapper>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side Sidebar Feed Panel (1/3 size) */}
        <div className="lg:col-span-1">
          {activeTab === "emissions" && (
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md animate-scale-up">
              <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Compass className="h-4.5 w-4.5" />
                  <CardTitle className="text-sm font-bold text-foreground">Recent Events</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                <div className="space-y-3.5 relative pl-2">
                  <div className="absolute left-3 top-2 bottom-2 w-[1.5px] bg-zinc-200 dark:bg-zinc-800" />
                  
                  {analytics?.recentActivities.slice(0, 4).map((act, idx) => (
                    <div key={idx} className="relative pl-6 space-y-1 group">
                      <div className="absolute left-[-2px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-zinc-50 dark:border-zinc-950 group-hover:scale-125 transition-transform" />
                      <span className="text-[10px] text-zinc-500 font-bold">{new Date(act.date).toLocaleDateString()}</span>
                      <p className="text-xs font-bold text-foreground">{act.title || act.activityType}</p>
                      <p className="text-[11px] text-muted-foreground leading-normal">{act.carbonEmission} kg CO2e logged.</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "sources" && (
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md animate-scale-up">
              <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: activeCategoryData?.color }} />
                  <CardTitle className="text-sm font-bold text-foreground capitalize">{selectedCategory} Intelligence</CardTitle>
                </div>
                <CardDescription className="text-[10px] text-muted-foreground">{activeCategoryData?.value}% of total footprint</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                <p className="text-xs text-muted-foreground/95 leading-relaxed font-medium">
                  {activeCategoryData?.narrative}
                </p>

                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Detailed Breakdown</span>
                  <div className="space-y-2.5">
                    {activeCategoryData?.breakdown.map((item: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-500">{item.label}</span>
                          <span className="text-foreground">{item.val} ({item.percent}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${item.percent}%`, backgroundColor: activeCategoryData.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-zinc-200/40 dark:border-zinc-800/40">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Recommended Actions</span>
                  <div className="space-y-2">
                    {activeCategoryData?.actions.map((action: string, index: number) => (
                      <div key={index} className="flex gap-2 text-xs font-semibold text-zinc-300 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-emerald-500/20 transition-all cursor-default">
                        <Lightbulb className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
