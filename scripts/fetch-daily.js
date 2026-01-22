import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { sampleStocks as defaultStocks } from '../src/services/sampleData.js';

// Config
const FINNHUB_KEY = process.env.VITE_FINNHUB_API_KEY;

// Validate API key is provided
if (!FINNHUB_KEY) {
  console.error('❌ VITE_FINNHUB_API_KEY environment variable is required!');
  console.error('   Set it in your .env file or pass as environment variable');
  process.exit(1);
}
const DATE_STR = new Date().toISOString().slice(0, 10);
const allowInsecureSsl = process.env.ALLOW_INSECURE_SSL === 'true';
const SYMBOLS_FILE = process.env.INGEST_SYMBOLS_FILE || '';
const MAX_CONCURRENCY = parseInt(process.env.INGEST_CONCURRENCY || '4', 10);
const RETRIES = parseInt(process.env.INGEST_RETRIES || '2', 10);
const RETRY_DELAY_MS = parseInt(process.env.INGEST_RETRY_DELAY_MS || '750', 10);
const PACE_DELAY_MS = parseInt(process.env.INGEST_PACE_DELAY_MS || '400', 10);

const axiosClient = axios.create({
  timeout: 10000,
  httpsAgent: allowInsecureSsl ? new https.Agent({ rejectUnauthorized: false }) : undefined
});

if (allowInsecureSsl) {
  console.warn('Warning: ALLOW_INSECURE_SSL enabled. TLS verification is disabled.');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'public', 'data');
const rawDir = path.join(dataDir, 'raw', DATE_STR);
const hotDir = path.join(dataDir, 'hot');

// Utilities
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const normalizeStock = (item) => {
  if (typeof item === 'string') {
    return {
      symbol: item.trim(),
      name: item.trim(),
      description: item.trim(),
      displaySymbol: item.trim(),
      type: 'Equity',
      exchange: 'UNKNOWN'
    };
  }
  const symbol = item.symbol?.trim();
  if (!symbol) return null;
  return {
    symbol,
    name: item.name || symbol,
    description: item.description || symbol,
    displaySymbol: item.displaySymbol || symbol,
    type: item.type || 'Equity',
    exchange: item.exchange || 'UNKNOWN'
  };
};

const loadSymbols = async () => {
  if (!SYMBOLS_FILE) return defaultStocks;
  const candidate = path.isAbsolute(SYMBOLS_FILE) ? SYMBOLS_FILE : path.join(rootDir, SYMBOLS_FILE);
  if (!fs.existsSync(candidate)) {
    console.warn(`Symbols file missing (${candidate}); falling back to sampleData.js`);
    return defaultStocks;
  }

  try {
    const raw = fs.readFileSync(candidate, 'utf8');
    const isJson = candidate.toLowerCase().endsWith('.json');
    const parsed = isJson ? JSON.parse(raw) : raw.split(/[\n,\r]+/).map((s) => s.trim()).filter(Boolean);
    const normalized = parsed
      .map((item) => normalizeStock(item))
      .filter(Boolean)
      .filter((item, idx, arr) => arr.findIndex((it) => it.symbol === item.symbol) === idx);

    if (!normalized.length) {
      console.warn('Symbols file empty after parsing; falling back to sampleData.js');
      return defaultStocks;
    }

    return normalized;
  } catch (err) {
    console.warn(`Failed to parse symbols file; using sampleData.js. Reason: ${err.message}`);
    return defaultStocks;
  }
};

// Fetch helpers with retry
async function fetchFinnhubQuote(symbol, errors) {
  const url = 'https://finnhub.io/api/v1/quote';
  const params = { symbol, token: FINNHUB_KEY };

  for (let attempt = 1; attempt <= RETRIES + 1; attempt++) {
    try {
      const { data } = await axiosClient.get(url, { params });
      if (data && data.c > 0) return data;
      const message = `Quote empty for ${symbol} (attempt ${attempt})`;
      errors.push(message);
      console.warn(message);
    } catch (err) {
      const message = `Quote error for ${symbol} (attempt ${attempt}): ${err.message}`;
      errors.push(message);
      console.warn(message);
    }

    if (attempt <= RETRIES) await delay(RETRY_DELAY_MS * attempt);
  }

  return null;
}

