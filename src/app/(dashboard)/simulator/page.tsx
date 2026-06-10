"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Car, Train, Bike, Footprints, Zap, TrendingDown, Leaf } from "lucide-react"

type TransportMode = "Car" | "Public Transport" | "EV" | "Bicycle" | "Walking"

const EMISSION_FACTORS: Record<TransportMode, number> = {
  "Car": 0.21,
  "Public Transport": 0.08,
  "EV": 0.10,
  "Bicycle": 0,
  "Walking": 0,
}

const MODES = [
  { id: "Car", label: "Car", icon: Car },
  { id: "Public Transport", label: "Transit", icon: Train },
  { id: "EV", label: "EV", icon: Zap },
  { id: "Bicycle", label: "Bicycle", icon: Bike },
  { id: "Walking", label: "Walking", icon: Footprints },
]

export default function SimulatorPage() {
  const [mode, setMode] = useState<TransportMode>("Public Transport")
  const [distance, setDistance] = useState<number>(15)
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5)

  // Calculations
  const distanceVal = distance || 0
  const daysVal = daysPerWeek || 0
  
  const baselineAnnual = distanceVal * daysVal * 52 * EMISSION_FACTORS["Car"]
  const projectedAnnual = distanceVal * daysVal * 52 * EMISSION_FACTORS[mode]
  const annualReduction = Math.max(0, baselineAnnual - projectedAnnual)

  const chartData = [
    {
      name: "Baseline",
      emissions: baselineAnnual,
      color: "#71717a", // zinc-500
    },
    {
      name: "Projected",
      emissions: projectedAnnual,
      color: "#10b981", // emerald-500
    }
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Carbon Footprint Simulator</h1>
        <p className="text-sm text-muted-foreground">
          Explore how lifestyle changes can reduce your emissions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Panel: Scenario */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">What If Scenario</CardTitle>
              <CardDescription>Adjust variables to simulate environmental impact.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Transport Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Transport Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id as TransportMode)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        mode === m.id 
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'border-border/40 bg-muted/10 text-muted-foreground hover:bg-muted/30'
                      }`}
                    >
                      <m.icon className="h-5 w-5" />
                      <span className="text-[11px] font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Distance Per Day (km)</Label>
                  <Input 
                    type="number" 
                    min={0} 
                    value={distance} 
                    onChange={(e) => setDistance(Number(e.target.value))} 
                    className="bg-muted/20 border-border/50 rounded-lg focus-visible:ring-emerald-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Days Per Week</Label>
                  <Input 
                    type="number" 
                    min={0} 
                    max={7}
                    value={daysPerWeek} 
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))} 
                    className="bg-muted/20 border-border/50 rounded-lg focus-visible:ring-emerald-500/30"
                  />
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Impact Projection */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="relative overflow-hidden border border-emerald-500/15 bg-white/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(16,185,129,0.04)] dark:border-emerald-500/10 dark:bg-zinc-950/50">
            <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/8 blur-[60px] dark:bg-emerald-500/5" />
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Impact Projection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 rounded-lg border border-border/30 bg-muted/15 p-4">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Current Baseline</span>
                  <span className="text-2xl font-bold">{baselineAnnual.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">kg CO₂e/yr</span></span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Projected Emissions</span>
                  <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{projectedAnnual.toFixed(0)} <span className="text-sm font-normal opacity-70">kg CO₂e/yr</span></span>
                </div>
              </div>
              
              {/* Highlight stats */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                 <div className="flex items-center gap-3">
                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                     <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                   </div>
                   <div>
                     <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Annual Reduction</div>
                     <div className="text-lg font-semibold text-foreground">{annualReduction.toFixed(0)} kg CO₂e</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                     <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                   </div>
                   <div>
                     <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Score Improvement</div>
                     <div className="text-lg font-semibold text-foreground">+{Math.round(annualReduction / 5)} pts</div>
                   </div>
                 </div>
              </div>
              
              {/* Chart */}
              <div className="h-[200px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} kg`} />
                    <YAxis dataKey="name" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                      formatter={(value: number) => [`${value.toFixed(0)} kg CO₂e`, "Emissions"]}
                    />
                    <Bar dataKey="emissions" radius={[0, 4, 4, 0]} barSize={32}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
