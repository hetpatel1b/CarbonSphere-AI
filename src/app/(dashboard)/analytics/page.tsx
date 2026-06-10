"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Area, AreaChart, Bar, BarChart, ResponsiveContainer, 
  XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart, Cell, ReferenceLine
} from "recharts"
import { 
  ArrowDownRight, ArrowUpRight, Cloud, Droplet, Zap, 
  Award, TrendingDown, Target, Lightbulb, Compass,
  Sparkles, ShieldCheck, ChevronRight
} from "lucide-react"
import { AnimatedChartWrapper } from "@/components/ui/animation-system"

// Complete integrated high-density timeline data
const mainChartData = [
  { name: "Jan", emissions: 2.1, target: 2.5, score: 620, forecast: null, milestone: "Account Onboarded" },
  { name: "Feb", emissions: 1.9, target: 2.4, score: 650, forecast: null, milestone: "HVAC Upgrade" },
  { name: "Mar", emissions: 2.2, target: 2.3, score: 680, forecast: null, milestone: "Green Hosting Migration" },
  { name: "Apr", emissions: 1.8, target: 2.2, score: 740, forecast: null, milestone: "E-Bike Launch" },
  { name: "May", emissions: 1.5, target: 2.0, score: 790, forecast: null, milestone: "Offset Registry Active" },
  { name: "Jun", emissions: 1.6, target: 1.9, score: 842, forecast: null, milestone: "Energy Saver Badge" },
  { name: "Jul", emissions: 1.2, target: 1.8, score: 850, forecast: 1.2, milestone: "Gold Standard offsets retired" },
  { name: "Aug", emissions: null, target: 1.7, score: null, forecast: 1.0, milestone: null },
  { name: "Sep", emissions: null, target: 1.6, score: null, forecast: 0.9, milestone: null },
  { name: "Oct", emissions: null, target: 1.5, score: null, forecast: 0.8, milestone: null },
]

// Detailed sub-category drill-downs
const sourceCategories = {
  Transport: {
    value: 45,
    unit: "% of footprint",
    trend: "+2% from last month",
    benchmark: "1.5 tCO₂e Sector Avg",
    color: "#3b82f6",
    breakdown: [
      { label: "Daily Commute Logs", percent: 60, val: "2.7 tCO₂e" },
      { label: "Corporate Business Flights", percent: 30, val: "1.35 tCO₂e" },
      { label: "Client Logistics/Deliveries", percent: 10, val: "0.45 tCO₂e" },
    ],
    narrative: "Commuting by single-occupancy vehicles remains your highest operational emission source. Shifting to electrified transit or remote schedules offers instant mitigation.",
    actions: [
      "Subsidize employee E-Bike purchases (+15 score points)",
      "Optimize logistics delivery routes using AI scheduler (+10 score points)",
    ]
  },
  Energy: {
    value: 35,
    unit: "% of footprint",
    trend: "-12% from last month",
    benchmark: "1.2 tCO₂e Sector Avg",
    color: "#f59e0b",
    breakdown: [
      { label: "Cloud Server Hosting", percent: 55, val: "1.92 tCO₂e" },
      { label: "Office Heating & Ventilation", percent: 35, val: "1.23 tCO₂e" },
      { label: "Equipment Plug Loads", percent: 10, val: "0.35 tCO₂e" },
    ],
    narrative: "Transitioning cloud hosting to Carbon-Free regions lowered footprint by 12% in Q2. Office heating remains high during off-hours.",
    actions: [
      "Install smart HVAC thermostats with occupancy sensors (+8 score points)",
      "Configure off-hour sleep schedules for workspace laptops (+5 score points)",
    ]
  },
  Diet: {
    value: 15,
    unit: "% of footprint",
    trend: "0% stable",
    benchmark: "0.5 tCO₂e Sector Avg",
    color: "#10b981",
    breakdown: [
      { label: "Meat & Dairy Catering", percent: 70, val: "1.05 tCO₂e" },
      { label: "Organic Pantry Logistics", percent: 20, val: "0.30 tCO₂e" },
      { label: "Food Transport Footprint", percent: 10, val: "0.15 tCO₂e" },
    ],
    narrative: "Food footprint is stable. Shifting office catering menus to vegetarian-first defaults can eliminate a substantial portion of meal footprint.",
    actions: [
      "Implement Meatless Mondays defaults for catered events (+4 score points)",
      "Source pantry catering from regional suppliers (+3 score points)",
    ]
  },
  Waste: {
    value: 5,
    unit: "% of footprint",
    trend: "-8% from last month",
    benchmark: "0.2 tCO₂e Sector Avg",
    color: "#a855f7",
    breakdown: [
      { label: "Paper & Cardboard Packaging", percent: 65, val: "0.33 tCO₂e" },
      { label: "E-Waste Hardware Disposal", percent: 25, val: "0.12 tCO₂e" },
      { label: "Organic Kitchen Waste", percent: 10, val: "0.05 tCO₂e" },
    ],
    narrative: "Paperless invoicing lowered waste print rates. Old hardware disposal represents the main potential hotspot.",
    actions: [
      "Establish certified hardware recycling protocols (+6 score points)",
      "Replace remaining single-use pantry items (+2 score points)",
    ]
  }
}

