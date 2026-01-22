 # PowerShell API Test Script - Tests each API source
 
 Write-Host "`n========================================" -ForegroundColor Cyan
 Write-Host "  API CONNECTIVITY TEST SUITE" -ForegroundColor Cyan  
 Write-Host "  Testing Symbol: AAPL" -ForegroundColor Cyan
 Write-Host "========================================`n" -ForegroundColor Cyan
 
 $testSymbol = "AAPL"
 $results = @{total=0; passed=0; failed=0}
 
 Write-Host "`n--- TESTING FINNHUB API ---`n" -ForegroundColor Blue
 
 # Finnhub Test 1: Stock Quote  
 try {
     $results.total++
     Write-Host "Test: Finnhub Stock Quote (AAPL)..." -NoNewline
     $url = "https://finnhub.io/api/v1/quote?symbol=AAPL&token=d5na9lhr01ql6sfqd5e0d5na9lhr01ql6sfqd5eg"
     $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
     if ($response.c -gt 0) {
         Write-Host " PASS (Price: `$$($response.c))" -ForegroundColor Green
         $results.passed++
     } else {
         Write-Host " FAIL" -ForegroundColor Red
         $results.failed++
     }
 } catch {
     Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
     $results.failed++
 }
 
 Start-Sleep -Seconds 1
 
 # Finnhub Test 2: Company Profile
 try {
     $results.total++
     Write-Host "Test: Finnhub Company Profile (AAPL)..." -NoNewline
     $url = "https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=d5na9lhr01ql6sfqd5e0d5na9lhr01ql6sfqd5eg"
     $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
     if ($response.name) {
         Write-Host " PASS ($($response.name))" -ForegroundColor Green
         $results.passed++
     } else {
         Write-Host " FAIL" -ForegroundColor Red
         $results.failed++
     }
 } catch {
     Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
     $results.failed++
 }
 
 Write-Host "`n--- TESTING YAHOO FINANCE API ---`n" -ForegroundColor Blue
 
 # Yahoo Test 1: Trending Stocks
 try {
     $results.total++
     Write-Host "Test: Yahoo Finance Trending Stocks..." -NoNewline
     $url = "https://query1.finance.yahoo.com/v10/finance/trending/US"
     $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
     if ($response.finance.result[0].quotes.Count -gt 0) {
         Write-Host " PASS (Found $($response.finance.result[0].quotes.Count) stocks)" -ForegroundColor Green
         $results.passed++
     } else {
         Write-Host " FAIL" -ForegroundColor Red
         $results.failed++
     }
 } catch {
     Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
     $results.failed++
 }
 
 Write-Host "`n--- TESTING ALPHA VANTAGE API ---`n" -ForegroundColor Blue
 Write-Host "(Note: Free tier has 5 calls/min limit)" -ForegroundColor Yellow
 
 # Alpha Vantage Test 1: Global Quote
 try {
     $results.total++
     Write-Host "Test: Alpha Vantage Global Quote..." -NoNewline
     $url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=HOR6ZHVJ8U0GGVE4"
     $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
     if ($response.'Global Quote'.'05. price' -or $response.Note) {
         Write-Host " PASS" -ForegroundColor Green
         $results.passed++
     } else {
         Write-Host " FAIL" -ForegroundColor Red
         $results.failed++
     }
 } catch {
     Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
     $results.failed++
 }
 
 Write-Host "`n--- TESTING FINANCIAL MODELING PREP API ---`n" -ForegroundColor Blue
 
 # FMP Test 1: Company Profile
 try {
     $results.total++
     Write-Host "Test: FMP Company Profile..." -NoNewline
     $url = "https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=Hc1TctggUGJUJf0iHoVOYv2y49YN1s73"
     $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
     if ($response.Count -gt 0 -and $response[0].companyName) {
         Write-Host " PASS ($($response[0].companyName))" -ForegroundColor Green
         $results.passed++
     } else {
         Write-Host " FAIL" -ForegroundColor Red
         $results.failed++
     }
 } catch {
     Write-Host " FAIL - $($_.Exception.Message)" -ForegroundColor Red
     $results.failed++
 }
 
 Write-Host "`n--- TEST SUMMARY ---`n" -ForegroundColor Blue
 Write-Host "Total Tests: $($results.total)" -ForegroundColor Cyan
 Write-Host "Passed: $($results.passed)" -ForegroundColor Green
 Write-Host "Failed: $($results.failed)" -ForegroundColor Red
 
 if ($results.failed -eq 0) {
     Write-Host "`nAll APIs are working!" -ForegroundColor Green
 } else {
     Write-Host "`nSome tests failed" -ForegroundColor Yellow
 }
 Write-Host ""
# Tests each API source one at a time

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     API CONNECTIVITY TEST SUITE            ║" -ForegroundColor Cyan
Write-Host "║     Testing Symbol: AAPL                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$testSymbol = "AAPL"
$apiKeys = @{
    finnhub = $env:VITE_FINNHUB_API_KEY
    alphaVantage = "HOR6ZHVJ8U0GGVE4"
    fmp = "Hc1TctggUGJUJf0iHoVOYv2y49YN1s73"
}

# Results tracking
$results = @{
    total = 0
    passed = 0
    failed = 0
}

# Helper function
function Test-API {
    param(
        [string]$Name,
        [string]$Url,
        [scriptblock]$Validator
    )
    
    $results.total++
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 10 -ErrorAction Stop
        
        $isValid = & $Validator $response
        
        if ($isValid) {
            Write-Host "✓ PASS: $Name" -ForegroundColor Green
            $results.passed++
            return $response
        } else {
            Write-Host "✗ FAIL: $Name - Invalid response" -ForegroundColor Red
            $results.failed++
            return $null
        }
    } catch {
        Write-Host "✗ FAIL: $Name - $($_.Exception.Message)" -ForegroundColor Red
        $results.failed++
        return $null
    }
}

