import React from "react"

export const ActionPlanPage: React.FC = () => {
  return (
<div 
        id="pdf-page-6"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-zinc-950 relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 05</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">Recommended Action Plan</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            AI recommendations custom-generated based on current operational profile. Execute the roadmap below to maximize emission reduction and achieve carbon neutrality targets.
          </p>

          {/* Action Plan Breakdown */}
          <div className="space-y-4">
            {/* Priority 1 */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-bold">Priority 1 (High Impact)</span>
                <h4 className="text-base font-bold text-white mt-1">Shift Server Compute Load to Green Regions</h4>
                <p className="text-xs text-zinc-400">Migrate intensive cloud jobs to regions operating on 100% renewable power grids (e.g. Iceland, Sweden).</p>
              </div>
              <div className="text-right whitespace-nowrap space-y-1">
                <div className="text-xs font-semibold text-zinc-500">Expected Reduction</div>
                <div className="text-base font-bold text-emerald-400">-0.80 tCO₂e</div>
                <div className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/20 inline-block font-bold">+15 Score Pts</div>
              </div>
            </div>

            {/* Priority 2 */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold">Priority 2 (Medium Impact)</span>
                <h4 className="text-base font-bold text-white mt-1">Introduce Active Transit & E-Bike Commute Incentives</h4>
                <p className="text-xs text-zinc-400">Provide staff subsidies for e-bikes and reward non-automotive commutes through gamified logs.</p>
              </div>
              <div className="text-right whitespace-nowrap space-y-1">
                <div className="text-xs font-semibold text-zinc-500">Expected Reduction</div>
                <div className="text-base font-bold text-emerald-400">-0.50 tCO₂e</div>
                <div className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/20 inline-block font-bold">+10 Score Pts</div>
              </div>
            </div>

            {/* Priority 3 */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-bold">Priority 3 (Medium Impact)</span>
                <h4 className="text-base font-bold text-white mt-1">Install Smart Zonal HVAC Thermostats</h4>
                <p className="text-xs text-zinc-400">Implement scheduled micro-zone climate controllers to reduce off-hour heating and cooling consumption.</p>
              </div>
              <div className="text-right whitespace-nowrap space-y-1">
                <div className="text-xs font-semibold text-zinc-500">Expected Reduction</div>
                <div className="text-base font-bold text-emerald-400">-0.35 tCO₂e</div>
                <div className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/20 inline-block font-bold">+8 Score Pts</div>
              </div>
            </div>
          </div>

          {/* Action Plan Summary Card */}
          <div className="bg-gradient-to-r from-emerald-950/30 to-teal-950/30 p-5 rounded-2xl border border-emerald-900/40 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-white">Action Plan Summary</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Projected results upon full implementation of Priorities 1, 2 & 3.</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Total Reduction</span>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">-1.65 tCO₂e/Qtr</p>
              </div>
              <div className="text-center border-l border-zinc-800 pl-6">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Score Projection</span>
                <p className="text-xl font-extrabold text-sky-400 mt-0.5">875 (+33 pts)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span>AI Recommendations & Priority Roadmaps</span>
          <span>Page 6 of 7</span>
        </div>
      </div>
  )
}
