"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

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
        <LineChart 
          tabIndex={0}
          className="focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl"
          aria-describedby="forecast-desc"
          role="img" aria-label="Forecasting Data Chart" data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.15)" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}t`} />
          <Tooltip 
            contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            formatter={(value: number, name: string) => [
              `${value} tCO₂e`, 
              name === "actual" ? "Actual" : "Predicted"
            ]}
            labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="hsl(var(--foreground))" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }} 
            activeDot={{ r: 6, strokeWidth: 0 }} 
            connectNulls
            isAnimationActive={isAnimationActive}
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#10b981" 
            strokeWidth={3} 
            strokeDasharray="6 6" 
            dot={{ r: 4, strokeWidth: 2 }} 
            activeDot={{ r: 6, strokeWidth: 0 }} 
            connectNulls
            isAnimationActive={isAnimationActive}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}
