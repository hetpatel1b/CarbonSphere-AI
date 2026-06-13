import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

export const ForecastingAnalysisPage: React.FC<{ forecastData: any[] }> = ({ forecastData }) => {
  return (
<div 
        id="pdf-page-4"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-zinc-950 relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 03</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">Forecasting Analysis</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 space-y-3">
                <h3 className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Predictive Parameters</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Predicted Next Qtr</span>
                    <span className="text-emerald-400 font-extrabold">8.5 tCO₂e</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Current Qtr Rate</span>
                    <span className="text-zinc-300 font-bold">10.4 tCO₂e</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Forecast Confidence</span>
                    <span className="text-emerald-400 font-bold">94% Stable</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 space-y-3">
                <h3 className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Reduction Opportunities</h3>
                
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-zinc-200">Transportation Optimization</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Route mapping & vehicle shifts</p>
                    </div>
                    <span className="text-emerald-400 font-bold">-0.35 t</span>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-zinc-200">Energy Optimization</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Green computing grids</p>
                    </div>
                    <span className="text-emerald-400 font-bold">-0.42 t</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-3 bg-zinc-900/30 p-5 rounded-2xl border border-zinc-900 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Predicted Quarterly Trajectory</h3>
                <p className="text-xs text-zinc-500 mb-4">Baseline vs Predicted vs Target emissions (tCO₂e)</p>
              </div>

              <div className="flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl" tabIndex={0} aria-describedby="pdf-forecast-summary">
                <span id="pdf-forecast-summary" className="sr-only">
                  Predictive emissions line chart showing Baseline vs Target vs Predicted trajectory.
                </span>
                <LineChart role="img" aria-label="Forecasting Chart" width={340} height={200} data={forecastData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} domain={[6, 12]} />
                  <Line type="monotone" dataKey="baseline" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="target" stroke="#0ea5e9" strokeWidth={1.5} strokeDasharray="3 3" dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2.5} dot={{ stroke: '#10b981', strokeWidth: 2, r: 3 }} isAnimationActive={false} />
                </LineChart>
              </div>

              <div className="flex gap-4 justify-center text-[10px] text-zinc-400 pt-2">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-3 bg-rose-500 inline-block rounded-full"></span>
                  <span>Baseline (10.4t)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-3 bg-sky-500 inline-block rounded-full"></span>
                  <span>Target (9.0t)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-3 bg-emerald-500 inline-block rounded-full"></span>
                  <span>Predicted (8.5t)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span>Predictive Emissions & Forecast Models</span>
          <span>Page 4 of 7</span>
        </div>
      </div>
  )
}
