# Quick Start: AI Stock Analysis Platform

## 🚀 Get Running in 5 Minutes

### 1. Start the Dev Server
```bash
npm run dev
```

Server runs at `http://localhost:3000`

### 2. View the Stocks Dashboard
Navigate to:
- **English**: `http://localhost:3000/stocks`
- **French**: `http://localhost:3000/fr/stocks`

### 3. Explore Sample Data
Pre-loaded stocks to analyze:
- **AAPL** (Apple) - Strong fundamentals, premium valuation
- **KO** (Coca-Cola) - Defensive dividend play with margin compression
- **JPM** (JPMorgan) - Leading bank, rate sensitive
- **XOM** (Exxon Mobil) - Energy dividend with volatility

Click **"Analyze Stock"** on any card to see:
- ✅ Graham Circuit Breaker results (4 gates)
- 📊 FVC 3.0 score breakdown (Valuation, Quality, Momentum)
- 🚩 10-point forensic alarm system

---

## 🏗️ Architecture Overview

```
User Request → Stocks Page (React)
    ↓
Click "Analyze" → /api/stocks/analyze (Node.js)
    ↓
    ├→ Graham Breaker (Binary filter)
    │   └→ Pass/Fail → Stops here if fails
    │
    ├→ FVC 3.0 Scoring (Relative scoring)
    │   └→ 0-100 score → BUY/HOLD/SELL
    │
    └→ Forensic Alarms (10 red flags)
        └→ Detects fraud/distress signals
    ↓
Return Full Analysis → Display on Dashboard
```

---

## 📚 Core Concepts (Simple Version)

### Graham Circuit Breaker
**"Is this company good enough to even consider?"**

4 simple Yes/No checks:
1. **Cheap enough?** P/E < 35 (not in bubble territory)
2. **Can pay debt?** Interest Coverage > 3.0x (debt safety)
3. **No shareholder dilution?** < 5% share increase in 3 years
4. **Liquid enough?** Has $1.50 in assets per $1 liability

✅ **If ALL pass** → Move to scoring
❌ **If ANY fail** → DISQUALIFY (eliminate 60% of stocks)

### FVC 3.0 Score (Like a Report Card)
**"How good is this stock compared to competitors in the same industry?"**

Three grades (0-100):
- **Valuation (40%)** - Is it cheaper than other tech companies?
- **Quality (30%)** - Does the company actually make real cash (not fake earnings)?
- **Momentum (30%)** - Is it trending up steadily (not just spiking)?

**Final Score:**
- 70+ = **BUY** 🟢
- 40-69 = **HOLD** 🟡
- Below 40 = **SELL** 🔴

### 10-Point Alarm System
**"Are we being lied to by accounting tricks?"**

10 red flags that suggest hidden problems:
1. Earnings don't match cash (Paper Profit Trap)
2. Too much "goodwill" on balance sheet
3. Company paying suppliers very late
4. Piling up assets it can't sell
5. Using creative accounting to hide poor performance
6. Revenue actually shrinking
7. Profit margins getting tighter
8. Cash flow not backing up reported earnings
9. Customers owing way more money
10. Big debt payments coming due soon

**Risk Level:**
- 0 alarms = **LOW** 🟢
- 1-2 alarms = **MEDIUM** 🟡
- 3-4 alarms = **HIGH** 🟠
- 5+ alarms = **CRITICAL** 🔴 (likely fraud)

---

## 💻 Code Examples

### Use the Scoring APIs

```typescript
// Example 1: Check if a stock passes Graham Breaker
import { evaluateGrahamBreaker } from '@/libs/GrahamBreaker';

const result = evaluateGrahamBreaker({
  peRatio: 28.5,
  interestCoverage: 4.2,
  shareCountChange: 1.5,
  currentAssets: 1000000,
  currentLiabilities: 500000,
});

if (result.overallPass) {
  console.log('✅ Stock passed! Can proceed to FVC3 scoring');
} else {
  console.log('❌ Rejected. Failures:', result.failureReasons);
}
```

```typescript
// Example 2: Calculate FVC3 Score
import { calculateFVC3Score } from '@/libs/SectorDistortionEngine';

const score = calculateFVC3Score(
  {
    earnings: 5000000,
    freeCashFlow: 4750000,
    totalAssets: 100000000,
    netIncome: 5000000,
    price: 150,
    shares: 1000000,
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

console.log(`Score: ${score.compositeScore}/100`);
console.log(`Recommendation: ${score.recommendation}`);
```

