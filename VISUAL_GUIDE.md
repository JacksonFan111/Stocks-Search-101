# 🎨 Visual Guide - Polytope Model

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    (React + Tailwind CSS)                        │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  StockInfoCard   │  │  Stock Analysis  │  │  Navigation  │  │
│  │  (Ticker, Price) │  │  (Graham, FVC3)  │  │  (Links)     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP POST/GET
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                         │
│                                                                   │
│  /api/stocks/analyze  ──┬──  /api/stocks/list                    │
│                         │                                         │
│                         │ Routes to business logic                │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              BUSINESS LOGIC LAYER (TypeScript)                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │        GRAHAM CIRCUIT BREAKER (Gatekeeper)              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │   │
│  │  │ Bubble   │  │  Junk    │  │Dilution  │  │Solvency│ │   │
│  │  │ Cap      │  │  Filter  │  │ Check    │  │ Test   │ │   │
│  │  │ P/E<35   │  │ IC>3.0x  │  │<5% 3yr   │  │ CR>1.5 │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘ │   │
│  │         All must PASS (AND logic)                       │   │
│  │         Result: Binary {0=FAIL, 1=PASS}                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │    FVC 3.0 SECTOR DISTORTION ENGINE (Only if PASS)     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │ Valuation    │  │ Quality      │  │ Momentum     │ │   │
│  │  │ (40%)        │  │ (30%)        │  │ (30%)        │ │   │
│  │  │              │  │              │  │              │ │   │
│  │  │ E/P Yield    │  │ FCF/NI Ratio │  │ RAM Ratio    │ │   │
│  │  │ Percentile   │  │ (Paper Trap) │  │ (Momentum)   │ │   │
│  │  │              │  │              │  │              │ │   │
│  │  │ (0-100)      │  │ (0-100)      │  │ (0-100)      │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  │                                                         │   │
│  │    Formula: FVC3 = 0.40*V + 0.30*Q + 0.30*M (0-100)   │   │
│  │    Output: BUY (70+) / HOLD (40-69) / SELL (<40)       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │    FORENSIC ALARM SYSTEM (10-Point Detection)           │   │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐      │   │
│  │  │Alarm1│  │Alarm2│  │Alarm3│  │Alarm4│  │Alarm5│      │   │
│  │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘      │   │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐      │   │
│  │  │Alarm6│  │Alarm7│  │Alarm8│  │Alarm9│  │Alarm10      │   │
│  │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘      │   │
│  │                                                         │   │
│  │    Risk: LOW (0) / MEDIUM (1-2) / HIGH (3-4) / CRITICAL│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE LAYER (PostgreSQL)                     │
│                                                                   │
│  ┌────────────┐  ┌────────────────────┐  ┌──────────────┐      │
│  │ stocks     │  │ financial_metrics  │  │ fvc3_score   │      │
│  │ (Company)  │  │ (Raw financials)   │  │ (Scores)     │      │
│  └────────────┘  └────────────────────┘  └──────────────┘      │
│                                                                   │
│  ┌────────────────────┐  ┌──────────────────────┐               │
│  │ graham_breaker     │  │ forensic_analysis    │               │
│  │ (Gate results)     │  │ (Alarm flags)        │               │
│  └────────────────────┘  └──────────────────────┘               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Decision Flow Chart

```
                    START
                      │
                      ▼
          ┌─────────────────────┐
          │  Get Stock Data     │
          │  (30+ metrics)      │
          └──────────┬──────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   GRAHAM CIRCUIT BREAKER   │
        │   (4 Binary Gates)         │
        └──────────┬─────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    ✅ PASS              ❌ FAIL
        │                     │
        │                     └──────────┐
        │                                 │
        ▼                                 ▼
    ┌─────────────┐           ┌──────────────────┐
    │ Calculate   │           │ DISQUALIFY       │
    │ FVC3 Score  │           │ (Stop here)      │
    └──────┬──────┘           │ Show reasons     │
           │                  └──────────────────┘
           ▼
    ┌─────────────────────┐
    │  Valuation Score    │
    │  Quality Score      │
    │  Momentum Score     │
    │  Composite: 0-100   │
    └──────────┬──────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
   BUY       HOLD       SELL
  (70+)    (40-69)     (<40)
    │          │          │
    └──────────┼──────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ FORENSIC ALARM ANALYSIS  │
    │ (10-point anomaly check) │
    └──────────┬───────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    Alarms?         None?
    (0-10)          (Pass)
        │             │
        ▼             ▼
    Risk Level    ✅ CLEAN
    LOW-CRITICAL  (No fraud)
        │             │
        └──────┬──────┘
               │
               ▼
    ┌─────────────────────┐
    │  FINAL ASSESSMENT   │
    │  - Graham result    │
    │  - FVC3 score       │
    │  - Forensic result  │
    │  - Recommendation   │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────────┐
    │  DISPLAY DASHBOARD      │
    │  Return to User         │
    └─────────────────────────┘
```

