"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, ArrowRight, Zap, Droplet, Car, ShieldCheck } from "lucide-react"
import Link from "next/link"

interface Action {
  id: string
  title: string
  reduction: number
}

interface ActiveActionsWidgetProps {
  actions: Action[]
}

export function ActiveActionsWidget({ actions }: ActiveActionsWidgetProps) {
  // Map actions to appropriate icons
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("ev") || t.includes("car") || t.includes("transport") || t.includes("flight")) return <Car className="h-4 w-4 text-blue-500" />;
    if (t.includes("energy") || t.includes("solar") || t.includes("electricity")) return <Zap className="h-4 w-4 text-amber-500" />;
    if (t.includes("water") || t.includes("wash")) return <Droplet className="h-4 w-4 text-sky-500" />;
    return <Leaf className="h-4 w-4 text-emerald-500" />;
  };

  return (
    <Card className="col-span-full md:col-span-1 lg:col-span-1 border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <CardTitle className="text-sm font-semibold">Active Action Plan</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-3 flex-1 pb-4">
        {actions && actions.length > 0 ? (
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
            {actions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="shrink-0 p-1.5 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                    {getIcon(action.title)}
                  </div>
                  <span className="text-xs font-medium truncate">{action.title}</span>
                </div>
                <div className="shrink-0 ml-3 text-right">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">-{action.reduction}</span>
                  <span className="text-[10px] text-muted-foreground ml-1 block mt-[-2px]">tCO₂e</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-6 px-4 text-center border border-dashed rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
            <Leaf className="h-6 w-6 text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground font-medium">No active actions.</p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">Visit Forecasting to build your plan.</p>
          </div>
        )}

        <Link 
          href="/forecasting#recommended-actions"
          className="mt-auto group flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 py-2 text-xs font-semibold text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          {actions && actions.length > 0 ? "Manage Plan" : "Create Plan"}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
