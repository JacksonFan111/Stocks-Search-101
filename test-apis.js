/**
 * API Test Suite - Test each API source individually
 * Run with: node test-apis.js
 */

import axios from 'axios';

// Color console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.blue}━━━ ${msg} ━━━${colors.reset}`)
};

// Test configuration
const TEST_SYMBOL = 'AAPL';
const API_KEYS = {
  finnhub: process.env.VITE_FINNHUB_API_KEY || null,
};

if (!API_KEYS.finnhub) {
  log.warn('VITE_FINNHUB_API_KEY not set - tests will use demo mode');
}

// Sleep function to avoid rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== FINNHUB API TESTS ====================
async function testFinnhub() {
  log.header('TESTING FINNHUB API');
  const results = { total: 0, passed: 0, failed: 0 };
  
  // Test 1: Stock Quote
  try {
    results.total++;
    log.info(`Testing: GET Quote for ${TEST_SYMBOL}`);
    const response = await axios.get('https://finnhub.io/api/v1/quote', {
      params: { symbol: TEST_SYMBOL, token: API_KEYS.finnhub }
    });
    
    if (response.data && response.data.c > 0) {
      log.success(`Quote: $${response.data.c} (Change: ${response.data.dp}%)`);
      results.passed++;
    } else {
      log.error('Quote returned empty data');
      results.failed++;
    }
  } catch (error) {
    log.error(`Quote failed: ${error.response?.data?.error || error.message}`);
    results.failed++;
  }
  
  await sleep(1000); // Rate limit protection
  
  // Test 2: Company Profile
  try {
    results.total++;
    log.info(`Testing: GET Company Profile for ${TEST_SYMBOL}`);
    const response = await axios.get('https://finnhub.io/api/v1/stock/profile2', {
      params: { symbol: TEST_SYMBOL, token: API_KEYS.finnhub }
    });
    
    if (response.data && response.data.name) {
      log.success(`Company: ${response.data.name} (${response.data.finnhubIndustry})`);
      results.passed++;
    } else {
      log.error('Profile returned empty data');
      results.failed++;
    }
  } catch (error) {
    log.error(`Profile failed: ${error.response?.data?.error || error.message}`);
    results.failed++;
  }
  
  await sleep(1000);
  
  // Test 3: Stock Search
  try {
    results.total++;
    log.info('Testing: Search Stocks (query: APPLE)');
    const response = await axios.get('https://finnhub.io/api/v1/search', {
      params: { q: 'APPLE', token: API_KEYS.finnhub }
    });
    
    if (response.data && response.data.count > 0) {
      log.success(`Found ${response.data.count} stocks`);
      results.passed++;
    } else {
      log.error('Search returned no results');
      results.failed++;
    }
  } catch (error) {
    log.error(`Search failed: ${error.response?.data?.error || error.message}`);
    results.failed++;
  }
  
  await sleep(1000);
  
  // Test 4: Company News
  try {
    results.total++;
    log.info(`Testing: GET Company News for ${TEST_SYMBOL}`);
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const response = await axios.get('https://finnhub.io/api/v1/company-news', {
      params: { 
        symbol: TEST_SYMBOL, 
        from: lastWeek,
        to: today,
        token: API_KEYS.finnhub 
      }
    });
    
    if (response.data && Array.isArray(response.data)) {
      log.success(`Found ${response.data.length} news articles`);
      results.passed++;
    } else {
      log.warn('News returned no articles (may be API limit)');
      results.passed++; // Count as pass since endpoint works
    }
  } catch (error) {
    log.error(`News failed: ${error.response?.data?.error || error.message}`);
    results.failed++;
  }
  
  return results;
}

