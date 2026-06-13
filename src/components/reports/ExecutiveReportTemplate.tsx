"use client"

import React from "react"
import { ReportProps } from "./types"
import { CoverPage } from "./pages/CoverPage"
import { PerformanceOverviewPage } from "./pages/PerformanceOverviewPage"
import { AIInsightsPage } from "./pages/AIInsightsPage"
import { ForecastingAnalysisPage } from "./pages/ForecastingAnalysisPage"
import { AchievementsPage } from "./pages/AchievementsPage"
import { ActionPlanPage } from "./pages/ActionPlanPage"
import { VerificationPage } from "./pages/VerificationPage"

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
      style={{ width: "794px" }}
    >
      <CoverPage userName={userName} date={date} reportType={reportType} score={score} co2Saved={co2Saved} achievementsCount={achievementsCount} communityRank={communityRank} />
      <PerformanceOverviewPage monthlyData={monthlyData} scoreData={scoreData} />
      <AIInsightsPage />
      <ForecastingAnalysisPage forecastData={forecastData} />
      <AchievementsPage />
      <ActionPlanPage />
      <VerificationPage />
    </div>
  )
})

ExecutiveReportTemplate.displayName = "ExecutiveReportTemplate"
