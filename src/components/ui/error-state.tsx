import React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border rounded-xl border-rose-200 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-950/20 animate-in fade-in duration-500", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-rose-700 dark:text-rose-400 mb-1">{title}</h3>
      <p className="text-sm text-rose-600/80 dark:text-rose-400/80 max-w-sm mb-5">{message}</p>
      
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry} 
          className="border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  )
}
