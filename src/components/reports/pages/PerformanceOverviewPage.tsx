import React from "react"
import { Leaf, TrendingUp, Target } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts"
import { MonthlyData, ScoreData } from "../types"

export const PerformanceOverviewPage: React.FC<{ monthlyData: MonthlyData[], scoreData: ScoreData[] }> = ({ monthlyData, scoreData }) => {
  return (
<div 
        id="pdf-page-2"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-zinc-950 relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 01</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">Performance Overview</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Monthly Saved CO₂</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">3.1 <span className="text-xs text-zinc-400 font-normal">tCO₂e</span></p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Leaf className="h-4 w-4" />
              </div>
            </div>
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Sustainability Growth</span>
                <p className="text-xl font-bold text-sky-400 mt-1">+222 <span className="text-xs text-zinc-400 font-normal">pts (35%)</span></p>
              </div>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Goal Progress Rate</span>
                <p className="text-xl font-bold text-amber-400 mt-1">78% <span className="text-xs text-zinc-400 font-normal">Avg</span></p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Target className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-900">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Monthly CO₂ Reduction
              </h3>
              <div className="flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl" tabIndex={0} aria-describedby="pdf-bar-summary">
                <span id="pdf-bar-summary" className="sr-only">
                  Monthly CO2 reduction chart. Total reduction over the last period is tracked.
                  Current reduction is {monthlyData[monthlyData.length - 1]?.reduction || 0} tonnes.
                </span>
                <BarChart role="img" aria-label="Monthly Emissions Chart" width={300} height={200} data={monthlyData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} />
                  <Bar dataKey="reduction" fill="#10b981" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </div>
              <p className="text-[10px] text-zinc-500 mt-3 text-center">Tonnes of carbon saved per month over latest period</p>
            </div>

            <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-900">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-500"></span> Sustainability Score Trend
              </h3>
              <div className="flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl" tabIndex={0} aria-describedby="pdf-area-summary">
                <span id="pdf-area-summary" className="sr-only">
                  Sustainability score trend chart. 
                  Latest score is {scoreData[scoreData.length - 1]?.score || 0}.
                </span>
                <AreaChart role="img" aria-label="Score History Chart" width={300} height={200} data={scoreData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="pdfScoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} domain={['dataMin - 50', 'dataMax + 50']} />
                  <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#pdfScoreGrad)" isAnimationActive={false} />
                </AreaChart>
              </div>
              <p className="text-[10px] text-zinc-500 mt-3 text-center">Progression of overall sustainability scoring</p>
            </div>
          </div>

          {/* Goal Progress Section */}
          <div className="bg-zinc-900/20 p-5 rounded-2xl border border-zinc-900 space-y-4">
            <h3 className="text-sm font-bold text-white">Active Goals Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-medium">Shift Servers to Green hosting</span>
                  <span className="text-emerald-400 font-bold">80%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-medium">Implement Smart Thermostats</span>
                  <span className="text-emerald-400 font-bold">65%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-medium">Optimize E-Bike Fleet Logistics</span>
                  <span className="text-emerald-400 font-bold">45%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span>Sustainability Performance Report</span>
          <span>Page 2 of 7</span>
        </div>
      </div>
  )
}
