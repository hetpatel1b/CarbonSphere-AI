"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Leaf, Target, Zap, Droplet, CheckCircle2, Clock, CalendarClock, Trophy, TrendingUp, Loader2, Flame, Star, Medal, Crown, Shield, Activity, Sparkles, ChevronRight } from "lucide-react"
import { challengeService, ChallengeStatusResponse, ChallengeDocument } from "@/services/challengeService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Leaf': return Leaf;
    case 'Zap': return Zap;
    case 'Droplet': return Droplet;
    case 'Target': return Target;
    case 'TrendingUp': return TrendingUp;
    default: return Trophy;
  }
}

const getRarityConfig = (targetValue: number) => {
  if (targetValue >= 50) return { name: "Legendary", color: "amber", glow: "shadow-[0_0_15px_rgba(251,191,36,0.3)]", icon: Crown }
  if (targetValue >= 20) return { name: "Epic", color: "purple", glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]", icon: Star }
  return { name: "Rare", color: "blue", glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]", icon: Shield }
}

const LEADERBOARD_MOCK = [
  { rank: 1, name: "EcoWarrior99", points: 15420, avatar: "🌍", trend: "up" },
  { rank: 2, name: "GreenTitan", points: 14200, avatar: "🌲", trend: "up" },
  { rank: 3, name: "CarbonHero", points: 13850, avatar: "🦸‍♂️", trend: "down" },
  { rank: 4, name: "You", points: 0, avatar: "👤", trend: "up", isCurrentUser: true },
  { rank: 5, name: "PlanetSaver", points: 8500, avatar: "🌱", trend: "down" },
]

