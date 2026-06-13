export interface MonthlyData {
  month: string
  reduction: number
}

export interface ScoreData {
  month: string
  score: number
}

export interface ReportProps {
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
