#!/usr/bin/env powershell
# Stocks Search 101 - Quick Launch Script

Write-Host "🚀 Stocks Search 101 - Launch Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "c:\Users\jacksonf-ad\OneDrive - CraigsIP\00.CodeRepo\Stocks-Search-101"

# Change to project directory
Push-Location $projectPath

# Menu
Write-Host "Select action:" -ForegroundColor Green
Write-Host "1) Start development server (http://localhost:3000)"
Write-Host "2) Run ETL ingestion (default 40 symbols)"
Write-Host "3) Run ETL with custom symbols (tech_stocks.json)"
Write-Host "4) Run ETL behind corporate proxy (TLS bypass)"
Write-Host "5) View hot cache data"
Write-Host "6) View manifest (errors & metadata)"
Write-Host "7) Build for production"
Write-Host "8) Open app in browser"
Write-Host "9) Create custom symbols file"
Write-Host "0) Exit"
Write-Host ""

$choice = Read-Host "Enter choice (0-9)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Starting dev server..." -ForegroundColor Yellow
        Write-Host "App will be available at: http://localhost:3000" -ForegroundColor Green
        Write-Host ""
        npm run dev
    }
    
    "2" {
        Write-Host ""
        Write-Host "Running ETL ingestion with 40 default symbols..." -ForegroundColor Yellow
        npm run fetch:daily
    }
    
    "3" {
        Write-Host ""
        Write-Host "Running ETL with custom tech stocks..." -ForegroundColor Yellow
        $env:INGEST_SYMBOLS_FILE="symbols/tech_stocks.json"
        npm run fetch:daily
    }
    
    "4" {
        Write-Host ""
        Write-Host "Running ETL with SSL bypass (corporate proxy)..." -ForegroundColor Yellow
        $env:ALLOW_INSECURE_SSL="true"
        npm run fetch:daily
    }
    
    "5" {
        Write-Host ""
        Write-Host "Hot Cache Contents:" -ForegroundColor Yellow
        if (Test-Path "public\data\hot\hotCache.json") {
            $data = Get-Content "public\data\hot\hotCache.json" | ConvertFrom-Json
            Write-Host "- Stocks: $($data.sampleStocks.Count) symbols"
            Write-Host "- Quotes: $($data.mockStockQuotes.PSObject.Properties.Count) entries"
            Write-Host "- Profiles: $($data.mockCompanyProfiles.PSObject.Properties.Count) entries"
            Write-Host "- Generated: $($data.fetchedAt)"
        } else {
            Write-Host "❌ Hot cache not found. Run ETL first." -ForegroundColor Red
        }
    }
    
    "6" {
        Write-Host ""
        Write-Host "Manifest Contents:" -ForegroundColor Yellow
        if (Test-Path "public\data\manifest.json") {
            $manifest = Get-Content "public\data\manifest.json" | ConvertFrom-Json
            Write-Host "Date: $($manifest.date)"
            Write-Host "Symbols: $($manifest.symbols)"
            Write-Host "Quotes: $($manifest.quotes)"
            Write-Host "Profiles: $($manifest.profiles)"
            Write-Host "Errors: $($manifest.errors.Count)"
            Write-Host "Source: $($manifest.symbolSource)"
            Write-Host "Runtime: $($manifest.runMs)ms"
            if ($manifest.errors.Count -gt 0) {
                Write-Host ""
                Write-Host "Error Details:" -ForegroundColor Red
                $manifest.errors | ForEach-Object { Write-Host "  - $_" }
            }
        } else {
            Write-Host "❌ Manifest not found. Run ETL first." -ForegroundColor Red
        }
    }
    
    "7" {
        Write-Host ""
        Write-Host "Building for production..." -ForegroundColor Yellow
        npm run build
        Write-Host ""
        Write-Host "✅ Build complete! Dist folder ready for deployment." -ForegroundColor Green
    }
    
    "8" {
        Write-Host ""
        Write-Host "Opening app in browser..." -ForegroundColor Yellow
        Start-Process "http://localhost:3000"
    }
    
    "9" {
        Write-Host ""
        Write-Host "Create custom symbols file" -ForegroundColor Yellow
        $filename = Read-Host "Enter filename (in symbols/ folder, e.g., 'my_stocks')"
        $format = Read-Host "Format? (1=JSON, 2=Text)"
        
        if ($format -eq "1") {
            $template = @"
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "exchange": "NASDAQ"
  },
  {
    "symbol": "MSFT",
    "name": "Microsoft",
    "exchange": "NASDAQ"
  }
]
"@
            $path = "symbols\$filename.json"
        } else {
            $template = "AAPL`nMSFT`nGOOGL`nAMZN`nNVDA"
            $path = "symbols\$filename.txt"
        }
        
        $template | Out-File $path -Encoding UTF8
        Write-Host "✅ Created: $path" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now run ETL with:" -ForegroundColor Yellow
        Write-Host "`$env:INGEST_SYMBOLS_FILE=`"$path`"" -ForegroundColor Cyan
        Write-Host "npm run fetch:daily"
    }
    
    "0" {
        Write-Host "Goodbye! 👋" -ForegroundColor Cyan
        exit
    }
    
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
    }
}

Write-Host ""
Pop-Location