export default function ChallengesPage() {
  const [data, setData] = useState<ChallengeStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const result = await challengeService.getChallengeStatus();
      setData(result);
    } catch (err: unknown) {
      setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || "Failed to load challenges");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => loadData());
  }, [loadData]);

  const handleJoin = async (id: string) => {
    setJoiningId(id);
    const joinPromise = challengeService.joinChallenge(id);

    toast.promise(joinPromise, {
      loading: "Committing to challenge...",
      success: () => {
        loadData();
        return "Challenge locked in! Let's go! 🚀";
      },
      error: (err: Error | unknown) => {
        return "Unable to join challenge";
      }
    });

    try {
      await joinPromise;
    } catch (err) {
      // Handled in toast error
    } finally {
      setJoiningId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-8 w-full max-w-full">
        <Skeleton className="h-48 w-full rounded-3xl bg-zinc-900/50" />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 grid gap-4 grid-cols-1 sm:grid-cols-2">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 rounded-3xl bg-zinc-900/50" />)}
          </div>
          <div className="lg:col-span-4">
             <Skeleton className="h-[500px] rounded-3xl bg-zinc-900/50" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-10">
        <ErrorState 
          title="Failed to load challenges"
          message={error || "Could not retrieve challenges data."}
          onRetry={loadData}
        />
      </div>
    );
  }

  const { active, completed, upcoming, available, stats } = data;

  // Gamification Math
  const points = stats?.pointsEarned || 0;
  const level = Math.floor(points / 500) + 1;
  const xpCurrent = points % 500;
  const xpMax = 500;
  const xpPercentage = (xpCurrent / xpMax) * 100;
  const streakCount = Math.min(14, completed.length * 2 + (active.length > 0 ? 1 : 0)); // Mocked streak based on activity

  // Sync leaderboard points to actual user points
  const leaderboard = [...LEADERBOARD_MOCK];
  const userIdx = leaderboard.findIndex(u => u.isCurrentUser);
  if (userIdx !== -1) {
    leaderboard[userIdx].points = points;
    leaderboard.sort((a, b) => b.points - a.points);
    leaderboard.forEach((u, i) => u.rank = i + 1);
  }

  const calculateDaysRemaining = (endDate: string) => {
    const diff = new Date(endDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const renderChallengeCard = (challenge: ChallengeDocument, isAvailable: boolean) => {
    const pct = Math.min(Math.round(((challenge.progress || 0) / challenge.targetValue) * 100), 100);
    const Icon = getIconComponent(challenge.icon);
    const daysRemaining = calculateDaysRemaining(challenge.endDate);
    const rarity = getRarityConfig(challenge.targetValue);
    const RarityIcon = rarity.icon;

    return (
      <Card key={challenge._id} className={cn("flex flex-col h-full relative overflow-hidden group bg-zinc-900/60 backdrop-blur-xl border-white/5 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1", rarity.glow)}>
        {/* Animated Background Gradient */}
        <div className={`absolute -top-32 -right-32 w-64 h-64 bg-${challenge.color}-500/10 blur-[80px] rounded-full group-hover:bg-${challenge.color}-500/20 transition-colors pointer-events-none`} />
        
        <CardHeader className="pb-3 flex-1 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-${challenge.color}-500/10 border border-${challenge.color}-500/20 shadow-inner`}>
              <Icon className={`h-6 w-6 text-${challenge.color}-400`} />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Badge variant="secondary" className={`bg-${rarity.color}-500/10 text-${rarity.color}-400 hover:bg-${rarity.color}-500/10 border border-${rarity.color}-500/20 font-bold uppercase tracking-widest text-[9px] px-2`}>
                <RarityIcon className="w-3 h-3 mr-1" /> {rarity.name}
              </Badge>
              <Badge variant="secondary" className={`bg-zinc-950 text-${challenge.color}-400 hover:bg-zinc-900 border border-${challenge.color}-500/20 font-black px-2`}>
                +{challenge.rewardPoints} XP
              </Badge>
            </div>
          </div>
          <CardTitle className="text-lg font-black text-white leading-tight">{challenge.title}</CardTitle>
          <CardDescription className="text-xs text-zinc-400 leading-relaxed mt-1 line-clamp-2 font-medium">
            {challenge.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-4 relative z-10">
          <div className="space-y-4">
            {!isAvailable && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Quest Progress</span>
                  <span className={`font-black text-${challenge.color}-400`}>
                    {challenge.progress} <span className="text-zinc-500 font-medium">/ {challenge.targetValue}</span>
                  </span>
                </div>
                {/* Fitbit-style Segmented Progress */}
                <div className="flex gap-1 h-2">
                   {Array.from({ length: 5 }).map((_, i) => {
                     const segmentPct = Math.max(0, Math.min(100, (pct - (i * 20)) * 5));
                     return (
                       <div key={i} className="flex-1 bg-zinc-800 rounded-full overflow-hidden">
                         <div className={`h-full bg-${challenge.color}-500 shadow-[0_0_10px_currentColor]`} style={{ width: `${segmentPct}%` }} />
                       </div>
                     )
                   })}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-white/5">
               <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                 <Target className="h-4 w-4 text-emerald-500" />
                 Unlocks Title
               </div>
               <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md">
                 <Clock className="h-3.5 w-3.5" />
                 {daysRemaining}d Left
               </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 relative z-10 mt-auto">
          {isAvailable ? (
            <Button 
              onClick={() => handleJoin(challenge._id)} 
              disabled={joiningId === challenge._id}
              className={`w-full mt-2 bg-${challenge.color}-500 hover:bg-${challenge.color}-400 text-zinc-950 font-black shadow-lg shadow-${challenge.color}-500/30 transition-all rounded-xl h-12`}
            >
              {joiningId === challenge._id ? <Loader2 className="h-5 w-5 animate-spin" /> : "Accept Quest"}
            </Button>
          ) : (
            <Button variant="outline" className="w-full mt-2 text-zinc-400 border-white/10 bg-zinc-950 font-bold rounded-xl h-12 cursor-default hover:bg-zinc-950 hover:text-zinc-400">
              Quest Active
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-8 max-w-full pb-12 overflow-x-hidden">
      {/* Gamified Player Banner (Duolingo/Fitbit Style) */}
      <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 border border-white/10 shadow-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10 pointer-events-none" />
        
        {/* Avatar & Level */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-30 rounded-full animate-pulse" />
            <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-emerald-500 flex items-center justify-center text-4xl relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              🌱
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-emerald-500 text-zinc-950 font-black flex items-center justify-center border-4 border-zinc-950 z-20 shadow-lg">
              {level}
            </div>
          </div>
          <h2 className="text-xl font-black text-white mt-4 tracking-tight">EcoWarrior</h2>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">Rank: Vanguard</p>
        </div>

        {/* XP & Streak Stats */}
        <div className="flex-1 w-full flex flex-col justify-center gap-6 relative z-10">
          <div className="flex items-end justify-between mb-1">
            <h3 className="text-3xl font-black text-white">{points.toLocaleString()} <span className="text-sm font-bold text-zinc-500 uppercase">Total XP</span></h3>
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl shadow-inner">
               <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
               <span className="text-lg font-black text-orange-400">{streakCount} Day Streak</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
              <span className="text-zinc-400">Level {level} Progress</span>
              <span className="text-emerald-400">{xpCurrent} / {xpMax} XP</span>
            </div>
            <div className="h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/5 p-0.5">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${xpPercentage}%` }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full relative overflow-hidden shadow-[0_0_10px_#10b981]"
               >
                 <div className="absolute top-0 bottom-0 left-0 right-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-shimmer" />
               </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 xl:grid-cols-12">
        {/* Main Quests Area */}
        <div className="xl:col-span-8 flex flex-col gap-10">
          
          {/* Active Quests */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Activity className="w-6 h-6 text-emerald-500" /> Active Quests
            </h2>
            {active.length === 0 ? (
              <EmptyState 
                icon={Target}
                title="No Active Quests"
                description="Accept a quest below to start earning XP and leveling up your impact profile."
                className="bg-zinc-900/40 border-white/5 rounded-3xl"
              />
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <AnimatePresence>
                  {active.map(c => (
                    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={c._id}>
                      {renderChallengeCard(c, false)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Available Quests */}
          {available.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Target className="w-6 h-6 text-sky-500" /> Quest Board
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {available.map(c => renderChallengeCard(c, true))}
              </div>
            </div>
          )}

          {/* Achievement Showcase (Habitica Style) */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Medal className="w-6 h-6 text-amber-500" /> Trophy Room
            </h2>
            <div className="p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-xl">
              {completed.length === 0 ? (
                <div className="text-center text-zinc-500 text-sm font-medium">Complete quests to unlock rare trophies here.</div>
              ) : (
                <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
                  {completed.map((c) => {
                    const Icon = getIconComponent(c.icon);
                    const rarity = getRarityConfig(c.targetValue);
                    return (
                      <div key={c._id} className="group relative flex flex-col items-center gap-3 w-24">
                         <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center relative overflow-hidden bg-zinc-950 border-2 transition-transform group-hover:scale-110 group-hover:-translate-y-2 cursor-pointer", `border-${rarity.color}-500/50`, rarity.glow)}>
                           <div className={`absolute inset-0 bg-${rarity.color}-500/10 pointer-events-none`} />
                           <Icon className={`w-8 h-8 text-${c.color}-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] relative z-10`} />
                         </div>
                         <div className="text-center">
                           <p className="text-[10px] font-black text-white uppercase leading-tight">{c.title}</p>
                           <p className={`text-[8px] font-bold text-${rarity.color}-400 uppercase mt-0.5`}>{rarity.name}</p>
                         </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Leaderboard & Upcoming */}
        <div className="xl:col-span-4 flex flex-col gap-8">
           
           {/* Global Leaderboard Mock */}
           <div className="flex flex-col gap-4">
             <h2 className="text-xl font-black text-white flex items-center gap-2">
               <Crown className="w-5 h-5 text-amber-400" /> Global Rankings
             </h2>
             <div className="rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-xl overflow-hidden p-2">
               <div className="flex flex-col gap-1">
                 {leaderboard.map((user, i) => (
                   <div key={i} className={cn(
                     "flex items-center gap-3 p-3 rounded-2xl transition-colors relative overflow-hidden",
                     user.isCurrentUser ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-zinc-800"
                   )}>
                     {user.isCurrentUser && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                     <div className="w-6 text-center font-black text-zinc-500 text-sm">#{user.rank}</div>
                     <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center text-lg shadow-inner">{user.avatar}</div>
                     <div className="flex-1 min-w-0">
                       <h4 className={cn("text-sm font-bold truncate", user.isCurrentUser ? "text-emerald-400" : "text-white")}>{user.name}</h4>
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{user.points.toLocaleString()} XP</p>
                     </div>
                     <div className="w-6 flex justify-center">
                       {user.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingUp className="w-4 h-4 text-rose-500 rotate-180" />}
                     </div>
                   </div>
                 ))}
               </div>
               <Button variant="ghost" className="w-full mt-2 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest">
                 View Full League <ChevronRight className="w-4 h-4 ml-1" />
               </Button>
             </div>
           </div>

           {/* Upcoming Challenges */}
           <div className="flex flex-col gap-4">
             <h2 className="text-xl font-black text-white flex items-center gap-2">
               <CalendarClock className="w-5 h-5 text-purple-400" /> Coming Soon
             </h2>
             <div className="flex flex-col gap-3">
               {upcoming.length === 0 ? (
                 <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 text-center text-zinc-500 text-sm font-medium">More quests dropping soon.</div>
               ) : (
                 upcoming.map((challenge) => (
                   <div key={challenge._id} className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-900/40 border border-white/5 border-dashed hover:border-white/20 transition-colors group">
                     <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 border border-white/5 shadow-inner">
                       <Sparkles className="h-5 w-5 text-zinc-600 group-hover:text-purple-400 transition-colors" />
                     </div>
                     <div className="flex-1">
                       <h4 className="text-sm font-bold text-zinc-300">{challenge.title}</h4>
                       <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1 text-purple-500/50">Unlocks Next Week</p>
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>

        </div>
      </div>
    </div>
  )
}
