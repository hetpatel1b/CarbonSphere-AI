import React from "react"
import { Leaf, Sparkles, User, Calendar } from "lucide-react"
import { ReportProps } from "../types"

export const CoverPage: React.FC<ReportProps> = ({ userName, date, reportType, score, co2Saved, achievementsCount, communityRank }) => {
  return (
<div 
        id="pdf-page-1"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 relative overflow-hidden"
      >
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header */}
        <div className="flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20">
              <Leaf className="h-5 w-5 text-black" />
            </div>
            <span className="font-bold tracking-tight text-lg">CarbonSphere <span className="text-emerald-400">AI</span></span>
          </div>
          <span className="text-xs font-semibold tracking-wider text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/30">
            EXECUTIVE REPORT
          </span>
        </div>

        {/* Cover Title */}
        <div className="my-auto flex flex-col gap-6 z-10">
          <div className="space-y-2">
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Sustainability <br />
              Performance Report
            </h1>
            <p className="text-emerald-400 font-medium tracking-wide text-lg">
              {reportType}
            </p>
          </div>

          {/* Large Score Showcase */}
          <div className="flex items-center gap-8 bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/60 max-w-[500px]">
            <div className="flex items-center justify-center h-24 w-24 rounded-full border-4 border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="text-3xl font-extrabold text-emerald-400">{score}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Current Sustainability Score</p>
              <h3 className="text-xl font-bold text-white mt-1">Excellent Performance</h3>
              <p className="text-xs text-zinc-500 mt-1">Top 5% of active global accounts</p>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div className="border-l-4 border-emerald-500 bg-emerald-950/10 p-5 rounded-r-xl max-w-[650px] space-y-2">
            <span className="text-[10px] font-bold tracking-wider text-emerald-400 flex items-center gap-1.5 uppercase">
              <Sparkles className="h-3.5 w-3.5" /> AI Generated Summary
            </span>
            <p className="text-sm italic leading-relaxed text-zinc-300">
              &ldquo;CarbonSphere AI analysis indicates a 18% reduction in emissions over the reporting period. Transportation improvements contributed the largest impact, while renewable energy adoption presents the next major opportunity.&rdquo;
            </p>
          </div>
        </div>

        {/* Highlights and Metadata Footer */}
        <div className="z-10 space-y-8">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Sustainability Score</span>
              <p className="text-xl font-extrabold text-emerald-400 mt-1">{score}</p>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Community Rank</span>
              <p className="text-xl font-extrabold text-sky-400 mt-1">{communityRank}</p>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Total CO₂ Saved</span>
              <p className="text-xl font-extrabold text-teal-400 mt-1">{co2Saved}</p>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Achievements</span>
              <p className="text-xl font-extrabold text-amber-400 mt-1">{achievementsCount} Unlocked</p>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex justify-between items-center text-xs text-zinc-500 pt-6 border-t border-zinc-900">
            <div className="flex gap-6">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-zinc-400" />
                <span>Prepared For: <strong className="text-zinc-300">{userName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                <span>Date: <strong className="text-zinc-300">{date}</strong></span>
              </div>
            </div>
            <span>Page 1 of 7</span>
          </div>
        </div>
      </div>
  )
}
