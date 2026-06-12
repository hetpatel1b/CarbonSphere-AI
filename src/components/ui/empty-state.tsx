import React from "react"
import { LucideIcon, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = Leaf,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl border-border/50 bg-muted/10 animate-in fade-in duration-500", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      
      {actionLabel && (
        actionHref ? (
          <Link href={actionHref as any}>
            <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              {actionLabel}
            </Button>
          </Link>
        ) : onAction ? (
          <Button variant="default" onClick={onAction} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
            {actionLabel}
          </Button>
        ) : null
      )}
    </div>
  )
}
