"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Activity, Bot, Target, TrendingUp, Sparkles } from "lucide-react"

export function OnboardingPanel() {
  return (
    <div className="w-full space-y-6 animate-scale-up" role="region" aria-label="Onboarding Panel">
      
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 bg-zinc-950/20 border border-emerald-500/10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-500" />
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/5 to-sky-500/5 blur-3xl rounded-full" />
        
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 relative z-10">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Getting Started</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground relative z-10">
          Welcome to CarbonSphere AI
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto font-medium relative z-10">
          Your journey to a sustainable future begins here. We need some data to build your footprint analysis. Choose a starting point below.
        </p>
      </div>

      {/* CTA Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Log Activity */}
        <Link 
          href="/log"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Log First Activity"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-200/30 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Activity className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground">Log First Activity</h3>
              <p className="text-xs font-medium text-muted-foreground/90 leading-relaxed">
                Manually record your emissions or connect external integrations to start tracking.
              </p>
            </div>
          </div>
          <div className="relative mt-6 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
            Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </div>
        </Link>

        {/* AI Sustainability Analysis */}
        <Link 
          href="/ai-coach"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-sky-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="Generate AI Sustainability Analysis"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100/50 dark:bg-sky-950/40 border border-sky-200/30 dark:border-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
              <Bot className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground">AI Analysis</h3>
              <p className="text-xs font-medium text-muted-foreground/90 leading-relaxed">
                Generate highly personalized insights and reduction strategies powered by LLMs.
              </p>
            </div>
          </div>
          <div className="relative mt-6 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:gap-2 transition-all">
            Explore AI <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Join Challenge */}
        <Link 
          href="/challenges"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Join Sustainability Challenge"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/50 dark:bg-amber-950/40 border border-amber-200/30 dark:border-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground">Join Challenges</h3>
              <p className="text-xs font-medium text-muted-foreground/90 leading-relaxed">
                Participate in community goals, earn badges, and lower footprints together.
              </p>
            </div>
          </div>
          <div className="relative mt-6 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:gap-2 transition-all">
            View Challenges <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Explore Forecasting */}
        <Link 
          href="/forecasting"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-purple-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          aria-label="Explore Carbon Forecasting"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100/50 dark:bg-purple-950/40 border border-purple-200/30 dark:border-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground">Carbon Forecasting</h3>
              <p className="text-xs font-medium text-muted-foreground/90 leading-relaxed">
                Run predictive simulations to see where your trajectory is heading.
              </p>
            </div>
          </div>
          <div className="relative mt-6 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:gap-2 transition-all">
            See Predictions <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </div>
        </Link>
        
      </div>
    </div>
  )
}
