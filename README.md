# Polytope Model V3: AI-Powered Stock Research & Forensic Analysis Platform

> **Warren Buffett-Style Value Investing meets Modern AI** — Identify undervalued global assets with institutional-grade financial forensics and fraud detection.

## 🎯 What This Is

An **end-to-end stock analysis platform** combining:
- **Forensic Accounting Detection**: 10-point Polytope alarm system for fraud red flags
- **Value Investing Framework**: Graham Circuit Breaker gates + FVC3 composite scoring  
- **Financial Analysis**: DCF valuation, cash flow analysis, ratio decomposition
- **Real-Time APIs**: Finnhub, Alpha Vantage integration for live market data
- **AI-Powered Insights**: Claude-powered analysis and narrative recommendations

**Use it to:**
- Screen 20+ global stocks daily for undervaluation
- Detect financial red flags before they crash
- Build a watchlist with institutional-grade analysis
- Export analysis to Power BI for portfolio monitoring

---

## ⚡️ Quick Start

### **No Installation Needed** — Try It Now
1. Open [`polytope-research-interface.html`](polytope-research-interface.html) in any browser
2. Enter stock financial metrics (pre-filled with Apple example)
3. Click "Run Polytope Analysis"
4. See real-time forensic scoring and valuation

### **With Node.js** — Full Stack
```bash
npm install
npm run dev
# Visit http://localhost:3000/stocks
```

## Sponsors

<table width="100%">
  <tr height="187px">
    <td align="center" width="33%">
      <a href="https://clerk.com?utm_source=github&utm_medium=sponsorship&utm_campaign=nextjs-boilerplate">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/ixartz/SaaS-Boilerplate/assets/1328388/6fb61971-3bf1-4580-98a0-10bd3f1040a2">
          <source media="(prefers-color-scheme: light)" srcset="https://github.com/ixartz/SaaS-Boilerplate/assets/1328388/f80a8bb5-66da-4772-ad36-5fabc5b02c60">
          <img alt="Clerk – Authentication & User Management for Next.js" src="https://github.com/ixartz/SaaS-Boilerplate/assets/1328388/f80a8bb5-66da-4772-ad36-5fabc5b02c60">
        </picture>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://anthropic.com">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="public/assets/images/anthropic-logo.png?raw=true">
          <source media="(prefers-color-scheme: light)" srcset="public/assets/images/anthropic-logo.png?raw=true">
          <img alt="Anthropic Claude" src="public/assets/images/anthropic-logo.png?raw=true">
        </picture>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="public/assets/images/sentry-white.png?raw=true">
          <source media="(prefers-color-scheme: light)" srcset="public/assets/images/sentry-dark.png?raw=true">
          <img alt="Sentry" src="public/assets/images/sentry-dark.png?raw=true">
        </picture>
      </a>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────┐
