# Mathematical Foundations - Polytope Model

## Overview

The Polytope Model is a three-layer mathematical framework for stock selection combining **binary filtering**, **relative scoring**, and **anomaly detection**.

---

## Layer 1: Graham Circuit Breaker (Binary Classification)

### Purpose
Eliminate stocks that fail basic safety criteria. Results in **{0, 1}** for each gate.

### Gate 1: Bubble Cap (P/E Ratio)

$$\text{Bubble Cap Pass} = \begin{cases} 1 & \text{if } P/E < 35 \\ 0 & \text{otherwise} \end{cases}$$

Where:
- $P$ = Stock price
- $E$ = Earnings per share (or Net Income / Shares)

**Intuition**: Extreme valuations (P/E > 35) indicate speculative bubbles. No margin of safety.

---

### Gate 2: Junk Filter (Interest Coverage)

$$\text{Interest Coverage} = \frac{\text{EBIT}}{\text{Interest Expense}}$$

$$\text{Junk Filter Pass} = \begin{cases} 1 & \text{if IC > 3.0 \\ 0 & \text{otherwise} \end{cases}$$

**Intuition**: Company must earn at least 3x its annual interest to comfortably service debt.

---

### Gate 3: Dilution Check (Share Count Growth)

$$\text{Share Count Change (\%)} = \frac{\text{Shares}_{t} - \text{Shares}_{t-3yr}}{\text{Shares}_{t-3yr}} \times 100$$

$$\text{Dilution Pass} = \begin{cases} 1 & \text{if } |\Delta \text{ Shares}| < 5\% \\ 0 & \text{otherwise} \end{cases}$$

**Intuition**: Stock-based comp and dilution erode shareholder value. Tolerance: < 5% over 3 years.

---

### Gate 4: Solvency Check (Current Ratio)

$$\text{Current Ratio} = \frac{\text{Current Assets}}{\text{Current Liabilities}}$$

$$\text{Solvency Pass} = \begin{cases} 1 & \text{if CR} > 1.5 \\ 0 & \text{otherwise} \end{cases}$$

**Intuition**: Must have $1.50 in liquid assets for every $1 of short-term obligations.

---

### Overall Graham Result

$$\text{Graham Pass} = \text{Bubble Cap Pass} \times \text{Junk Filter Pass} \times \text{Dilution Pass} \times \text{Solvency Pass}$$

If Graham Pass = 0, stock is **ELIMINATED**. Only stocks with Graham Pass = 1 proceed to FVC3 scoring.

---

## Layer 2: Sector Distortion Engine (FVC 3.0 Scoring)

### Purpose
Score stocks **relative to sector peers** on three pillars (Valuation, Quality, Momentum).

---

### Pillar 1: Valuation (40% Weight)

$$\text{Earnings Yield} = \frac{\text{Net Income}}{\text{Market Cap}} = \frac{E}{P}$$

**Peer Comparison:**
$$\text{Valuation Percentile} = \frac{\text{# stocks in sector with } EY \leq \text{ this stock}}{n} \times 100$$

**Intuition**: Higher earnings yield = cheaper valuation. Percentile rank shows standing vs peers.

**Example:**
- Tech sector has 100 stocks
- Your stock's EY is higher than 75 peers
- Valuation Score = 75 (75th percentile = good value)

---

### Pillar 2: Quality (30% Weight)

$$\text{FCF Margin} = \frac{\text{Free Cash Flow}}{\text{Net Income}}$$

**Red Flag (Paper Profit Trap):**
$$\text{Paper Profit Ratio} = \frac{\text{Net Income} - \text{Operating Cash Flow}}{\text{Total Assets}}$$

$$\text{Alert if } \text{Ratio} > 5\%$$

**Quality Percentile:**
$$\text{Quality Score} = \frac{\text{FCF Margin}_{\text{this stock}}}{\text{Sector Median FCF Margin}} \times 100$$

**Intuition:** 
- FCF Margin = 1.0: All earnings convert to cash (perfect quality)
- FCF Margin = 0.5: Only 50% of earnings are real cash (warning)
- FCF Margin < 0: Earnings are negative cash (fraud red flag)

---

### Pillar 3: Smart Momentum (30% Weight)

$$\text{Risk-Adjusted Momentum} = \frac{\text{12-Month Total Return}}{\text{6-Month Realized Volatility}}$$

**Momentum Percentile:**
$$\text{Momentum Score} = \frac{\text{RAM}_{\text{this stock}}}{\text{Sector Median RAM}} \times 100$$

**Intuition:**
- $\frac{20\% \text{ return}}{5\% \text{ volatility}} = 4.0$ (strong momentum, low vol)
- $\frac{20\% \text{ return}}{30\% \text{ volatility}} = 0.67$ (weak risk-adjusted return)

The first stock is clearly better despite same absolute returns.

---

### Composite FVC3 Score

$$\text{FVC3\_Score} = 100 \times \left(0.40 \cdot V + 0.30 \cdot Q + 0.30 \cdot M\right)$$

Where $V$, $Q$, $M$ are percentile ranks (0-100).

**Recommendation:**
$$\text{Recommendation} = \begin{cases}
\text{BUY} & \text{if FVC3\_Score} \geq 70 \\
\text{HOLD} & \text{if } 40 \leq \text{FVC3\_Score} < 70 \\
\text{SELL} & \text{if FVC3\_Score} < 40
\end{cases}$$

---

## Layer 3: Forensic Alarm System (10-Point Anomaly Detection)

### Purpose
Flag stocks with high probability of fraud, accounting manipulation, or distress.

Each alarm is a **binary indicator**: {0 = pass, 1 = alarm triggered}

---

### Alarm 1: Paper Profit Trap

$$\text{Paper Profit Ratio} = \frac{\text{Net Income} - \text{Operating Cash Flow}}{\text{Total Assets}} \times 100\%$$

$$\text{Alarm}_1 = \begin{cases} 1 & \text{if Ratio} > 5\% \\ 0 & \text{otherwise} \end{cases}$$

**Why it matters:** Reported profits must be backed by actual cash. If divergence > 5%, earnings quality is suspect.

---

### Alarm 2: Intangible Asset Bloat

$$\text{Intangible Ratio} = \frac{\text{Intangible Assets + Goodwill}}{\text{Total Assets}} \times 100\%$$

$$\text{Alarm}_2 = \begin{cases} 1 & \text{if Ratio} > 20\% \\ 0 & \text{otherwise} \end{cases}$$

**Why it matters:** Intangible assets (goodwill, patents, trademarks) can hide balance sheet deterioration.

---

### Alarm 3: Payable Days Extreme

$$\text{Days Payable Outstanding} = \frac{\text{Accounts Payable}}{\text{Cost of Goods Sold} / 365}$$

$$\text{Alarm}_3 = \begin{cases} 1 & \text{if DPO} > 300 \text{ days} \\ 0 & \text{otherwise} \end{cases}$$

**Why it matters:** Normal: 30-60 days. >300 days = suppliers unpaid, using them as forced lenders.

---

### Alarm 4: Asset Turnover Decline

$$\text{Asset Turnover} = \frac{\text{Revenue}}{\text{Total Assets}}$$

$$\text{Asset Bloating} = \begin{cases} 1 & \text{if } AT_t < AT_{t-1} \text{ AND } \text{Revenue}_t > \text{Revenue}_{t-1} \\ 0 & \text{otherwise} \end{cases}$$

**Why it matters:** Declining asset efficiency while growing revenue suggests inventory buildup or asset manipulation.

---

### Alarm 5: GAAP vs Non-GAAP Gap

$$\text{GAAP Gap \%} = \left|\frac{\text{Non-GAAP NI} - \text{GAAP NI}}{\text{GAAP NI}}\right| \times 100\%$$

$$\text{Alarm}_5 = \begin{cases} 1 & \text{if Gap} > 15\% \\ 0 & \text{otherwise} \end{cases}$$

**Why it matters:** Large gaps indicate aggressive "adjusted" metrics to mask poor GAAP performance.

---

### Alarms 6-10 (Simplified Formulas)

| Alarm | Formula | Threshold |
|-------|---------|-----------|
| 6. Revenue Trend | YoY % change | < 0% (decline) |
| 7. Margin Compression | NI / Revenue | Declining trend |
| 8. Cash Flow Divergence | OCF vs NI | OCF declining > 10% while revenue ↑ |
| 9. A/R Growth | Growth rate | > Revenue growth + 5% |
| 10. Debt Maturity Risk | Debt_due_1yr / Cash | > 1.0x |

---

### Risk Level Classification

$$\text{Alarm Count} = \sum_{i=1}^{10} \text{Alarm}_i$$

$$\text{Risk Level} = \begin{cases}
\text{LOW} & \text{if Alarm Count} = 0 \\
\text{MEDIUM} & \text{if Alarm Count} \in [1, 2] \\
\text{HIGH} & \text{if Alarm Count} \in [3, 4] \\
\text{CRITICAL} & \text{if Alarm Count} \geq 5
\end{cases}$$

---

## Integrated Decision Framework

### Final Stock Recommendation

```
Step 1: Graham Circuit Breaker
  ├─ If FAIL → DISQUALIFY (can't proceed)
  └─ If PASS → Continue to Step 2

Step 2: FVC3 Scoring
  ├─ BUY: Score ≥ 70
  ├─ HOLD: Score 40-69
  └─ SELL: Score < 40

Step 3: Forensic Validation
  ├─ CRITICAL alarms → Override to SELL
  ├─ HIGH alarms → Reduce score by 15 points
  └─ MEDIUM/LOW → No adjustment
```

### Final Output Matrix

| Graham | FVC3 | Alarms | Recommendation |
|--------|------|--------|-----------------|
| PASS | BUY (75+) | LOW | **STRONG BUY** |
| PASS | BUY (75+) | CRITICAL | **AVOID** (fraud risk) |
| PASS | HOLD (50) | MEDIUM | **INVESTIGATE** |
| PASS | SELL (35) | HIGH | **SELL** |
| FAIL | - | - | **DISQUALIFY** |

---

## Statistical Properties

### Distribution Assumptions

1. **Earnings Yield** follows sector distribution
   - Used for percentile ranking
   - Normalized via empirical CDF

2. **FCF Margin** assumes market follows fundamental distributions
   - Normal assumption for most sectors
   - Exception: Growth tech (may have negative FCF temporarily)

3. **Risk-Adjusted Momentum**
   - Assumes 6-month rolling volatility is stable
   - High vol stocks get penalized (feature, not bug)

### Backtesting Framework

$$\text{Sharpe Ratio} = \frac{E[R_p] - R_f}{\sigma(R_p)}$$

Where:
- $R_p$ = Portfolio return
- $R_f$ = Risk-free rate
- $\sigma(R_p)$ = Portfolio volatility

**Target:** Sharpe ratio > 1.0 (excess return per unit risk)

---

## Summary

The Polytope Model achieves **three goals simultaneously**:

1. **Safety** (Graham): Eliminate dangerous/overvalued stocks
2. **Opportunity** (FVC3): Find best values within safe set
3. **Risk** (Forensics): Detect fraud/manipulation red flags

**Result:** High-probability, low-risk stock selection suitable for long-term value investing.

---

## References & Further Reading

- Graham, B. (1949). *The Intelligent Investor*
- Piotroski, J.D. (2000). "Value Investing" - F-Score paper
- Sloan, R. (1996). "Do Stock Prices Fully Reflect Information in Accruals?" - Accruals Anomaly
- Damodaran, A. (2012). *Damodaran on Valuation*
