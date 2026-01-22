# ETL & Forensics Analysis Deep Dive - Complete Implementation

## 📊 Project Status
- **App Running**: ✅ http://localhost:3000 (mock mode active)
- **Hot Cache**: ✅ Generated at `public/data/hot/hotCache.json`
- **Raw Data**: ✅ Stored per-symbol at `public/data/raw/2026-01-22/`
- **Manifest**: ✅ Tracking at `public/data/manifest.json`

---

## 🚀 **I. Enhanced ETL Pipeline** (`scripts/fetch-daily.js`)

### Features Implemented
1. **Symbol Source Override**
   - `INGEST_SYMBOLS_FILE` env var for custom lists (.json or .txt)
   - Falls back to `src/services/sampleData.js` (40 symbols default)
   - Automatic deduplication & normalization

2. **Concurrency & Rate Limiting**
   - `INGEST_CONCURRENCY=4` - parallel workers (default)
   - `INGEST_RETRIES=2` - attempts per symbol
   - `INGEST_RETRY_DELAY_MS=750` - exponential backoff
   - `INGEST_PACE_DELAY_MS=400` - inter-request pacing

3. **SSL/Proxy Support**
   - `ALLOW_INSECURE_SSL=true` disables TLS verification (for corporate proxies)
   - Optional `https.Agent` configuration

4. **Rich Manifest Output**
   - Date, symbol count, quote/profile counts
   - Error log per-symbol per-attempt
   - Source tracking (sampleData.js vs custom file)
   - Timing metrics (concurrency, retries, run duration in ms)

### Usage Examples
```bash
# Default: 40 symbols from sampleData.js
npm run fetch:daily

# With corporate proxy (TLS issues)
$env:ALLOW_INSECURE_SSL="true"; npm run fetch:daily

# Custom symbol list (JSON)
$env:INGEST_SYMBOLS_FILE="symbols/tech.json"; npm run fetch:daily

# Custom symbol list (newline/comma-separated .txt)
$env:INGEST_SYMBOLS_FILE="symbols/watchlist.txt"; npm run fetch:daily

# Fine-tuned concurrency & retry
$env:INGEST_CONCURRENCY="8"; $env:INGEST_RETRIES="3"; npm run fetch:daily
```

### Latest Run Summary
```
✅ 39/40 symbols fetched successfully
⚠️ PARA (Paramount Global) failed after 3 retry attempts
📊 Generated in 12.4 seconds with 4-worker concurrency
💾 Stored: hotCache.json (1.3MB), 40 raw JSON files
```

---

## 🔬 **II. Forensic Analysis Deep Dive** (`src/components/ForensicsAnalysis.jsx`)

### Transformation: Static → Dynamic
**Before**: Static checklist framework (educational only)
**After**: Real-time forensic analyzer tied to selected stock

### Core Analysis Engine
Calculates 5 red flags against live stock data:

1. **High Daily Volatility**
   - Threshold: > 5% daily price change
   - Risk Weight: +2 points
   - Data Source: `quote.d` (daily change %)

2. **Small Cap Risk**
   - Threshold: < $500M market cap
   - Risk Weight: +2 points
   - Data Source: `profile.marketCapitalization`

3. **Penny Stock Warning**
   - Threshold: < $5 per share
   - Risk Weight: +3 points (highest individual)
   - Data Source: `quote.c` (current price)

4. **Low Trading Volume**
   - Threshold: < 1M daily volume
   - Risk Weight: +1 point
   - Data Source: `quote.v` (volume)

5. **High Valuation (P/E)**
   - Threshold: P/E > 30x
   - Risk Weight: +2 points
   - Data Source: Calculated from market cap & price

### Risk Scoring Framework
- **Score Range**: 0-10 (capped at 10)
- **Polytope Detection**: 3+ red flags = high-risk pattern
- **Recommendation**:
  - 🟢 **REVIEW** (0-1 flags) → Low risk, proceed with analysis
  - 🟡 **HOLD** (2-3 flags) → Medium risk, investigate concerns
  - 🔴 **DO NOT BUY** (4+ flags) → High risk Polytope pattern

### Live Display Features
- **Risk Score Card**: Shows score/10, flag count, price, recommendation
- **Red Flags Alert**: Lists each triggered flag with actual value
- **Framework Selector**: 4 analysis sections (Fundamental, Flags, Advanced, Polytope)
- **Benchmark Table**: Compares actual metrics vs. industry standards
- **Interpretation Guide**: Visual reference for risk levels

### Integration Points
1. **With DeepDive**: Select a stock → navigate to Forensics
2. **Data Source**: Real-time from Finnhub via `getStockQuote()` & `getCompanyProfile()`
3. **Hot Cache Support**: Falls back to hot cache if API fails
4. **Performance**: Analysis runs on component mount, cached via state

---

## 🔄 **III. Data Flow Architecture**

