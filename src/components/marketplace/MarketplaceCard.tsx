"use client"

import { CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Globe, CheckCircle2, Star, ShieldCheck } from "lucide-react"
import { OffsetProject } from "@/types"

const getCategoryImageUrl = (category: string) => {
  switch (category) {
    case 'Reforestation': return "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
    case 'Renewable Energy': return "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80"
    case 'Ocean Cleanup': return "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80"
    case 'Water Conservation': return "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
    case 'Sustainable Agriculture': return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
    default: return "https://images.unsplash.com/photo-1536696120663-882436d53b9f?w=800&q=80"
  }
}

export default function MarketplaceCard({ 
  project, 
  isRecommended, 
  onClick 
}: { 
  project: OffsetProject; 
  isRecommended: boolean;
  onClick: (project: OffsetProject) => void;
}) {
  const imageUrl = getCategoryImageUrl(project.category);

  return (
    <div 
      onClick={() => onClick(project)}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      {/* Immersive Cover Image Container */}
      <div 
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-2xl transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]",
          isRecommended ? "ring-2 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]" : "ring-1 ring-white/5"
        )}
        role="img"
        aria-label={`Cover photo for ${project.category} project`}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        {/* Subtle gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-none font-semibold px-2.5 py-1">
            {project.category}
          </Badge>
          
          {isRecommended && (
            <div className="bg-emerald-500/90 backdrop-blur-md text-white rounded-full p-1.5 shadow-lg flex items-center justify-center">
              <Star className="w-4 h-4 fill-white" />
            </div>
          )}
        </div>

        {/* Bottom Details Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-white/90 font-medium text-xs">
            <Globe className="w-3.5 h-3.5" />
            <span className="drop-shadow-md">{project.location}</span>
          </div>
        </div>
      </div>

      {/* Info Section (Airbnb Style - Below Image) */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-bold text-white tracking-tight leading-tight line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {project.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm font-bold text-white bg-zinc-900 px-1.5 py-0.5 rounded-md shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {project.rating}
          </div>
        </div>
        
        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-base font-black text-white">${project.costPerTon}</span>
          <span className="text-xs font-medium text-zinc-500">USD / ton</span>
        </div>
      </div>
    </div>
  )
}