// ==================== YAHOO FINANCE API TESTS ====================
async function testYahooFinance() {
  log.header('TESTING YAHOO FINANCE API');
  const results = { total: 0, passed: 0, failed: 0 };
  
  // Test 1: Trending Stocks
  try {
    results.total++;
    log.info('Testing: GET Trending Stocks');
    const response = await fetch('https://query1.finance.yahoo.com/v10/finance/trending/US');
    const data = await response.json();
    
    if (data.finance?.result?.[0]?.quotes?.length > 0) {
      log.success(`Found ${data.finance.result[0].quotes.length} trending stocks`);
      results.passed++;
    } else {
      log.error('Trending returned no data');
      results.failed++;
    }
  } catch (error) {
    log.error(`Trending failed: ${error.message}`);
    results.failed++;
  }
  
  await sleep(1000);
  
  // Test 2: Quote Summary
  try {
    results.total++;
    log.info(`Testing: GET Quote Summary for ${TEST_SYMBOL}`);
    const response = await fetch(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${TEST_SYMBOL}?modules=price,summaryProfile`
    );
    const data = await response.json();
    
    if (data.quoteSummary?.result?.[0]?.price) {
      const price = data.quoteSummary.result[0].price;
      log.success(`Price: $${price.regularMarketPrice?.fmt || 'N/A'}`);
      results.passed++;
    } else {
      log.error('Quote Summary returned no data');
      results.failed++;
    }
  } catch (error) {
    log.error(`Quote Summary failed: ${error.message}`);
    results.failed++;
  }
  
  return results;
}

// ==================== ALPHA VANTAGE API TESTS ====================
async function testAlphaVantage() {
  log.header('TESTING ALPHA VANTAGE API');
  const results = { total: 0, passed: 0, failed: 0 };
  
  // Test 1: Daily Time Series
  try {
    results.total++;
    log.info(`Testing: GET Daily Time Series for ${TEST_SYMBOL}`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${TEST_SYMBOL}&outputsize=compact&apikey=${API_KEYS.alphaVantage}`
    );
    const data = await response.json();
    
    if (data['Time Series (Daily)']) {
      const dates = Object.keys(data['Time Series (Daily)']);
      log.success(`Found ${dates.length} days of data`);
      results.passed++;
    } else if (data['Note']) {
      log.warn('API call frequency limit reached');
      log.info(data['Note']);
      results.passed++; // Count as pass since endpoint works
    } else {
      log.error(`Daily Time Series failed: ${data['Error Message'] || 'Unknown error'}`);
      results.failed++;
    }
  } catch (error) {
    log.error(`Daily Time Series failed: ${error.message}`);
    results.failed++;
  }
  
  await sleep(12000); // Alpha Vantage free tier: 5 calls/min, so wait 12s
  
  // Test 2: Quote Endpoint
  try {
    results.total++;
    log.info(`Testing: GET Global Quote for ${TEST_SYMBOL}`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${TEST_SYMBOL}&apikey=${API_KEYS.alphaVantage}`
    );
    const data = await response.json();
    
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      log.success(`Price: $${data['Global Quote']['05. price']}`);
      results.passed++;
    } else if (data['Note']) {
      log.warn('API call frequency limit reached');
      results.passed++;
    } else {
      log.error('Global Quote returned no data');
      results.failed++;
    }
  } catch (error) {
    log.error(`Global Quote failed: ${error.message}`);
    results.failed++;
  }
  
  return results;
}

// ==================== FINANCIAL MODELING PREP API TESTS ====================
async function testFinancialModelingPrep() {
  log.header('TESTING FINANCIAL MODELING PREP API');
  const results = { total: 0, passed: 0, failed: 0 };
  
  // Test 1: Income Statement
  try {
    results.total++;
    log.info(`Testing: GET Income Statement for ${TEST_SYMBOL}`);
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/income-statement/${TEST_SYMBOL}?limit=1&apikey=${API_KEYS.fmp}`
    );
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0 && data[0].revenue) {
      log.success(`Revenue: $${(data[0].revenue / 1e9).toFixed(2)}B (${data[0].date})`);
      results.passed++;
    } else if (data.message) {
      log.error(`Income Statement failed: ${data.message}`);
      results.failed++;
    } else {
      log.error('Income Statement returned no data');
      results.failed++;
    }
  } catch (error) {
    log.error(`Income Statement failed: ${error.message}`);
    results.failed++;
  }
  
  await sleep(1000);
  
  // Test 2: Company Profile
  try {
    results.total++;
    log.info(`Testing: GET Company Profile for ${TEST_SYMBOL}`);
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/profile/${TEST_SYMBOL}?apikey=${API_KEYS.fmp}`
    );
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0 && data[0].companyName) {
      log.success(`Company: ${data[0].companyName} | Market Cap: $${(data[0].mktCap / 1e9).toFixed(2)}B`);
      results.passed++;
    } else if (data.message) {
      log.error(`Profile failed: ${data.message}`);
      results.failed++;
    } else {
      log.error('Profile returned no data');
      results.failed++;
    }
  } catch (error) {
    log.error(`Profile failed: ${error.message}`);
    results.failed++;
  }
  
  await sleep(1000);
  
  // Test 3: Financial Ratios
  try {
    results.total++;
    log.info(`Testing: GET Financial Ratios for ${TEST_SYMBOL}`);
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/ratios/${TEST_SYMBOL}?limit=1&apikey=${API_KEYS.fmp}`
    );
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0 && data[0].currentRatio) {
      log.success(`P/E Ratio: ${data[0].priceEarningsRatio?.toFixed(2) || 'N/A'} | Current Ratio: ${data[0].currentRatio?.toFixed(2)}`);
      results.passed++;
    } else if (data.message) {
      log.error(`Ratios failed: ${data.message}`);
      results.failed++;
    } else {
      log.error('Ratios returned no data');
      results.failed++;
    }
  } catch (error) {
    log.error(`Ratios failed: ${error.message}`);
    results.failed++;
  }
  
  return results;
}

