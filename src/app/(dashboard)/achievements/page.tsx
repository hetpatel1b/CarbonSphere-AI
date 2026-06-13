"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Award, Leaf, Zap, Droplet, Wind, Trophy, Star, Hexagon, Crown, Sparkles, Target, Flame } from "lucide-react"
import { achievementService, AchievementDocument, Rarity } from "@/services/achievementService"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { motion } from "framer-motion"

const RARITY_CONFIG = {
  Common: {
    color: "text-slate-400",
    bg: "bg-slate-900",
    border: "border-slate-800",
    glow: "shadow-[0_0_15px_rgba(100,116,139,0.1)]",
    gradient: "from-slate-800 to-slate-900",
    icon: Star
  },
  Rare: {
    color: "text-sky-400",
    bg: "bg-sky-950/50",
    border: "border-sky-500/30",
    glow: "shadow-[0_0_20px_rgba(14,165,233,0.15)]",
    gradient: "from-sky-900/60 to-sky-950/40",
    icon: Hexagon
  },
  Epic: {
    color: "text-violet-400",
    bg: "bg-violet-950/50",
    border: "border-violet-500/40",
    glow: "shadow-[0_0_30px_rgba(139,92,246,0.25)]",
    gradient: "from-violet-900/60 to-violet-950/40",
    icon: Flame
  },
  Legendary: {
    color: "text-amber-400",
    bg: "bg-amber-950/50",
    border: "border-amber-500/50",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.35)]",
    gradient: "from-amber-600/30 via-orange-600/20 to-amber-950/40",
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

const calculateLevel = (totalXP: number) => {
  const level = Math.floor(Math.sqrt(totalXP / 50)) + 1;
  const currentLevelXP = (level - 1) * (level - 1) * 50;
  const nextLevelXP = level * level * 50;
  const xpIntoLevel = totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progressPct = Math.min(100, Math.max(0, (xpIntoLevel / xpNeededForLevel) * 100));
  
  let rank = "Novice Ecologist";
  if (level >= 5) rank = "Green Guardian";
  if (level >= 10) rank = "Climate Champion";
  if (level >= 15) rank = "Sustainability Master";
  if (level >= 20) rank = "Carbon Vanguard";

  return { level, rank, xpIntoLevel, xpNeededForLevel, progressPct, nextLevelXP };
}

