# AI Stock Analysis Platform - Polytope Model Implementation

## Overview

This is a **working implementation** of the **Polytope Model** - a sophisticated AI-driven stock analysis framework combining:

1. **Graham Circuit Breaker** (Gatekeeper Layer) - Binary filters to eliminate speculative/junk stocks
2. **Sector Distortion Engine** (FVC 3.0 Scoring) - Relative valuation scoring (40% valuation, 30% quality, 30% momentum)
3. **10-Point Forensic Alarm System** - Detection of financial manipulation and distress signals

Built with **Next.js 16 + React 19 + TypeScript** for a modern, type-safe web app.

---

## Project Structure

```
src/
├── libs/
│   ├── GrahamBreaker.ts          # Gatekeeper logic (4 binary filters)
│   ├── SectorDistortionEngine.ts # FVC 3.0 scoring system
│   ├── ForensicAlarms.ts         # 10-point fraud/distress detection
│   ├── DB.ts                      # Database connection (Drizzle ORM)
│   └── ...
├── models/
│   └── Schema.ts                  # Extended database schema (stocks, metrics, scores, alarms)
├── app/[locale]/
│   ├── api/
│   │   └── stocks/
│   │       ├── analyze/route.ts   # POST /api/stocks/analyze - Full analysis pipeline
│   │       └── list/route.ts      # GET /api/stocks/list - Retrieve screened stocks
│   └── (marketing)/
│       ├── stocks/
│       │   └── page.tsx           # Main stocks dashboard with demo data
│       └── layout.tsx             # Updated nav to include "AI Stocks" link
└── components/
    ├── atoms/
    │   └── MetricBadge.tsx        # Atomic design: metrics, status icons, alarms
    ├── molecules/
    │   └── StockCard.tsx          # Groups of atoms: stock info, Graham, FVC3 cards
    └── organisms/
        └── ForensicDashboard.tsx  # Complex: 10-point alarm grid
```

---

## Core Components Explained

### 1. Graham Circuit Breaker (`src/libs/GrahamBreaker.ts`)

**Purpose:** Binary filter that eliminates 60-80% of stocks immediately.

**4 Rules (ALL must PASS):**

| Rule | Threshold | Rationale |
|------|-----------|-----------|
| **Bubble Cap** | P/E < 35 | Prevents overvalued speculative names |
| **Junk Filter** | Interest Coverage > 3.0x | Ensures company survives debt obligations |
| **Dilution Check** | Share count change < 5% (3yr) | Flags excessive stock-based compensation |
| **Solvency** | Current Assets / Liabilities > 1.5 | Short-term liquidity safety check |

**Usage:**
```typescript
import { evaluateGrahamBreaker } from '@/libs/GrahamBreaker';

const result = evaluateGrahamBreaker({
  peRatio: 28.5,
  interestCoverage: 4.2,
  shareCountChange: 1.5,
  currentAssets: 1000000,
  currentLiabilities: 500000,
});

if (result.overallPass) {
  console.log('Stock passed! Send to FVC3 scoring');
} else {
  console.log('Failed criteria:', result.failureReasons);
}
```

---

### 2. Sector Distortion Engine (`src/libs/SectorDistortionEngine.ts`)

**Purpose:** Score stocks RELATIVE to sector peers (not absolute basis).

**FVC 3.0 Formula:**
$$\text{FVC3\_Score} = 100 \times (0.40 \times V + 0.30 \times Q + 0.30 \times M)$$

Where:
- **V (Valuation, 40%)**: Earnings Yield percentile vs sector
  - $E/P = \text{Net Income} / \text{Market Cap}$
  - Higher is better (inverse of P/E)

- **Q (Quality, 30%)**: FCF to Net Income ratio
  - Detects "Paper Profit Trap" where earnings ≠ cash
  - $\text{FCF Margin} = \text{Free Cash Flow} / \text{Net Income}$
  - Ratio < 0.5 = red flag (earnings manipulation)

- **M (Smart Momentum, 30%)**: Risk-adjusted momentum
  - $\text{Risk-Adjusted Momentum} = \text{12M Return} / \text{6M Volatility}$
  - Favors "grinding higher" over vertical spikes
  - 20% return with 5% vol > 20% return with 30% vol

**Output Recommendation:**
- **BUY**: Score ≥ 70/100
- **HOLD**: Score 40-69/100
- **SELL**: Score < 40/100

**Usage:**
```typescript
import { calculateFVC3Score } from '@/libs/SectorDistortionEngine';

const fvc3 = calculateFVC3Score(
  {
    earnings: 5000000,
    freeCashFlow: 4750000,
    operatingCashFlow: 4900000,
    totalAssets: 100000000,
    netIncome: 5000000,
    price: 150,
    shares: 1000000, // market cap = $150M
    volatility6M: 0.12,
    return12M: 0.35,
  },
  {
    medianPE: 22,
    medianFCFMargin: 0.85,
    medianMomentum: 1.2,
    sectorStocks: 150,
  }
);

console.log(`Score: ${fvc3.compositeScore}/100 - ${fvc3.recommendation}`);
```

