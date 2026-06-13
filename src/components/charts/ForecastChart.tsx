"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Area } from "recharts"

export default function ForecastChart({ chartData, isAnimationActive }: { 
  chartData: { month: string; actual?: number; predicted?: number }[];
  isAnimationActive: boolean;
}) {
  return (
    <>
      <span id="forecast-desc" className="sr-only">
        Forecasting Data Chart showing the comparison between actual tracked emissions and the predicted trajectory model over time.
      </span>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          tabIndex={0}
          className="focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl"
          aria-describedby="forecast-desc"
          role="img" aria-label="Forecasting Data Chart" data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          
          <defs>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}t`} />
          <Tooltip 
            contentStyle={{ backgroundColor: "rgba(9,9,11,0.85)", backdropFilter: "blur(12px)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
            formatter={(value: number, name: string) => [
              <span key="val" className="font-bold text-white">{value} tCO₂e</span>, 
              <span key="name" className="uppercase tracking-wider text-[10px] text-zinc-400">{name === "actual" ? "Historical Actual" : "AI Prediction"}</span>
            ]}
            labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "6px", fontSize: "12px", fontWeight: "bold" }}
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="predicted" 
            stroke="#10b981" 
            strokeWidth={3} 
            strokeDasharray="6 6"
            fillOpacity={1} 
            fill="url(#colorPredicted)" 
            isAnimationActive={isAnimationActive}
            connectNulls
            activeDot={{ r: 6, fill: "#10b981", stroke: "#000", strokeWidth: 2 }}
          />
          
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#ffffff" 
            strokeWidth={3} 
            dot={{ r: 4, fill: "#000", stroke: "#ffffff", strokeWidth: 2 }} 
            activeDot={{ r: 6, fill: "#ffffff", stroke: "#000", strokeWidth: 2 }} 
            connectNulls
            isAnimationActive={isAnimationActive}
            filter="url(#glow)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}
