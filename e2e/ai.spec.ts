import { test, expect } from '@playwright/test';

// Mock responses
const mockInsight = {
  insight: {
    score: 85,
    strengths: ["Great public transport usage"],
    weaknesses: ["High electricity usage"],
    executiveSummary: "Test Summary",
    monthlyImprovementPlan: "Test Plan",
    carbonReductionOpportunities: "100kg",
    challengeSuggestion: "Use cold water",
    riskAssessment: "Low risk",
    topEmissionSources: ["Energy"]
  },
  recommendations: [
    {
      category: "Energy",
      title: "Switch to LEDs",
      description: "Use LED bulbs",
      estimatedCarbonSaving: "50",
      saving: "50kg",
      confidence: 95
    }
  ],
  generatedAt: new Date().toISOString()
};

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Credentials': 'true',
};

test.describe('AI Capabilities', () => {
  test.beforeEach(async ({ page }) => {
    // Catch-all to prevent real backend 401s from crashing the test via apiClient redirects
    await page.route('**/api/**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            ...corsHeaders,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
          }
        });
        return;
      }
      await route.fulfill({ headers: corsHeaders, json: { success: true, data: [] } });
    });

    // Specific mocks take precedence because they are registered later
    await page.route('**/api/csrf-token', async route => {
      if (route.request().method() === 'OPTIONS') return route.fallback();
      await route.fulfill({ headers: corsHeaders, json: { csrfToken: 'mock-csrf-token', success: true } });
    });
    
    await page.route('**/api/auth/me', async route => {
      if (route.request().method() === 'OPTIONS') return route.fallback();
      await route.fulfill({ headers: corsHeaders, json: { user: { _id: 'test', name: 'Test User' }, success: true } });
    });

    // Navigate to /login first so we are on the correct origin to set cookies/storage without triggering AuthGuard redirects
    await page.goto('/login');
    
    await page.evaluate(() => {
      document.cookie = "token=test-token; path=/;";
      window.localStorage.setItem('user', JSON.stringify({ _id: 'test', name: 'Test User', email: 'test@test.com' }));
    });
  });

  test.describe('AI Coach Flows', () => {
    test('AI Coach Success Flow - Loads initial data', async ({ page }) => {
      await page.route('**/api/ai-coach/latest', async route => {
        if (route.request().method() === 'OPTIONS') return route.fallback();
        await route.fulfill({ headers: corsHeaders, json: { success: true, data: mockInsight } });
      });

      await page.goto('/ai-coach');
      await expect(page.getByText('AI Coach Workspace')).toBeVisible();
      
      // Verify data is loaded
      await expect(page.getByText('Test Summary')).toBeVisible();
      await expect(page.getByText('Great public transport usage')).toBeVisible();
      await expect(page.getByText('Switch to LEDs')).toBeVisible();
    });

    test('AI Coach Loading & Generation Flow', async ({ page }) => {
      // Return empty initially
      await page.route('**/api/ai-coach/latest', async route => {
        if (route.request().method() === 'OPTIONS') return route.fallback();
        await route.fulfill({ headers: corsHeaders, json: { success: true, data: { insight: null, recommendations: [] } } });
      });
      
      await page.goto('/ai-coach');
      await expect(page.getByText('No AI Analysis Available')).toBeVisible();

      // Intercept generate endpoint with delay
      await page.route('**/api/ai-coach/analyze', async route => {
        if (route.request().method() === 'OPTIONS') return route.fallback();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({ headers: corsHeaders, json: { success: true, data: mockInsight } });
      });

      // Click Generate
      const generateBtn = page.getByRole('button', { name: /Generate New Analysis/i });
      await generateBtn.click();

      // Verify Loading State
      await expect(page.getByRole('button', { name: /Groq AI is generating/i })).toBeVisible();

      // Verify Success Result replaces loading
      await expect(page.getByText('Test Summary')).toBeVisible();
    });

    test('AI Coach Error & Retry Flow', async ({ page }) => {
      let requestCount = 0;
      await page.route('**/api/ai-coach/latest', async route => {
        if (route.request().method() === 'OPTIONS') return route.fallback();
        requestCount++;
        if (requestCount === 1) {
          await route.fulfill({ status: 500, headers: corsHeaders, json: { message: 'Groq Rate Limit Exceeded' } });
        } else {
          await route.fulfill({ headers: corsHeaders, json: { success: true, data: mockInsight } });
        }
      });

      await page.goto('/ai-coach');
      
      // Verify Error State
      await expect(page.getByText('Failed to run AI Coach')).toBeVisible();
      await expect(page.getByText('Groq Rate Limit Exceeded')).toBeVisible();

      // Click Retry
      await page.getByRole('button', { name: /Retry/i }).click();

      // Verify Recovery
      await expect(page.getByText('Test Summary')).toBeVisible();
    });
  });

  test.describe('AI Assistant Flows', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/assistant');
      await expect(page.getByText('AI Sustainability Assistant')).toBeVisible();
    });

    test('Assistant Empty Prompt Validation', async ({ page }) => {
      const input = page.getByPlaceholder('Ask about reducing your footprint...');
      const submitBtn = page.locator('form button[type="submit"]');

      // Should be disabled initially
      await expect(submitBtn).toBeDisabled();

      // Should enable when typing
      await input.fill('Hello');
      await expect(submitBtn).toBeEnabled();

      // Should disable when cleared
      await input.fill('');
      await expect(submitBtn).toBeDisabled();
      
      // Should disable with only spaces
      await input.fill('   ');
      await expect(submitBtn).toBeDisabled();
    });

    test('Assistant Prompt Submission & Loading State', async ({ page }) => {
      const input = page.getByPlaceholder('Ask about reducing your footprint...');
      const submitBtn = page.locator('form button[type="submit"]');

      await page.route('**/api/assistant/chat', async route => {
        if (route.request().method() === 'OPTIONS') return route.fallback();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({ headers: corsHeaders, json: { 
          data: {
            content: 'I can help you reduce your carbon footprint.',
            impact: 'High',
            actionability: 90
          }
        }});
      });

      await input.fill('How can I reduce emissions?');
      await submitBtn.click();

      // Verify input clears
      await expect(input).toHaveValue('');

      // Verify user message appears
      await expect(page.getByText('How can I reduce emissions?')).toBeVisible();

      // Verify Loading State
      await expect(page.getByText('Thinking...')).toBeVisible();

      // Verify AI Response
      await expect(page.getByText('I can help you reduce your carbon footprint.')).toBeVisible();
      
      // Verify Tags
      await expect(page.getByText('High Impact')).toBeVisible();
      await expect(page.getByText('Actionability 90%')).toBeVisible();
    });

    test('Groq Failure Handling', async ({ page }) => {
      const input = page.getByPlaceholder('Ask about reducing your footprint...');
      const submitBtn = page.locator('form button[type="submit"]');

      await page.route('**/api/assistant/chat', async route => {
        if (route.request().method() === 'OPTIONS') return route.fallback();
        await route.fulfill({ status: 500, headers: corsHeaders, json: { message: 'Groq AI Service Unavailable' } });
      });

      await input.fill('Will this fail?');
      await submitBtn.click();

      // Playwright should be able to see the sonner toast error
      await expect(page.getByText('Groq AI Service Unavailable')).toBeVisible();
    });
  });
});
