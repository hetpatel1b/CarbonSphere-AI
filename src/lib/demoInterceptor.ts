import * as demoData from './demoData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function handleDemoRequest(method: string, path: string, body?: unknown): Promise<{ success?: boolean; data?: unknown; token?: string; message?: string; user?: unknown; pagination?: unknown }> {
  await delay(300); // Simulate network latency

  const normalizedPath = path.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', '').split('?')[0];

  // Auth
  if (normalizedPath === '/auth/me') return { success: true, data: demoData.DEMO_USER.user };
  if (normalizedPath === '/auth/login') return { token: 'demo-token', user: demoData.DEMO_USER.user };
  if (normalizedPath === '/auth/register') return { token: 'demo-token', user: demoData.DEMO_USER.user };

  // Dashboard
  if (normalizedPath === '/dashboard/summary') return { success: true, data: demoData.DEMO_DASHBOARD_SUMMARY };
  if (normalizedPath === '/dashboard/analytics') return { success: true, data: demoData.DEMO_DASHBOARD_ANALYTICS };

  // Activity
  if (normalizedPath === '/activity/stats') return { success: true, data: demoData.DEMO_ACTIVITY_STATS };
  if (normalizedPath === '/activities') {
    if (method === 'GET') return { success: true, data: demoData.DEMO_ACTIVITIES.activities, pagination: { total: 3, page: 1, pages: 1 } };
    if (method === 'POST') return { success: true, data: { _id: Date.now().toString(), ...((body as Record<string, unknown>) || {}) } };
  }
  if (normalizedPath.startsWith('/activities/')) {
    if (method === 'DELETE') return { success: true, message: 'Deleted successfully' };
    if (method === 'PUT') return { success: true, data: { _id: normalizedPath.split('/').pop(), ...((body as Record<string, unknown>) || {}) } };
    if (method === 'GET') return { success: true, data: demoData.DEMO_ACTIVITIES.activities[0] };
  }

  // Reports
  if (normalizedPath === '/reports') return { success: true, data: demoData.DEMO_REPORTS };

  // Marketplace
  if (normalizedPath === '/offset-marketplace') return { success: true, data: demoData.DEMO_OFFSETS };

  // Simulator
  if (normalizedPath === '/simulator/run') return { success: true, data: { currentEmissions: 5000, simulatedEmissions: 3500, carbonReduction: 1500, percentageImprovement: 30, treesEquivalent: 75, costEstimate: 500, annualSavings: 1200, roiEstimate: "2.5 years", aiInsights: { environmentalSummary: "Significant reduction.", longTermBenefits: ["Cost savings", "Lower impact"], recommendedActions: ["Do it"], riskReduction: "High" } } };

  // Forecasting
  if (normalizedPath === '/forecast/data') return { success: true, data: demoData.DEMO_FORECAST };
  if (normalizedPath === '/forecast/generate') return { success: true, data: demoData.DEMO_FORECAST };

  // Challenges
  if (normalizedPath === '/challenges/status') return { success: true, data: demoData.DEMO_CHALLENGES };
  if (normalizedPath === '/challenges/user') return { success: true, data: demoData.DEMO_CHALLENGES.active };
  if (normalizedPath === '/challenges') return { success: true, data: demoData.DEMO_CHALLENGES.available };

  // Community
  if (normalizedPath === '/community/leaderboard') return { success: true, data: demoData.DEMO_COMMUNITY.leaderboard };
  if (normalizedPath === '/community/feed') return { success: true, data: demoData.DEMO_COMMUNITY.feed };

  // AI Coach
  if (normalizedPath === '/ai-coach/latest') return { success: true, data: demoData.DEMO_COACH };
  if (normalizedPath === '/ai-coach/analyze') return { success: true, data: demoData.DEMO_COACH };
  
  // Settings
  if (normalizedPath === '/settings/profile') {
    if (method === 'GET') return { success: true, data: demoData.DEMO_USER.user };
    if (method === 'PUT') return { success: true, data: { ...demoData.DEMO_USER.user, ...((body as Record<string, unknown>) || {}) } };
  }

  // Default fallback
  console.warn(`[Demo Mode] Unmocked endpoint: ${method} ${normalizedPath}`);
  return { success: true, data: [] };
}