# ==================== FINNHUB API TESTS ====================
Write-Host "`n━━━ TESTING FINNHUB API ━━━" -ForegroundColor Blue

# Test 1: Stock Quote
Test-API `
    -Name "Finnhub Stock Quote ($testSymbol)" `
    -Url "https://finnhub.io/api/v1/quote?symbol=$testSymbol&token=$($apiKeys.finnhub)" `
    -Validator { param($r) return $r.c -gt 0 }

Start-Sleep -Seconds 1

# Test 2: Company Profile
Test-API `
    -Name "Finnhub Company Profile ($testSymbol)" `
    -Url "https://finnhub.io/api/v1/stock/profile2?symbol=$testSymbol&token=$($apiKeys.finnhub)" `
    -Validator { param($r) return $r.name -ne $null }

Start-Sleep -Seconds 1

# Test 3: Search
Test-API `
    -Name "Finnhub Stock Search (APPLE)" `
    -Url "https://finnhub.io/api/v1/search?q=APPLE&token=$($apiKeys.finnhub)" `
    -Validator { param($r) return $r.count -gt 0 }

# ==================== YAHOO FINANCE API TESTS ====================
Write-Host "`n━━━ TESTING YAHOO FINANCE API ━━━" -ForegroundColor Blue

# Test 1: Trending
Test-API `
    -Name "Yahoo Finance Trending Stocks" `
    -Url "https://query1.finance.yahoo.com/v10/finance/trending/US" `
    -Validator { param($r) return $r.finance.result[0].quotes.Count -gt 0 }

Start-Sleep -Seconds 1

# Test 2: Quote Summary
Test-API `
    -Name "Yahoo Finance Quote Summary ($testSymbol)" `
    -Url "https://query1.finance.yahoo.com/v10/finance/quoteSummary/$testSymbol?modules=price" `
    -Validator { param($r) return $r.quoteSummary.result[0].price -ne $null }

# ==================== ALPHA VANTAGE API TESTS ====================
Write-Host "`n━━━ TESTING ALPHA VANTAGE API ━━━" -ForegroundColor Blue
Write-Host "⚠ Note: Free tier has 5 calls/min limit" -ForegroundColor Yellow

# Test 1: Global Quote
Test-API `
    -Name "Alpha Vantage Global Quote ($testSymbol)" `
    -Url "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=$testSymbol&apikey=$($apiKeys.alphaVantage)" `
    -Validator { param($r) 
        return ($r.'Global Quote'.'05. price' -ne $null) -or ($r.Note -ne $null)
    }

Start-Sleep -Seconds 12  # Rate limit protection

# Test 2: Daily Time Series
Test-API `
    -Name "Alpha Vantage Daily Time Series ($testSymbol)" `
    -Url "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=$testSymbol&outputsize=compact&apikey=$($apiKeys.alphaVantage)" `
    -Validator { param($r) 
        return ($r.'Time Series (Daily)' -ne $null) -or ($r.Note -ne $null)
    }

# ==================== FINANCIAL MODELING PREP API TESTS ====================
Write-Host "`n━━━ TESTING FINANCIAL MODELING PREP API ━━━" -ForegroundColor Blue

# Test 1: Company Profile
Test-API `
    -Name "FMP Company Profile ($testSymbol)" `
    -Url "https://financialmodelingprep.com/api/v3/profile/$testSymbol?apikey=$($apiKeys.fmp)" `
    -Validator { param($r) return ($r.Count -gt 0) -and ($r[0].companyName -ne $null) }

Start-Sleep -Seconds 1

# Test 2: Income Statement
Test-API `
    -Name "FMP Income Statement ($testSymbol)" `
    -Url "https://financialmodelingprep.com/api/v3/income-statement/$testSymbol?limit=1&apikey=$($apiKeys.fmp)" `
    -Validator { param($r) return ($r.Count -gt 0) -and ($r[0].revenue -ne $null) }

Start-Sleep -Seconds 1

# Test 3: Financial Ratios
Test-API `
    -Name "FMP Financial Ratios ($testSymbol)" `
    -Url "https://financialmodelingprep.com/api/v3/ratios/$testSymbol?limit=1&apikey=$($apiKeys.fmp)" `
    -Validator { param($r) return ($r.Count -gt 0) -and ($r[0].currentRatio -ne $null) }

# ==================== SUMMARY ====================
Write-Host "`n━━━ TEST SUMMARY ━━━" -ForegroundColor Blue
Write-Host "Total Tests: $($results.total)" -ForegroundColor Cyan
Write-Host "Passed: $($results.passed)" -ForegroundColor Green
Write-Host "Failed: $($results.failed)" -ForegroundColor Red

if ($results.failed -eq 0) {
    Write-Host "`n✓ All APIs are working!" -ForegroundColor Green
} else {
    Write-Host "`n⚠ Some tests failed - Check API keys or rate limits" -ForegroundColor Yellow
}

Write-Host "`n━━━ RECOMMENDATIONS ━━━" -ForegroundColor Blue
if ($results.failed -gt 0) {
    Write-Host "• Finnhub: Check VITE_FINNHUB_API_KEY in .env file" -ForegroundColor Yellow
    Write-Host "• Alpha Vantage: Free tier has 5 calls/min limit" -ForegroundColor Yellow
    Write-Host "• FMP: Free tier may have expired. Get new key at financialmodelingprep.com" -ForegroundColor Yellow
    Write-Host "• Yahoo Finance: No API key required, but may have rate limits" -ForegroundColor Yellow
}

Write-Host ""
