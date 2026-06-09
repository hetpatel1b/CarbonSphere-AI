import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Award, Leaf, Zap, Droplet, Wind, Trophy } from "lucide-react"

const achievements = [
  { title: "First Step", description: "Logged your first eco-friendly activity.", icon: Leaf, progress: 100, unlocked: true, color: "text-green-500", bg: "bg-green-500/10" },
  { title: "Energy Saver", description: "Reduced energy consumption by 10% this month.", icon: Zap, progress: 100, unlocked: true, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { title: "Water Guardian", description: "Saved 1000L of water overall.", icon: Droplet, progress: 85, unlocked: false, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Zero Waste Week", description: "Produced no non-recyclable waste for 7 days.", icon: Wind, progress: 40, unlocked: false, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "Carbon Neutral", description: "Offset 100% of your emissions this year.", icon: Trophy, progress: 15, unlocked: false, color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Eco Champion", description: "Reach a sustainability score of 900+.", icon: Award, progress: 65, unlocked: false, color: "text-indigo-500", bg: "bg-indigo-500/10" },
]

export default function AchievementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">Unlock badges by reaching sustainability milestones.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement, i) => (
          <Card key={i} className={`relative overflow-hidden ${achievement.unlocked ? 'border-primary/50' : 'opacity-80'}`}>
            {achievement.unlocked && (
              <div className="absolute top-0 right-0 p-4">
                <Badge className="bg-primary text-primary-foreground">Unlocked</Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${achievement.unlocked ? achievement.bg : 'bg-muted'}`}>
                <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? achievement.color : 'text-muted-foreground'}`} />
              </div>
              <CardTitle className="text-lg">{achievement.title}</CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className={`h-2 ${achievement.unlocked ? '[&>div]:bg-primary' : ''}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
