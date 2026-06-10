"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Leaf, Shield, Globe, CheckCircle, TreeDeciduous, Wind } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image";

// Mock Data ----------------------------------------------------
const STATS = [
  { label: "Total Offset Purchased", value: "12.5 tCO₂e" },
  { label: "Projects Supported", value: "8" },
  { label: "Trees Equivalent", value: "625" },
  { label: "Impact Score", value: "+145" },
]

const PROJECTS = [
  {
    id: "p1",
    title: "Rainforest Protection",
    location: "Brazil",
    price: "$12 / tCO₂e",
    impact: "Protect endangered rainforest",
    verified: "Gold Standard",
    progress: 74,
    img: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "p2",
    title: "Wind Energy Expansion",
    location: "India",
    price: "$9 / tCO₂e",
    impact: "Renewable energy generation",
    verified: "VCS",
    progress: 82,
    img: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "p3",
    title: "Mangrove Restoration",
    location: "Indonesia",
    price: "$15 / tCO₂e",
    impact: "Coastal ecosystem restoration",
    verified: "Gold Standard",
    progress: 68,
    img: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "p4",
    title: "Direct Air Capture",
    location: "United States",
    price: "$28 / tCO₂e",
    impact: "Carbon removal technology",
    verified: "CarbonFuture",
    progress: 54,
    img: "/placeholder.svg?height=200&width=300",
  },
]

const HISTORY = [
  { date: "2024-03-12", project: "Rainforest Protection", amount: "2.3 tCO₂e", cost: "$27.60", status: "Completed" },
  { date: "2024-04-05", project: "Wind Energy Expansion", amount: "1.5 tCO₂e", cost: "$13.50", status: "Pending" },
  { date: "2024-04-22", project: "Mangrove Restoration", amount: "0.8 tCO₂e", cost: "$12.00", status: "Completed" },
]

const data = [
  { month: "Jan", offset: 1.2 },
  { month: "Feb", offset: 1.8 },
  { month: "Mar", offset: 2.1 },
  { month: "Apr", offset: 2.8 },
  { month: "May", offset: 3.2 },
  { month: "Jun", offset: 3.9 },
];

const CERTIFICATES = [
  { title: "Verified Impact", description: "Gold Standard Certified", icon: CheckCircle },
  { title: "Transparency", description: "Blockchain Verified", icon: Shield },
  { title: "Global Reach", description: "20+ Countries", icon: Globe },
]

export default function OffsetMarketplacePage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Carbon Offset Marketplace</h1>
        <p className="text-sm text-muted-foreground">
          Offset your carbon footprint by supporting verified sustainability projects.
        </p>
      </div>

      {/* Section 1: Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label} className="bg-muted/10 border-border/40">
            <CardContent className="p-5 flex flex-col gap-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <h4 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{s.value}</h4>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section 2: Featured Projects */}
      <div>
        <h2 className="text-base font-semibold mb-4">Featured Offset Projects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((p) => (
            <Card key={p.id} className="flex flex-col transition-shadow hover:shadow-xl border-border/40 bg-white/50 dark:bg-zinc-950/30 backdrop-blur-xl">
                <div className="flex items-center justify-center h-48 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 rounded-t-md">
                {p.id === "p1" && <Leaf className="w-12 h-12 text-white" />}
                {p.id === "p2" && <Wind className="w-12 h-12 text-white" />}
                {p.id === "p3" && <TreeDeciduous className="w-12 h-12 text-white" />}
                {p.id === "p4" && <Globe className="w-12 h-12 text-white" />}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{p.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">{p.location}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">Price</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{p.price}</span>
                </div>
                <p className="text-xs text-muted-foreground">{p.impact}</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {p.verified}
                </Badge>
                <div className="flex items-center gap-2">
                  <Progress value={p.progress} className="h-2 flex-1 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400" />
                  <span className="text-xs font-medium text-muted-foreground">{p.progress}%</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default">
                  Offset Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 3: Your Offset History */}
      <div>
        <h2 className="text-base font-semibold mb-4">Your Offset History</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Amount Offset</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {HISTORY.map((h, i) => (
              <TableRow key={i}>
                <TableCell>{h.date}</TableCell>
                <TableCell>{h.project}</TableCell>
                <TableCell>{h.amount}</TableCell>
                <TableCell>{h.cost}</TableCell>
                <TableCell>
                  <Badge variant={h.status === "Completed" ? "default" : "secondary"} className={cn(h.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800")}> 
                    {h.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Section 4: Impact Visualization */}
      <div>
        <h2 className="text-base font-semibold mb-4">Impact Visualization</h2>
        <Card className="border-border/40 bg-white/50 dark:bg-zinc-950/30">
          <CardHeader>
            <CardTitle className="text-sm">Monthly Carbon Offsets</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-6 min-h-[300px]">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.15)" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}t`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
                <Area
                  type="monotone"
                  dataKey="offset"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Section 5: Certificates */}
      <div>
        <h2 className="text-base font-semibold mb-4">Certificates</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {CERTIFICATES.map((c, i) => (
            <Card key={i} className="flex items-start gap-4 p-4 border-border/40 bg-muted/10">
              <c.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <div className="flex flex-col">
                <h4 className="font-semibold text-sm">{c.title}</h4>
                <p className="text-xs text-muted-foreground">{c.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
