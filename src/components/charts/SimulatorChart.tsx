"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

type ChartDataItem = {
  name: string;
  emissions: number;
  color: string;
}

export default function SimulatorChart({ data, isAnimationActive }: { data: ChartDataItem[], isAnimationActive: boolean }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart role="img" aria-label="Simulation Comparison Chart" data={data} margin={{ top: 0, right: 30, left: 0, bottom: 0 }} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted-foreground)/0.2)" />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} kg`} />
        <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} fontWeight={700} />
        <Tooltip 
          cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
          contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
          formatter={(value: number) => [`${value.toFixed(0)} kg CO₂e`, "Emissions"]}
        />
        <Bar dataKey="emissions" radius={[0, 6, 6, 0]} barSize={40} isAnimationActive={isAnimationActive}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
