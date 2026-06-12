"use client"

import React from "react"
import { 
  Award, Leaf, Target, Globe, Shield, Zap, 
  TrendingUp, Sparkles, AlertCircle, CheckCircle2, 
  ChevronRight, Calendar, User, FileText, BarChart3,
  Clock, CheckSquare
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, LineChart, Line } from "recharts"

interface MonthlyData {
  month: string
  reduction: number
}

interface ScoreData {
  month: string
  score: number
}

interface ReportProps {
  userName?: string
  date?: string
  reportType?: string
  score?: number
  co2Saved?: string
  achievementsCount?: number
  communityRank?: string
  monthlyData?: MonthlyData[]
  scoreData?: ScoreData[]
}

const defaultMonthlyData = [
  { month: "Jan", reduction: 0.8 },
  { month: "Feb", reduction: 1.2 },
  { month: "Mar", reduction: 1.5 },
  { month: "Apr", reduction: 2.1 },
  { month: "May", reduction: 2.4 },
  { month: "Jun", reduction: 3.1 },
]

const defaultScoreData = [
  { month: "Jan", score: 620 },
  { month: "Feb", score: 650 },
  { month: "Mar", score: 680 },
  { month: "Apr", score: 740 },
  { month: "May", score: 790 },
  { month: "Jun", score: 842 },
]

const forecastData = [
  { month: "Jul", baseline: 10.4, predicted: 10.1, target: 10.0 },
  { month: "Aug", baseline: 10.4, predicted: 9.2, target: 9.5 },
  { month: "Sep", baseline: 10.4, predicted: 8.5, target: 9.0 },
]

