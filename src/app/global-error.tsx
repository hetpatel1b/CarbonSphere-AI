"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Layout Error Boundary caught an error:", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center', border: '1px solid #fecdd3', borderRadius: '1rem', backgroundColor: '#fff1f2', color: '#e11d48' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Something went wrong</h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', opacity: 0.8 }}>
              {error.message || "A critical error occurred while loading the application."}
            </p>
            <button
              onClick={() => {
                reset()
                setTimeout(() => window.location.reload(), 500)
              }}
              style={{ padding: '0.5rem 1rem', border: '1px solid #fda4af', borderRadius: '0.375rem', backgroundColor: 'transparent', color: '#be123c', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