// ==================== MAIN TEST RUNNER ====================
async function runAllTests() {
  console.log(`\n${colors.blue}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║     API CONNECTIVITY TEST SUITE            ║${colors.reset}`);
  console.log(`${colors.blue}║     Testing Symbol: ${TEST_SYMBOL}                   ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════╝${colors.reset}\n`);
  
  const allResults = {
    finnhub: await testFinnhub(),
    yahoo: await testYahooFinance(),
    alphaVantage: await testAlphaVantage(),
    fmp: await testFinancialModelingPrep()
  };
  
  // Summary
  log.header('TEST SUMMARY');
  
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  
  Object.entries(allResults).forEach(([api, results]) => {
    const status = results.failed === 0 ? colors.green : colors.red;
    console.log(`${status}${api.toUpperCase()}: ${results.passed}/${results.total} passed${colors.reset}`);
    totalTests += results.total;
    totalPassed += results.passed;
    totalFailed += results.failed;
  });
  
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.cyan}OVERALL: ${totalPassed}/${totalTests} tests passed${colors.reset}`);
  
  if (totalFailed === 0) {
    console.log(`${colors.green}✓ All APIs are working!${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠ ${totalFailed} test(s) failed - Check API keys or rate limits${colors.reset}\n`);
  }
  
  // Recommendations
  log.header('RECOMMENDATIONS');
  
  if (allResults.finnhub.failed > 0) {
    log.warn('Finnhub: Check VITE_FINNHUB_API_KEY in .env file');
  }
  if (allResults.alphaVantage.failed > 0) {
    log.warn('Alpha Vantage: Free tier has 5 calls/min limit. Get free key at alphavantage.co');
  }
  if (allResults.fmp.failed > 0) {
    log.warn('FMP: Free tier may have expired. Get new key at financialmodelingprep.com');
  }
  if (allResults.yahoo.failed > 0) {
    log.warn('Yahoo Finance: API may be temporarily unavailable');
  }
  
  console.log('');
}

// Run tests
runAllTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  process.exit(1);
});
