import React from "react"
import { Award } from "lucide-react"

export const AchievementsPage: React.FC = () => {
  return (
<div 
        id="pdf-page-5"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-zinc-950 relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 04</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">Achievements & Engagement</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          {/* Gamification Summary Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Total Badges</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">14 / 20</p>
            </div>
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Community Rank</span>
              <p className="text-xl font-bold text-sky-400 mt-1">#42 (Top 5%)</p>
            </div>
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Saved by Community</span>
              <p className="text-xl font-bold text-teal-400 mt-1">1.2 tCO₂e</p>
            </div>
          </div>

          {/* Completed Achievements List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Highlighted Achievements</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-start gap-3">
                <div className="p-2 rounded bg-amber-500/10 text-amber-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-200">First Step</span>
                    <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded uppercase font-bold">Common</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Completed first carbon offset. Unlocked on January 12, 2026.</p>
                </div>
              </div>

              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-start gap-3">
                <div className="p-2 rounded bg-sky-500/10 text-sky-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-200">Energy Saver</span>
                    <span className="text-[8px] bg-sky-950 text-sky-400 px-1 py-0.2 rounded uppercase font-bold">Rare</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Maintained a 20% reduction in power consumption. Unlocked on February 10, 2026.</p>
                </div>
              </div>

              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-start gap-3">
                <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-200">Water Guardian</span>
                    <span className="text-[8px] bg-indigo-950 text-indigo-400 px-1 py-0.2 rounded uppercase font-bold">Epic</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Reduced operational water footprint by 30%. Unlocked on March 20, 2026.</p>
                </div>
              </div>

              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-start gap-3">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-200">Carbon Neutral</span>
                    <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 py-0.2 rounded uppercase font-bold">Legendary</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Fully offset operations carbon for 1 month. Unlocked on May 05, 2026.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Challenges */}
          <div className="bg-zinc-900/20 p-5 rounded-2xl border border-zinc-900 space-y-4">
            <h3 className="text-sm font-bold text-white">Active Challenges & Team Goals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-semibold">Zero Waste Week</span>
                  <span className="text-emerald-400 font-bold">75%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-[10px] text-zinc-500">Eliminate plastic packaging. 3 days remaining.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-semibold">Commute Green Challenge</span>
                  <span className="text-emerald-400 font-bold">60%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "60%" }}></div>
                </div>
                <p className="text-[10px] text-zinc-500">Use public transit or e-bikes. 4 days remaining.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span>Achievements Journey & Gamification Metrics</span>
          <span>Page 5 of 7</span>
        </div>
      </div>
  )
}