```typescript
// Example 3: Run forensic analysis
import { evaluateForensicAlarms } from '@/libs/ForensicAlarms';

const forensics = evaluateForensicAlarms({
  netIncome: 5000000,
  operatingCashFlow: 4900000,
  // ... (20 metrics)
});

if (forensics.totalAlarms === 0) {
  console.log('✅ No red flags detected - Good quality company');
} else if (forensics.riskLevel === 'CRITICAL') {
  console.log('🚩 CRITICAL: Likely accounting fraud');
} else {
  console.log(`⚠️ ${forensics.totalAlarms} concerns to investigate`);
}
```

---

## 🔌 Calling the API from Client/Backend

```typescript
// Call the analysis endpoint
const response = await fetch('/api/stocks/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ticker: 'AAPL',
    peRatio: 32.5,
    // ... (all 30+ metrics)
  }),
});

const analysis = await response.json();

console.log('Graham Result:', analysis.grahamBreaker.overallPass);
console.log('FVC3 Score:', analysis.fvc3Score.compositeScore);
console.log('Risk Level:', analysis.forensicAlarms.riskLevel);
```

---

## 🗄️ Database Setup

The database schema is **automatically created** when you run:

```bash
npm run dev
```

It creates 5 tables:
- `stocks` - Company info (ticker, name, sector, price)
- `financial_metrics` - Raw financial data
- `fvc3_score` - Calculated composite scores
- `graham_breaker` - Pass/fail gates
- `forensic_analysis` - Red flag results

View data visually:
```bash
npm run db:studio
```

---

## 📊 UI Components You Can Reuse

```typescript
// In any React component:
import { StockInfoCard } from '@/components/molecules/StockCard';
import { GrahamBreakerCard } from '@/components/molecules/StockCard';
import { FVC3ScoreCard } from '@/components/molecules/StockCard';
import { ForensicDashboard } from '@/components/organisms/ForensicDashboard';

// Use them:
<StockInfoCard
  ticker="AAPL"
  name="Apple Inc"
  sector="Technology"
  price={182.5}
  marketCap="$2.8T"
  onAnalyze={() => handleAnalysis()}
/>

<GrahamBreakerCard
  passed={true}
  peRatio={32.5}
  interestCoverage={12.3}
  assetLiabilityRatio={1.82}
  shareCountChange={-2.1}
/>

<FVC3ScoreCard
  compositeScore={74.2}
  valuationScore={68}
  qualityScore={85}
  momentumScore={72}
  recommendation="BUY"
/>

<ForensicDashboard
  riskLevel="LOW"
  totalAlarms={0}
  details={forensicDetails}
/>
```

---

## 🎯 What to Do Next

### Easy (1-2 hours)
- [ ] Add stock search/filter functionality
- [ ] Save favorite stocks to user account
- [ ] Add price change indicators
- [ ] Create email alert system

### Medium (4-8 hours)
- [ ] Connect to real financial API (Alpha Vantage, Finnhub, etc.)
- [ ] Auto-refresh financial data daily
- [ ] Add historical score tracking
- [ ] Create portfolio comparison

### Advanced (16+ hours)
- [ ] AI-generated stock summaries (Claude/OpenAI)
- [ ] Backtesting module (historical performance)
- [ ] Machine learning to improve scoring weights
- [ ] Options analysis
- [ ] Sector rotation recommendations

---

## 🐛 Troubleshooting

**"Stocks page shows no data"**
→ That's normal! Use the sample stocks on the page or click "Analyze Stock" to see pre-loaded data.

**"API returns 500 error"**
→ Check that all 30+ metrics are provided in request body. See `/api/stocks/analyze` for full list.

**"Database errors"**
→ Run `npm run db:migrate` to apply schema migrations.

**"TypeScript errors"**
→ Run `npm run check:types` to see all issues, then `npm run lint:fix` to auto-fix.

---

## 📖 Documentation

- **Full Architecture**: See `POLYTOPE_MODEL.md`
- **API Reference**: See `/api/stocks/analyze` route
- **Component Library**: Check `src/components/atoms|molecules|organisms`
- **Database Schema**: See `src/models/Schema.ts`

---

## 🚀 Production Checklist

- [ ] Connect real financial data source
- [ ] Add rate limiting (already have Arcjet)
- [ ] Set up error monitoring (Sentry ready)
- [ ] Configure environment variables
- [ ] Run full test suite
- [ ] Deploy to Vercel (or your host)

---

**You're all set! 🎉 Start exploring stocks at `/stocks` page.**
