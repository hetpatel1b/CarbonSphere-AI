"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import { Car, Train, Bike, Footprints, Zap, TrendingDown, Leaf, Shield, History, Sparkles, DollarSign, Trees, Loader2, Gauge, Battery, Activity, Cpu, Target } from "lucide-react"
import { runSimulation, fetchSimulationHistory } from "@/services/simulatorService"
import { SimulationRecord } from "@/types"
import { toast } from "sonner"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const SimulatorChart = dynamic(() => import('@/components/charts/SimulatorChart'), { ssr: false, loading: () => <Skeleton className="w-full h-full rounded-2xl bg-zinc-900/50" /> })

const SCENARIOS = [
  { id: "switch_to_ev", label: "Switch to EV", icon: Car, category: 'Transport', desc: "Replace ICE with Electric" },
  { id: "public_transport", label: "Public Transit", icon: Train, category: 'Transport', desc: "Use bus or train daily" },
  { id: "reduce_flights", label: "Reduce Flights", icon: Shield, category: 'Transport', desc: "-1 long-haul flight/yr" },
  { id: "solar_panels", label: "Solar Panels", icon: Zap, category: 'Energy', desc: "Install 5kW system" },
  { id: "plant_based", label: "Plant-Based", icon: Leaf, category: 'Food', desc: "Vegan diet transition" },
  { id: "second_hand", label: "Second-Hand", icon: Footprints, category: 'Shopping', desc: "Buy 50% pre-owned" }
]

// Animated SVG Circular Gauge
const CircularGauge = ({ value, max, label, icon: Icon, colorClass, strokeClass }: { value: number, max: number, label: string, icon: any, colorClass: string, strokeClass: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / max, 1);
  const strokeDashoffset = circumference - (percentage * circumference);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background Track */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" className="text-zinc-800" />
          {/* Progress */}
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="40" cy="40" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" 
            strokeLinecap="round"
            className={strokeClass}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={cn("w-5 h-5 mb-0.5", colorClass)} />
          <span className="text-sm font-black text-white">{value.toFixed(0)}{label.includes('%') ? '%' : ''}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-3 text-center leading-tight">{label}</span>
    </div>
  )
}

