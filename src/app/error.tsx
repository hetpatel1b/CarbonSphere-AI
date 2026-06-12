"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/ui/error-state"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught an error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <ErrorState 
        title="Something went wrong"
        message={error.message || "An unexpected error occurred. Please try again."}
        onRetry={() => {
          reset()
          // Fallback reload if reset fails
          setTimeout(() => {
            if (typeof window !== 'undefined') window.location.reload()
          }, 500)
        }}
        className="max-w-md w-full shadow-lg"
      />
    </div>
  )
}
