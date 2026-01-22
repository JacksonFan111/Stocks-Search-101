# Copilot Instructions for Stocks-Search-101

## Project Architecture

This is a **dual-mode stock analysis app** with ETL pipeline and forensic risk scoring:

- **Frontend**: React 18 + Vite + Tailwind CSS (SPA with view-based routing)
- **Data Layer**: ETL pipeline → Hot cache → Runtime API/Mock fallback
- **Analysis Engine**: Real-time forensic scoring (volatility, market cap, P/E, liquidity checks)

### Key Architectural Pattern: Hot Cache Strategy

The app operates in **two modes** based on `VITE_FINNHUB_API_KEY`:
1. **Live Mode**: Direct Finnhub API calls (when valid API key exists)
2. **Mock Mode**: Pre-fetched data from `public/data/hot/hotCache.json` (when no API key or `demo`)

The hot cache is populated by the ETL pipeline and loaded at runtime via `ensureHotCache()` in [src/services/finnhubAPI.js](src/services/finnhubAPI.js).

## Critical Developer Workflows

### Starting Development
```powershell
npm run dev                # Start Vite dev server (localhost:3000)
npm run fetch:daily        # Run ETL to populate hot cache (separate terminal)
```

### ETL Pipeline Execution
The `scripts/fetch-daily.js` ETL script supports **environment-driven configuration**:

```powershell
# Custom symbol list (JSON or newline/comma-separated .txt)
$env:INGEST_SYMBOLS_FILE="symbols/tech_stocks.json"; npm run fetch:daily

# Corporate proxy support (disable TLS verification)
$env:ALLOW_INSECURE_SSL="true"; npm run fetch:daily

# Concurrency tuning (default: 4 workers, 2 retries)
$env:INGEST_CONCURRENCY="8"; $env:INGEST_RETRIES="3"; npm run fetch:daily
```

**Output Structure**:
- `public/data/raw/YYYY-MM-DD/{SYMBOL}.json` - Per-symbol API responses
- `public/data/hot/hotCache.json` - Consolidated cache for browser consumption
- `public/data/manifest.json` - ETL run metadata (timing, errors, source tracking)

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

## Testing & Validation

Run API connectivity test:
```powershell
node test-apis.js          # Or: .\test-apis.ps1
```
Validates Finnhub endpoints and displays rate limit status.

## Build & Deployment

```powershell
npm run build              # Outputs to dist/
npm run preview            # Preview production build locally
```

**Pre-deployment checklist**:
1. Run ETL to refresh hot cache: `npm run fetch:daily`
2. Commit `public/data/hot/hotCache.json` (or regenerate in CI/CD)
3. Set production `VITE_FINNHUB_API_KEY` in hosting environment
4. Ensure `public/data/` directory is included in deployment artifacts

## Key Files Reference

- [src/App.jsx](src/App.jsx) - Root component, view routing, toast system
- [src/services/finnhubAPI.js](src/services/finnhubAPI.js) - API client with hot cache loader
- [scripts/fetch-daily.js](scripts/fetch-daily.js) - ETL pipeline (Node.js)
- [src/components/ForensicsAnalysis.jsx](src/components/ForensicsAnalysis.jsx) - Risk scoring UI
- [src/services/analysisEngine.js](src/services/analysisEngine.js) - Financial calculations
- [ETL_FORENSICS_SUMMARY.md](ETL_FORENSICS_SUMMARY.md) - Deep architectural docs
- [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) - Workflow quick reference