export default function SimulatorPage() {
  const [selectedScenario, setSelectedScenario] = useState("switch_to_ev")
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<SimulationRecord["results"] | null>(null)
  const [history, setHistory] = useState<SimulationRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const reducedMotion = useReducedMotion()

  const loadHistory = async () => {
    try {
      const res = await fetchSimulationHistory()
      setHistory(res.data)
    } catch (err) {
      console.warn("Could not load history")
    }
  }

  const handleSimulate = async (scenarioId: string, isInitial = false) => {
    setIsRunning(true)
    setError(null)
    try {
      const res = await runSimulation(scenarioId)
      setResults(res.data.results)
      if (!isInitial) {
        loadHistory()
        toast.success("Telemetry updated")
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || 'Failed to run simulation')
      if (!isInitial) toast.error("Simulation failed")
    } finally {
      setIsRunning(false)
      if (isInitial) setInitialLoad(false)
    }
  }

  // Run initial simulation on mount to avoid empty state
  useEffect(() => {
    Promise.resolve().then(() => loadHistory())
    Promise.resolve().then(() => handleSimulate(selectedScenario, true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRunClick = () => {
    handleSimulate(selectedScenario)
  }

  const chartData = results ? [
    { name: "Current Footprint", emissions: results.currentEmissions, color: "#f43f5e" },
    { name: "Simulated Target", emissions: results.simulatedEmissions, color: "#10b981" }
  ] : []

  // Derived Metrics for Tesla/Apple feel
  const fuelSaved = results ? (results.carbonReduction * 0.112).toFixed(1) : "0" // Approx 11.2 gallons per 100kg
  const energySaved = results ? (results.carbonReduction * 1.4).toFixed(0) : "0" // Approx 140 kWh per 100kg
  const confidenceScore = results ? Math.min(98, 85 + (results.percentageImprovement / 2)) : 0;

  return (
    <div className="flex flex-col gap-8 pb-12 w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-white/5 pb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
          Telemetry Simulator
          <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold uppercase tracking-wider text-[10px] hidden sm:flex"><Activity className="w-3 h-3 mr-1" /> Live Sync</Badge>
        </h1>
        <p className="text-base text-zinc-400 max-w-2xl font-medium">
          Project lifestyle modifications against your historical data using dynamic forecasting algorithms.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Panel: Scenario Builder (Control Center) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-zinc-800 text-zinc-300 border border-white/10"><Cpu className="w-5 h-5" /></div>
              <div>
                <h3 className="text-xl font-bold text-white">Parameters</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Select a modification scenario.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 flex-1">
              {SCENARIOS.map((m) => {
                const isActive = selectedScenario === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedScenario(m.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left relative overflow-hidden group",
                      isActive 
                        ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                        : "border-white/5 bg-zinc-950/50 hover:bg-zinc-800 hover:border-white/10"
                    )}
                  >
                    {isActive && <motion.div layoutId="activeScenarioIndicator" className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      isActive ? "bg-emerald-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 group-hover:text-white"
                    )}>
                      <m.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={cn("text-sm font-bold", isActive ? "text-white" : "text-zinc-300")}>{m.label}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">{m.desc}</p>
                    </div>
                    {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />}
                  </button>
                )
              })}
            </div>

            <Button 
              onClick={handleRunClick} 
              disabled={isRunning || initialLoad}
              className="w-full mt-6 bg-white hover:bg-zinc-200 text-zinc-950 font-black h-14 rounded-2xl text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              {isRunning ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Compiling Data</> : "Execute Projection"}
            </Button>
          </div>

          {/* History Panel (Mini Ledger) */}
          {history.length > 0 && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><History className="w-4 h-4 text-emerald-400" /> Recent Configurations</h3>
              <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 hide-scrollbar">
                {history.slice(0,5).map((sim) => (
                  <div key={sim._id} className="flex justify-between items-center p-3 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-white/5" onClick={() => setResults(sim.results)}>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-300">{SCENARIOS.find(s => s.id === sim.scenarioType)?.label || sim.scenarioType}</h4>
                      <p className="text-[10px] text-zinc-500 font-medium">{new Date(sim.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 font-bold text-[10px]">
                      -{sim.results.percentageImprovement.toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Impact Projection (Dashboard) */}
        <div className="lg:col-span-8 flex flex-col gap-6 relative min-h-[600px]">
          {/* Overlay loader when running */}
          <AnimatePresence>
            {isRunning && !initialLoad && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 rounded-3xl bg-zinc-950/60 backdrop-blur-md border border-emerald-500/30 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
              >
                 <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                 <h2 className="text-xl font-black text-white tracking-widest uppercase">Processing Telemetry</h2>
                 <p className="text-sm text-emerald-400/80 font-mono mt-2">Calculating environmental deltas...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {initialLoad && !results ? (
            <div className="flex-1 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl flex items-center justify-center">
               <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
            </div>
          ) : results && (
            <div className="space-y-6" aria-live="polite">
              
              {/* Top Tesla-style Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 {/* Apple Health Stacked Bar for Before/After */}
                 <div className="sm:col-span-2 p-6 md:p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-6">
                      <Target className="w-5 h-5 text-zinc-400" />
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Emissions Delta (kg CO₂e/yr)</h3>
                    </div>

                    <div className="flex flex-col gap-5 w-full max-w-md mx-auto sm:mx-0">
                      {/* Current Bar */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 shrink-0 text-right">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Baseline</span>
                          <span className="text-lg font-black text-rose-400">{results.currentEmissions.toFixed(0)}</span>
                        </div>
                        <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1, ease: "easeOut" }}
                             className="h-full bg-rose-500 rounded-full" 
                           />
                        </div>
                      </div>

                      {/* Projected Bar */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 shrink-0 text-right">
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Projected</span>
                          <span className="text-lg font-black text-emerald-400">{results.simulatedEmissions.toFixed(0)}</span>
                        </div>
                        <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: `${Math.max(10, (results.simulatedEmissions / results.currentEmissions) * 100)}%` }} 
                             transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                             className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" 
                           />
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Gauges Side */}
                 <div className="p-4 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col justify-center items-center gap-2">
                    <CircularGauge 
                      value={results.percentageImprovement} 
                      max={100} 
                      label="Reduction" 
                      icon={TrendingDown}
                      colorClass="text-emerald-400"
                      strokeClass="text-emerald-500"
                    />
                    <div className="w-16 h-px bg-white/10 my-1" />
                    <CircularGauge 
                      value={confidenceScore} 
                      max={100} 
                      label="Confidence" 
                      icon={Gauge}
                      colorClass="text-sky-400"
                      strokeClass="text-sky-500"
                    />
                 </div>
              </div>

              {/* Middle Row: Environmental Impact Visuals */}
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                {[
                  { label: "Trees Equivalent", value: results.treesEquivalent, unit: "Trees/yr", icon: Trees, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                  { label: "Fuel Saved", value: fuelSaved, unit: "Gallons/yr", icon: Battery, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
                  { label: "Capital Retained", value: `$${results.annualSavings}`, unit: "USD/yr", icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 md:p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", stat.bg, stat.border)}>
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                    </div>
                    <div className="text-xl md:text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{stat.unit}</div>
                    <div className="text-[10px] font-medium text-zinc-600 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Bottom Row: Chart & Apple Intelligence Bubble */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="w-5 h-5 text-zinc-400" />
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Trajectory Graph</h3>
                  </div>
                  <div className="flex-1 min-h-[200px] w-full">
                     <SimulatorChart data={chartData} isAnimationActive={!reducedMotion} />
                  </div>
                </div>

                {/* Apple Intelligence Style AI Bubble */}
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-950 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 animate-pulse rounded-full" />
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-lg relative z-10">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Intelligence Analysis</h3>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Groq Neural Engine</p>
                    </div>
                  </div>

                  <div className="flex-1 relative z-10 space-y-5">
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                      <span className="text-white font-bold">Summary:</span> {results.aiInsights.environmentalSummary}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Shield className="w-3 h-3 text-emerald-400" /> Recommended Protocol</h4>
                        <ul className="space-y-2">
                          {results.aiInsights.recommendedActions.slice(0, 2).map((a: string, i: number) => (
                            <li key={i} className="text-xs font-medium text-zinc-300 flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span className="leading-tight">{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                       <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Risk Mitigation</span>
                         <span className="text-xs font-bold text-emerald-400">{results.aiInsights.riskReduction}</span>
                       </div>
                       <div className="flex flex-col text-right">
                         <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Est. Cost Base</span>
                         <span className="text-xs font-black text-white">${results.costEstimate}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
