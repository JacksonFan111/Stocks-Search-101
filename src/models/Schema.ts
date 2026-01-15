import { decimal, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// It automatically run the command `db-server:file`, which apply the migration before Next.js starts in development mode,
// Alternatively, if your database is running, you can run `npm run db:migrate` and there is no need to restart the server.

// Need a database for production? Check out https://www.prisma.io/?via=nextjsboilerplate
// Tested and compatible with Next.js Boilerplate

export const counterSchema = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Stock data schema for AI-powered stock analysis
export const stockSchema = pgTable('stocks', {
  id: serial('id').primaryKey(),
  ticker: varchar('ticker', { length: 10 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  sector: varchar('sector', { length: 100 }),
  price: decimal('price', { precision: 10, scale: 2 }),
  marketCap: decimal('market_cap', { precision: 20, scale: 0 }),
  aiSummary: text('ai_summary'), // AI-generated insights
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Financial metrics for Graham Circuit Breaker and FVC 3.0
export const financialMetricsSchema = pgTable('financial_metrics', {
  id: serial('id').primaryKey(),
  stockId: integer('stock_id').notNull(),
  peRatio: decimal('pe_ratio', { precision: 8, scale: 2 }),
  forwardPeRatio: decimal('forward_pe_ratio', { precision: 8, scale: 2 }),
  interestCoverage: decimal('interest_coverage', { precision: 8, scale: 2 }), // EBIT / Interest Expense
  shareCountChange: decimal('share_count_change', { precision: 8, scale: 2 }), // 3-year % change
  currentAssets: decimal('current_assets', { precision: 20, scale: 0 }),
  currentLiabilities: decimal('current_liabilities', { precision: 20, scale: 0 }),
  netIncome: decimal('net_income', { precision: 20, scale: 0 }),
  operatingCashFlow: decimal('operating_cash_flow', { precision: 20, scale: 0 }),
  freeCashFlow: decimal('free_cash_flow', { precision: 20, scale: 0 }),
  totalAssets: decimal('total_assets', { precision: 20, scale: 0 }),
  intangibleAssets: decimal('intangible_assets', { precision: 20, scale: 0 }),
  payableDays: decimal('payable_days', { precision: 8, scale: 2 }),
  gaapNetIncome: decimal('gaap_net_income', { precision: 20, scale: 0 }),
  nonGaapNetIncome: decimal('non_gaap_net_income', { precision: 20, scale: 0 }),
  revenue: decimal('revenue', { precision: 20, scale: 0 }),
  fiscalYear: integer('fiscal_year'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Forensic analysis schema - 10-point alarm system
export const forensicAnalysisSchema = pgTable('forensic_analysis', {
  id: serial('id').primaryKey(),
  stockId: integer('stock_id').notNull(),
  paperProfitTrapFlag: integer('paper_profit_trap_flag').default(0), // 0 = pass, 1 = alarm
  intangibleBloatFlag: integer('intangible_bloat_flag').default(0),
  payableDaysFlag: integer('payable_days_flag').default(0),
  assetTurnoverTrendFlag: integer('asset_turnover_trend_flag').default(0),
  gaapGapFlag: integer('gaap_gap_flag').default(0),
  revenueTrendFlag: integer('revenue_trend_flag').default(0),
  marginCompressionFlag: integer('margin_compression_flag').default(0),
  cashFlowDivergenceFlag: integer('cash_flow_divergence_flag').default(0),
  accountsReceivableTrendFlag: integer('accounts_receivable_trend_flag').default(0),
  debtMaturityFlag: integer('debt_maturity_flag').default(0),
  alarmScore: integer('alarm_score').default(0), // Sum of all flags
  riskLevel: varchar('risk_level', { length: 20 }).default('LOW'), // LOW, MEDIUM, HIGH, CRITICAL
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// FVC 3.0 Score schema - Sector Distortion Engine
export const fvc3ScoreSchema = pgTable('fvc3_score', {
  id: serial('id').primaryKey(),
  stockId: integer('stock_id').notNull(),
  valuationPercentile: decimal('valuation_percentile', { precision: 5, scale: 2 }), // 0-100
  qualityPercentile: decimal('quality_percentile', { precision: 5, scale: 2 }), // 0-100
  momentumPercentile: decimal('momentum_percentile', { precision: 5, scale: 2 }), // 0-100
  compositeScore: decimal('composite_score', { precision: 8, scale: 2 }), // Final FVC 3.0 score
  sectorPercentileRank: decimal('sector_percentile_rank', { precision: 5, scale: 2 }), // Rank vs peers
  recommendation: varchar('recommendation', { length: 50 }), // BUY, HOLD, SELL
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Graham Circuit Breaker schema - Pass/Fail gates
export const grahamBreakerSchema = pgTable('graham_breaker', {
  id: serial('id').primaryKey(),
  stockId: integer('stock_id').notNull(),
  bubbleCapPass: integer('bubble_cap_pass').default(0), // 1 = pass, 0 = fail
  junkFilterPass: integer('junk_filter_pass').default(0),
  dilutionCheckPass: integer('dilution_check_pass').default(0),
  solvencyPass: integer('solvency_pass').default(0),
  overallPass: integer('overall_pass').default(0), // All gates must pass
  failureReasons: text('failure_reasons'), // Which gates failed
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