---

### 3. Forensic Alarms (`src/libs/ForensicAlarms.ts`)

**Purpose:** Detect red flags of financial manipulation, fraud, and distress.

**10-Point Alarm System:**

| Alarm | Metric | Threshold | Signal |
|-------|--------|-----------|--------|
| 1. **Paper Profit Trap** | (NI - OCF) / Assets | > 5% | Profits not backed by cash |
| 2. **Intangible Bloat** | Intangibles / Assets | > 20% | Goodwill/patents masking losses |
| 3. **Payable Days Alarm** | Days Payable Outstanding | > 300 | Unpaid suppliers = liquidity stress |
| 4. **Asset Turnover Trend** | Declining while revenue rises | ↓ | Asset bloating/inventory buildup |
| 5. **GAAP Gap** | (Non-GAAP - GAAP) / GAAP | > 15% | Aggressive adjusted metrics |
| 6. **Revenue Trend** | YoY revenue change | < 0% | Business shrinking |
| 7. **Margin Compression** | Net margin trending down | Low | Pricing power loss / cost inflation |
| 8. **Cash Flow Divergence** | OCF declining vs stable NI | ↓ | Classic earnings manipulation |
| 9. **A/R Trend** | Receivables growing > revenue | Fast | Channel stuffing/credit quality |
| 10. **Debt Maturity** | Debt due < 1yr > cash | > 1.0x | Refinancing risk |

**Risk Levels:**
- **LOW** (0 alarms)
- **MEDIUM** (1-2 alarms)
- **HIGH** (3-4 alarms)
- **CRITICAL** (5+ alarms)

**Usage:**
```typescript
import { evaluateForensicAlarms } from '@/libs/ForensicAlarms';

const forensics = evaluateForensicAlarms({
  netIncome: 5000000,
  operatingCashFlow: 4900000,
  totalAssets: 100000000,
  intangibleAssets: 15000000,
  payableDays: 45,
  // ... (all 20 metrics)
});

console.log(`${forensics.totalAlarms} alarms detected - ${forensics.riskLevel} risk`);
```

---

## API Endpoints

### POST `/api/stocks/analyze`

**Full analysis pipeline in one request.**

**Request Body:**
```json
{
  "ticker": "AAPL",
  "peRatio": 32.5,
  "forwardPeRatio": 30.2,
  "interestCoverage": 12.3,
  "shareCountChange": -2.1,
  "currentAssets": 100000000,
  "currentLiabilities": 55000000,
  "earnings": 25000000,
  "freeCashFlow": 23000000,
  "operatingCashFlow": 24000000,
  "totalAssets": 350000000,
  "netIncome": 25000000,
  "price": 182.50,
  "shares": 15000000,
  "volatility6M": 0.18,
  "return12M": 0.45,
  "sectorMedianPE": 28,
  "sectorMedianFCFMargin": 0.88,
  "sectorMedianMomentum": 1.5,
  "intangibleAssets": 50000000,
  "payableDays": 32,
  "assetTurnover": 1.8,
  "assetTurnoverPriorYear": 1.75,
  "gaapNetIncome": 25000000,
  "nonGaapNetIncome": 26500000,
  "accountsReceivable": 25000000,
  "accountsReceivablePriorYear": 23000000,
  "inventory": 15000000,
  "inventoryPriorYear": 14000000,
  "cash": 50000000,
  "debtDue1Year": 5000000,
  "operatingCashFlowPriorYear": 23000000,
  "revenueChange": 12.5
}
```

**Response:**
```json
{
  "ticker": "AAPL",
  "grahamBreaker": {
    "bubbleCapPass": true,
    "junkFilterPass": true,
    "dilutionCheckPass": true,
    "solvencyPass": true,
    "overallPass": true,
    "failureReasons": [],
    "scores": { "peRatio": 32.5, "interestCoverage": 12.3, ... }
  },
  "fvc3Score": {
    "valuationScore": 68.5,
    "qualityScore": 82.1,
    "momentumScore": 75.3,
    "compositeScore": 74.2,
    "recommendation": "BUY",
    "metrics": { "earningsYield": 0.037, "fcfMargin": 0.92, ... }
  },
  "forensicAlarms": {
    "totalAlarms": 0,
    "riskLevel": "LOW",
    "details": { "paperProfitTrap": {...}, ... }
  },
  "overallAssessment": {
    "passedGrahams": true,
    "recommendation": "BUY",
    "riskLevel": "LOW",
    "summary": "Passed Graham Breaker. FVC3 Score: 74.2/100 (BUY). No forensic red flags detected."
  }
}
```

### GET `/api/stocks/list`

**Query Parameters:**
- `sector` (optional): Filter by sector
- `sortBy` (optional): "compositeScore" | "price" | "ticker"
- `limit` (optional): Default 50

**Response:**
```json
{
  "stocks": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc",
      "sector": "Technology",
      "price": "182.50",
      "compositeScore": 74.2,
      "recommendation": "BUY",
      "grahamPassed": true
    },
    ...
  ],
  "count": 23
}
```