│   React Frontend (Stocks Dashboard)      │
│   - Search, analyze, filter by risk      │
│   - Real-time charts & metrics           │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│   Next.js API Routes                     │
│   - /api/stocks/fetch (real market data) │
│   - /api/research/polytope-analysis      │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│   Core Analysis Engine                   │
│   ├─ PolytopModelV3.ts (forensic logic)  │
│   ├─ ExternalAPIs.ts (Finnhub/Alpha V)   │
│   └─ PostgreSQL (Drizzle ORM)            │
└──────────────────────────────────────────┘
```

---

## 📊 Features

### 1. Three-Layer Analysis Framework

| Layer | Purpose | Output |
|-------|---------|--------|
| **Graham Breaker** | Binary filter | 4 gates: P/E, interest cover, dilution, solvency |
| **FVC3 Scoring** | Composite ranking | Score 0-100 (Valuation 40%, Quality 30%, Momentum 30%) |
| **Forensic Alarms** | Fraud detection | 10-point alarm system for red flags |

### 2. Polytope 10-Point Alarm System

Detects financial red flags in real-time:

- 🚨 **Paper Profit Trap** — Net income vs operating cash flow divergence
- 🚨 **Intangible Bloat** — Goodwill > 20% of total assets
- 🚨 **Supply Chain Stress** — Days payable outstanding > 300 days
- 🚨 **Asset Turnover Decline** — Assets rising while sales flat
- 🚨 **GAAP vs Non-GAAP Gap** — Adjusted metrics > 40% higher
- 🚨 **Debt-Fueled Growth** — Debt growing 3x faster than free cash flow
- 🚨 **Inventory Stretch** — Days inventory outstanding rising >15% YoY
- 🚨 **Short Seller Signal** — Short interest > 15% (institutional warning)
- 🚨 **Industry Contagion** — Peer defaults or distress signals
- 🚨 **Big Bath Watch** — New CEO with aggressive accounting changes

### 3. Valuation Methods

- **DCF** — Discounted cash flow with 12% discount rate (margin of safety)
- **Tangible Book Value** — Strip out goodwill for real asset backing
- **Earning Power Value** — Sustainable earnings excluding growth
- **Undervaluation Gap** — Compare all three methods to market price

### 4. Real-Time Market Data

- **Finnhub API** — Stock prices, company fundamentals, market data
- **Alpha Vantage API** — Historical financials, technical indicators
- **1-Hour Caching** — Reduce API calls, speed up repeated queries
- **Fallback Data** — Demo data when APIs not configured

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Next.js 16 (App Router)
- TypeScript for type safety
- Tailwind CSS 4 for styling
- Recharts for data visualization

**Backend:**
- Next.js API Routes (serverless)
- DrizzleORM (PostgreSQL/SQLite/MySQL)
- Zod for input validation
- Claude API for AI analysis (optional)

**Infrastructure:**
- **Dev**: PGlite (local database)
- **Prod**: PostgreSQL or Prisma Postgres
- **Monitoring**: Sentry (errors) + Better Stack (logs)
- **Security**: Arcjet (rate limiting, bot detection)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (marketing)/stocks/     ← Main stocks page
│   │   └── api/
│   │       ├── stocks/fetch        ← Get real market data
│   │       └── research/polytope-analysis ← Run analysis
│   └── layout.tsx
├── libs/
│   ├── PolytopModelV3.ts           ← Core analysis (500+ lines)
│   ├── ExternalAPIs.ts             ← Finnhub/Alpha Vantage
│   ├── Logger.ts
│   └── [other utilities]
├── components/
│   ├── atoms/                      ← MetricBadge, icons
│   ├── molecules/                  ← StockCard, alerts
│   └── organisms/                  ← ForensicDashboard
└── models/
    └── Schema.ts                   ← Database schema

polytope-research-interface.html    ← Interactive demo (no Node.js)
CLEANUP_LOG.md                      ← Changelog of refactoring
START_HERE.md                       ← Quick navigation
POLYTOPE_MODEL.md                   ← Full documentation
```

---

## 🚀 Usage Examples

### Search & Analyze a Stock

```bash
POST /api/research/polytope-analysis
{
  "ticker": "AAPL",
  "price": 238.50,
  "revenue": 394000,
  "netIncome": 99500,
  "operatingCashFlow": 110000
  // ... 15 more financial metrics
}

# Response
{
  "ticker": "AAPL",
  "riskScore": "LOW",
  "dcfValue": 245.50,
  "undervaluationGap": 2.8,
  "forensics": {
    "polytopeFlagCount": 1,
    "debtFueledGrowth": false,
    "paperProfitTrap": false,
    "intangibleBloat": false,
    "recommendation": "Strong Buy - Undervalued with low fraud signals"
  }
}
```

### Daily Screener (20+ Stocks)

Analyze S&P 500 top 20 + custom picks each morning:
```bash
npm run screen:daily
```

Outputs CSV with:
- Ticker | FVC3 Score | Risk Level | DCF Value | Recommendation

### Portfolio Watchlist

Monitor 10 holdings with Polytope updates via Power BI:
- Risk heatmap (red/yellow/green)
- Undervaluation gaps
- Forensic alarm trends
- Alerts when 7+ alarms triggered

---

## 📈 Key Metrics

### FVC3 Score (0-100)

$$\text{FVC3} = 100 \times (0.40 \times V + 0.30 \times Q + 0.30 \times M)$$

Where:
- **V** = Valuation percentile (earnings yield vs sector peers)
- **Q** = Quality percentile (FCF / Net Income ratio)
- **M** = Momentum percentile (volume-adjusted returns)

### Risk Levels

- **LOW** (0-3 alarms) — Warren Buffett would invest
- **MEDIUM** (4-6 alarms) — Caution, research further
- **HIGH** (7-9 alarms) — Avoid or short
- **CRITICAL** (10 alarms) — Likely fraud, distressed

### Graham Breaker Gates

