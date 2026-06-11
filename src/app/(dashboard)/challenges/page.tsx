"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Leaf, Target, Zap, Droplet, CheckCircle2, Clock, CalendarClock, Trophy, TrendingUp, Loader2 } from "lucide-react"
import { challengeService, ChallengeStatusResponse, ChallengeDocument } from "@/services/challengeService"

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

export default function ChallengesPage() {
  const [data, setData] = useState<ChallengeStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const result = await challengeService.getChallengeStatus();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load challenges");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    loadData();
  }, []);

  const handleJoin = async (id: string) => {
    try {
      setJoiningId(id);
      await challengeService.joinChallenge(id);
      toast({
        title: "Challenge Joined!",
        description: "You've successfully joined the challenge.",
      });
      await loadData();
    } catch (err: any) {
      toast({
        title: "Failed to join",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setJoiningId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4 text-center">
        <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          <Trophy className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">Failed to load challenges</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Try again</Button>
      </div>
    );
  }

  const { active, completed, upcoming, available, stats } = data;

  const statsCards = [
    { label: "Challenges Joined", value: stats.challengesJoined.toString(), icon: Target },
    { label: "Challenges Completed", value: stats.challengesCompleted.toString(), icon: CheckCircle2 },
    { label: "Points Earned", value: stats.pointsEarned.toLocaleString(), icon: Trophy },
  ]

  const calculateDaysRemaining = (endDate: string) => {
    const diff = new Date(endDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const renderChallengeCard = (challenge: ChallengeDocument, isAvailable: boolean) => {
    const pct = Math.min(Math.round(((challenge.progress || 0) / challenge.targetValue) * 100), 100);
    const Icon = getIconComponent(challenge.icon);
    const daysRemaining = calculateDaysRemaining(challenge.endDate);

    return (
      <Card key={challenge._id} className="flex flex-col h-full relative overflow-hidden group">
        <div className={`absolute top-0 left-0 w-full h-1 bg-${challenge.color}-500/20 group-hover:bg-${challenge.color}-500/40 transition-colors`} />
        <CardHeader className="pb-3 flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 dark:bg-muted/40`}>
              <Icon className={`h-5 w-5 text-${challenge.color}-600 dark:text-${challenge.color}-400`} />
            </div>
            <Badge variant="secondary" className={`bg-${challenge.color}-50 text-${challenge.color}-700 hover:bg-${challenge.color}-50 dark:bg-${challenge.color}-900/30 dark:text-${challenge.color}-400 border-none font-semibold`}>
              +{challenge.rewardPoints} pts
            </Badge>
          </div>
          <CardTitle className="text-base font-semibold leading-snug">{challenge.title}</CardTitle>
          <CardDescription className="text-xs leading-relaxed mt-1 line-clamp-2">
            {challenge.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-3">
            {!isAvailable && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">
                    {challenge.progress} / {challenge.targetValue}
                  </span>
                </div>
                <Progress value={pct} className={`h-2 [&>div]:bg-gradient-to-r [&>div]:from-${challenge.color}-500 [&>div]:to-${challenge.color}-400`} />
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-orange-500/80" />
              {daysRemaining} days remaining
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 border-t border-border/30 mt-auto flex">
          {isAvailable ? (
            <Button 
              onClick={() => handleJoin(challenge._id)} 
              disabled={joiningId === challenge._id}
              className={`w-full mt-4 bg-${challenge.color}-600 hover:bg-${challenge.color}-700 text-white shadow-sm transition-all`}
            >
              {joiningId === challenge._id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Join Challenge
            </Button>
          ) : (
            <Button variant="outline" className="w-full mt-4 text-muted-foreground transition-all">
              In Progress
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sustainability Challenges</h1>
        <p className="text-sm text-muted-foreground">
          Join challenges, earn rewards, and build greener habits.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {statsCards.map((stat, i) => (
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

      {/* Active Challenges */}
      <div>
        <h2 className="text-base font-semibold mb-4">Active Joined Challenges</h2>
        {active.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground bg-muted/5">
            You haven&apos;t joined any active challenges yet. Browse available challenges below!
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {active.map(c => renderChallengeCard(c, false))}
          </div>
        )}
      </div>

      {/* Available Challenges */}
      {available.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-4">Available to Join</h2>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {available.map(c => renderChallengeCard(c, true))}
          </div>
        </div>
      )}

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Completed Challenges */}
        <div>
          <h2 className="text-base font-semibold mb-4">Completed Challenges</h2>
          {completed.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground text-sm">
              No completed challenges yet. Keep going!
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {completed.map((challenge) => {
                const Icon = getIconComponent(challenge.icon)
                return (
                  <Card key={challenge._id} className="bg-muted/10 border-border/40">
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
          )}
        </div>

        {/* Upcoming Challenges */}
        <div>
          <h2 className="text-base font-semibold mb-4">Upcoming Challenges</h2>
          {upcoming.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground text-sm">
              Check back soon for new challenges!
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((challenge) => (
                <Card key={challenge._id} className="bg-muted/10 border-border/40 border-dashed">
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
          )}
        </div>
      </div>
    </div>
  )
}