export const ExecutiveReportTemplate = React.forwardRef<HTMLDivElement, ReportProps>((props, ref) => {
  const {
    userName = "Alex Patel",
    date = "June 10, 2026",
    reportType = "Annual Sustainability Report",
    score = 842,
    co2Saved = "12.4 tCO₂e",
    achievementsCount = 14,
    communityRank = "#42",
    monthlyData = defaultMonthlyData,
    scoreData = defaultScoreData,
  } = props

  return (
    <div 
      ref={ref} 
      className="flex flex-col bg-zinc-950 text-zinc-100 font-sans"
      style={{ width: "794px" }} // Explicit A4 width
    >
      {/* ==================== PAGE 1: COVER & EXECUTIVE SUMMARY ==================== */}
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

      {/* ==================== PAGE 2: PERFORMANCE OVERVIEW ==================== */}
      <div 
        id="pdf-page-2"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-zinc-950 relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 01</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">Performance Overview</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Monthly Saved CO₂</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">3.1 <span className="text-xs text-zinc-400 font-normal">tCO₂e</span></p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Leaf className="h-4 w-4" />
              </div>
            </div>
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Sustainability Growth</span>
                <p className="text-xl font-bold text-sky-400 mt-1">+222 <span className="text-xs text-zinc-400 font-normal">pts (35%)</span></p>
              </div>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Goal Progress Rate</span>
                <p className="text-xl font-bold text-amber-400 mt-1">78% <span className="text-xs text-zinc-400 font-normal">Avg</span></p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Target className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-900">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Monthly CO₂ Reduction
              </h3>
              <div className="flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl" tabIndex={0} aria-describedby="pdf-bar-summary">
                <span id="pdf-bar-summary" className="sr-only">
                  Monthly CO2 reduction chart. Total reduction over the last period is tracked.
                  Current reduction is {monthlyData[monthlyData.length - 1]?.reduction || 0} tonnes.
                </span>
                <BarChart role="img" aria-label="Monthly Emissions Chart" width={300} height={200} data={monthlyData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} />
                  <Bar dataKey="reduction" fill="#10b981" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </div>
              <p className="text-[10px] text-zinc-500 mt-3 text-center">Tonnes of carbon saved per month over latest period</p>
            </div>

            <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-900">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-500"></span> Sustainability Score Trend
              </h3>
              <div className="flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl" tabIndex={0} aria-describedby="pdf-area-summary">
                <span id="pdf-area-summary" className="sr-only">
                  Sustainability score trend chart. 
                  Latest score is {scoreData[scoreData.length - 1]?.score || 0}.
                </span>
                <AreaChart role="img" aria-label="Score History Chart" width={300} height={200} data={scoreData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="pdfScoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} domain={['dataMin - 50', 'dataMax + 50']} />
                  <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#pdfScoreGrad)" isAnimationActive={false} />
                </AreaChart>
              </div>
              <p className="text-[10px] text-zinc-500 mt-3 text-center">Progression of overall sustainability scoring</p>
            </div>
          </div>

          {/* Goal Progress Section */}
          <div className="bg-zinc-900/20 p-5 rounded-2xl border border-zinc-900 space-y-4">
            <h3 className="text-sm font-bold text-white">Active Goals Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-medium">Shift Servers to Green hosting</span>
                  <span className="text-emerald-400 font-bold">80%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-medium">Implement Smart Thermostats</span>
                  <span className="text-emerald-400 font-bold">65%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-medium">Optimize E-Bike Fleet Logistics</span>
                  <span className="text-emerald-400 font-bold">45%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span>Sustainability Performance Report</span>
          <span>Page 2 of 7</span>
        </div>
      </div>

      {/* ==================== PAGE 3: AI INSIGHTS ==================== */}
      <div 
        id="pdf-page-3"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-zinc-950 relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 02</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">AI Insights & Diagnostics</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          {/* Engine Summary Card */}
          <div className="bg-gradient-to-r from-emerald-950/20 via-zinc-900/40 to-zinc-900/40 p-5 rounded-2xl border border-emerald-900/20 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Diagnostic Engine Active
              </span>
              <h3 className="text-base font-bold text-white">AI Copilot Recommendation System</h3>
              <p className="text-xs text-zinc-400">Analysis run completed over 12 operational datasets. Recommended priorities ranked below.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 font-medium">Confidence Score</span>
              <p className="text-2xl font-black text-emerald-400">94%</p>
            </div>
          </div>

          {/* Insight Breakdown Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top Improvement Area */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div className="absolute top-0 right-0 p-3 text-emerald-500/20">
                <TrendingUp className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">Top Improvement Area</span>
                <h4 className="text-lg font-bold text-white mt-1">Transportation Systems</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Active transit and logistics routing updates contributed a massive 4.2 tCO₂e reduction. E-Bike commute tracking holds further potential.
                </p>
              </div>
              <div className="flex items-center text-xs text-emerald-400 font-semibold gap-1">
                <span>View roadmap details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Top Achievement */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div className="absolute top-0 right-0 p-3 text-amber-500/20">
                <Award className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold">Top Achievement</span>
                <h4 className="text-lg font-bold text-white mt-1">Energy Saver Elite</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Achieved 20% carbon reduction in office environment by deploying smart heating, smart thermostats, and scheduled operations.
                </p>
              </div>
              <div className="flex items-center text-xs text-amber-400 font-semibold gap-1">
                <span>View unlock details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Biggest Emission Hotspot */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div className="absolute top-0 right-0 p-3 text-rose-500/20">
                <AlertCircle className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-bold">Biggest Hotspot</span>
                <h4 className="text-lg font-bold text-white mt-1">Server Hosting Platforms</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Legacy data centers represent 42% of remaining scope-3 carbon footprints. Server locations should be migrated to carbon-free grids immediately.
                </p>
              </div>
              <div className="flex items-center text-xs text-rose-400 font-semibold gap-1">
                <span>Analyze mitigation options</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Forecast Summary */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between h-[200px]">
              <div className="absolute top-0 right-0 p-3 text-sky-500/20">
                <Zap className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-bold">Forecast Summary</span>
                <h4 className="text-lg font-bold text-white mt-1">-18% Emissions Projected</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Model forecasts that executing the three high-priority actions next quarter will lead to an 18% overall emission reduction.
                </p>
              </div>
              <div className="flex items-center text-xs text-sky-400 font-semibold gap-1">
                <span>View predictive model</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span>AI Insights & Diagnostics</span>
          <span>Page 3 of 7</span>
        </div>
      </div>

      {/* ==================== PAGE 4: FORECASTING ANALYSIS ==================== */}
      <div 
        id="pdf-page-4"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-zinc-950 relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 03</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">Forecasting Analysis</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 space-y-3">
                <h3 className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Predictive Parameters</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Predicted Next Qtr</span>
                    <span className="text-emerald-400 font-extrabold">8.5 tCO₂e</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Current Qtr Rate</span>
                    <span className="text-zinc-300 font-bold">10.4 tCO₂e</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Forecast Confidence</span>
                    <span className="text-emerald-400 font-bold">94% Stable</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 space-y-3">
                <h3 className="text-xs uppercase text-zinc-400 font-bold tracking-wider">Reduction Opportunities</h3>
                
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-zinc-200">Transportation Optimization</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Route mapping & vehicle shifts</p>
                    </div>
                    <span className="text-emerald-400 font-bold">-0.35 t</span>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-zinc-200">Energy Optimization</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Green computing grids</p>
                    </div>
                    <span className="text-emerald-400 font-bold">-0.42 t</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-3 bg-zinc-900/30 p-5 rounded-2xl border border-zinc-900 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Predicted Quarterly Trajectory</h3>
                <p className="text-xs text-zinc-500 mb-4">Baseline vs Predicted vs Target emissions (tCO₂e)</p>
              </div>

              <div className="flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none rounded-xl" tabIndex={0} aria-describedby="pdf-forecast-summary">
                <span id="pdf-forecast-summary" className="sr-only">
                  Predictive emissions line chart showing Baseline vs Target vs Predicted trajectory.
                </span>
                <LineChart role="img" aria-label="Forecasting Chart" width={340} height={200} data={forecastData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717a" }} domain={[6, 12]} />
                  <Line type="monotone" dataKey="baseline" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="target" stroke="#0ea5e9" strokeWidth={1.5} strokeDasharray="3 3" dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2.5} dot={{ stroke: '#10b981', strokeWidth: 2, r: 3 }} isAnimationActive={false} />
                </LineChart>
              </div>

              <div className="flex gap-4 justify-center text-[10px] text-zinc-400 pt-2">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-3 bg-rose-500 inline-block rounded-full"></span>
                  <span>Baseline (10.4t)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-3 bg-sky-500 inline-block rounded-full"></span>
                  <span>Target (9.0t)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-3 bg-emerald-500 inline-block rounded-full"></span>
                  <span>Predicted (8.5t)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span>Predictive Emissions & Forecast Models</span>
          <span>Page 4 of 7</span>
        </div>
      </div>

      {/* ==================== PAGE 5: ACHIEVEMENTS & CHALLENGES ==================== */}
      <div 
        id="pdf-page-5"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-zinc-950 relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 04</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">Achievements & Engagement</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          {/* Gamification Summary Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Total Badges</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">14 / 20</p>
            </div>
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Community Rank</span>
              <p className="text-xl font-bold text-sky-400 mt-1">#42 (Top 5%)</p>
            </div>
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Saved by Community</span>
              <p className="text-xl font-bold text-teal-400 mt-1">1.2 tCO₂e</p>
            </div>
          </div>

          {/* Completed Achievements List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Highlighted Achievements</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-start gap-3">
                <div className="p-2 rounded bg-amber-500/10 text-amber-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-200">First Step</span>
                    <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded uppercase font-bold">Common</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Completed first carbon offset. Unlocked on January 12, 2026.</p>
                </div>
              </div>

              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-start gap-3">
                <div className="p-2 rounded bg-sky-500/10 text-sky-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-200">Energy Saver</span>
                    <span className="text-[8px] bg-sky-950 text-sky-400 px-1 py-0.2 rounded uppercase font-bold">Rare</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Maintained a 20% reduction in power consumption. Unlocked on February 10, 2026.</p>
                </div>
              </div>

              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-start gap-3">
                <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-200">Water Guardian</span>
                    <span className="text-[8px] bg-indigo-950 text-indigo-400 px-1 py-0.2 rounded uppercase font-bold">Epic</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Reduced operational water footprint by 30%. Unlocked on March 20, 2026.</p>
                </div>
              </div>

              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex items-start gap-3">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-200">Carbon Neutral</span>
                    <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 py-0.2 rounded uppercase font-bold">Legendary</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Fully offset operations carbon for 1 month. Unlocked on May 05, 2026.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Challenges */}
          <div className="bg-zinc-900/20 p-5 rounded-2xl border border-zinc-900 space-y-4">
            <h3 className="text-sm font-bold text-white">Active Challenges & Team Goals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-semibold">Zero Waste Week</span>
                  <span className="text-emerald-400 font-bold">75%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-[10px] text-zinc-500">Eliminate plastic packaging. 3 days remaining.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-semibold">Commute Green Challenge</span>
                  <span className="text-emerald-400 font-bold">60%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "60%" }}></div>
                </div>
                <p className="text-[10px] text-zinc-500">Use public transit or e-bikes. 4 days remaining.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span>Achievements Journey & Gamification Metrics</span>
          <span>Page 5 of 7</span>
        </div>
      </div>

      {/* ==================== PAGE 6: RECOMMENDED ACTION PLAN ==================== */}
      <div 
        id="pdf-page-6"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-800 bg-zinc-950 relative overflow-hidden"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 05</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">Recommended Action Plan</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            AI recommendations custom-generated based on current operational profile. Execute the roadmap below to maximize emission reduction and achieve carbon neutrality targets.
          </p>

          {/* Action Plan Breakdown */}
          <div className="space-y-4">
            {/* Priority 1 */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-bold">Priority 1 (High Impact)</span>
                <h4 className="text-base font-bold text-white mt-1">Shift Server Compute Load to Green Regions</h4>
                <p className="text-xs text-zinc-400">Migrate intensive cloud jobs to regions operating on 100% renewable power grids (e.g. Iceland, Sweden).</p>
              </div>
              <div className="text-right whitespace-nowrap space-y-1">
                <div className="text-xs font-semibold text-zinc-500">Expected Reduction</div>
                <div className="text-base font-bold text-emerald-400">-0.80 tCO₂e</div>
                <div className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/20 inline-block font-bold">+15 Score Pts</div>
              </div>
            </div>

            {/* Priority 2 */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold">Priority 2 (Medium Impact)</span>
                <h4 className="text-base font-bold text-white mt-1">Introduce Active Transit & E-Bike Commute Incentives</h4>
                <p className="text-xs text-zinc-400">Provide staff subsidies for e-bikes and reward non-automotive commutes through gamified logs.</p>
              </div>
              <div className="text-right whitespace-nowrap space-y-1">
                <div className="text-xs font-semibold text-zinc-500">Expected Reduction</div>
                <div className="text-base font-bold text-emerald-400">-0.50 tCO₂e</div>
                <div className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/20 inline-block font-bold">+10 Score Pts</div>
              </div>
            </div>

            {/* Priority 3 */}
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-bold">Priority 3 (Medium Impact)</span>
                <h4 className="text-base font-bold text-white mt-1">Install Smart Zonal HVAC Thermostats</h4>
                <p className="text-xs text-zinc-400">Implement scheduled micro-zone climate controllers to reduce off-hour heating and cooling consumption.</p>
              </div>
              <div className="text-right whitespace-nowrap space-y-1">
                <div className="text-xs font-semibold text-zinc-500">Expected Reduction</div>
                <div className="text-base font-bold text-emerald-400">-0.35 tCO₂e</div>
                <div className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/20 inline-block font-bold">+8 Score Pts</div>
              </div>
            </div>
          </div>

          {/* Action Plan Summary Card */}
          <div className="bg-gradient-to-r from-emerald-950/30 to-teal-950/30 p-5 rounded-2xl border border-emerald-900/40 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-white">Action Plan Summary</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Projected results upon full implementation of Priorities 1, 2 & 3.</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Total Reduction</span>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">-1.65 tCO₂e/Qtr</p>
              </div>
              <div className="text-center border-l border-zinc-800 pl-6">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Score Projection</span>
                <p className="text-xl font-extrabold text-sky-400 mt-0.5">875 (+33 pts)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span>AI Recommendations & Priority Roadmaps</span>
          <span>Page 6 of 7</span>
        </div>
      </div>

      {/* ==================== PAGE 7: VERIFICATION & IMPACT ==================== */}
      <div 
        id="pdf-page-7"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-900 bg-zinc-950 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 06</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">Verification & Impact</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left side details */}
            <div className="space-y-4">
              <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-900 space-y-3">
                <h3 className="text-sm font-bold text-white">Carbon Offset Contributions</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Offset purchases are certified and logged under official carbon registry systems.
                </p>
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Retired Quantity</span>
                    <span className="text-zinc-200 font-semibold">5.2 tonnes</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Registry Standard</span>
                    <span className="text-emerald-400 font-semibold">Gold Standard (GS)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Project Name</span>
                    <span className="text-zinc-200 font-semibold truncate max-w-[150px]">Rimba Raya Biodiversity</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Registry ID</span>
                    <span className="text-zinc-300 font-semibold">GS-492-A9F</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-900 space-y-3">
                <h3 className="text-sm font-bold text-white">Audit Status & Standards</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Compliance and calculations are verified in real-time by the CarbonSphere Trust Engine using audited emission protocols.
                </p>
                <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-900/20 px-3 py-2 rounded-lg text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Verified ESG Audit Certificate Active</span>
                </div>
              </div>
            </div>

            {/* Right side verification badge / presentation layout */}
            <div className="bg-zinc-900/20 p-6 rounded-2xl border border-zinc-900 flex flex-col justify-between items-center text-center">
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">OFFICIAL SECURITY CERTIFICATION</span>
                <h4 className="text-base font-bold text-white">Trust Stamp</h4>
              </div>

              {/* Certificate badge visual */}
              <div className="my-6 relative flex items-center justify-center">
                {/* Visual glow circles */}
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
                <div className="h-32 w-32 rounded-full border-4 border-dashed border-emerald-500/30 flex items-center justify-center relative bg-zinc-950">
                  <div className="h-24 w-24 rounded-full border-2 border-emerald-500 flex flex-col items-center justify-center p-2 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <Shield className="h-8 w-8 text-emerald-400" />
                    <span className="text-[8px] font-black text-emerald-400 tracking-wider uppercase mt-1">VERIFIED</span>
                    <span className="text-[6px] text-zinc-400">AUDIT TIER 3</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-300">CarbonSphere Trust Engine</p>
                <p className="text-[9px] text-zinc-500">Cryptographically signed sustainability audit record</p>
              </div>
            </div>
          </div>

          {/* Verification Audit Signatures & Digital Trace */}
          <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 grid grid-cols-2 gap-4 text-xs font-mono text-zinc-500">
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase font-sans mb-1">Audit Record Signature</p>
              <p className="truncate">CS_SIGN_BLOCK::f7b9c2837d7a18e9a2b34</p>
              <p className="mt-1">Generated: 2026-06-10 13:37:39 UTC</p>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <p className="text-[10px] text-zinc-400 font-bold uppercase font-sans mb-1">Unique Report Signature</p>
              <p>Report ID: CS-REP-2026-8F8D2B</p>
              <p className="mt-1">Standard: Protocol v1.42 (ESG-Ready)</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span className="italic">Report Generated by CarbonSphere AI</span>
          <span>Page 7 of 7</span>
        </div>
      </div>
    </div>
  )
})

ExecutiveReportTemplate.displayName = "ExecutiveReportTemplate"