async function fetchFinnhubProfile(symbol, errors) {
  const url = 'https://finnhub.io/api/v1/stock/profile2';
  const params = { symbol, token: FINNHUB_KEY };

  for (let attempt = 1; attempt <= RETRIES + 1; attempt++) {
    try {
      const { data } = await axiosClient.get(url, { params });
      if (data && Object.keys(data).length > 0) return data;
      const message = `Profile empty for ${symbol} (attempt ${attempt})`;
      errors.push(message);
      console.warn(message);
    } catch (err) {
      const message = `Profile error for ${symbol} (attempt ${attempt}): ${err.message}`;
      errors.push(message);
      console.warn(message);
    }

    if (attempt <= RETRIES) await delay(RETRY_DELAY_MS * attempt);
  }

  return null;
}

async function main() {
  const start = Date.now();
  const stocks = await loadSymbols();

  console.log(`Starting daily fetch for ${stocks.length} symbols on ${DATE_STR} (concurrency=${MAX_CONCURRENCY}, retries=${RETRIES})`);
  ensureDir(rawDir);
  ensureDir(hotDir);

  const mockStockQuotes = {};
  const mockCompanyProfiles = {};
  const errors = [];

  let idx = 0;
  const worker = async (workerId) => {
    while (true) {
      const current = idx;
      idx += 1;
      if (current >= stocks.length) return;

      const stock = stocks[current];
      const symbol = stock.symbol;
      console.log(`Worker ${workerId} fetching ${symbol}...`);

      const quote = await fetchFinnhubQuote(symbol, errors);
      const profile = await fetchFinnhubProfile(symbol, errors);

      if (quote) {
        mockStockQuotes[symbol] = quote;
      } else {
        errors.push(`Quote missing after retries for ${symbol}`);
      }

      if (profile) {
        mockCompanyProfiles[symbol] = profile;
      } else {
        errors.push(`Profile missing after retries for ${symbol}`);
      }

      const rawPath = path.join(rawDir, `${symbol}.json`);
      fs.writeFileSync(rawPath, JSON.stringify({ quote, profile }, null, 2));

      if (PACE_DELAY_MS > 0) await delay(PACE_DELAY_MS);
    }
  };

  await Promise.all(Array.from({ length: Math.max(1, MAX_CONCURRENCY) }, (_, i) => worker(i + 1)));

  const hotPayload = { sampleStocks: stocks, mockStockQuotes, mockCompanyProfiles, fetchedAt: new Date().toISOString() };
  const hotPath = path.join(hotDir, 'hotCache.json');
  fs.writeFileSync(hotPath, JSON.stringify(hotPayload, null, 2));

  const manifest = {
    date: DATE_STR,
    symbols: stocks.length,
    quotes: Object.keys(mockStockQuotes).length,
    profiles: Object.keys(mockCompanyProfiles).length,
    errors,
    generatedAt: new Date().toISOString(),
    symbolSource: SYMBOLS_FILE || 'sampleData.js',
    allowInsecureSsl,
    concurrency: MAX_CONCURRENCY,
    retries: RETRIES,
    retryDelayMs: RETRY_DELAY_MS,
    paceDelayMs: PACE_DELAY_MS,
    runMs: Date.now() - start
  };

  fs.writeFileSync(path.join(dataDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`Done. Quotes: ${manifest.quotes}, Profiles: ${manifest.profiles}, Errors: ${errors.length}`);
}

main().catch((err) => {
  console.error('Fetch failed', err);
  process.exit(1);
});
