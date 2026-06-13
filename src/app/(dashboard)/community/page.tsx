"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import { Users, Globe, Target, Trophy, Flame, TrendingUp, Sparkles, AlertTriangle, UserCircle2, CheckCircle2, History, Loader2, ArrowRight, Zap, Star, Shield, Medal, MapPin, Activity, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchCommunityStats, fetchLeaderboard, fetchCommunityFeed, fetchCommunityChallenges, joinChallenge, CommunityStats, LeaderboardEntry, FeedItem, CommunityChallenge } from "@/services/communityService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { toast } from "sonner"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const CommunityChart = dynamic(() => import('@/components/charts/CommunityChart'), { ssr: false, loading: () => <Skeleton className="w-full h-full rounded-xl" /> })

export default function CommunityPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joiningId, setJoiningId] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [chartData, setChartData] = useState<{ month: string; reduction: number }[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([])

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
      setChartData((cData || []) as { month: string; reduction: number }[])
    } catch (err: unknown) {
      setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || "Failed to load community data.")
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
      error: (err: Error | unknown) => {
        return (err as Error).message || "Failed to join challenge"
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
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
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

  // Derived metrics for impact
  const treesEquivalent = Math.max(0, Math.floor((stats?.totalCarbonSaved || 0) * 1.5))

  return (
    <div className="flex flex-col gap-8 pb-8">

      {/* Global Community Impact Hero + Map */}
      <div className="relative w-full h-[450px] rounded-3xl overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl flex items-center">
        {/* Abstract Dot Map Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_#10b981_1px,_transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] animate-[pulse_8s_ease-in-out_infinite]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />
        
        <div className="relative z-10 p-10 md:p-16 flex flex-col gap-6 max-w-3xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Globe className="w-4 h-4" /> Global Network Online
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Together, we&apos;re <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">healing</span> the planet.
            </h1>
            <p className="text-zinc-400 mt-4 text-lg md:text-xl font-medium max-w-xl">
              Join thousands of individuals turning small habits into massive global impact.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 mt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Collective Reduction</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{stats?.totalCarbonSaved?.toFixed(1) || "0.0"}</span>
                <span className="text-sm font-bold text-emerald-500">tCO₂e</span>
              </div>
            </div>
            <div className="w-px h-12 bg-zinc-800 hidden md:block" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Trees Equivalent</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{treesEquivalent.toLocaleString()}</span>
                <span className="text-sm font-bold text-sky-500">trees</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract floating nodes representing users */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 opacity-50 hidden lg:block pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399] animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-3/4 left-1/2 w-4 h-4 bg-sky-400 rounded-full shadow-[0_0_15px_#38bdf8] animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_15px_#fbbf24] animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Section 1: Community Statistics Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex items-center gap-6 group hover:-translate-y-1 hover:border-emerald-500/30 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Active Pioneers</p>
            <p className="text-2xl font-black text-white">{stats?.totalUsers?.toLocaleString() || 0}</p>
          </div>
        </div>
        
        <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex items-center gap-6 group hover:-translate-y-1 hover:border-sky-500/30 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Target className="w-7 h-7 text-sky-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Live Challenges</p>
            <p className="text-2xl font-black text-white">{stats?.activeChallengesCount?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex items-center gap-6 group hover:-translate-y-1 hover:border-amber-500/30 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Trophy className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Badges Earned</p>
            <p className="text-2xl font-black text-white">{stats?.totalBadges?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex items-center gap-6 group hover:-translate-y-1 hover:border-indigo-500/30 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Flame className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Global Streak</p>
            <p className="text-2xl font-black text-white">{Math.floor((stats?.totalCarbonSaved || 0) / 2)} <span className="text-xs font-bold text-zinc-500">Days</span></p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Weekly Community Challenge Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-900 border border-emerald-500/30 shadow-[0_10px_40px_rgba(16,185,129,0.2)]">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-emerald-200 text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
                  <Activity className="w-4 h-4" /> Weekly Sprint
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Zero-Waste Weekend</h3>
                <p className="text-emerald-100/80 text-sm font-medium mb-6">Join the community in producing exactly 0kg of landfill waste for 48 hours.</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-emerald-200 uppercase tracking-wider">
                    <span>Progress to Global Goal</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-3 bg-black/20 [&>div]:bg-white" />
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-4">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-600 bg-zinc-800 flex items-center justify-center overflow-hidden">
                      <UserCircle2 className="w-6 h-6 text-zinc-500" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-600 bg-black/40 flex items-center justify-center text-[10px] font-bold text-white backdrop-blur-md">
                    +2k
                  </div>
                </div>
                <Button className="w-full bg-white text-emerald-900 hover:bg-emerald-50 font-black shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Join Sprint <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Activity Feed (Discord Style) */}
          <div className="p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><History className="w-5 h-5" /></div>
              <div>
                <h3 className="text-xl font-bold text-white">Live Activity Feed</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Real-time updates from your sustainability network.</p>
              </div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {feed.length > 0 ? feed.map((item, i) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl hover:bg-zinc-800/50 transition-colors group cursor-default">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 border",
                    item.type === 'BADGE' ? "bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]" : "bg-sky-500/10 border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]"
                  )}>
                    {item.type === 'BADGE' ? <Star className="w-6 h-6 text-amber-400" /> : <Shield className="w-6 h-6 text-sky-400" />}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">{item.user}</span>
                      <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{i === 0 ? "Just now" : `${i * 12} mins ago`}</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-300">
                      {item.type === 'BADGE' ? "Unlocked a new achievement:" : "Completed a milestone:"} <span className="font-bold text-white">{item.title}</span>
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">{item.description}</p>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center border border-dashed rounded-2xl border-zinc-800 bg-zinc-950/30">
                  <Globe className="h-8 w-8 mx-auto text-zinc-600 mb-3" />
                  <p className="text-sm font-bold text-zinc-400">Quiet in the network</p>
                </div>
              )}
            </div>
          </div>

          {/* Chart Section */}
          <div className="p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex flex-col h-[400px]">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><TrendingUp className="w-5 h-5" /></div>
              <div>
                <h3 className="text-xl font-bold text-white">Global Trend</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Collective monthly CO₂ reductions.</p>
              </div>
            </div>
            <div className="flex-1 w-full">
               {chartData.length > 0 ? (
                 <CommunityChart chartData={chartData} isAnimationActive={!reducedMotion} />
               ) : (
                 <div className="flex items-center justify-center h-full">
                   <p className="text-zinc-500">No trend data available yet.</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Duolingo-style Leaderboard */}
          <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><Medal className="w-5 h-5" /></div>
              <div>
                <h3 className="text-xl font-bold text-white">Hall of Fame</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Top contributors this week.</p>
              </div>
            </div>

            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((user) => (
                  <div 
                    key={user.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-2xl transition-all relative overflow-hidden group cursor-default",
                      user.rank === 1 ? "bg-amber-500/10 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]" :
                      user.rank === 2 ? "bg-zinc-300/10 border border-zinc-400/30" :
                      user.rank === 3 ? "bg-orange-500/10 border border-orange-500/30" :
                      "bg-zinc-950/50 border border-zinc-800 hover:bg-zinc-800"
                    )}
                  >
                    {/* Rank Number */}
                    <div className={cn(
                      "w-8 text-center text-lg font-black",
                      user.rank === 1 ? "text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" :
                      user.rank === 2 ? "text-zinc-300" :
                      user.rank === 3 ? "text-orange-400" :
                      "text-zinc-600"
                    )}>
                      {user.rank}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                       {user.rank === 1 && <div className="absolute inset-0 bg-amber-500/20 animate-pulse" />}
                       <UserCircle2 className={cn("w-6 h-6", user.rank === 1 ? "text-amber-400" : "text-zinc-400")} />
                    </div>

                    {/* Name & Score */}
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-bold truncate", user.isCurrentUser ? "text-emerald-400" : "text-white")}>{user.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{user.score} XP</p>
                    </div>

                    {/* Crown Icon for Rank 1 */}
                    {user.rank === 1 && <Trophy className="w-5 h-5 text-amber-400 opacity-50 absolute right-4" />}
                  </div>
                ))}

                {currentUserRank && currentUserRank.rank > 5 && (
                  <>
                    <div className="flex items-center gap-4 py-2">
                      <div className="h-px bg-zinc-800 flex-1" />
                      <span className="text-[10px] uppercase font-bold text-zinc-600">You</span>
                      <div className="h-px bg-zinc-800 flex-1" />
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <div className="w-8 text-center text-lg font-black text-emerald-400">{currentUserRank.rank}</div>
                      <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center shrink-0">
                         <UserCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-emerald-400 truncate">{currentUserRank.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{currentUserRank.score} XP</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed rounded-2xl border-zinc-800 bg-zinc-950/30">
                <Medal className="h-8 w-8 mx-auto text-zinc-600 mb-3" />
                <p className="text-sm font-bold text-zinc-400">Leaderboard resetting</p>
              </div>
            )}
          </div>

          {/* Achievement Showcase */}
          <div className="p-6 bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20"><Sparkles className="w-5 h-5" /></div>
              <div>
                <h3 className="text-xl font-bold text-white">Global Unlocks</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Rarest badges earned today.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: "Zero Hero", color: "from-emerald-400 to-teal-600", icon: <Leaf className="w-6 h-6 text-white" /> },
                { title: "Century", color: "from-amber-400 to-orange-600", icon: <Flame className="w-6 h-6 text-white" /> },
                { title: "Pioneer", color: "from-indigo-400 to-purple-600", icon: <Globe className="w-6 h-6 text-white" /> },
              ].map((badge, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-zinc-950/50 border border-zinc-800 flex flex-col items-center justify-center p-2 group hover:border-zinc-600 transition-colors cursor-default relative overflow-hidden">
                   <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                     {badge.icon}
                   </div>
                   <p className="text-[10px] font-bold text-zinc-400 mt-2 text-center leading-tight">{badge.title}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
