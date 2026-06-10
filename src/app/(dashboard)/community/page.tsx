"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, Globe, Target, Trophy, Flame, TrendingUp, Sparkles, ChevronRight, CheckCircle2, UserCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const CHART_DATA = [
  { month: "Jan", reduction: 45 },
  { month: "Feb", reduction: 58 },
  { month: "Mar", reduction: 72 },
  { month: "Apr", reduction: 89 },
  { month: "May", reduction: 104 },
  { month: "Jun", reduction: 120 },
  { month: "Jul", reduction: 145 },
]

const LEADERBOARD = [
  { rank: 1, name: "GreenWarrior", score: 985, isCurrentUser: false },
  { rank: 2, name: "EcoChampion", score: 972, isCurrentUser: false },
  { rank: 3, name: "CarbonCrusher", score: 956, isCurrentUser: false },
  { rank: 4, name: "EarthGuardian", score: 941, isCurrentUser: false },
  { rank: 5, name: "SustainableSoul", score: 928, isCurrentUser: false },
  { rank: 42, name: "You", score: 812, isCurrentUser: true },
]

const COMMUNITY_CHALLENGES = [
  {
    id: "c1",
    title: "Plant 10,000 Trees",
    progress: 74,
    participants: "8,452"
  },
  {
    id: "c2",
    title: "Reduce 100 tCO₂e",
    progress: 82,
    participants: "5,120"
  },
  {
    id: "c3",
    title: "Zero Waste Month",
    progress: 61,
    participants: "3,894"
  }
]

export default function CommunityPage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Community Impact</h1>
        <p className="text-sm text-muted-foreground">
          See how your actions contribute to a global sustainability movement.
        </p>
      </div>

      {/* Section 1: Community Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Community Members</p>
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-2xl font-bold mt-1">12,458</h4>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total CO₂ Saved</p>
              <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">145 <span className="text-sm font-normal opacity-70">tCO₂e</span></h4>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Active Challenges</p>
              <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-2xl font-bold mt-1">2,184</h4>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Avg Sustainability Score</p>
              <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-2xl font-bold mt-1">812</h4>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Section 2: Community Impact Trend */}
          <Card className="flex flex-col relative overflow-hidden border-border/40 bg-white/50 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.02)] dark:bg-zinc-950/50">
            <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-emerald-500/5 blur-[80px] dark:bg-emerald-500/3" />
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Community Impact Trend</CardTitle>
              <CardDescription>Collective monthly CO₂ reduction (tCO₂e)</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-6 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    formatter={(value: number) => [`${value} tCO₂e`, "Reduction"]}
                    labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="reduction" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorReduction)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Section 4: Community Challenges */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold">Community Challenges</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {COMMUNITY_CHALLENGES.map((challenge) => (
                <Card key={challenge.id} className="flex flex-col border-border/40 hover:border-emerald-500/30 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold leading-snug">{challenge.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 space-y-3 flex-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {challenge.participants} participants
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4">
                    <Button variant="secondary" className="w-full text-xs h-8 bg-muted/50 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 transition-colors">
                      Join Movement
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Section 5: Your Community Contribution */}
          <Card className="border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/5 overflow-hidden relative">
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-emerald-500/10 blur-[40px]" />
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Your Contribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-background/60 border border-border/40 backdrop-blur-sm">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Your Rank</span>
                  <span className="text-lg font-bold text-foreground">#42</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-background/60 border border-border/40 backdrop-blur-sm">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Carbon Saved</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">1.2 <span className="text-xs font-normal opacity-70">tCO₂e</span></span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-background/60 border border-border/40 backdrop-blur-sm">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Percentile</span>
                  <span className="text-lg font-bold text-foreground">Top 8%</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-background/60 border border-border/40 backdrop-blur-sm">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Current Streak</span>
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-lg font-bold text-foreground">14</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Leaderboard */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">Top Sustainability Leaders</h2>
            <div className="flex flex-col gap-2">
              {LEADERBOARD.slice(0, 5).map((user) => (
                <div 
                  key={user.rank} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all",
                    user.rank <= 3 
                      ? "bg-white dark:bg-zinc-900 border-border/60 shadow-sm" 
                      : "bg-muted/10 border-transparent hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                      user.rank === 1 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" :
                      user.rank === 2 ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" :
                      user.rank === 3 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" :
                      "bg-muted text-muted-foreground"
                    )}>
                      #{user.rank}
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-5 w-5 text-muted-foreground/50" />
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">
                    {user.score}
                  </Badge>
                </div>
              ))}
              {/* Current User Divider */}
              <div className="flex items-center gap-4 py-1">
                <div className="h-px bg-border/40 flex-1" />
                <span className="text-xs text-muted-foreground font-medium">You</span>
                <div className="h-px bg-border/40 flex-1" />
              </div>
              {LEADERBOARD.filter(u => u.isCurrentUser).map((user) => (
                <div 
                  key={user.rank} 
                  className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 text-xs font-bold">
                      #{user.rank}
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-5 w-5 text-emerald-600/70 dark:text-emerald-400/70" />
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{user.name}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-bold bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                    {user.score}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Community Insights */}
      <div>
        <h2 className="text-base font-semibold mb-4">Community Insights</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-muted/15 border-border/40 shadow-none">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-foreground leading-snug">Transportation emissions reduced 18% this month.</h4>
                <p className="text-xs text-muted-foreground mt-1">Based on global active community data.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/15 border-border/40 shadow-none">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/40">
                <Users className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-foreground leading-snug">Community participation increased 22%.</h4>
                <p className="text-xs text-muted-foreground mt-1">Welcome to all the new eco-champions!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/15 border-border/40 shadow-none">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-foreground leading-snug">Water conservation challenge trending upward.</h4>
                <p className="text-xs text-muted-foreground mt-1">Join the movement to save 1M liters.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
    </div>
  )
}