---

## Component Hierarchy

```
Pages
├── /stocks (Main Dashboard)
│
└── Components (Atomic Design)
    │
    ├── ATOMS (Smallest units)
    │   ├── MetricBadge
    │   │   ├── label: string
    │   │   ├── value: number
    │   │   └── color: enum
    │   │
    │   ├── StatusIcon
    │   │   ├── status: 'pass'|'fail'|'warning'
    │   │   └── label: string
    │   │
    │   ├── AlarmBadge
    │   │   ├── alarmName: string
    │   │   ├── isTriggered: boolean
    │   │   └── description: string
    │   │
    │   └── ProgressBar
    │       ├── value: 0-100
    │       └── color: enum
    │
    ├── MOLECULES (Groups of atoms)
    │   ├── StockInfoCard
    │   │   ├── ticker, name, price, sector
    │   │   ├── 1x MetricBadge
    │   │   └── 1x Button
    │   │
    │   ├── GrahamBreakerCard
    │   │   ├── 1x StatusIcon
    │   │   ├── 4x MetricBadge (one per gate)
    │   │   └── Optional: failure reasons list
    │   │
    │   └── FVC3ScoreCard
    │       ├── 1x StatusIcon
    │       ├── Large composite score display
    │       └── 3x ProgressBar (one per pillar)
    │
    └── ORGANISMS (Complex sections)
        └── ForensicDashboard
            ├── 1x Risk level indicator
            ├── 2x5 grid of AlarmBadge
            └── Info panel
```

---

## Data Models

### Stock Analysis Request
```
{
  ticker: string                    // "AAPL"
  
  // Graham Breaker inputs
  peRatio: number                   // 32.5
  forwardPeRatio?: number           // 30.2
  interestCoverage: number          // 12.3
  shareCountChange: number          // -2.1 (%)
  currentAssets: number             // 100M
  currentLiabilities: number        // 55M
  
  // FVC3.0 inputs
  earnings: number                  // Net income
  freeCashFlow: number              
  operatingCashFlow: number         
  totalAssets: number               
  netIncome: number                 
  price: number                     // Per share
  shares: number                    // Outstanding shares
  volatility6M: number              // 0.18 (18%)
  return12M: number                 // 0.45 (45%)
  
  // Sector inputs
  sectorMedianPE: number            // 28
  sectorMedianFCFMargin: number     // 0.88
  sectorMedianMomentum: number      // 1.5
  
  // Forensic inputs
  intangibleAssets: number          
  payableDays: number               
  assetTurnover: number             
  assetTurnoverPriorYear: number    
  gaapNetIncome: number             
  nonGaapNetIncome: number          
  accountsReceivable: number        
  accountsReceivablePriorYear: number
  inventory: number                 
  inventoryPriorYear: number        
  cash: number                      
  debtDue1Year: number              
  operatingCashFlowPriorYear: number
  revenueChange: number             // YoY %
}
```

### Stock Analysis Response
```
{
  ticker: string,
  
  grahamBreaker: {
    bubbleCapPass: boolean,
    junkFilterPass: boolean,
    dilutionCheckPass: boolean,
    solvencyPass: boolean,
    overallPass: boolean,           // ALL gates must pass
    failureReasons: string[],
    scores: {
      peRatio: number,
      interestCoverage: number,
      shareCountChange: number,
      assetLiabilityRatio: number
    }
  },
  
  fvc3Score: {
    valuationScore: 0-100,          // Percentile
    qualityScore: 0-100,            // Percentile
    momentumScore: 0-100,           // Percentile
    compositeScore: 0-100,          // Weighted average
    recommendation: 'BUY'|'HOLD'|'SELL',
    metrics: { ... }
  },
  
  forensicAlarms: {
    totalAlarms: 0-10,              // Count of triggered flags
    riskLevel: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL',
    details: {
      paperProfitTrap: { flag, ratio, threshold, explanation },
      intangibleBloat: { ... },
      payableDaysAlarm: { ... },
      // ... 7 more alarms
    }
  },
  
  overallAssessment: {
    passedGrahams: boolean,
    recommendation: string,
    riskLevel: string,
    summary: string                 // Human-readable summary
  }
}
```

---

## User Interface Mockup

