# 🚀 Quick Start: ETL + Forensic Analysis

## ⚡ 30-Second Start

```powershell
# Terminal 1: Start app
npm run dev
# Opens http://localhost:3000

# Terminal 2: Fetch latest data
npm run fetch:daily
```

Done! App now has fresh stock data from Finnhub.

---

## 🎯 Workflows

### Workflow 1: Use Default 40 Stocks
```powershell
npm run fetch:daily
# ✅ Fetches all 40 symbols from sampleData.js
# ✅ Generates hot cache with 39-40 quotes/profiles
# ✅ App loads hot cache on startup
```

### Workflow 2: Use Custom Symbol List
```powershell
# Create your list: symbols/my_stocks.json
# [{"symbol":"AAPL","name":"Apple Inc.","exchange":"NASDAQ"}, ...]

$env:INGEST_SYMBOLS_FILE="symbols/my_stocks.json"
npm run fetch:daily
# ✅ Only fetches YOUR symbols
```

### Workflow 3: Behind Corporate Proxy (TLS Issues)
```powershell
$env:ALLOW_INSECURE_SSL="true"
npm run fetch:daily
# ✅ Disables certificate verification
# ⚠️ Only use in secure/testing environments
```

### Workflow 4: Faster Ingestion (More Workers)
```powershell
$env:INGEST_CONCURRENCY="8"
npm run fetch:daily
# ✅ 8 parallel workers (default is 4)
# ⚠️ May trigger rate limits with large lists
```

---

## 🔍 Using Forensic Analysis

### Step 1: Search a Stock
1. Open http://localhost:3000
2. Click "Search" in navigation
3. Enter symbol: `TSLA`
4. Click on result

### Step 2: View Deep Analysis
- Detailed metrics, charts, valuations displayed
- Historical price trends, risk scores visible

### Step 3: Run Forensic Analysis
- Click "Forensics" in navigation
- Real-time risk scoring begins
- Red flags highlighted with actual values

### Risk Score Interpretation
| Score | Flags | Recommendation | Action |
|-------|-------|-----------------|--------|
| 0-3   | 0-1   | 🟢 REVIEW       | Proceed with caution |
| 4-6   | 2-3   | 🟡 HOLD         | Investigate concerns |
| 7-10  | 4+    | 🔴 DO NOT BUY   | Avoid this stock |

---

## 📊 Data Files

### Hot Cache (Runtime)
```
public/data/hot/hotCache.json
├── sampleStocks: [40 stock objects]
├── mockStockQuotes: {AAPL: {...}, MSFT: {...}, ...}
├── mockCompanyProfiles: {AAPL: {...}, MSFT: {...}, ...}
└── fetchedAt: "2026-01-22T02:03:15.160Z"
```

### Manifest (Metadata)
```
public/data/manifest.json
├── date: "2026-01-22"
├── symbols: 8
├── quotes: 8
├── profiles: 8
├── errors: []
├── symbolSource: "symbols/tech_stocks.json"
├── runMs: 2042
└── ... (concurrency, retries, pacing settings)
```

### Raw Backups (Per-Symbol)
```
public/data/raw/2026-01-22/
├── AAPL.json
├── MSFT.json
├── ... (one file per symbol)
└── TSLA.json
```

---

## 🐛 Troubleshooting

### Issue: "Hot cache load skipped"
**Cause**: Fetch `/data/hot/hotCache.json` failed  
**Fix**: Run `npm run fetch:daily` to generate cache first

### Issue: Only 0 quotes/profiles fetched
**Cause**: Finnhub API errors or TLS issues  
**Fix**: 
1. Check API key: `echo $env:VITE_FINNHUB_API_KEY`
2. Try: `$env:ALLOW_INSECURE_SSL="true"; npm run fetch:daily`

### Issue: Forensic analysis shows "N/A" for all metrics
**Cause**: Stock data not loaded  
**Fix**: Ensure stock was selected before viewing Forensics

### Issue: App shows mock data instead of fresh data
**Cause**: Hot cache not generated yet  
**Fix**: Run `npm run fetch:daily`, then refresh browser

---

## 🎓 Architecture at a Glance

```
npm run fetch:daily
    ↓
Finnhub API (4 concurrent workers)
    ↓
public/data/hot/hotCache.json (generated)
    ↓
Browser fetch on app start
    ↓
ensureHotCache() merges data into state
    ↓
Components use fresh data
    ↓
Forensic analysis runs real-time
    ↓
Risk scores calculated
    ↓
🟢 REVIEW / 🟡 HOLD / 🔴 DO NOT BUY
```

---

## 🎁 Bonus: Custom Symbol File Examples

### Tech Giants (tech_stocks.json)
```json
[
  {"symbol":"AAPL","name":"Apple Inc.","exchange":"NASDAQ"},
  {"symbol":"MSFT","name":"Microsoft","exchange":"NASDAQ"},
  {"symbol":"GOOGL","name":"Alphabet","exchange":"NASDAQ"}
]
```

### Simple List (watchlist.txt)
```
AAPL
MSFT
GOOGL
TSLA
```

### Comma-Separated (tickers.txt)
```
AAPL, MSFT, GOOGL, TSLA, NVDA
```

---

## 📱 Mobile Responsive
- App works on mobile (responsive design)
- Forensic analysis optimized for all screen sizes
- Charts and metrics stack on small screens

---

## 🔐 Security Notes
- ⚠️ `ALLOW_INSECURE_SSL` only for dev/testing
- API key stored in `VITE_FINNHUB_API_KEY` env var
- Hot cache is static JSON (no sensitive data)
- No user data persisted by default

---

## 🚀 Production Deployment

### Build for Production
```powershell
npm run build
# Creates dist/ folder with optimized app
```

### Deploy to Vercel
```powershell
npm i -g vercel
vercel
# Follow prompts, auto-deploys from Git
```

### Deploy to Netlify
```powershell
npm run build
# Drag dist/ folder to netlify.com
# Or use: netlify deploy
```

### Set Environment Variables
```
VITE_FINNHUB_API_KEY = your_actual_api_key
```

---

## 💡 Pro Tips

1. **Refresh data daily**: Schedule `npm run fetch:daily` via cron or GitHub Actions
2. **Monitor manifest.json**: Check error count to track API health
3. **Custom watchlists**: Create different symbol files for different portfolios
4. **Batch analysis**: Use high concurrency for large symbol lists
5. **Rate limiting**: If getting 429 errors, increase `INGEST_PACE_DELAY_MS`

---

## 📞 Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run fetch:daily` | Ingest stock data & generate hot cache |
| `npm run build` | Production build (creates dist/) |
| `npm run preview` | Preview production build |

---

## ✅ Validation Checklist

Before going live:
- [ ] Run `npm run dev` - server starts
- [ ] Run `npm run fetch:daily` - data fetched successfully
- [ ] Search a stock in UI - results display
- [ ] Click "Forensics" - analysis loads without errors
- [ ] Check manifest.json - 0 errors (or acceptable count)
- [ ] Check hot cache - contains quote/profile data

---

**Last Updated**: 2026-01-22  
**Status**: Production Ready ✅
