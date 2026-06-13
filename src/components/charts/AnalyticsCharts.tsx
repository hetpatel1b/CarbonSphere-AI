"use client"

import { 
  ResponsiveContainer, 
  XAxis, YAxis, Tooltip, CartesianGrid, Cell, 
  AreaChart, Area, BarChart, Bar, Line
} from "recharts"
import { Award } from "lucide-react"

type ChartDataItem = {
  name: string;
  emissions: number;
  target: number;
  score: number;
  forecast: number | null;
  milestone: string | null;
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: unknown[]; label?: string }) => {
  if (active && payload && payload.length) {
    const data = (payload[0] as { payload: ChartDataItem }).payload
    return (
      <div className="bg-zinc-950/95 backdrop-blur-md border border-zinc-800 p-4 rounded-xl shadow-xl space-y-2 text-xs">
        <p className="font-extrabold text-white text-sm">{label} 2026</p>
        <div className="space-y-1">
          {payload.map((p: { value: number | null; color?: string; stroke?: string; name: string } | unknown, idx: number) => {
            const typedP = p as { value: number | null; color?: string; stroke?: string; name: string };
            const displayVal = typedP.value !== null ? typedP.value : "N/A"
            return (
              <p key={idx} className="font-semibold flex items-center gap-1.5" style={{ color: typedP.color || typedP.stroke }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: typedP.color || typedP.stroke }} />
                {typedP.name}: {displayVal} {typedP.name.includes("Score") ? "pts" : "kg"}
              </p>
            )
          })}
        </div>
        {data.milestone && (
          <div className="mt-2.5 pt-2 border-t border-zinc-900 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            <span>Milestone: {data.milestone}</span>
          </div>
        )}
      </div>
    )
  }
  return null
}

export function EmissionsAreaChart({ data, isAnimationActive }: { data: ChartDataItem[], isAnimationActive: boolean }) {
  return (
    <>
      <span id="analytics-emissions-desc" className="sr-only">
        Emissions History Chart showing chronological tracking of actual emissions against target emissions.
      </span>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          tabIndex={0}
          className="focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl"
          aria-describedby="analytics-emissions-desc"
          role="img" aria-label="Emissions History Chart" data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="emissionsGlowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kg`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" name="emissions" dataKey="emissions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#emissionsGlowGrad)" activeDot={{ r: 6 }} isAnimationActive={isAnimationActive} />
          <Line type="monotone" name="target" dataKey="target" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={isAnimationActive} />
        </AreaChart>
      </ResponsiveContainer>
    </>
  )
}

export function SourcesBarChart({ data, selectedCategory, onSelect, isAnimationActive }: { 
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

export function ScoreAreaChart({ data, isAnimationActive }: { data: ChartDataItem[], isAnimationActive: boolean }) {
  return (
    <>
      <span id="analytics-score-desc" className="sr-only">
        Score History Chart illustrating progression of sustainability scores over time.
      </span>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          tabIndex={0}
          className="focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl"
          aria-describedby="analytics-score-desc"
          role="img" aria-label="Score History Chart" data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="scoreGlowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} domain={[550, 900]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" name="score" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#scoreGlowGrad)" activeDot={{ r: 6 }} isAnimationActive={isAnimationActive} />
        </AreaChart>
      </ResponsiveContainer>
    </>
  )
}