```
╔════════════════════════════════════════════════════════════════╗
║                  AI STOCK ANALYSIS PLATFORM                    ║
║ ────────────────────────────────────────────────────────────── ║
║                                                                 ║
║  [Home] [About] [Counter] [Portfolio] ★ [AI Stocks] [Sign In] ║
║                                                                 ║
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ 📊 POLYTOPE MODEL - Global Value Investing Framework     │ ║
║  │ Graham Circuit Breaker + Sector Engine + Forensic Alarms │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                 ║
║  Sample Stocks to Analyze:                                     ║
║                                                                 ║
║  ┌──────────────────┐  ┌──────────────────┐                  ║
║  │ AAPL             │  │ KO               │                  ║
║  │ Apple Inc        │  │ Coca-Cola        │                  ║
║  │ $182.50          │  │ $62.30           │                  ║
║  │ Technology       │  │ Consumer         │                  ║
║  │ [Analyze Stock]  │  │ [Analyze Stock]  │                  ║
║  └──────────────────┘  └──────────────────┘                  ║
║                                                                 ║
║  ┌──────────────────┐  ┌──────────────────┐                  ║
║  │ JPM              │  │ XOM              │                  ║
║  │ JPMorgan         │  │ Exxon Mobil      │                  ║
║  │ $214.60          │  │ $110.80          │                  ║
║  │ Financial        │  │ Energy           │                  ║
║  │ [Analyze Stock]  │  │ [Analyze Stock]  │                  ║
║  └──────────────────┘  └──────────────────┘                  ║
║                                                                 ║
║ ────────────────────────────────────────────────────────────── ║
║  [After clicking "Analyze Stock":]                             ║
║ ────────────────────────────────────────────────────────────── ║
║                                                                 ║
║  Apple Inc. (AAPL)                                             ║
║  ┌───────────────────────────────────────────────────────────┐║
║  │ GRAHAM CIRCUIT BREAKER            ✅ PASS                ││
║  │ P/E: 32.5 ✅ IC: 12.3x ✅ Dilute: -2.1% ✅ CR: 1.82 ✅  ││
║  └───────────────────────────────────────────────────────────┘║
║                                                                 ║
║  ┌───────────────────────────────────────────────────────────┐║
║  │ FVC 3.0 SCORE                        74.2/100 → BUY       ││
║  │                                                             ││
║  │ Valuation (40%): ████████░░ 68                            ││
║  │ Quality (30%):   ██████████ 85                            ││
║  │ Momentum (30%):  ████████░░ 72                            ││
║  └───────────────────────────────────────────────────────────┘║
║                                                                 ║
║  ┌───────────────────────────────────────────────────────────┐║
║  │ FORENSIC ANALYSIS - Risk Level: LOW (0 alarms)            ││
║  │                                                             ││
║  │  ✅ Paper Profit    ✅ Intangible       ✅ Payables       ││
║  │  ✅ Asset Turnover  ✅ GAAP Gap        ✅ Revenue Trend   ││
║  │  ✅ Margin Health   ✅ Cash Divergence ✅ A/R Growth      ││
║  │  ✅ Debt Safety                                            ││
║  └───────────────────────────────────────────────────────────┘║
║                                                                 ║
║  Summary: Passed Graham Breaker. FVC3 74.2/100 (BUY).         ║
║  No forensic red flags. Strong company, reasonable valuation.  ║
║                                                                 ║
║                                          [Clear] [← Back]      ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Color Scheme

```
Performance Indicators:
┌─────────────────────────────────┐
│ 🟢 GREEN   = Good / Pass / Safe │
│ 🟡 YELLOW  = Warning / Caution  │
│ 🟠 ORANGE  = Risk / Concern     │
│ 🔴 RED     = Danger / Fail      │
└─────────────────────────────────┘

Score Ranges:
┌──────────────────────────────────────┐
│ FVC3 70-100  → GREEN (Buy)           │
│ FVC3 40-69   → YELLOW (Hold)         │
│ FVC3  0-39   → RED (Sell)            │
└──────────────────────────────────────┘

Alarms:
┌──────────────────────────────────────┐
│ 0 alarms     → GREEN (Low)           │
│ 1-2 alarms   → YELLOW (Medium)       │
│ 3-4 alarms   → ORANGE (High)         │
│ 5+ alarms    → RED (Critical)        │
└──────────────────────────────────────┘
```

---

## Example Analysis Flow

```
User clicks: "Analyze AAPL"
    ↓
[Loading animation - "Analyzing AAPL..."]
    ↓
/api/stocks/analyze POST
{
  ticker: "AAPL",
  peRatio: 32.5,
  interestCoverage: 12.3,
  ... (30 more fields)
}
    ↓
Backend Processing (500ms):
├─ Graham Breaker: PASS ✅
├─ FVC3 Score: 74.2/100 ✅
└─ Forensic Alarms: 0 flags ✅
    ↓
Response JSON:
{
  ticker: "AAPL",
  grahamBreaker: { ... },
  fvc3Score: { ... },
  forensicAlarms: { ... },
  overallAssessment: { ... }
}
    ↓
Frontend Rendering:
├─ Clear card
├─ Show Graham card
├─ Show FVC3 card
├─ Show Forensic grid
└─ Show summary
    ↓
User sees complete analysis
```

---

**This visual guide helps understand how all pieces fit together! 🎨**