All 4 must PASS for further analysis:
1. **P/E Ratio** < 35 (avoid speculation bubbles)
2. **Interest Coverage** > 3.0 (can service debt)
3. **Share Dilution** < 5% over 3 years
4. **Current Ratio** > 1.5 (short-term liquidity)

---

## 🔗 API Integration

### Setup Finnhub & Alpha Vantage

```bash
# .env.local
FINNHUB_API_KEY=your_key
ALPHA_VANTAGE_API_KEY=your_key
```

### Fetch Real Data

```javascript
const data = await fetch('/api/stocks/fetch', {
  method: 'POST',
  body: JSON.stringify({ ticker: 'AAPL' })
});

const analysis = await fetch('/api/research/polytope-analysis', {
  method: 'POST',
  body: JSON.stringify({
    ticker: 'AAPL',
    revenue: 394000,
    netIncome: 99500,
    // ... financial metrics
  })
});
```

---

## 📊 Dashboard Features

- **Stock Search** — Find by ticker or company name
- **Real-Time Analysis** — Click to run Polytope framework
- **Risk Heatmap** — Color-coded visualization
- **Valuation Charts** — DCF vs market comparison
- **Forensic Details** — Click alarms for methodology
- **Export** — CSV/JSON download

---

## 🎓 Philosophy

Three core principles:

1. **Wait, Then Pounce** — Only invest when sentiment is pessimistic
2. **Stay the Course** — Focus on business fundamentals, not price movements
3. **Pick Businesses, Not Stocks** — Understand economics deeply

Inspired by **Warren Buffett** + enhanced with:
- Modern AI (Claude)
- Forensic accounting (Polytope theory)
- Automated screening (20+ stocks/day)

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [`START_HERE.md`](START_HERE.md) | Quick navigation & setup |
| [`POLYTOPE_MODEL.md`](POLYTOPE_MODEL.md) | Full technical guide |
| [`CLEANUP_LOG.md`](CLEANUP_LOG.md) | Refactoring log |

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run check:types

# Lint & format
npm run lint:fix
```

---

## 📦 What's Included

✅ **Polytope V3 engine** (500+ lines of financial logic)  
✅ **Real market data** (Finnhub + Alpha Vantage integration)  
✅ **Interactive HTML demo** (no setup needed)  
✅ **React dashboard** (search, analyze, filter)  
✅ **Database schema** (PostgreSQL + SQLite)  
✅ **API endpoints** (production-ready)  
✅ **Error monitoring** (Sentry integration)  
✅ **Rate limiting** (Arcjet security)  
✅ **Full documentation** (architecture + formulas)  

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### AWS Lambda
```bash
npm run build
# Deploy via Serverless or CDK
```

### Self-Hosted
```bash
npm run build
npm run start
# Runs on port 3000
```

---

## 🤝 Contributing

Found a bug? Have a feature request?
1. Open an issue with details
2. Include ticker + failing analysis
3. Check [`POLYTOPE_MODEL.md`](POLYTOPE_MODEL.md) for technical details

---

## 📄 License

MIT — Free to use and modify

---

## 🎯 Roadmap

- [ ] LangGraph agent for multi-step research
- [ ] RAG for 10-K/10-Q filing analysis
- [ ] RLHF fine-tuning for fraud detection
- [ ] Power BI dashboard integration
- [ ] Mobile app (iOS/Android)
- [ ] Telegram/Slack alerts
- [ ] Historical backtest engine

---

## 👤 Author

**Jackson Fan** — AI Apps Developer | Certified Data Engineer | Investment Banking ITS  
- LinkedIn: [Your LinkedIn]
- GitHub: [Your GitHub]
- Portfolio: [Your Website]

---

**Start analyzing undervalued stocks today.** 👉 [Try the demo →](polytope-research-interface.html)

See [`POLYTOPE_MODEL.md`](POLYTOPE_MODEL.md) for complete technical documentation.

---

Made with ♥ by [CreativeDesignsGuru](https://creativedesignsguru.com) [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40Ixartz)](https://twitter.com/ixartz)

Looking for a custom boilerplate to kick off your project? I'd be glad to discuss how I can help you build one. Feel free to reach out anytime at contact@creativedesignsguru.com!

[![Sponsor Next JS Boilerplate](https://cdn.buymeacoffee.com/buttons/default-red.png)](https://github.com/sponsors/ixartz)
