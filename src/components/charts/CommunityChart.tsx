"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function CommunityChart({ chartData, isAnimationActive }: { 
  chartData: { month: string; reduction: number }[];
  isAnimationActive: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart role="img" aria-label="Community Engagement Chart" data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorReduction" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.15)" />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}t`} />
        <Tooltip 
          contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          formatter={(value: number) => [`${value.toFixed(1)} tCO₂e`, "Emissions Logged"]}
          labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
        />
        <Area 
          type="monotone" 
          dataKey="reduction" 
          stroke="#10b981" 
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorReduction)"
          isAnimationActive={isAnimationActive}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