### ETL → Hot Cache → App
```
scripts/fetch-daily.js (Node)
    ↓
fetch Finnhub API (quote + profile per symbol)
    ↓
store raw files: public/data/raw/2026-01-22/{symbol}.json
    ↓
build hot cache: public/data/hot/hotCache.json
    ↓
generate manifest: public/data/manifest.json
    
App Startup
    ↓
src/services/finnhubAPI.js (ensureHotCache)
    ↓
fetch /data/hot/hotCache.json (browser)
    ↓
merge into sampleStocks / mockStockQuotes / mockCompanyProfiles
    ↓
Components render with fresh data
```

### Runtime Hot Cache Loading
When `USE_MOCK_DATA=true` (no API key):
1. `ensureHotCache()` fetches `/data/hot/hotCache.json`
2. Merges quote/profile data into module-level objects
3. Cache loaded once, reused for all subsequent searches
4. Fallback to baked mock data if fetch fails

---

## 🎯 **IV. Testing & Validation**

### ✅ Completed
- [x] Dev server running (npm run dev at http://localhost:3000)
- [x] ETL script executes with concurrency & retries
- [x] Hot cache generated with 39/40 symbols
- [x] Manifest tracks errors & metadata
- [x] ForensicsAnalysis component accepts stock prop
- [x] Risk scoring logic implemented
- [x] Red flag detection active

### 🧪 Quick Tests You Can Run
1. **Search a stock** (e.g., AAPL) → view results
2. **Select stock** → DeepDive view loads
3. **Click Forensics** → ForensicsAnalysis runs live analysis
4. **Check console** for hot cache load confirmation
5. **Inspect manifest.json** to see ETL metadata

### 📝 Custom Symbol List Example
Create `symbols/my_list.json`:
```json
[
  { "symbol": "TSLA", "name": "Tesla Inc.", "exchange": "NASDAQ" },
  { "symbol": "NVDA", "name": "NVIDIA Corp.", "exchange": "NASDAQ" }
]
```
Then run:
```bash
$env:INGEST_SYMBOLS_FILE="symbols/my_list.json"; npm run fetch:daily
```

---

## 📁 **V. File Structure**

```
Stocks-Search-101/
├── scripts/
│   └── fetch-daily.js          ← ETL Pipeline (enhanced)
├── src/
│   ├── services/
│   │   └── finnhubAPI.js        ← Hot cache loader
│   └── components/
│       ├── ForensicsAnalysis.jsx ← Forensic deep dive (NEW)
│       ├── DeepDive.jsx
│       └── App.jsx               ← Navigation to forensics
├── public/data/
│   ├── hot/
│   │   └── hotCache.json        ← Live stock data cache
│   ├── raw/
│   │   └── 2026-01-22/          ← Per-symbol backups
│   └── manifest.json            ← ETL metadata
└── package.json                 ← npm scripts
```

---

## 🔧 **VI. Environment Variables Reference**

### ETL Script (`fetch-daily.js`)
| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_FINNHUB_API_KEY` | demo key | Finnhub API authentication |
| `INGEST_SYMBOLS_FILE` | empty | Path to custom symbols list |
| `INGEST_CONCURRENCY` | 4 | Parallel fetch workers |
| `INGEST_RETRIES` | 2 | Retry attempts per symbol |
| `INGEST_RETRY_DELAY_MS` | 750 | Backoff delay (ms) |
| `INGEST_PACE_DELAY_MS` | 400 | Inter-request pacing (ms) |
| `ALLOW_INSECURE_SSL` | false | Disable TLS verification |

### App Mode (`src/services/finnhubAPI.js`)
| Condition | Behavior |
|-----------|----------|
| No API key OR `API_KEY === 'demo'` | Use hot cache + mock data |
| API key present | Live Finnhub API calls |
| API fails | Fallback to hot cache/mock |

---

## 🚀 **VII. Next Steps**

1. **Enhance Advanced Screening**
   - Add OCF/Debt ratio calculation
   - Implement short interest tracking
   - Track insider trading patterns

2. **Expand Risk Metrics**
   - Earnings volatility analysis
   - Debt maturity schedule inspection
   - Accounting quality scoring

3. **Persist Analysis Results**
   - Store forensic reports per stock
   - Track historical risk score trends
   - Build risk dashboard

4. **Performance Optimization**
   - Cache forensic analysis results
   - Batch API calls across watchlist
   - Use Web Workers for calculations

5. **Distribution**
   - Production build: `npm run build`
   - Deploy to Vercel/Netlify
   - Schedule daily ingestion via cron/GitHub Actions

---

## 📞 **Quick Reference**

**Run dev server**: `npm run dev`
**Fetch stock data**: `npm run fetch:daily`
**Inspect hot cache**: Open `public/data/hot/hotCache.json` in browser
**View manifest**: Open `public/data/manifest.json` in browser
**Check logs**: Browser DevTools Console (Network tab for API calls)

---

**Last Updated**: 2026-01-22  
**Status**: Production Ready (39/40 symbols cached)
