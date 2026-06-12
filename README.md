# CarbonSphere AI

### Empowering individuals and organizations with AI-driven, actionable sustainability intelligence.

---

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-Llama%203.3-orange?style=for-the-badge)](https://groq.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)

---

## 📌 PROBLEM

Modern sustainability initiatives face significant hurdles at both individual and organizational scales:
* **The Actionability Gap**: Traditional calculators estimate carbon footprints but fail to tell users *how* to lower them. Raw emissions data (e.g., "1.2 tCO₂e") lacks context.
* **Information Overload**: Users are overwhelmed by static guides that do not match their actual daily routines, dietary preferences, or local conditions.
* **Lack of Engagement**: Sustainability goals are rarely sustained without validation, milestones, and peer engagement.
* **Prediction Deficit**: Without forecasting, individuals and businesses cannot anticipate how changes in transport, energy, or dietary habits will impact their carbon footprint over time.

---

## 💡 SOLUTION

**CarbonSphere AI** bridges the actionability gap by converting raw logs into highly personalized, AI-driven carbon abatement strategies. 

### Key Innovation
Instead of static suggestions, CarbonSphere AI uses a **dynamic sustainability engine** powered by Groq Llama 3.3. It analyzes actual logged activities, runs linear-regression forecasting models, simulates prospective scenarios, and constructs custom action plans that adapt as the user logs changes.

---

## 🚀 KEY FEATURES

### 🧠 AI Coach
Analyzes logged carbon inputs to generate executive summaries, highlight top emission sources, map carbon reduction opportunities, and establish a weekly action plan.

### 💬 AI Assistant
A context-aware sustainability assistant that answers queries, suggests habit modifications, and calculates carbon impact on the fly.

### 📝 Carbon Tracking
Supports granular logging across six primary categories: Transport, Energy, Food, Shopping, Waste, and Water.

### 📈 Forecasting
Applies a weighted linear regression model to predict emission trends over a 6-month horizon, mapping actual historical data against future forecasts.

### 🕹️ Sustainability Simulator
An ESG scenario playground where users simulate structural lifestyle adjustments (e.g., installing solar panels, transitioning to an electric vehicle, adapting plant-based diets) to calculate financial ROI and projected emission reductions before implementing them.

### 🏆 Community Challenges & Achievements
A gamified framework hosting global and category-specific challenges. Real-time criteria verification unlocks badges and rewards points.

### 🛒 Offset Marketplace
A registry of verified carbon offset projects. Supports credit purchases, calculates costs per ton, and tracks historical offset credits.

### 📄 Impact Reports
Generates detailed sustainability reports containing scorecards and category breakdowns. Supports client-side PDF export with zero server-side latency.

---

## 🏗️ ARCHITECTURE

```
+--------------------------------------------------------+
|                      FRONTEND                          |
|             Next.js 15 (App Router)                    |
|             React 19 / TypeScript / Tailwind           |
+---------------------------+----------------------------+
                            | (Secure HTTP-Only Cookies)
                            v
+--------------------------------------------------------+
|                      BACKEND                           |
|             Express.js / Node.js                       |
|   (JWT Auth, Rate Limiter, Winston logger, Helmet)     |
+-------------+----------------------------+-------------+
              |                            |
              v                            v
   +--------------------+        +--------------------+
   |     DATABASE       |        |      AI LAYER      |
   |   MongoDB Atlas    |        |   Groq SDK / AI    |
   | (Mongoose Indexes) |        | (Round-Robin Keys) |
   +--------------------+        +--------------------+
```

### Data Flow
1. **Request Ingestion**: The client makes API calls using a centralized [apiClient.ts](file:///d:/Het/CarbonSphere-AI/src/lib/apiClient.ts) that handles JWT bearer headers and credentials.
2. **Security & Rate Limiting**: The Express middleware verifies CORS origins, checks CSRF headers, verifies cookie validity, and enforces rate limits.
3. **Database Execution**: The controller fetches/writes documents to MongoDB Atlas. Models utilize custom indexes to avoid collection-scan overhead.
4. **AI Processing**: Side-effect engines (e.g. `groqService`) run prompts on Groq, parse structured JSON outputs, and return tailored insights.

---

## 💻 TECH STACK

* **Frontend**: Next.js 15, React 19, TailwindCSS, shadcn/ui, Recharts.
* **Backend**: Node.js, Express.js, Mongoose.
* **Database**: MongoDB Atlas.
* **AI Engine**: Groq SDK (Llama 3.3 70B Versatile).
* **Testing**: Vitest, React Testing Library, Playwright, @axe-core/playwright.
* **Security**: Helmet, Express Rate Limit, Cookie Parser, bcryptjs.

---

## 📸 SCREENSHOTS

*Placeholders for visual layouts:*

* **Dashboard Overview**: `/assets/screenshots/dashboard_mock.png`
* **Emissions Forecasting**: `/assets/screenshots/forecasting_mock.png`
* **AI Coach Insights**: `/assets/screenshots/ai_coach_mock.png`
* **Offset Registry & Purchases**: `/assets/screenshots/marketplace_mock.png`
* **Impact Report Generator**: `/assets/screenshots/reports_mock.png`

---

## ⚙️ LOCAL SETUP

### Prerequisites
* Node.js v18+
* MongoDB database instance
* Groq API Key(s)

### 1. Repository Setup
```bash
git clone https://github.com/hetpatel1b/CarbonSphere-AI.git
cd CarbonSphere-AI
pnpm install
```

### 2. Environment Variables Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI="mongodb://localhost:27017/carbonsphere"
JWT_SECRET="your_secure_jwt_signing_key"
FRONTEND_URL="http://localhost:3000"
GROQ_API_KEY="your_groq_api_key"
```

### 3. Database Seeding
Seed achievements and challenge templates:
```bash
cd backend
npm run seed:challenges
npm run seed:achievements
cd ..
```

### 4. Running the Application
Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend server (in a separate terminal):
```bash
pnpm dev
```

---

## 🔒 SECURITY FIRST

* **HttpOnly Sessions**: Session transport uses strictly-scoped cookies (`HttpOnly`, `SameSite=None`, `Secure` in production) to mitigate XSS risks.
* **Fail-Safe Secret Validation**: The backend checks for the presence of `JWT_SECRET` on startup and fails instantly if the variable is missing or empty.
* **CORS & CSRF Isolation**: Features dynamic origin verification whitelisting localhost, production domains, and any dynamic Vercel preview environments (`*.vercel.app`).
* **Stricter Access Limits**: Enforces rate limiting of 5 requests per 15 minutes on auth points (`/api/auth/login` and `/api/auth/register`).

---

## 🧪 TESTING

```bash
# Execute frontend unit & component tests
pnpm test

# Execute Playwright E2E & automated accessibility audits
pnpm test:e2e

# Execute backend integration tests
cd backend
npm run test
```

---

## 🔮 FUTURE ROADMAP

1. **Distributed Caching**: Integrate Redis to sync rate limiting metrics and caching across scaled nodes.
2. **Team / Organization Workspaces**: Group accounts to track aggregated corporate carbon goals.
3. **Vector Database / RAG Support**: Implement PGVector or Pinecone to cache common LLM recommendations.

---

## 🌟 WHY THIS PROJECT STANDS OUT

* **Production-Grade Resiliency**: The MongoDB connector implements a dynamic startup retry mechanism that handles transient database outages without crashing the server.
* **Automated Accessibility Gates**: Accessibility checks are integrated into the Playwright test suites. The build pipeline fails if any WCAG 2.1 AA violations are detected.
* **Optimized AI Cost Management**: Implements a round-robin API key failover loop that handles key rotations and rate limits seamlessly.
