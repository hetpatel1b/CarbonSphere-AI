"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Award, Leaf, Zap, Droplet, Wind, Trophy, CheckCircle2, Star, Hexagon, Crown, Sparkles, Target, Flame, Activity } from "lucide-react"

type Rarity = "Common" | "Rare" | "Epic" | "Legendary"

interface Achievement {
  id: string
  title: string
  description: string
  category: "Energy" | "Transport" | "Water" | "Community"
  rarity: Rarity
  icon: any
  progress: number
  unlocked: boolean
  rewardXP: number
  rewardImpact: string
}

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

const ACHIEVEMENTS: Achievement[] = [
  { id: "first-step", title: "First Step", description: "Logged your first eco-friendly activity.", category: "Community", rarity: "Common", icon: Leaf, progress: 100, unlocked: true, rewardXP: 50, rewardImpact: "0.01 tCO₂e" },
  { id: "energy-saver", title: "Energy Saver", description: "Reduced energy consumption by 10% this month.", category: "Energy", rarity: "Rare", icon: Zap, progress: 100, unlocked: true, rewardXP: 150, rewardImpact: "0.05 tCO₂e" },
  { id: "water-guardian", title: "Water Guardian", description: "Saved 1000L of water overall.", category: "Water", rarity: "Epic", icon: Droplet, progress: 85, unlocked: false, rewardXP: 300, rewardImpact: "0.1 tCO₂e" },
  { id: "zero-waste", title: "Zero Waste Week", description: "Produced no non-recyclable waste for 7 days.", category: "Community", rarity: "Epic", icon: Wind, progress: 40, unlocked: false, rewardXP: 350, rewardImpact: "0.15 tCO₂e" },
  { id: "eco-champion", title: "Eco Champion", description: "Reach a sustainability score of 900+.", category: "Community", rarity: "Legendary", icon: Award, progress: 65, unlocked: false, rewardXP: 500, rewardImpact: "0.5 tCO₂e" },
  { id: "transit-hero", title: "Transit Hero", description: "Use public transport for 30 consecutive days.", category: "Transport", rarity: "Rare", icon: Target, progress: 30, unlocked: false, rewardXP: 200, rewardImpact: "0.2 tCO₂e" }
]

const FEATURED: Achievement = { 
  id: "carbon-neutral", title: "Carbon Neutral", description: "Offset 100% of your emissions this year.", category: "Community", rarity: "Legendary", icon: Trophy, progress: 15, unlocked: false, rewardXP: 1000, rewardImpact: "1.0 tCO₂e" 
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("All")

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length
  const totalCount = ACHIEVEMENTS.length + 1 // including featured
  const completionPct = Math.round((unlockedCount / totalCount) * 100)

  const filteredAchievements = activeTab === "All" 
    ? ACHIEVEMENTS 
    : ACHIEVEMENTS.filter(a => a.category === activeTab)

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Achievements</h1>
        <p className="text-sm text-muted-foreground">
          Unlock badges, earn XP, and track your sustainability journey.
        </p>
      </div>

      {/* Top Statistics */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
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
      <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20 shrink-0">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left w-full">
              <h3 className="text-lg font-bold text-foreground">Level 7 Eco Champion</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>1240 XP Earned</span>
                <span>Next Milestone: 1500 XP</span>
              </div>
              <Progress value={82} className="h-3 bg-emerald-100 dark:bg-emerald-950 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Achievement */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" /> Featured Achievement
        </h2>
        <Card className={`relative overflow-hidden transition-all border-amber-300 dark:border-amber-700/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] group hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]`}>
          <div className="absolute top-0 right-0 p-4">
            <Badge className="bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50 dark:text-amber-400 dark:border-amber-700 gap-1.5 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-md">
              <Crown className="h-3.5 w-3.5" />
              Legendary
            </Badge>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30 shrink-0 transform transition-transform group-hover:scale-105">
                <FEATURED.icon className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left mt-2 md:mt-0 w-full">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{FEATURED.title}</h3>
                  <p className="text-muted-foreground mt-1">{FEATURED.description}</p>
                </div>
                <div className="space-y-2 max-w-md mx-auto md:mx-0">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-amber-600 dark:text-amber-500">{FEATURED.progress}%</span>
                  </div>
                  <Progress value={FEATURED.progress} className="h-2 bg-amber-200/50 dark:bg-amber-900/50 [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-orange-400" />
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                  <Badge variant="outline" className="bg-white/50 dark:bg-black/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 gap-1.5 py-1">
                    <Sparkles className="h-3.5 w-3.5" /> +{FEATURED.rewardXP} XP
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-black/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 gap-1.5 py-1">
                    <Leaf className="h-3.5 w-3.5" /> {FEATURED.rewardImpact} saved
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Categories */}
      <Tabs defaultValue="All" value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">Your Achievements</h2>
          <TabsList className="bg-muted/50 border border-border/40 w-full sm:w-auto overflow-x-auto justify-start">
            {["All", "Energy", "Transport", "Water", "Community"].map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-xs whitespace-nowrap">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0 outline-none">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((achievement, i) => {
              const rarityStyle = RARITY_CONFIG[achievement.rarity]
              const RarityIcon = rarityStyle.icon

              return (
                <Card key={i} className={`flex flex-col relative overflow-hidden transition-all duration-300 ${
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
                        <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? rarityStyle.color : 'text-muted-foreground'}`} />
                      </div>
                      {!achievement.unlocked && (
                        <Badge variant="outline" className={`gap-1 px-2 py-0.5 text-[10px] ${rarityStyle.color} ${rarityStyle.border} bg-background/50 backdrop-blur-sm`}>
                          <RarityIcon className="h-3 w-3" />
                          {achievement.rarity}
                        </Badge>
                      )}
                      {achievement.unlocked && (
                        <Badge variant="outline" className={`gap-1 px-2 py-0.5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 left-3 ${rarityStyle.color} ${rarityStyle.border} bg-background/90 backdrop-blur-sm`}>
                          <RarityIcon className="h-3 w-3" />
                          {achievement.rarity}
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
                      <Sparkles className="h-3.5 w-3.5" /> +{achievement.rewardXP} XP
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 ml-auto">
                      <Leaf className="h-3.5 w-3.5" /> {achievement.rewardImpact}
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
