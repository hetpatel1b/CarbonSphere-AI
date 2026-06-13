"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TreeDeciduous, Wind, Droplets, Droplet, Sprout, Globe } from "lucide-react"
import { OffsetProject } from "@/types"

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Reforestation': return <TreeDeciduous className="w-12 h-12 text-white" />
    case 'Renewable Energy': return <Wind className="w-12 h-12 text-white" />
    case 'Ocean Cleanup': return <Droplets className="w-12 h-12 text-white" />
    case 'Water Conservation': return <Droplet className="w-12 h-12 text-white" />
    case 'Sustainable Agriculture': return <Sprout className="w-12 h-12 text-white" />
    default: return <Globe className="w-12 h-12 text-white" />
  }
}

export default function MarketplaceCard({ 
  project, 
  isRecommended, 
  onPurchase 
}: { 
  project: OffsetProject; 
  isRecommended: boolean;
  onPurchase: (project: OffsetProject) => void;
}) {
  return (
    <Card className={cn("flex flex-col transition-shadow hover:shadow-xl border-border/40 bg-white/50 dark:bg-zinc-950/30 backdrop-blur-xl relative", isRecommended && "border-emerald-500/50 shadow-emerald-500/10")}>
      {isRecommended && (
        <Badge className="absolute -top-3 -right-2 z-10 shadow-sm bg-emerald-500 text-white">Recommended</Badge>
      )}
      <div 
        className="flex items-center justify-center h-40 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-t-md relative overflow-hidden"
        role="img"
        aria-label={`Visualization of ${project.category} category`}
      >
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        <div className="z-10" aria-hidden="true">{getCategoryIcon(project.category)}</div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{project.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{project.location} • {project.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Cost per ton</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">${project.costPerTon} / tCO₂e</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2" title={project.description}>{project.description}</p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px]">
            {project.rating}
          </Badge>
          <span className="text-[10px] text-muted-foreground">{(project.availableCredits || 0).toLocaleString()} tCO₂e left</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onPurchase(project)} className="w-full" variant="default">
          Select Project
        </Button>
      </CardFooter>
    </Card>
  )
}
