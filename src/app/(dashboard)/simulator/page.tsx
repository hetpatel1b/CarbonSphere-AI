"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import { Car, Train, Bike, Footprints, Zap, TrendingDown, Leaf, Shield, History, Sparkles, DollarSign, Trees, Loader2 } from "lucide-react"
import { runSimulation, fetchSimulationHistory } from "@/services/simulatorService"
import { EmptyState } from "@/components/ui/empty-state"
import { SimulationRecord } from "@/types"
import { toast } from "sonner"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { Skeleton } from "@/components/ui/skeleton"

const SimulatorChart = dynamic(() => import('@/components/charts/SimulatorChart'), { ssr: false, loading: () => <Skeleton className="w-full h-full rounded-xl" /> })

const SCENARIOS = [
  { id: "switch_to_ev", label: "Switch to EV", icon: Car, category: 'Transport' },
  { id: "public_transport", label: "Public Transit", icon: Train, category: 'Transport' },
  { id: "reduce_flights", label: "Reduce Flights", icon: Shield, category: 'Transport' },
  { id: "solar_panels", label: "Solar Panels", icon: Zap, category: 'Energy' },
  { id: "plant_based", label: "Plant-Based", icon: Leaf, category: 'Food' },
  { id: "second_hand", label: "Second-Hand", icon: Footprints, category: 'Shopping' }
]

