export const DEMO_USER = {
  user: {
    _id: "demo-user-id",
    name: "Demo Explorer",
    email: "demo@carbonsphere.ai",
    avatar: "",
    bio: "Passionate about sustainability and reducing my carbon footprint.",
    joinedAt: "2023-01-15T00:00:00.000Z",
    totalCarbonSaved: 1250.5,
    currentStreak: 12,
    longestStreak: 45,
    level: 8,
    achievements: ["First Log", "7 Day Streak", "Carbon Saver", "Eco Warrior", "Tree Hugger"],
    completedChallenges: ["Week 1: Meatless Mondays", "Month 1: Commute by Bike"]
  }
};

export const DEMO_ACTIVITY_STATS = {
  totalCarbon: 4250.8,
  monthlyAverage: 350.5,
  topCategory: "Transport",
  recentTrend: -5.2,
  history: [
    { month: "Jan", carbon: 400 },
    { month: "Feb", carbon: 380 },
    { month: "Mar", carbon: 420 },
    { month: "Apr", carbon: 350 },
    { month: "May", carbon: 360 },
    { month: "Jun", carbon: 310 }
  ]
};

export const DEMO_ACTIVITIES = {
  activities: [
    {
      _id: "act-1",
      title: "Roundtrip Flight to NYC",
      activityType: "Flight",
      description: "Business trip.",
      carbonEmission: 500,
      category: "Transport",
      date: new Date().toISOString()
    },
    {
      _id: "act-2",
      title: "Monthly Electricity",
      activityType: "Grid Energy",
      description: "Home office electricity.",
      carbonEmission: 150,
      category: "Energy",
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: "act-3",
      title: "Vegan Meals",
      activityType: "Diet",
      description: "Switched to plant-based for a week.",
      carbonEmission: 21,
      category: "Food",
      date: new Date(Date.now() - 172800000).toISOString()
    }
  ],
  total: 3,
  page: 1,
  pages: 1
};

export const DEMO_CHALLENGES = {
  active: [
    { _id: "chal-1", title: "Zero Waste Week", description: "Produce zero landfill waste for 7 days.", progress: 50, rewardPoints: 100, category: "Lifestyle", difficulty: "medium", startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000 * 7).toISOString(), targetValue: 7, isActive: true, icon: "Leaf", color: "bg-emerald-500", joined: true }
  ],
  completed: [
    { _id: "chal-2", title: "Carpool Month", description: "Share rides to work 10 times.", progress: 100, rewardPoints: 300, category: "Transport", difficulty: "hard", startDate: new Date(Date.now() - 86400000 * 30).toISOString(), endDate: new Date().toISOString(), targetValue: 10, isActive: false, icon: "Car", color: "bg-blue-500", joined: true, completed: true }
  ],
  upcoming: [],
  available: [
    { _id: "chal-3", title: "Solar Power Transition", description: "Install solar panels or switch to a green energy plan.", rewardPoints: 500, category: "Energy", difficulty: "hard", startDate: new Date(Date.now() + 86400000 * 5).toISOString(), endDate: new Date(Date.now() + 86400000 * 35).toISOString(), targetValue: 1, isActive: true, icon: "Sun", color: "bg-amber-500", joined: false }
  ],
  stats: {
    challengesJoined: 3,
    challengesCompleted: 1,
    pointsEarned: 300
  }
};

export const DEMO_COMMUNITY = {
  leaderboard: [
    { _id: "u-1", name: "Sarah Green", avatar: "", score: 15420, rank: 1 },
    { _id: "u-2", name: "Demo Explorer", avatar: "", score: 12500, rank: 2 },
    { _id: "u-3", name: "Mike Eco", avatar: "", score: 9800, rank: 3 }
  ],
  feed: [
    { _id: "p-1", user: "Sarah Green", content: "Just reached 15k carbon points! Switched to full solar. ☀️", likes: 45, time: "2h ago" },
    { _id: "p-2", user: "Mike Eco", content: "Completed the 'Zero Waste Week' challenge! It was tough but rewarding.", likes: 32, time: "5h ago" }
  ]
};

export const DEMO_REPORTS = [
  { _id: "rep-1", title: "Q1 Sustainability Impact", date: "2024-04-01", type: "Quarterly", carbonSaved: 450, documentUrl: "#" },
  { _id: "rep-2", title: "2023 Annual CSR", date: "2024-01-15", type: "Annual", carbonSaved: 1800, documentUrl: "#" }
];

export const DEMO_OFFSETS = [
  { _id: "off-1", title: "Amazon Reforestation", category: "Forestry", location: "Brazil", costPerTon: 50, description: "Reforestation of the Amazon.", rating: "A+", availableCredits: 1000, provider: "EcoTrust", status: "Active" },
  { _id: "off-2", title: "Texas Wind Farm", category: "Renewable", location: "USA", costPerTon: 20, description: "Wind power.", rating: "B", availableCredits: 500, provider: "CleanEnergy", status: "Completed" }
];