type CategoryKey = "Transport" | "Energy" | "Diet" | "Waste"

// Bloomberg custom interactive tooltip component
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
                {p.name}: {displayVal} {p.name.includes("Score") ? "pts" : "tCO₂e"}
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("Transport")
  const [activeTab, setActiveTab] = useState("emissions")

  const activeCategoryData = sourceCategories[selectedCategory]

  return (
    <div className="flex flex-col gap-8 animate-scale-up">
      {/* Header section */}
      <div className="flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 w-fit">
          <Sparkles className="h-3 w-3 animate-pulse-glow" />
          <span>Bloomberg ESG Benchmark Grade A</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Analytics & Intelligence</h1>
        <p className="text-sm text-muted-foreground">Detailed financial-grade breakdown of your carbon footprint, forecasts, and benchmarks.</p>
      </div>

      {/* Financial Tickers Summary Row */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Ticker 1 */}
        <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2.5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Footprint</CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-200/30 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Cloud className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black tracking-tight">12.3 <span className="text-xs text-muted-foreground font-semibold">tCO₂e</span></div>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-100/80 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                <ArrowDownRight className="h-3 w-3" />
                -12%
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground/85 font-medium border-t border-zinc-200/40 dark:border-zinc-800/40 pt-2.5">
              <span>Sector Benchmark</span>
              <span className="font-bold text-foreground">15.2 tCO₂e</span>
            </div>
          </CardContent>
        </Card>

        {/* Ticker 2 */}
        <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2.5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Power Consumption</CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/50 dark:bg-amber-950/40 border border-amber-200/30 dark:border-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black tracking-tight">840 <span className="text-xs text-muted-foreground font-semibold">kWh</span></div>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-rose-100/80 px-1.5 py-0.2 text-[9px] font-bold text-rose-800 dark:bg-rose-500/10 dark:text-rose-400">
                <ArrowUpRight className="h-3 w-3" />
                +4%
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground/85 font-medium border-t border-zinc-200/40 dark:border-zinc-800/40 pt-2.5">
              <span>Goal Rate Target</span>
              <span className="font-bold text-foreground">800 kWh</span>
            </div>
          </CardContent>
        </Card>

        {/* Ticker 3 */}
        <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-sky-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2.5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Water Conservation</CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100/50 dark:bg-sky-950/40 border border-sky-200/30 dark:border-sky-500/10 text-sky-600 dark:text-sky-400">
              <Droplet className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black tracking-tight">1,250 <span className="text-xs text-muted-foreground font-semibold">L</span></div>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-100/80 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                <ArrowUpRight className="h-3 w-3" />
                +18%
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground/85 font-medium border-t border-zinc-200/40 dark:border-zinc-800/40 pt-2.5">
              <span>Conservation Benchmark</span>
              <span className="font-bold text-foreground">1,000 L</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asymmetrical Asymmetric Analytics Panel Grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        
        {/* Left Side Chart Panel (2/3 size) */}
        <div className="lg:col-span-2 space-y-5">
          <Tabs defaultValue="emissions" value={activeTab} onValueChange={(val) => setActiveTab(val)} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl">
                <TabsTrigger value="emissions" className="rounded-lg px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm">Emissions Trend</TabsTrigger>
                <TabsTrigger value="sources" className="rounded-lg px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm">Footprint Sources</TabsTrigger>
                <TabsTrigger value="score" className="rounded-lg px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm">Score Evolution</TabsTrigger>
              </TabsList>
              
              {/* Context indicator */}
              <span className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider hidden sm:inline-block">
                {activeTab === "emissions" ? "Forecast model active" : activeTab === "sources" ? "Drill-down active (Click bars)" : "Evolution Milestones"}
              </span>
            </div>

            {/* Emissions Trend Content */}
            <TabsContent value="emissions" className="animate-scale-up">
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/40 dark:to-zinc-950/20 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Monthly Carbon Trend & Forecast</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Historical carbon footprint mapped against goal limits, detailing AI-forecasted projections.</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                  <div className="h-[380px] w-full">
                    <AnimatedChartWrapper>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mainChartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                          <defs>
                            <linearGradient id="emissionsGlowGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}t`} />
                          <Tooltip content={<CustomTooltip />} />
                          
                          {/* Shaded Area for historical emissions */}
                          <Area type="monotone" name="emissions" dataKey="emissions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#emissionsGlowGrad)" activeDot={{ r: 6 }} />
                          
                          {/* Target Line */}
                          <Line type="monotone" name="target" dataKey="target" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                          
                          {/* Forecast Projections Line */}
                          <Line type="monotone" name="forecast" dataKey="forecast" stroke="#0ea5e9" strokeWidth={2.5} strokeDasharray="4 4" dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 3 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </AnimatedChartWrapper>
                  </div>
                  <div className="flex gap-4 justify-center text-[10px] text-muted-foreground/80 font-bold border-t border-zinc-200/40 dark:border-zinc-800/40 pt-4 mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Emissions Tracked</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-3.5 bg-red-500 rounded-sm inline-block"></span>
                      <span>Target Goal Limits</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-3.5 bg-sky-500 rounded-sm inline-block"></span>
                      <span>AI Forecast Overlay</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Footprint Sources Content */}
            <TabsContent value="sources" className="animate-scale-up">
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/40 dark:to-zinc-950/20 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Operational Footprint Breakdown</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Interactive drill-down. Click on any bar segment to load detailed context analyses.</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                  <div className="h-[380px] w-full">
                    <AnimatedChartWrapper>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={Object.keys(sourceCategories).map((key) => ({
                            name: key,
                            value: sourceCategories[key as CategoryKey].value,
                            color: sourceCategories[key as CategoryKey].color
                          }))}
                          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                          onClick={(state) => {
                            if (state && state.activeLabel) {
                              setSelectedCategory(state.activeLabel as CategoryKey)
                            }
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                            {Object.keys(sourceCategories).map((key, index) => (
                              <Cell 
                                key={index} 
                                fill={sourceCategories[key as CategoryKey].color} 
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
                  <p className="text-[10px] text-muted-foreground/60 text-center mt-2 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-4">Click segments to change the focused category drill-down details</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Score Evolution Content */}
            <TabsContent value="score" className="animate-scale-up">
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Sustainability Score progression</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Historical milestones achieved during score increments mapped across the time horizon.</CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                  <div className="h-[380px] w-full">
                    <AnimatedChartWrapper>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mainChartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
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
                  <p className="text-[10px] text-muted-foreground/60 text-center mt-2 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-4">Hover coordinates to view major sustainability milestones unlocked during score jumps</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side Sidebar Feed Panel (1/3 size) */}
        <div className="lg:col-span-1">
          {/* Emissions intelligence details */}
          {activeTab === "emissions" && (
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md animate-scale-up">
              <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Compass className="h-4.5 w-4.5" />
                  <CardTitle className="text-sm font-bold text-foreground">Trend Storytelling Feed</CardTitle>
                </div>
                <CardDescription className="text-[10px] text-muted-foreground">Key carbon events and benchmark diagnostics.</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                {/* Benchmark grades widget */}
                <div className="bg-zinc-100/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-850 p-4 rounded-2xl space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Global Benchmarks</span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-500">Your Average</span>
                      <span className="text-emerald-500">1.75 tCO₂e/mo</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-500">Global Average</span>
                      <span className="text-zinc-300">3.20 tCO₂e/mo</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-500">Sector Goal</span>
                      <span className="text-emerald-400">1.80 tCO₂e/mo</span>
                    </div>
                  </div>
                </div>

                {/* Event Logs list */}
                <div className="space-y-3.5 relative pl-2">
                  <div className="absolute left-3 top-2 bottom-2 w-[1.5px] bg-zinc-200 dark:bg-zinc-800" />
                  
                  <div className="relative pl-6 space-y-1 group">
                    <div className="absolute left-[-2px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-zinc-50 dark:border-zinc-950 group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] text-zinc-500 font-bold">JULY 2026</span>
                    <p className="text-xs font-bold text-foreground">Gold Standard Offsets Retired</p>
                    <p className="text-[11px] text-muted-foreground leading-normal">Retired 5.2 tonnes of CO₂e at Rimba Raya Reserve.</p>
                  </div>
                  
                  <div className="relative pl-6 space-y-1 group">
                    <div className="absolute left-[-2px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-zinc-50 dark:border-zinc-950 group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] text-zinc-500 font-bold">JUNE 2026</span>
                    <p className="text-xs font-bold text-foreground">Energy Saver Elite Badge</p>
                    <p className="text-[11px] text-muted-foreground leading-normal">Achieved 20% electrical reduction across workspace offices.</p>
                  </div>
                  
                  <div className="relative pl-6 space-y-1 group">
                    <div className="absolute left-[-2px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-700 border-2 border-zinc-50 dark:border-zinc-950 group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] text-zinc-500 font-bold">APRIL 2026</span>
                    <p className="text-xs font-bold text-foreground">E-Bike Commute Policy</p>
                    <p className="text-[11px] text-muted-foreground leading-normal">Launched public transit and cycling incentives for employees.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sources Category Drill-Down Details */}
          {activeTab === "sources" && (
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md animate-scale-up">
              <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: activeCategoryData.color }} />
                  <CardTitle className="text-sm font-bold text-foreground">{selectedCategory} Intelligence</CardTitle>
                </div>
                <CardDescription className="text-[10px] text-muted-foreground">{activeCategoryData.value}% of total footprint • {activeCategoryData.benchmark}</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                {/* Narrative */}
                <p className="text-xs text-muted-foreground/95 leading-relaxed font-medium">
                  {activeCategoryData.narrative}
                </p>

                {/* Sub-breakdown Bars */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Detailed Breakdown</span>
                  <div className="space-y-2.5">
                    {activeCategoryData.breakdown.map((item, index) => (
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

                {/* Direct Action Recommendations */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-200/40 dark:border-zinc-800/40">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Recommended Actions</span>
                  <div className="space-y-2">
                    {activeCategoryData.actions.map((action, index) => (
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

          {/* Score Evolution Milestones List */}
          {activeTab === "score" && (
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md animate-scale-up">
              <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <CardTitle className="text-sm font-bold text-foreground">Score Evolution Milestones</CardTitle>
                </div>
                <CardDescription className="text-[10px] text-muted-foreground">Historical records of score growth events.</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                {mainChartData
                  .filter((item) => item.score !== null)
                  .map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-zinc-100/50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-sky-500/20 transition-all">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase">{item.name} 2026</span>
                        <p className="text-xs font-bold text-foreground truncate">{item.milestone}</p>
                      </div>
                      <span className="text-sm font-black text-sky-500 shrink-0 ml-4">
                        {item.score} pts
                      </span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