export default function SimulatorPage() {
  const [selectedScenario, setSelectedScenario] = useState("switch_to_ev")
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<SimulationRecord["results"] | null>(null)
  const [history, setHistory] = useState<SimulationRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()

  const loadHistory = async () => {
    try {
      const res = await fetchSimulationHistory()
      setHistory(res.data)
    } catch (err) {
      console.warn("Could not load history")
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => loadHistory())
  }, [])

  const handleSimulate = async () => {
    setIsRunning(true)
    setError(null)
    try {
      const res = await runSimulation(selectedScenario)
      setResults(res.data.results)
      loadHistory()
      toast.success("Simulation completed")
    } catch (err: unknown) {
      setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || 'Failed to run simulation')
      toast.error("Simulation failed")
    } finally {
      setIsRunning(false)
    }
  }

  const chartData = results ? [
    { name: "Current Footprint", emissions: results.currentEmissions, color: "#f43f5e" },
    { name: "Simulated Projection", emissions: results.simulatedEmissions, color: "#10b981" }
  ] : []

  return (
    <div className="flex flex-col gap-8 pb-8 relative">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Sustainability Simulator</h1>
        <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
          Simulate lifestyle changes against your actual footprint and forecast planetary impact.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/50">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Panel: Scenario Builder */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="border-border/40 hover:shadow-md transition-shadow bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Scenario Builder</CardTitle>
              <CardDescription>Select an action to project the mathematical impact against your historic carbon logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SCENARIOS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedScenario(m.id)}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                      selectedScenario === m.id 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                        : 'border-border/40 bg-muted/10 text-muted-foreground hover:bg-muted/30'
                    }`}
                  >
                    <m.icon className="h-6 w-6" />
                    <span className="text-xs font-bold">{m.label}</span>
                  </button>
                ))}
              </div>

              <Button 
                onClick={handleSimulate} 
                disabled={isRunning}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl"
              >
                {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isRunning ? "Running Simulation..." : "Run Simulation"}
              </Button>
              
            </CardContent>
          </Card>

          {/* History Panel */}
          {history.length > 0 && (
            <Card className="border-border/40 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-bold flex items-center gap-2"><History className="w-4 h-4 text-emerald-500" /> Recent Simulations</CardTitle>
              </CardHeader>
              <div className="flex flex-col max-h-[300px] overflow-y-auto">
                {history.slice(0,5).map((sim) => (
                  <div key={sim._id} className="p-4 border-b flex justify-between items-center hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setResults(sim.results)}>
                    <div>
                      <h4 className="text-sm font-bold">{sim.scenarioType}</h4>
                      <p className="text-xs text-muted-foreground">{new Date(sim.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10 border-emerald-500/20">
                      -{sim.results.percentageImprovement.toFixed(0)}% CO₂e
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Panel: Impact Projection */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {!results ? (
            <div className="h-full min-h-[500px] flex items-center justify-center">
              <EmptyState 
                icon={TrendingDown}
                title="Awaiting Parameters"
                description="Select a scenario and click run to mathematically project your future carbon reduction."
                className="border-none bg-transparent w-full"
              />
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500" aria-live="polite">
              
              <Card className="relative overflow-hidden border border-emerald-500/15 bg-white/50 backdrop-blur-xl shadow-lg dark:border-emerald-500/10 dark:bg-zinc-950/50">
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/8 blur-[60px] dark:bg-emerald-500/5" />
                <CardHeader>
                  <CardTitle className="text-xl font-black">Simulation Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 rounded-xl border border-border/30 bg-muted/15 p-5 shadow-sm">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Trajectory</span>
                      <span className="text-3xl font-black text-rose-500">{results.currentEmissions.toFixed(0)} <span className="text-sm font-bold text-muted-foreground">kg CO₂e/yr</span></span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-sm">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Simulated Target</span>
                      <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{results.simulatedEmissions.toFixed(0)} <span className="text-sm font-bold opacity-70">kg CO₂e/yr</span></span>
                    </div>
                  </div>
                  
                  {/* Highlight stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div className="p-4 bg-white dark:bg-zinc-900 border rounded-xl flex flex-col items-center justify-center text-center">
                      <TrendingDown className="h-6 w-6 text-emerald-500 mb-2" />
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Reduction</div>
                      <div className="text-lg font-black">{results.carbonReduction.toFixed(0)} kg</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-900 border rounded-xl flex flex-col items-center justify-center text-center">
                      <Leaf className="h-6 w-6 text-emerald-500 mb-2" />
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Improvement</div>
                      <div className="text-lg font-black">{results.percentageImprovement.toFixed(1)}%</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-900 border rounded-xl flex flex-col items-center justify-center text-center">
                      <Trees className="h-6 w-6 text-emerald-500 mb-2" />
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Trees Eq</div>
                      <div className="text-lg font-black">{results.treesEquivalent}</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-900 border rounded-xl flex flex-col items-center justify-center text-center">
                      <DollarSign className="h-6 w-6 text-emerald-500 mb-2" />
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Annual Saved</div>
                      <div className="text-lg font-black">${results.annualSavings}</div>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <div className="h-[250px] md:h-[300px] w-full pt-4 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl" tabIndex={0} aria-describedby="simulator-chart-summary">
                    <span id="simulator-chart-summary" className="sr-only">
                      Simulation indicates a current footprint of {results.currentEmissions.toFixed(0)} kg CO2e. 
                      The simulated projection reduces this to {results.simulatedEmissions.toFixed(0)} kg CO2e, 
                      which is a reduction of {results.carbonReduction.toFixed(0)} kg.
                    </span>
                    <SimulatorChart data={chartData} isAnimationActive={!reducedMotion} />
                  </div>

                </CardContent>
              </Card>

              {/* AI Insights Card */}
              <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="w-5 h-5" /> Groq AI Coach Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Environmental Impact</h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">{results.aiInsights.environmentalSummary}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Long-Term Benefits</h4>
                      <ul className="space-y-1">
                        {results.aiInsights.longTermBenefits.map((b: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Recommended Actions</h4>
                      <ul className="space-y-1">
                        {results.aiInsights.recommendedActions.map((a: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/10">
                     <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Risk Reduction</h4>
                     <p className="text-sm font-semibold">{results.aiInsights.riskReduction}</p>
                     <p className="text-xs text-muted-foreground mt-1">ROI Estimate: <span className="font-mono text-foreground">{results.roiEstimate}</span> (Base Cost: ${results.costEstimate})</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
