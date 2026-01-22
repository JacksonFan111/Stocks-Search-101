# Copilot Instructions for Stocks-Search-101

## Project Architecture

This is a **dual-mode stock analysis app** with ETL pipeline and forensic risk scoring:

- **Frontend**: React 18 + Vite + Tailwind CSS (SPA with view-based routing)
- **Data Layer**: ETL pipeline → Hot cache → Runtime API/Mock fallback
- **Analysis Engine**: Real-time forensic scoring (volatility, market cap, P/E, liquidity checks)

### ⚠️ Security Notice for Production
**CRITICAL**: The codebase contains a hardcoded fallback API key (`d5na9lhr01ql6sfqd5e0`) for demo purposes. Before production deployment:
1. Remove all hardcoded API keys from source code
2. Use environment variables exclusively: `VITE_FINNHUB_API_KEY`
3. Add `.env` files to `.gitignore` (already configured)
4. Consider API key rotation policies for commercial use

Locations: [src/services/apiConfig.js](src/services/apiConfig.js#L23), [scripts/fetch-daily.js](scripts/fetch-daily.js#L9), [test-apis.js](test-apis.js#L29)

### Key Architectural Pattern: Hot Cache Strategy

The app operates in **two modes** based on `VITE_FINNHUB_API_KEY`:
1. **Live Mode**: Direct Finnhub API calls (when valid API key exists)
2. **Mock Mode**: Pre-fetched data from `public/data/hot/hotCache.json` (when no API key or `demo`)

The hot cache is populated by the ETL pipeline and loaded at runtime via `ensureHotCache()` in [src/services/finnhubAPI.js](src/services/finnhubAPI.js).

**Free-Tier Economics**:
- **Finnhub Free**: 60 API calls/minute (3,600/hour, 86,400/day max)
- **ETL Efficiency**: 40 symbols = 80 API calls (2 per symbol: quote + profile) in ~12 seconds
- **Daily Refresh Strategy**: Run ETL once daily to stay well within limits (80 calls/day vs 86,400 available)
- **User Experience**: Hot cache eliminates 100% of runtime API calls → unlimited concurrent users on free tier
- **Scaling Path**: Live mode for premium users, cached mode for free users (hybrid monetization model)

## Critical Developer Workflows

### Starting Development
```bash
npm run dev                # Start Vite dev server (localhost:3000, auto-opens browser)
npm run fetch:daily        # Run ETL to populate hot cache (separate terminal)
```

**Alternative**: Use the PowerShell launcher for guided workflows:
```powershell
./launch.ps1               # Interactive menu for dev/build/ETL tasks
```

### ETL Pipeline Execution
The `scripts/fetch-daily.js` ETL script supports **environment-driven configuration**:

```bash
# Bash/Linux (dev container default)
INGEST_SYMBOLS_FILE="symbols/tech_stocks.json" npm run fetch:daily
ALLOW_INSECURE_SSL="true" npm run fetch:daily
INGEST_CONCURRENCY="8" INGEST_RETRIES="3" npm run fetch:daily

# PowerShell (Windows)
$env:INGEST_SYMBOLS_FILE="symbols/tech_stocks.json"; npm run fetch:daily
$env:ALLOW_INSECURE_SSL="true"; npm run fetch:daily
$env:INGEST_CONCURRENCY="8"; $env:INGEST_RETRIES="3"; npm run fetch:daily
```

**Output Structure**:
- `public/data/raw/YYYY-MM-DD/{SYMBOL}.json` - Per-symbol API responses
- `public/data/hot/hotCache.json` - Consolidated cache for browser consumption
- `public/data/manifest.json` - ETL run metadata (timing, errors, source tracking)

**Environment Variables**:
- `INGEST_SYMBOLS_FILE` - Custom symbol list (JSON or .txt, default: sampleData.js)
- `ALLOW_INSECURE_SSL` - Disable TLS verification for corporate proxies
- `INGEST_CONCURRENCY` - Parallel workers (default: 4)
- `INGEST_RETRIES` - Retry attempts per symbol (default: 2)
- `INGEST_RETRY_DELAY_MS` - Exponential backoff delay (default: 750ms)
- `INGEST_PACE_DELAY_MS` - Inter-request pacing (default: 400ms)

## Component Conventions

### View-Based Routing (Not React Router)
Navigation managed via `currentView` state in [src/App.jsx](src/App.jsx):
- Views: `'landing'`, `'results'`, `'deepdive'`, `'forensics'`, `'watchlist'`, `'about'`
- Switch views: `setCurrentView('forensics')` + conditionally set `selectedStock`

### Component Data Flow
```
App.jsx (root state: selectedStock, watchlist, currentView)
  ↓
Navigation (view switcher)
  ↓
DeepDive (stock details) → ForensicsAnalysis (risk scoring)
  ↓
finnhubAPI.js (auto-selects live API or hot cache)
```

### Forensic Analysis Pattern
[src/components/ForensicsAnalysis.jsx](src/components/ForensicsAnalysis.jsx) calculates risk scores from **live data**:

- Fetches `quote` + `profile` on mount via `Promise.all()`
- Runs `calculateForensicAnalysis()` to check 5 red flags:
  1. Daily volatility > 5%
  2. Market cap < $500M
  3. Price < $5 (penny stock)
  4. Volume < 1M shares
  5. P/E ratio > 30x
- Risk score: 0-10 (capped), recommendation: 🟢 REVIEW / 🟡 HOLD / 🔴 DO NOT BUY

### Pre-calculated Analysis Cache
[src/services/analysisCache.js](src/services/analysisCache.js) pre-computes valuations (DCF, EPV, asset-based) for all cached stocks on app startup:

- Called from `App.jsx` via `useEffect(() => preloadAnalysis(), [])`
- Access via `getCachedAnalysis(symbol)` for instant results
- Used in [src/components/PolytopeAnalysis.jsx](src/components/PolytopeAnalysis.jsx) for valuation displays

## Integration Points

### Finnhub API Service Layer
All API calls route through [src/services/finnhubAPI.js](src/services/finnhubAPI.js):
- `searchStocks(query)` - Symbol search with mock fallback
- `getStockQuote(symbol)` - Real-time quote or hot cache
- `getCompanyProfile(symbol)` - Company details or hot cache

**Mock Fallback Chain**:
1. Check `USE_MOCK_DATA` flag (based on API key presence)
2. Call `ensureHotCache()` to load `hotCache.json` (once per session)
3. Merge into `sampleStocks`, `mockStockQuotes`, `mockCompanyProfiles` from [src/services/sampleData.js](src/services/sampleData.js)
4. Return cached data or baked defaults

### Environment Variables
- **Runtime (Browser)**: `import.meta.env.VITE_FINNHUB_API_KEY` - Vite-prefixed for client exposure
- **Build-Time (Node ETL)**: `process.env.VITE_FINNHUB_API_KEY` - Standard Node.js env
- **ETL Tuning**: `INGEST_CONCURRENCY`, `INGEST_RETRIES`, `INGEST_RETRY_DELAY_MS`, `INGEST_PACE_DELAY_MS`, `INGEST_SYMBOLS_FILE`, `ALLOW_INSECURE_SSL`

Create `.env` file in project root (not tracked in git) for local overrides.

## Project-Specific Patterns

### Symbol File Format
Custom symbol lists ([symbols/tech_stocks.json](symbols/tech_stocks.json)) support two formats:

**JSON** (rich metadata):
```json
[
  {"symbol": "AAPL", "name": "Apple Inc.", "type": "Common Stock", "exchange": "NASDAQ"},
  {"symbol": "TSLA"}
]
```

**Text** (simple list):
```
AAPL
TSLA, GOOGL
MSFT
```

The ETL script normalizes both formats via `normalizeStock()` and deduplicates.

### Toast Notification System
[src/App.jsx](src/App.jsx) implements a centralized toast helper:
```javascript
showToast('Stock added to watchlist ⭐', 'success');
showToast('API rate limit reached', 'error');
```
Auto-dismisses after 3 seconds. Types: `'success'`, `'error'`, `'info'`.

### Analysis Engine Exports
[src/services/analysisEngine.js](src/services/analysisEngine.js) exports reusable calculators:
- `calculateFinancialMetrics(quote, profile)` - Core ratios (P/E, P/B, volume)
- `calculatePolytopeScore(metrics, quote, profile)` - Risk scoring with flags
- `estimateDCFValuation()`, `estimateEPV()`, `estimateAssetBasedValuation()` - Valuation models
- `generateBenchmarkComparison()` - Industry vs. actual metrics table
- `generateChartsData()` - Recharts-compatible time series data

## Debugging Tips

### Hot Cache Not Loading
1. Run ETL: `npm run fetch:daily` (generates `hotCache.json`)
2. Check browser console for "Hot cache load skipped" warnings
3. Verify `public/data/hot/hotCache.json` exists and is valid JSON
4. Ensure Vite dev server is running (serves `/data/hot/hotCache.json` route)

### API Rate Limiting
Finnhub free tier: **60 calls/minute**. The ETL script defaults to:
- 4 concurrent workers (`INGEST_CONCURRENCY=4`)
- 400ms inter-request delay (`INGEST_PACE_DELAY_MS=400`)
- ~10-15 seconds for 40 symbols

Adjust concurrency downward if hitting rate limits during ETL runs.

### Mock Data Not Showing
- [src/services/sampleData.js](src/services/sampleData.js) contains 40 baked stocks as ultimate fallback
- Mock mode triggers when `API_KEY === 'demo'` or `!API_KEY`
- Hot cache **merges into** (not replaces) sampleData arrays

### ETL Pipeline Failures
**Symptoms**: Empty hot cache, 429 errors, incomplete data

**Diagnosis**:
```bash
# Check manifest for errors
cat public/data/manifest.json | grep -A5 errors

# Verify API key validity
node test-apis.js

# Check rate limit status (manual inspection)
cat public/data/manifest.json | jq '.concurrency, .runMs, .errors'
```

**Solutions**:
1. **429 Rate Limit Exceeded**: Reduce `INGEST_CONCURRENCY` from 4 to 2
2. **Corporate Proxy Issues**: Set `ALLOW_INSECURE_SSL=true`
3. **Invalid API Key**: Check `.env` file or fallback key freshness
4. **Partial Failures**: Check `manifest.json` errors array for per-symbol diagnostics

### Production Monitoring
**Key Metrics to Track**:
- `manifest.json` → `errors` array (should be empty)
- `manifest.json` → `runMs` (should be < 20,000ms for 40 symbols)
- Browser console → "Hot cache load skipped" warnings
- Network tab → Failed API calls triggering fallback

**Health Check Endpoint** (add to production):
```javascript
// src/services/healthCheck.js
export const getDataHealth = async () => {
  const manifestRes = await fetch('/data/manifest.json');
  const manifest = await manifestRes.json();
  const cacheRes = await fetch('/data/hot/hotCache.json');
  const cache = await cacheRes.json();
  
  return {
    status: manifest.errors.length === 0 ? 'healthy' : 'degraded',
    lastUpdate: manifest.generatedAt,
    symbolCount: cache.sampleStocks?.length || 0,
    errors: manifest.errors
  };
};
```

## Testing & Validation

Run API connectivity test:
```bash
node test-apis.js          # Cross-platform (Bash/Linux)
# Or: .\test-apis.ps1 (PowerShell)
```
Validates Finnhub endpoints and displays rate limit status.

## Build & Deployment

```bash
npm run build              # Outputs to dist/
npm run preview            # Preview production build locally
```

**Pre-deployment checklist**:
1. Run ETL to refresh hot cache: `npm run fetch:daily`
2. Commit `public/data/hot/hotCache.json` (or regenerate in CI/CD)
3. Set production `VITE_FINNHUB_API_KEY` in hosting environment
4. Ensure `public/data/` directory is included in deployment artifacts

### Production Deployment Architecture

**Option 1: Pure Mock Mode (Zero API Costs)**
- Deploy without `VITE_FINNHUB_API_KEY` or set to `'demo'`
- App automatically loads from hot cache (pre-committed data)
- **Pros**: Free hosting, unlimited users, no API rate limits
- **Cons**: Stale data (manual ETL updates), limited to cached symbols
- **Best For**: Demos, prototypes, investor presentations

**Option 2: Hybrid Mode (Recommended for Production)**
- Deploy with valid `VITE_FINNHUB_API_KEY`
- ETL runs daily via cron job (e.g., GitHub Actions, Vercel Cron)
- Hot cache serves as fallback for degraded API performance
- **Pros**: Fresh data, graceful degradation, API cost control
- **Cons**: Requires CI/CD automation, potential rate limit issues at scale
- **Best For**: Production SaaS, paid tiers with live data

**Option 3: Premium Live Mode**
- Upgrade to Finnhub Pro ($99/month for unlimited calls)
- Disable hot cache entirely or use only for error recovery
- Real-time quotes for all user interactions
- **Pros**: Always current data, no ETL pipeline needed
- **Cons**: Higher costs, API dependency risk
- **Best For**: Financial institutions, professional traders

**CI/CD Example (GitHub Actions)**:
```yaml
# .github/workflows/daily-etl.yml
name: Daily ETL
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
jobs:
  etl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run fetch:daily
        env:
          VITE_FINNHUB_API_KEY: ${{ secrets.FINNHUB_API_KEY }}
      - run: |
          git config user.name github-actions
          git commit -am "Daily ETL update" && git push || true
```

## Key Files Reference

- [src/App.jsx](src/App.jsx) - Root component, view routing, toast system
- [src/services/finnhubAPI.js](src/services/finnhubAPI.js) - API client with hot cache loader
- [scripts/fetch-daily.js](scripts/fetch-daily.js) - ETL pipeline (Node.js)
- [src/components/ForensicsAnalysis.jsx](src/components/ForensicsAnalysis.jsx) - Risk scoring UI
- [src/services/analysisEngine.js](src/services/analysisEngine.js) - Financial calculations
- [ETL_FORENSICS_SUMMARY.md](ETL_FORENSICS_SUMMARY.md) - Deep architectural docs
- [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) - Workflow quick reference

## Commercial Readiness Assessment

### ✅ Production-Ready Features
- **Zero-downtime fallback architecture** (hot cache → sample data)
- **Configurable ETL pipeline** with retry logic and error tracking
- **Responsive UI** with modern React patterns (hooks, functional components)
- **Financial analysis engine** with 5 valuation models (DCF, EPV, asset-based)
- **Forensic risk scoring** with industry-standard red flags
- **Cross-platform compatibility** (Windows PowerShell, Linux/Mac Bash)

### ⚠️ Pre-Commercial Checklist
1. **Security Hardening**
   - [ ] Remove hardcoded API keys from source
   - [ ] Implement API key rotation mechanism
   - [ ] Add rate limiting middleware for live mode
   - [ ] Enable CORS configuration for production domain
   - [ ] Add authentication layer (if user accounts needed)

2. **Scalability Improvements**
   - [ ] Implement Redis/CDN for hot cache distribution
   - [ ] Add database layer for historical analysis storage
   - [ ] Set up monitoring (Sentry, LogRocket, or Datadog)
   - [ ] Configure auto-scaling for serverless functions (if using Vercel/Netlify)

3. **Legal & Compliance**
   - [ ] Review Finnhub Terms of Service for commercial use
   - [ ] Add disclaimer about financial advice (not licensed investment advisor)
   - [ ] Implement GDPR-compliant analytics (if EU users)
   - [ ] Add Terms of Service and Privacy Policy

4. **Testing & QA**
   - [ ] Add unit tests for analysis engine calculations
   - [ ] E2E tests for critical user flows (search → analyze → watchlist)
   - [ ] Load testing for concurrent user scenarios
   - [ ] Browser compatibility testing (Chrome, Firefox, Safari, Edge)

### 💰 Monetization Potential
**Free Tier**: 
- Mock mode with daily-refreshed data
- Limited to 40 pre-selected symbols
- Ads or freemium upgrade prompts

**Pro Tier** ($9-19/month):
- Live API access with real-time quotes
- Custom symbol lists (watchlist sync)
- Advanced forensics reports (PDF export)
- Email alerts for risk threshold breaches

**Enterprise Tier** ($99-299/month):
- Finnhub Pro API included (white-label cost pass-through)
- Unlimited symbols and concurrent users
- Custom valuation models
- API access to analysis engine
- SLA and priority support

**Estimated Development Time to MVP**:
- Security cleanup: 2-4 hours
- CI/CD setup: 4-6 hours  
- Basic authentication: 8-12 hours
- Stripe integration: 6-8 hours
- **Total**: 20-30 hours for commercial-ready product
