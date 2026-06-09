import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Award, Leaf, Zap, Droplet, Wind, Trophy, CheckCircle2 } from "lucide-react"

const achievements = [
  { title: "First Step", description: "Logged your first eco-friendly activity.", icon: Leaf, progress: 100, unlocked: true, color: "text-emerald-500", bg: "bg-gradient-to-br from-emerald-400 to-emerald-600", bgLight: "bg-emerald-100 dark:bg-emerald-900/40" },
  { title: "Energy Saver", description: "Reduced energy consumption by 10% this month.", icon: Zap, progress: 100, unlocked: true, color: "text-amber-500", bg: "bg-gradient-to-br from-amber-400 to-amber-600", bgLight: "bg-amber-100 dark:bg-amber-900/40" },
  { title: "Water Guardian", description: "Saved 1000L of water overall.", icon: Droplet, progress: 85, unlocked: false, color: "text-sky-500", bg: "bg-sky-500/10", bgLight: "bg-sky-100/60 dark:bg-sky-900/20" },
  { title: "Zero Waste Week", description: "Produced no non-recyclable waste for 7 days.", icon: Wind, progress: 40, unlocked: false, color: "text-violet-500", bg: "bg-violet-500/10", bgLight: "bg-violet-100/60 dark:bg-violet-900/20" },
  { title: "Carbon Neutral", description: "Offset 100% of your emissions this year.", icon: Trophy, progress: 15, unlocked: false, color: "text-orange-500", bg: "bg-orange-500/10", bgLight: "bg-orange-100/60 dark:bg-orange-900/20" },
  { title: "Eco Champion", description: "Reach a sustainability score of 900+.", icon: Award, progress: 65, unlocked: false, color: "text-indigo-500", bg: "bg-indigo-500/10", bgLight: "bg-indigo-100/60 dark:bg-indigo-900/20" },
]

export default function AchievementsPage() {
  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Achievements</h1>
        <p className="text-sm text-muted-foreground">
          Unlock badges by reaching sustainability milestones — <span className="font-medium text-foreground">{unlockedCount} of {achievements.length}</span> unlocked.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement, i) => (
          <Card key={i} className={`relative overflow-hidden transition-all ${
            achievement.unlocked 
              ? 'ring-1 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.06)] dark:ring-emerald-500/15 dark:shadow-[0_0_20px_rgba(16,185,129,0.04)]' 
              : 'opacity-60'
          }`}>
            {achievement.unlocked && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500/20 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Unlocked
                </Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${achievement.unlocked ? achievement.bg : 'bg-muted'}`}>
                <achievement.icon className={`w-7 h-7 ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              <CardTitle className="text-lg font-semibold">{achievement.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed">{achievement.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-muted-foreground">Progress</span>
                  <span className="font-semibold">{achievement.progress}%</span>
                </div>
                <Progress 
                  value={achievement.progress} 
                  className={`h-2.5 bg-muted/40 ${
                    achievement.unlocked 
                      ? '[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400' 
                      : '[&>div]:bg-muted-foreground/30'
                  }`} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