export const DEMO_COACH = {
  insight: {
    executiveSummary: "You are doing great on reducing meat consumption, but your transport emissions remain a primary area for improvement.",
    score: 85,
    topEmissionSources: ["Flights", "Car Commute"],
    strengths: ["Plant-based diet", "Renewable energy usage"],
    weaknesses: ["Frequent short-haul flights"],
    riskAssessment: "Medium",
    monthlyImprovementPlan: "Reduce flights by 1 this month.",
    carbonReductionOpportunities: "15% reduction possible.",
    challengeSuggestion: "Join the No-Fly Month Challenge!",
    generatedAt: new Date().toISOString()
  },
  recommendations: [
    { id: "rec-1", title: "Optimize Home Heating", description: "Lowering your thermostat by 2 degrees can save 15% on energy.", category: "Energy", impact: "High", estimatedCarbonSaving: 200 },
    { id: "rec-2", title: "Switch to EV", description: "Your transport emissions are high. Consider an EV.", category: "Transport", impact: "Very High", estimatedCarbonSaving: 1500 },
    { id: "rec-3", title: "Local Produce", description: "Buying local reduces transport emissions.", category: "Food", impact: "Medium", estimatedCarbonSaving: 50 }
  ]
};

export const DEMO_FORECAST = {
  historicalSeries: [
    { month: "Jan", actual: 600 },
    { month: "Feb", actual: 550 },
    { month: "Mar", actual: 520 },
    { month: "Apr", actual: 480 },
    { month: "May", actual: 450 },
    { month: "Jun", actual: 420 }
  ],
  predictionSeries: [
    { month: "Jul", predicted: 400 },
    { month: "Aug", predicted: 380 },
    { month: "Sep", predicted: 350 }
  ],
  riskLevel: "MEDIUM",
  previousMonth: 450,
  currentMonth: 420,
  forecastNextMonth: 400,
  trendDirection: "Decreasing",
  aiInsights: {
    insight: "Your carbon footprint is consistently decreasing. Keep it up!",
    highestRiskArea: "Transport",
    potentialIncrease: "If you take the planned flight in August, emissions will spike."
  },
  actionPlan: [
    { title: "Switch to EV", reduction: 1500, difficulty: "Hard", impact: "High" }
  ]
};

export const DEMO_DASHBOARD_SUMMARY = {
  totalActivities: 142,
  totalCarbon: 12500,
  sustainabilityScore: 85,
  currentMonthCarbon: 420.5,
  currentWeekCarbon: 110.2,
  totalAchievementsUnlocked: 15,
  activeChallengesCount: 3,
  completedChallengesCount: 12,
  aiInsight: {
    score: 85,
    topEmissionSources: ["Transport", "Grid Energy"],
    strengths: ["Consistent logging", "Low diet emissions"],
    weaknesses: ["High transport emissions"],
    challengeSuggestion: "Join the Carpool Month Challenge to lower transport emissions!"
  }
};

export const DEMO_DASHBOARD_ANALYTICS = {
  carbonTrend: [
    { month: "Jan", totalCarbon: 600, activitiesCount: 10 },
    { month: "Feb", totalCarbon: 550, activitiesCount: 12 },
    { month: "Mar", totalCarbon: 520, activitiesCount: 15 },
    { month: "Apr", totalCarbon: 480, activitiesCount: 18 },
    { month: "May", totalCarbon: 450, activitiesCount: 20 },
    { month: "Jun", totalCarbon: 420.5, activitiesCount: 22 }
  ],
  monthlyTotals: [
    { month: "Jan", totalCarbon: 600, activitiesCount: 10 },
    { month: "Feb", totalCarbon: 550, activitiesCount: 12 },
    { month: "Mar", totalCarbon: 520, activitiesCount: 15 },
    { month: "Apr", totalCarbon: 480, activitiesCount: 18 },
    { month: "May", totalCarbon: 450, activitiesCount: 20 },
    { month: "Jun", totalCarbon: 420.5, activitiesCount: 22 }
  ],
  categoryBreakdown: [
    { category: "Transport", totalCarbon: 5000 },
    { category: "Energy", totalCarbon: 4000 },
    { category: "Food", totalCarbon: 2000 },
    { category: "Shopping", totalCarbon: 1500 }
  ],
  recentActivities: [
    {
      _id: "act-1",
      activityType: "Flight",
      title: "Roundtrip Flight to NYC",
      description: "Business trip.",
      carbonEmission: 500,
      category: "Transport",
      date: new Date().toISOString()
    },
    {
      _id: "act-2",
      activityType: "Grid Energy",
      title: "Monthly Electricity",
      description: "Home office electricity.",
      carbonEmission: 150,
      category: "Energy",
      date: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};
