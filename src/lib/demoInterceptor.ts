import * as demoData from './demoData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function handleDemoRequest(method: string, path: string, body?: unknown): Promise<any> {
  await delay(300); // Simulate network latency

  const normalizedPath = path.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', '').split('?')[0];

  // Auth
  if (normalizedPath === '/auth/me') return demoData.DEMO_USER;
  if (normalizedPath === '/auth/login') return { token: 'demo-token', user: demoData.DEMO_USER.user };
  if (normalizedPath === '/auth/register') return { token: 'demo-token', user: demoData.DEMO_USER.user };

  // Dashboard
  if (normalizedPath === '/dashboard/summary') return { success: true, data: demoData.DEMO_DASHBOARD_SUMMARY };
  if (normalizedPath === '/dashboard/analytics') return { success: true, data: demoData.DEMO_DASHBOARD_ANALYTICS };

  // Activity
  if (normalizedPath === '/activity/stats') return { success: true, data: demoData.DEMO_ACTIVITY_STATS };
  if (normalizedPath === '/activity') {
    if (method === 'GET') return { success: true, data: demoData.DEMO_ACTIVITIES };
    if (method === 'POST') return { success: true, data: { _id: Date.now().toString(), ...((body as any) || {}) } };
  }
  if (normalizedPath.startsWith('/activity/')) {
    if (method === 'DELETE') return { success: true, message: 'Deleted successfully' };
    if (method === 'PUT') return { success: true, data: { _id: normalizedPath.split('/').pop(), ...((body as any) || {}) } };
  }

  // Reports
  if (normalizedPath === '/reports') return { success: true, data: demoData.DEMO_REPORTS };

  // Marketplace
  if (normalizedPath === '/offset-marketplace') return { success: true, data: demoData.DEMO_OFFSETS };

  // Simulator
  if (normalizedPath === '/simulator/run') return { success: true, data: { currentEmissions: 5000, simulatedEmissions: 3500, reductions: { Transport: 1000, Energy: 500 } } };

  // Forecasting
  if (normalizedPath === '/forecast') return { success: true, data: { predictions: [ { month: 'Jul', carbon: 300 }, { month: 'Aug', carbon: 280 } ], confidence: 85 } };

  // Challenges
  if (normalizedPath === '/challenges/user') return { success: true, data: demoData.DEMO_CHALLENGES.active };
  if (normalizedPath === '/challenges') return { success: true, data: demoData.DEMO_CHALLENGES.available };

  // Community
  if (normalizedPath === '/community/leaderboard') return { success: true, data: demoData.DEMO_COMMUNITY.leaderboard };
  if (normalizedPath === '/community/feed') return { success: true, data: demoData.DEMO_COMMUNITY.feed };

  // AI Coach
  if (normalizedPath === '/assistant/coach') return { success: true, data: demoData.DEMO_COACH.recommendations };
  
  // Settings
  if (normalizedPath === '/settings/profile') {
    if (method === 'GET') return { success: true, data: demoData.DEMO_USER.user };
    if (method === 'PUT') return { success: true, data: { ...demoData.DEMO_USER.user, ...((body as any) || {}) } };
  }

  // Default fallback
  console.warn(`[Demo Mode] Unmocked endpoint: ${method} ${normalizedPath}`);
  return { success: true, data: [] };
}
