"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Award, Leaf, Zap, Droplet, Wind, Trophy, CheckCircle2, Star, Hexagon, Crown, Sparkles, Target, Flame, Activity, Loader2 } from "lucide-react"
import { achievementService, AchievementDocument, Rarity } from "@/services/achievementService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"

const RARITY_CONFIG = {
  Common: {
    color: "text-slate-500",
    bg: "bg-slate-100 dark:bg-slate-800/40",
    border: "border-slate-200 dark:border-slate-800",
    glow: "shadow-[0_0_15px_rgba(100,116,139,0.15)]",
    icon: Star
  },
  Rare: {
    color: "text-sky-500",
    bg: "bg-sky-100 dark:bg-sky-900/40",
    border: "border-sky-200 dark:border-sky-800",
    glow: "shadow-[0_0_15px_rgba(14,165,233,0.2)]",
    icon: Hexagon
  },
  Epic: {
    color: "text-violet-500",
    bg: "bg-violet-100 dark:bg-violet-900/40",
    border: "border-violet-200 dark:border-violet-800",
    glow: "shadow-[0_0_20px_rgba(139,92,246,0.25)]",
    icon: Flame
  },
  Legendary: {
    color: "text-amber-500",
    bg: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40",
    border: "border-amber-300 dark:border-amber-700/50",
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.3)]",
    icon: Crown
  }
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Leaf': return Leaf;
    case 'Zap': return Zap;
    case 'Droplet': return Droplet;
    case 'Wind': return Wind;
    case 'Award': return Award;
    case 'Target': return Target;
    case 'Crown': return Crown;
    default: return Trophy;
  }
}

