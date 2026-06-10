"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Leaf, Target, Zap, Droplet, CheckCircle2, Clock, CalendarClock, Trophy, TrendingUp } from "lucide-react"

export default function ChallengesPage() {
  const activeChallenges = [
    {
      id: "1",
      title: "Zero Waste Week",
      description: "Avoid non-recyclable waste for 7 days.",
      icon: Leaf,
      reward: 100,
      progress: { value: 4, target: 7, label: "Days" },
      daysRemaining: 3,
      color: "emerald"
    },
    {
      id: "2",
      title: "Green Commute Challenge",
      description: "Use public transport, cycling, or walking.",
      icon: Target,
      reward: 150,
      progress: { value: 8, target: 10, label: "Trips" },
      daysRemaining: 5,
      color: "emerald"
    },
    {
      id: "3",
      title: "Energy Saver",
      description: "Reduce household energy consumption.",
      icon: Zap,
      reward: 120,
      progress: { value: 65, target: 100, label: "%" },
      daysRemaining: 12,
      color: "amber"
    },
    {
      id: "4",
      title: "Water Guardian",
      description: "Reduce water usage through conservation.",
      icon: Droplet,
      reward: 90,
      progress: { value: 80, target: 100, label: "%" },
      daysRemaining: 7,
      color: "sky"
    }
  ]

  const completedChallenges = [
    { id: "c1", title: "Plant-Based Week", icon: Leaf },
    { id: "c2", title: "Eco Shopping Challenge", icon: Target },
    { id: "c3", title: "Carbon Awareness Bootcamp", icon: Trophy },
  ]

  const upcomingChallenges = [
    { id: "u1", title: "30 Day Carbon Reduction" },
    { id: "u2", title: "Sustainable Home Upgrade" },
    { id: "u3", title: "Community Green Impact" },
  ]

  const stats = [
    { label: "Challenges Joined", value: "12", icon: Target },
    { label: "Challenges Completed", value: "8", icon: CheckCircle2 },
    { label: "Points Earned", value: "2,450", icon: Trophy },
    { label: "Current Streak", value: "14 Days", icon: TrendingUp },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sustainability Challenges</h1>
        <p className="text-sm text-muted-foreground">
          Join challenges, earn rewards, and build greener habits.
        </p>
      </div>

      {/* Section 2: Your Progress (placed at top for better dashboard feel, or let's follow the prompt exactly) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                <stat.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">{stat.label}</p>
                <h4 className="text-xl font-bold text-foreground truncate mt-0.5">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section 1: Active Challenges */}
      <div>
        <h2 className="text-base font-semibold mb-4">Active Challenges</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {activeChallenges.map((challenge) => {
            const pct = Math.min(Math.round((challenge.progress.value / challenge.progress.target) * 100), 100)
            const isPctBased = challenge.progress.label === "%"
            const Icon = challenge.icon
            
            return (
              <Card key={challenge.id} className="flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20 group-hover:bg-emerald-500/40 transition-colors" />
                <CardHeader className="pb-3 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 dark:bg-muted/40`}>
                      <Icon className={`h-5 w-5 text-${challenge.color}-600 dark:text-${challenge.color}-400`} />
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border-none font-semibold">
                      +{challenge.reward} pts
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-semibold leading-snug">{challenge.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed mt-1 line-clamp-2">
                    {challenge.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">
                          {isPctBased 
                            ? `${challenge.progress.value}%` 
                            : `${challenge.progress.value} / ${challenge.progress.target} ${challenge.progress.label}`}
                        </span>
                      </div>
                      <Progress value={pct} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-orange-500/80" />
                      {challenge.daysRemaining} days remaining
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t border-border/30 mt-auto flex">
                  <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Section 3: Completed Challenges */}
        <div>
          <h2 className="text-base font-semibold mb-4">Completed Challenges</h2>
          <div className="flex flex-col gap-3">
            {completedChallenges.map((challenge) => {
              const Icon = challenge.icon
              return (
                <Card key={challenge.id} className="bg-muted/10 border-border/40">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20">
                        <Icon className="h-4 w-4 text-emerald-600/70 dark:text-emerald-400/70" />
                      </div>
                      <span className="text-sm font-semibold text-foreground/80">{challenge.title}</span>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500/20 gap-1.5 pointer-events-none">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Section 4: Upcoming Challenges */}
        <div>
          <h2 className="text-base font-semibold mb-4">Upcoming Challenges</h2>
          <div className="flex flex-col gap-3">
            {upcomingChallenges.map((challenge) => (
              <Card key={challenge.id} className="bg-muted/10 border-border/40 border-dashed">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 dark:bg-muted/30">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{challenge.title}</span>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground border-border/50 bg-background/50 pointer-events-none">
                    Coming Soon
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
