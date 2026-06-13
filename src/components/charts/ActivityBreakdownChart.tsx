"use client"

import React from "react"

export type BreakdownItem = {
  label: string;
  percent: number;
  val: string;
};

export function ActivityBreakdownChart({ 
  items, 
  color 
}: { 
  items: BreakdownItem[], 
  color: string 
}) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Detailed Breakdown</span>
      <div className="space-y-2.5" role="list" aria-label="Activity breakdown details">
        {items.map((item, index) => (
          <div key={index} className="space-y-1" role="listitem">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-500">{item.label}</span>
              <span className="text-foreground">{item.val} ({item.percent}%)</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden" role="progressbar" aria-valuenow={item.percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.label} percentage`}>
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ width: `${item.percent}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