const determineRarity = (points: number): Rarity => {
  if (points <= 100) return "Common";
  if (points <= 250) return "Rare";
  if (points <= 450) return "Epic";
  return "Legendary";
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("All")
  const [achievements, setAchievements] = useState<AchievementDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await achievementService.getAchievementStatus();
        setAchievements(data);
      } catch (err: unknown) {
        setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || "Failed to load achievements");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [])

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const completionPct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  const filteredAchievements = activeTab === "All" 
    ? achievements 
    : achievements.filter(a => a.category === activeTab)

  const featured = achievements.find(a => determineRarity(a.points) === "Legendary") || achievements[0]

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-8 w-full">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-md mt-1" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-10">
        <ErrorState 
          title="Failed to load achievements"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const latestUnlocked = achievements.filter(a => a.unlocked).sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime())[0]

  return (
    <div className="flex flex-col gap-8 pb-8 animate-scale-up">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 w-fit">
          <Sparkles className="h-3 w-3 animate-pulse-glow" />
          <span>Live Synchronized with MongoDB</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Achievements</h1>
        <p className="text-sm text-muted-foreground">
          Unlock badges, earn XP, and track your sustainability journey dynamically.
        </p>
      </div>

      {/* Top Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Card className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border-border/40">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</span>
            <div className="flex items-center gap-2 mt-1">
              <Trophy className="h-5 w-5 text-emerald-500" />
              <span className="text-2xl font-bold">{totalCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border-border/40">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Unlocked</span>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="h-5 w-5 text-sky-500" />
              <span className="text-2xl font-bold">{unlockedCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border-border/40">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In Progress</span>
            <div className="flex items-center gap-2 mt-1">
              <Activity className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{totalCount - unlockedCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border-border/40">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completion</span>
            <div className="flex items-center gap-2 mt-1">
              <Target className="h-5 w-5 text-violet-500" />
              <span className="text-2xl font-bold">{completionPct}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Journey */}
      {latestUnlocked && (
        <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20 shrink-0">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 space-y-2 text-center md:text-left w-full">
                <h3 className="text-lg font-bold text-foreground">Latest Unlock: {latestUnlocked.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Earned +{latestUnlocked.points} XP</span>
                  <span>Unlocked on {new Date(latestUnlocked.unlockedAt!).toLocaleDateString()}</span>
                </div>
                <Progress value={100} className="h-3 bg-emerald-100 dark:bg-emerald-950 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Achievement */}
      {featured && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" /> Featured Challenge
          </h2>
          <Card className={`relative overflow-hidden transition-all border-amber-300 dark:border-amber-700/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] group hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]`}>
            <div className="absolute top-0 right-0 p-4">
              <Badge className="bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50 dark:text-amber-400 dark:border-amber-700 gap-1.5 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-md">
                <Crown className="h-3.5 w-3.5" />
                {determineRarity(featured.points)}
              </Badge>
            </div>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30 shrink-0 transform transition-transform group-hover:scale-105">
                  {(() => {
                    const FeaturedIcon = getIconComponent(featured.badgeIcon);
                    return <FeaturedIcon className="h-12 w-12 text-white" />;
                  })()}
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left mt-2 md:mt-0 w-full">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{featured.title}</h3>
                    <p className="text-muted-foreground mt-1">{featured.description}</p>
                  </div>
                  <div className="space-y-2 max-w-md mx-auto md:mx-0">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-amber-600 dark:text-amber-500">{featured.progress}%</span>
                    </div>
                    <Progress value={featured.progress} className="h-2 bg-amber-200/50 dark:bg-amber-900/50 [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-orange-400" />
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                    <Badge variant="outline" className="bg-white/50 dark:bg-black/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 gap-1.5 py-1">
                      <Sparkles className="h-3.5 w-3.5" /> +{featured.points} XP
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Achievement Categories */}
      <Tabs defaultValue="All" value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">Your Achievements</h2>
          <TabsList className="bg-muted/50 border border-border/40 w-full sm:w-auto overflow-x-auto justify-start">
            {["All", "Community", "Energy"].map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-xs whitespace-nowrap">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0 outline-none">
          {filteredAchievements.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <EmptyState 
                icon={Trophy}
                title="No Achievements"
                description="No achievements found in this category."
                className="bg-transparent border-none"
              />
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredAchievements.map((achievement, i) => {
                const rarityName = determineRarity(achievement.points)
                const rarityStyle = RARITY_CONFIG[rarityName]
                const RarityIcon = rarityStyle.icon
                const AchIcon = getIconComponent(achievement.badgeIcon)

                return (
                  <Card key={achievement._id} className={`flex flex-col relative overflow-hidden transition-all duration-300 ${
                    achievement.unlocked 
                      ? `border ${rarityStyle.border} ${rarityStyle.glow} bg-white dark:bg-zinc-950 group hover:-translate-y-1` 
                      : 'border-border/40 bg-muted/10 opacity-75 hover:opacity-100 group'
                  }`}>
                    {achievement.unlocked && (
                      <div className="absolute top-0 right-0 p-3">
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500/20 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Unlocked
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-3 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-110 ${
                          achievement.unlocked ? rarityStyle.bg : 'bg-muted dark:bg-zinc-800'
                        }`}>
                          <AchIcon className={`w-6 h-6 ${achievement.unlocked ? rarityStyle.color : 'text-muted-foreground'}`} />
                        </div>
                        {!achievement.unlocked && (
                          <Badge variant="outline" className={`gap-1 px-2 py-0.5 text-[10px] ${rarityStyle.color} ${rarityStyle.border} bg-background/50 backdrop-blur-sm`}>
                            <RarityIcon className="h-3 w-3" />
                            {rarityName}
                          </Badge>
                        )}
                        {achievement.unlocked && (
                          <Badge variant="outline" className={`gap-1 px-2 py-0.5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 left-3 ${rarityStyle.color} ${rarityStyle.border} bg-background/90 backdrop-blur-sm`}>
                            <RarityIcon className="h-3 w-3" />
                            {rarityName}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base font-bold">{achievement.title}</CardTitle>
                      <CardDescription className="text-xs leading-relaxed mt-1 line-clamp-2">{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                          <span>Progress</span>
                          <span className={achievement.unlocked ? rarityStyle.color : ""}>{achievement.progress}%</span>
                        </div>
                        <Progress 
                          value={achievement.progress} 
                          className={`h-1.5 bg-muted/50 ${
                            achievement.unlocked 
                              ? `[&>div]:bg-current ${rarityStyle.color}`
                              : '[&>div]:bg-muted-foreground/30'
                          }`} 
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-3 pb-4 border-t border-border/40 bg-muted/5 flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" /> +{achievement.points} XP
                      </div>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
