"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, Globe, Target, Trophy, Flame, TrendingUp, Sparkles, AlertTriangle, UserCircle2, CheckCircle2, History, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchCommunityStats, fetchLeaderboard, fetchCommunityFeed, fetchCommunityChallenges, joinChallenge } from "@/services/communityService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { toast } from "sonner"

export default function CommunityPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joiningId, setJoiningId] = useState<string | null>(null)
  
  const [stats, setStats] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [feed, setFeed] = useState<any[]>([])
  const [challenges, setChallenges] = useState<any[]>([])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, leaderboardRes, feedRes, challengesRes] = await Promise.all([
        fetchCommunityStats(),
        fetchLeaderboard(),
        fetchCommunityFeed(),
        fetchCommunityChallenges()
      ])
      setStats(statsRes.data.stats)
      setFeed(feedRes.data)
      setChallenges(challengesRes.data)
      
      let cData = statsRes.data.chartData;
      if (cData && cData.length === 1) {
        cData.unshift({
          month: "Prev",
          reduction: 0
        });
      }
      setLeaderboard(leaderboardRes.data)
      setChartData(cData || [])
    } catch (err: any) {
      setError(err.message || "Failed to load community data.")
      toast.error("Unable to load community data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => loadData())
  }, [])

  const handleJoinChallenge = async (id: string) => {
    setJoiningId(id)
    const joinPromise = joinChallenge(id)
    
    toast.promise(joinPromise, {
      loading: "Joining challenge...",
      success: () => {
        setChallenges(prev => prev.map(c => 
          c.id === id ? { ...c, hasJoined: true, participants: c.participants + 1 } : c
        ))
        return "Challenge joined successfully"
      },
      error: (err: any) => {
        return err.message || "Failed to join challenge"
      }
    })

    try {
      await joinPromise
    } catch (err) {
      // Handled in toast error
    } finally {
      setJoiningId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-8">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md mt-1" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-10">
        <ErrorState 
          title="Error Loading Community"
          message={error}
          onRetry={loadData}
        />
      </div>
    )
  }

  const currentUserRank = leaderboard.find(u => u.isCurrentUser)

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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Community Members</p>
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-2xl font-bold mt-1">{stats?.totalUsers?.toLocaleString() || 0}</h4>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total CO₂ Saved</p>
              <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
              {stats?.totalCarbonSaved?.toFixed(1) || "0.0"} <span className="text-sm font-normal opacity-70">tCO₂e</span>
            </h4>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Active Challenges</p>
              <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-2xl font-bold mt-1">{stats?.activeChallengesCount?.toLocaleString() || 0}</h4>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Badges Earned</p>
              <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-2xl font-bold mt-1">{stats?.totalBadges?.toLocaleString() || 0}</h4>
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
              <CardDescription>Collective monthly CO₂ logged/reduced (tCO₂e)</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-6 min-h-[300px]">
              {chartData.length > 0 ? (
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
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No trend data available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 4: Community Challenges */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold">Community Challenges</h2>
            {challenges.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {challenges.map((challenge) => (
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
                      {challenge.hasJoined ? (
                        <Button disabled variant="outline" className="w-full text-xs h-8 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Joined
                        </Button>
                      ) : (
                        <Button onClick={() => handleJoinChallenge(challenge.id)} disabled={joiningId === challenge.id} variant="secondary" className="w-full text-xs h-8 bg-muted/50 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 transition-colors">
                          {joiningId === challenge.id && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                          {joiningId === challenge.id ? "Joining..." : "Join Movement"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Target}
                title="No Challenges Joined"
                description="Join community challenges and compete with others."
                actionLabel="Browse Challenges"
                actionHref="/challenges"
                className="mt-2 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm"
              />
            )}
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
              {currentUserRank ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-background/60 border border-border/40 backdrop-blur-sm">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Your Rank</span>
                    <span className="text-lg font-bold text-foreground">#{currentUserRank.rank}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-background/60 border border-border/40 backdrop-blur-sm">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Sustain Score</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{currentUserRank.score}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No contribution data found.</p>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Leaderboard */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">Top Sustainability Leaders</h2>
            {leaderboard.length > 0 ? (
              <div className="flex flex-col gap-2">
                {leaderboard.slice(0, 5).map((user) => (
                  <div 
                    key={user.id} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all",
                      user.rank <= 3 
                        ? "bg-white dark:bg-zinc-900 border-border/60 shadow-sm" 
                        : "bg-muted/10 border-transparent hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0",
                        user.rank === 1 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" :
                        user.rank === 2 ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" :
                        user.rank === 3 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" :
                        "bg-muted text-muted-foreground"
                      )}>
                        #{user.rank}
                      </div>
                      <div className="flex items-center gap-2 overflow-hidden">
                        <UserCircle2 className="h-5 w-5 shrink-0 text-muted-foreground/50" />
                        <span className="text-sm font-medium truncate max-w-[100px]" title={user.name}>{user.name}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">
                      {user.score}
                    </Badge>
                  </div>
                ))}
                
                {currentUserRank && currentUserRank.rank > 5 && (
                  <>
                    <div className="flex items-center gap-4 py-1">
                      <div className="h-px bg-border/40 flex-1" />
                      <span className="text-xs text-muted-foreground font-medium">You</span>
                      <div className="h-px bg-border/40 flex-1" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 text-xs font-bold shrink-0">
                          #{currentUserRank.rank}
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCircle2 className="h-5 w-5 text-emerald-600/70 dark:text-emerald-400/70" />
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[100px]">{currentUserRank.name}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-bold bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                        {currentUserRank.score}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 text-center border border-dashed rounded-lg border-border/50">
                <p className="text-sm text-muted-foreground">No leaderboard data yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 6: Real-Time Activity Feed */}
      <div>
        <h2 className="text-base font-semibold mb-4">Recent Community Activity</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {feed.length > 0 ? feed.map((item) => (
            <Card key={item.id} className="bg-muted/15 border-border/40 shadow-none">
              <CardContent className="p-4 flex items-start gap-4">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  item.type === 'BADGE' ? "bg-amber-100 dark:bg-amber-900/40" : "bg-sky-100 dark:bg-sky-900/40"
                )}>
                  {item.type === 'BADGE' ? (
                     <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  ) : (
                     <History className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-semibold">{item.user}</span>
                  </div>
                  <h4 className="text-sm font-medium text-foreground leading-snug">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full p-8 text-center border border-dashed rounded-lg border-border/50 bg-muted/20">
              <Globe className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-3" />
              <p className="text-sm text-muted-foreground">No recent community activity found.</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  )
}