// Circular Progress Component
const CircularProgress = ({ progress, size = 64, strokeWidth = 6, children, className }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
        <circle
          className="text-zinc-800 transition-all duration-300"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className="text-emerald-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      {children}
    </div>
  );
};

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
        setError((err instanceof Error ? err.message : String(err)) || "Failed to load achievements");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [])

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const { level, rank, progressPct, nextLevelXP } = calculateLevel(totalXP);

  const filteredAchievements = activeTab === "All" 
    ? achievements 
    : achievements.filter(a => a.category === activeTab)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-8 w-full max-w-6xl mx-auto">
        <Skeleton className="h-[250px] w-full rounded-3xl bg-zinc-900 border border-zinc-800" />
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-[180px] rounded-2xl bg-zinc-900 border border-zinc-800" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-10">
        <ErrorState 
          title="Gamification Services Offline"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-6xl mx-auto">
      
      {/* Gamification Hero Profile */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-1"
      >
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full mix-blend-screen" />
           <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/20 blur-[100px] rounded-full mix-blend-screen" />
        </div>
        
        <div className="relative z-10 bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 border border-white/5">
          
          {/* Level Ring */}
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
            <CircularProgress progress={progressPct} size={160} strokeWidth={8} className="drop-shadow-2xl bg-zinc-950 rounded-full border-4 border-zinc-900">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Level</span>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-200 drop-shadow-sm">{level}</span>
              </div>
            </CircularProgress>
          </div>

          {/* Profile Stats */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" /> {rank}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Eco Profile</h1>
            </div>
            
            <div className="w-full max-w-md bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Total XP</span>
                <span className="text-2xl font-bold text-white">{totalXP.toLocaleString()} <span className="text-sm text-zinc-600 font-normal">XP</span></span>
              </div>
              <div className="h-10 w-px bg-zinc-800" />
              <div className="flex flex-col text-right">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Next Level</span>
                <span className="text-2xl font-bold text-white">{nextLevelXP.toLocaleString()} <span className="text-sm text-zinc-600 font-normal">XP</span></span>
              </div>
            </div>
          </div>
          
          {/* Trophy Count */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-w-[160px]">
            <Trophy className="w-10 h-10 text-amber-500 mb-3 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <span className="text-3xl font-black text-white">{unlockedCount} <span className="text-xl text-zinc-600 font-medium">/ {totalCount}</span></span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-1">Unlocked</span>
          </div>

        </div>
      </motion.div>

      {/* Categories & Filter */}
      <Tabs defaultValue="All" value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Trophy Cabinet</h2>
          <TabsList className="bg-zinc-900 border border-zinc-800 w-full sm:w-auto h-12 p-1">
            {["All", "Community", "Energy"].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="text-sm font-medium px-6 h-full data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-md transition-all"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0 outline-none">
          {filteredAchievements.length === 0 ? (
            <div className="flex items-center justify-center p-12 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl">
              <EmptyState 
                icon={Trophy}
                title="No Trophies"
                description="Keep exploring to discover more challenges."
                className="bg-transparent border-none"
              />
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredAchievements.map((achievement) => {
                const rarityName = determineRarity(achievement.points)
                const rarityStyle = RARITY_CONFIG[rarityName]
                const RarityIcon = rarityStyle.icon
                const AchIcon = getIconComponent(achievement.badgeIcon)
                
                return (
                  <motion.div variants={itemVariants} key={achievement._id}>
                    <Card className={`h-full flex flex-col relative overflow-hidden transition-all duration-500 ${
                      achievement.unlocked 
                        ? `border ${rarityStyle.border} ${rarityStyle.glow} bg-gradient-to-br ${rarityStyle.gradient} group hover:-translate-y-2 hover:shadow-2xl` 
                        : 'border-zinc-800 bg-zinc-950/50 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0'
                    }`}>
                      
                      {achievement.unlocked && (
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      )}

                      <CardHeader className="pb-4 relative z-10 flex-row gap-4 items-start space-y-0">
                        <div className="relative shrink-0">
                          {achievement.unlocked && (
                            <div className={`absolute inset-0 rounded-2xl blur-md opacity-50 ${rarityStyle.bg}`} />
                          )}
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 border border-white/10 ${
                            achievement.unlocked ? 'bg-zinc-950 shadow-inner' : 'bg-zinc-900'
                          }`}>
                            <AchIcon className={`w-8 h-8 ${achievement.unlocked ? rarityStyle.color : 'text-zinc-600'}`} />
                          </div>
                          
                          {!achievement.unlocked && achievement.progress > 0 && (
                            <div className="absolute -bottom-2 -right-2 bg-zinc-900 border border-zinc-700 rounded-full w-8 h-8 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                              {achievement.progress}%
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <Badge variant="outline" className={`gap-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border-none bg-black/40 backdrop-blur-md ${rarityStyle.color}`}>
                              <RarityIcon className="h-3 w-3" />
                              {rarityName}
                            </Badge>
                            {achievement.unlocked && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0 text-[10px]">
                                Unlocked
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg font-bold text-white truncate">{achievement.title}</CardTitle>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 mt-1.5">
                            <Sparkles className="h-3.5 w-3.5" /> +{achievement.points} XP
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-5 pt-0 flex-1 relative z-10">
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          {achievement.description}
                        </p>
                      </CardContent>

                      {!achievement.unlocked && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900">
                           <div 
                             className="h-full bg-emerald-500/50" 
                             style={{ width: `${achievement.progress}%` }} 
                           />
                        </div>
                      )}
                      
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
