// API response structures
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    skip: number;
    total: number;
    pages: number;
  };
  newlyUnlocked?: AchievementDocument[];
  newlyCompletedChallenges?: Challenge[];
}

// User profile & preferences
export interface Preferences {
  goal?: string;
  transport?: string;
  energy?: string;
  dietary?: string;
  compactView?: boolean;
  darkMode?: boolean;
  reduceAnimations?: boolean;
  currency?: string;
  measurement?: string;
  theme?: string;
}

export interface UserNotifications {
  emailAlerts?: boolean;
  weeklyReport?: boolean;
  weeklyReports?: boolean;
  pushNotifications?: boolean;
  aiInsights?: boolean;
  challengeUpdates?: boolean;
  marketplaceUpdates?: boolean;
  achievementAlerts?: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role?: string;
  status?: 'active' | 'suspended' | 'deactivated';
  location?: string;
  timezone?: string;
  preferences?: Preferences;
  notifications?: UserNotifications;
  createdAt: string;
  updatedAt: string;
}

// Carbon logs & activities
export interface ActivityDocument {
  _id: string;
  userId: string;
  activityType: string;
  title?: string;
  description?: string;
  carbonEmission: number;
  category: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityDTO {
  title: string;
  activityType: string;
  description?: string;
  carbonEmission: number;
  category: string;
  date: string;
  notes?: string;
}

// Forecast prediction objects
export interface HistoricalSeriesPoint {
  month: string;
  actual: number;
}

export interface PredictionSeriesPoint {
  month: string;
  predicted: number;
}

export interface ForecastInsights {
  insight: string;
  highestRiskArea?: string;
  potentialIncrease?: string;
  potentialReduction?: string;
}

export interface ForecastAction {
  title: string;
  description: string;
  reduction: string | number;
  difficulty: string;
  impact: string;
  applied?: boolean;
}

export interface ForecastData {
  historicalSeries: HistoricalSeriesPoint[];
  predictionSeries: PredictionSeriesPoint[];
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  previousMonth: number;
  currentMonth: number;
  forecastNextMonth: number;
  trendDirection: 'Decreasing' | 'Stable' | 'Increasing';
  aiInsights: ForecastInsights;
  recommendations: ForecastAction[];
  needsGeneration?: boolean;
}

// Recommendation & action arrays
export interface AIRecommendation {
  _id?: string;
  title: string;
  description: string;
  category: string;
  saving?: string;
  estimatedCarbonSaving?: number;
  confidence?: number;
}

export interface AIInsight {
  executiveSummary?: string;
  score: number;
  topEmissionSources?: string[];
  strengths: string[];
  weaknesses: string[];
  riskAssessment?: string;
  monthlyImprovementPlan?: string;
  carbonReductionOpportunities?: string;
  challengeSuggestion: string;
  generatedAt?: string;
}

export interface AICoachResponse {
  insight: AIInsight;
  recommendations: AIRecommendation[];
}

// Simulator scenarios & simulation records
export interface SimulatorScenario {
  _id: string;
  name: string;
  description: string;
  category: string;
  parameters: Record<string, string | number | boolean>;
  icon?: string;
}

export interface SimulationRecord {
  _id: string;
  userId: string;
  scenarioType: string;
  assumptions: {
    reductionFactor: number;
    baseCost: number;
    annualSavings: number;
    targetCategory: string;
  };
  results: {
    currentEmissions: number;
    simulatedEmissions: number;
    carbonReduction: number;
    percentageImprovement: number;
    treesEquivalent: number;
    costEstimate: number;
    annualSavings: number;
    roiEstimate: string;
    aiInsights: {
      environmentalSummary: string;
      longTermBenefits: string[];
      recommendedActions: string[];
      riskReduction: string;
    };
  };
  createdAt: string;
}

// Marketplace project and purchase details
export interface OffsetProject {
  _id: string;
  title: string;
  description: string;
  category: string;
  costPerTon: number;
  availableCredits: number;
  location: string;
  image?: string;
  verifier?: string;
  rating?: string;
}

export interface OffsetPurchase {
  _id: string;
  userId: string;
  projectId: OffsetProject | string;
  projectName: string;
  credits: number;
  totalCost: number;
  certificateUrl?: string;
  createdAt: string;
}

export interface OffsetStats {
  totalCredits: number;
  totalEmissions: number;
  offsetPercentage: number;
  treesEquivalent: number;
}

// Achievement / Challenge
export interface AchievementDocument {
  _id: string;
  title: string;
  description: string;
  badgeIcon: string;
  points: number;
  category: string;
  criteria: Record<string, string | number | boolean>;
  isActive: boolean;
  unlocked: boolean;
  progress: number;
  unlockedAt: string | null;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  category: string;
  carbonGoal: number;
  durationDays: number;
  pointsReward: number;
  participantsCount: number;
  isGlobal: boolean;
  isActive: boolean;
  hasJoined?: boolean;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'achievement' | 'challenge' | 'report' | 'recommendation' | 'system';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  _id: string;
  reportType: string;
  generatedAt: string;
  reportData: {
    summary: { sustainabilityScore: number; totalEmissions: number; netCarbonImpact: number };
    aiInsights: { executiveSummary: string; keyFindings: string[]; improvementOpportunities: string[] };
    offsetContributions: { totalCredits: number; treesEquivalent: number };
    emissionsAnalysis: { categoryBreakdown: { category: string; amount: number; percentage: number; activitiesCount?: number }[] };
    community: { challengesJoined: number; challengesCompleted: number; achievementsEarned: number };
  };
}