---

## Database Schema

**5 New Tables:**

1. **stocks** - Base stock information
2. **financial_metrics** - Historical financials for Graham + FVC3
3. **fvc3_score** - Calculated composite scores
4. **graham_breaker** - Pass/fail results for each gate
5. **forensic_analysis** - Alarm flags and risk levels

Run migrations:
```bash
npm run db:generate  # Create new migrations
npm run db:migrate   # Apply migrations
```

---

## React UI Components (Atomic Design)

### Atoms (`src/components/atoms/MetricBadge.tsx`)
- `<MetricBadge />` - Display single metric with color coding
- `<StatusIcon />` - PASS/FAIL indicators
- `<AlarmBadge />` - Individual alarm display
- `<ProgressBar />` - Visual score representation (0-100)

### Molecules (`src/components/molecules/StockCard.tsx`)
- `<StockInfoCard />` - Ticker, name, price, sector, analyze button
- `<GrahamBreakerCard />` - Display all 4 gates with scores
- `<FVC3ScoreCard />` - Composite score with 3 pillar breakdown

### Organisms (`src/components/organisms/ForensicDashboard.tsx`)
- `<ForensicDashboard />` - 2x5 grid of all 10-point alarms with details

---

## Demo Page

**Navigate to:** `http://localhost:3000/stocks` (or `/fr/stocks` for French)

**Features:**
- Pre-loaded sample stocks (AAPL, KO, JPM, XOM)
- Click "Analyze Stock" to see full analysis
- Toggle between stocks
- Responsive design (mobile-friendly)

---

## How to Extend & Build Out

### 1. **Connect Real Data Source**
Replace sample data with actual financial API:
```typescript
// In /api/stocks/analyze or list routes
const financialData = await fetch('https://api.yourfinancial-data.com/...');
```

### 2. **Add AI Summary Generation**
Use Claude/OpenAI to generate insights:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const ai = new Anthropic();
const aiSummary = await ai.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  messages: [{
    role: 'user',
    content: `Analyze this stock score and provide investment insights: ${fvc3Score}`
  }],
});
```

### 3. **Add User Authentication & Portfolios**
Already integrated with **Clerk** for auth:
```typescript
import { auth } from '@clerk/nextjs/server';

export const POST = async (request: Request) => {
  const { userId } = await auth();
  // Save analysis to user's portfolio
};
```

### 4. **Add Real-Time Price Updates**
Subscribe to stock price feeds:
```typescript
// Use websockets or polling to update prices
setInterval(async () => {
  const prices = await fetch('https://price-api.com/...');
  // Update database
}, 60000);
```

### 5. **Build Alerting System**
Monitor stocks matching your criteria:
```typescript
// Trigger alerts when:
// - Stock passes Graham + scores > 70
// - New forensic alarms triggered
// - Price drops 10% from previous
```

---

## Key Metrics & Thresholds Reference

### Graham Breaker
```
P/E < 35                    (avoid bubbles)
Interest Coverage > 3.0x    (debt safety)
Share Dilution < 5% (3yr)   (shareholder protection)
Current Ratio > 1.5         (liquidity)
```

### FVC 3.0 Scoring
```
Valuation: 40% weight
  → Earnings Yield percentile vs sector
Quality: 30% weight
  → FCF / Net Income (paper profit detection)
Momentum: 30% weight
  → 12M Return / 6M Volatility (grinding higher)
```

### Forensic Alarms
```
Paper Profit: (NI - OCF) / Assets > 5%
Intangibles: > 20% of assets
Payables: > 300 days
GAAP Gap: > 15% variance
Revenue: Declining YoY
```

---

## Running the Application

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Database operations
npm run db:generate  # Create migrations
npm run db:migrate   # Apply migrations
npm run db:studio    # Visual database editor
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 + React 19 |
| **Language** | TypeScript 5+ |
| **Styling** | Tailwind CSS 4 |
| **Database** | PostgreSQL (Drizzle ORM) |
| **Auth** | Clerk |
| **Validation** | Zod |
| **Testing** | Vitest + Playwright |
| **Monitoring** | Sentry + PostHog |
| **Security** | Arcjet (bot detection, rate limiting) |

---

## Next Steps

1. ✅ **Done**: Core scoring engines (Graham, FVC3, Forensic)
2. ✅ **Done**: REST API endpoints
3. ✅ **Done**: React dashboard with sample data
4. **TODO**: Connect real financial data source
5. **TODO**: Add AI-generated stock summaries
6. **TODO**: Build watchlist/portfolio features
7. **TODO**: Add email alerts for trade signals
8. **TODO**: Create quantitative backtesting module
9. **TODO**: Deploy to production (Vercel recommended)

---

## Notes for Deployment

- Set `DATABASE_URL` environment variable pointing to PostgreSQL
- Configure Clerk authentication keys
- Optional: Enable Sentry for error monitoring
- Optional: Enable PostHog for analytics

This is a **production-grade foundation** ready to scale! 🚀
