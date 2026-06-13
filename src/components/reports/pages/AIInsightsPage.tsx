import React from "react"
import { Sparkles, TrendingUp, Award, AlertCircle, Zap, ChevronRight } from "lucide-react"

export const AIInsightsPage: React.FC = () => {
  return (
<div 
        id="pdf-page-3"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-zinc-950 relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 02</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">AI Insights & Diagnostics</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          {/* Engine Summary Card */}
          <div className="bg-gradient-to-r from-emerald-950/20 via-zinc-900/40 to-zinc-900/40 p-5 rounded-2xl border border-emerald-900/20 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Diagnostic Engine Active
              </span>
              <h3 className="text-base font-bold text-white">AI Copilot Recommendation System</h3>
              <p className="text-xs text-zinc-400">Analysis run completed over 12 operational datasets. Recommended priorities ranked below.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 font-medium">Confidence Score</span>
              <p className="text-2xl font-black text-emerald-400">94%</p>
            </div>
          </div>

          {/* Insight Breakdown Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top Improvement Area */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div className="absolute top-0 right-0 p-3 text-emerald-500/20">
                <TrendingUp className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">Top Improvement Area</span>
                <h4 className="text-lg font-bold text-white mt-1">Transportation Systems</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Active transit and logistics routing updates contributed a massive 4.2 tCO₂e reduction. E-Bike commute tracking holds further potential.
                </p>
              </div>
              <div className="flex items-center text-xs text-emerald-400 font-semibold gap-1">
                <span>View roadmap details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Top Achievement */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div className="absolute top-0 right-0 p-3 text-amber-500/20">
                <Award className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold">Top Achievement</span>
                <h4 className="text-lg font-bold text-white mt-1">Energy Saver Elite</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Achieved 20% carbon reduction in office environment by deploying smart heating, smart thermostats, and scheduled operations.
                </p>
              </div>
              <div className="flex items-center text-xs text-amber-400 font-semibold gap-1">
                <span>View unlock details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Biggest Emission Hotspot */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div className="absolute top-0 right-0 p-3 text-rose-500/20">
                <AlertCircle className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-bold">Biggest Hotspot</span>
                <h4 className="text-lg font-bold text-white mt-1">Server Hosting Platforms</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Legacy data centers represent 42% of remaining scope-3 carbon footprints. Server locations should be migrated to carbon-free grids immediately.
                </p>
              </div>
              <div className="flex items-center text-xs text-rose-400 font-semibold gap-1">
                <span>Analyze mitigation options</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Forecast Summary */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div className="absolute top-0 right-0 p-3 text-sky-500/20">
                <Zap className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-bold">Forecast Summary</span>
                <h4 className="text-lg font-bold text-white mt-1">-18% Emissions Projected</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Model forecasts that executing the three high-priority actions next quarter will lead to an 18% overall emission reduction.
                </p>
              </div>
              <div className="flex items-center text-xs text-sky-400 font-semibold gap-1">
                <span>View predictive model</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span>AI Insights & Diagnostics</span>
          <span>Page 3 of 7</span>
        </div>
      </div>
  )
}
