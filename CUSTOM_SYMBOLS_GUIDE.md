# Custom Symbols Ingestion Guide

## Overview
The ETL pipeline supports loading custom stock lists instead of the default 40 symbols. Use this guide to set up your own watchlist for ingestion.

---

## Option 1: JSON Format

### Create `symbols/my_stocks.json`
```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "description": "Tech company",
    "displaySymbol": "NASDAQ:AAPL",
    "type": "Common Stock",
    "exchange": "NASDAQ"
  },
  {
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "description": "EV Manufacturer",
    "displaySymbol": "NASDAQ:TSLA",
    "type": "Common Stock",
    "exchange": "NASDAQ"
  }
]
```

### Run ETL
```powershell
$env:INGEST_SYMBOLS_FILE="symbols/my_stocks.json"
npm run fetch:daily
```

---

## Option 2: Text Format (Symbols Only)

### Create `symbols/watchlist.txt`
```
AAPL
MSFT
GOOGL
AMZN
NVDA
META
TSLA
```

or comma-separated:
```
AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA
```

### Run ETL
```powershell
$env:INGEST_SYMBOLS_FILE="symbols/watchlist.txt"
npm run fetch:daily
```

---

## Full Usage Examples

### Tech Stocks Portfolio
```powershell
$env:INGEST_SYMBOLS_FILE="symbols/tech_portfolio.txt"
$env:INGEST_CONCURRENCY="8"
npm run fetch:daily
```

### Custom with Higher Concurrency & Retries
```powershell
$env:INGEST_SYMBOLS_FILE="symbols/my_list.json"
$env:INGEST_CONCURRENCY="6"
$env:INGEST_RETRIES="3"
$env:INGEST_RETRY_DELAY_MS="1000"
npm run fetch:daily
```

### Behind Corporate Proxy (TLS Issues)
```powershell
$env:INGEST_SYMBOLS_FILE="symbols/my_list.json"
$env:ALLOW_INSECURE_SSL="true"
npm run fetch:daily
```

---

## Expected Output

### Success
```
Starting daily fetch for 40 symbols on 2026-01-22 (concurrency=4, retries=2)
Worker 1 fetching AAPL...
Worker 2 fetching MSFT...
...
Done. Quotes: 39, Profiles: 39, Errors: 8
```

### Manifest File (`public/data/manifest.json`)
```json
{
  "date": "2026-01-22",
  "symbols": 40,
  "quotes": 39,
  "profiles": 39,
  "errors": [
    "Quote empty for PARA (attempt 1)",
    "Quote empty for PARA (attempt 2)",
    "Quote empty for PARA (attempt 3)"
  ],
  "generatedAt": "2026-01-22T01:59:29.986Z",
  "symbolSource": "symbols/my_stocks.json",
  "allowInsecureSsl": true,
  "concurrency": 4,
  "retries": 2,
  "retryDelayMs": 750,
  "paceDelayMs": 400,
  "runMs": 12449
}
```

---

## Raw Data Storage

Raw API responses are backed up per-symbol:
- **Location**: `public/data/raw/2026-01-22/{SYMBOL}.json`
- **Format**:
  ```json
  {
    "quote": { "c": 230.45, "h": 235.20, "l": 228.30, "o": 229.50, "pc": 225.60, "t": 1674345600000, "v": 52847392 },
    "profile": { "name": "Apple Inc.", "marketCapitalization": 2800000, "shareOutstanding": 12156.4, "finnhubIndustry": "Technology", ... }
  }
  ```

---

## Troubleshooting

### "Symbols file missing"
- Check file path is relative to project root
- Use forward slashes: `symbols/my_file.json` NOT `symbols\my_file.json`
- Verify file exists: `ls symbols/my_file.json`

### "Symbols file empty after parsing"
- JSON must be valid array of objects
- Text file must have one symbol per line or comma-separated
- Check for encoding issues (UTF-8 required)

### "ALLOW_INSECURE_SSL" errors still occurring
- May need additional proxy settings
- Try with valid Finnhub API key instead
- Check corporate firewall rules

### Low quote/profile counts
- Check `manifest.json` errors array for per-symbol failures
- Some symbols may not be available in Finnhub
- Consider increasing `INGEST_RETRIES`

---

## Advanced: Batch Ingestion

### Schedule Daily Runs (Windows Task Scheduler)
```batch
cd C:\path\to\Stocks-Search-101
@echo off
call npm run fetch:daily >> logs\ingest.log 2>&1
```

### Or via GitHub Actions (`.github/workflows/daily-ingest.yml`)
```yaml
name: Daily Ingest
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily

jobs:
  ingest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: INGEST_SYMBOLS_FILE="symbols/main_watchlist.json" npm run fetch:daily
      - uses: actions/upload-artifact@v3
        with:
          name: ingest-manifest
          path: public/data/manifest.json
```

---

**Pro Tip**: Keep your hot cache fresh by running `npm run fetch:daily` daily. The app will use the latest data automatically!
