"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart } from "recharts"
import { ArrowDownRight, ArrowUpRight, Cloud, Droplet, Zap } from "lucide-react"

const monthlyData = [
  { name: "Jan", emissions: 2.1, target: 2.5 },
  { name: "Feb", emissions: 1.9, target: 2.4 },
  { name: "Mar", emissions: 2.2, target: 2.3 },
  { name: "Apr", emissions: 1.8, target: 2.2 },
  { name: "May", emissions: 1.5, target: 2.0 },
  { name: "Jun", emissions: 1.6, target: 1.9 },
  { name: "Jul", emissions: 1.2, target: 1.8 },
]

const sourceData = [
  { name: "Transport", value: 45 },
  { name: "Energy", value: 35 },
  { name: "Diet", value: 15 },
  { name: "Waste", value: 5 },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Detailed breakdown of your carbon footprint and trends.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-emerald-500/60" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Emissions</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100/80 dark:bg-emerald-900/30">
              <Cloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">12.3 tCO2e</div>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <ArrowDownRight className="h-3 w-3" />
                12%
              </span>
              <span className="text-muted-foreground font-normal">from last year</span>
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-amber-500/60" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Energy Usage</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100/80 dark:bg-amber-900/30">
              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">840 kWh</div>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-1.5 py-0.5 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <ArrowUpRight className="h-3 w-3" />
                4%
              </span>
              <span className="text-muted-foreground font-normal">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-sky-500/60" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Water Saved</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100/80 dark:bg-sky-900/30">
              <Droplet className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">1,250 L</div>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <ArrowUpRight className="h-3 w-3" />
                18%
              </span>
              <span className="text-muted-foreground font-normal">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insight Summary */}
      <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 px-4 py-3 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
        <p className="text-sm text-muted-foreground">
          Your emissions are <span className="font-medium text-foreground">trending 12% below</span> last year&apos;s average, with the biggest improvements in transport.
        </p>
      </div>

      {/* Chart Section */}
      <Tabs defaultValue="emissions" className="space-y-5">
        <TabsList className="bg-muted/50 border border-border/30">
          <TabsTrigger value="emissions" className="data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">Emissions Trend</TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">Sources</TabsTrigger>
        </TabsList>
        <TabsContent value="emissions" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Monthly Emissions vs Target</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Your carbon emissions measured in tonnes of CO2 equivalent.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}t`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Line type="monotone" dataKey="emissions" stroke="hsl(var(--primary))" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Emissions by Source</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Breakdown of your carbon footprint by category.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                      cursor={{ fill: "hsl(var(--muted)/0.5)" }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
