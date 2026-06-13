"use client"

import { 
  ResponsiveContainer, 
  XAxis, YAxis, Tooltip, CartesianGrid, Cell, 
  BarChart, Bar
} from "recharts"
import React from "react"

export function CarbonSourcesChart({ data, selectedCategory, onSelect, isAnimationActive }: { 
  data: { name: string, value: number, color: string }[], 
  selectedCategory: string,
  onSelect: (category: string) => void,
  isAnimationActive: boolean
}) {
  return (
    <div 
      style={{ width: '100%', height: '100%' }}
      className="focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl"
      role="figure"
      aria-label="Emissions Category Chart"
      aria-describedby="analytics-sources-desc"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          const currentIndex = data.findIndex(d => d.name === selectedCategory)
          const nextIndex = (currentIndex + 1) % data.length
          onSelect(data[nextIndex].name)
        }
      }}
    >
      <span id="analytics-sources-desc" className="sr-only">
        Emissions Category Chart showing percentage distribution of emissions by source. Press Enter or Space to cycle through categories.
      </span>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          onClick={(state) => {
            if (state && state.activeLabel) {
              onSelect(state.activeLabel as string)
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50} isAnimationActive={isAnimationActive}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                className="cursor-pointer transition-opacity duration-300 hover:opacity-80"
                stroke={selectedCategory === entry.name ? "#ffffff" : "none"}
                strokeWidth={selectedCategory === entry.name ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
