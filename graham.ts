/**
 * Graham & Doddsville Value Investing Analysis
 * Based on Benjamin Graham's criteria from "The Intelligent Investor"
 * and "Security Analysis"
 */

export interface GrahamCriteria {
  // Criterion 1: P/E Ratio < 15 (Earnings Yield > 6.67%)
  peRatio: number | null;
  peRatioPassed: boolean;
  
  // Criterion 2: P/B Ratio < 1.5
  pbRatio: number | null;
  pbRatioPassed: boolean;
  
  // Criterion 3: Dividend Yield > 2.5% (approximation of 2/3 AAA bond yield)
  dividendYield: number | null;
  dividendYieldPassed: boolean;
  
  // Criterion 4: Total Debt < 2x Equity (D/E < 2)
  debtToEquity: number | null;
  debtToEquityPassed: boolean;
  
  // Criterion 5: Current Ratio > 2 (Current Assets > 2x Current Liabilities)
  currentRatio: number | null;
  currentRatioPassed: boolean;
  
  // Criterion 6: Positive earnings growth
  earningsGrowth: number | null;
  earningsGrowthPassed: boolean;
  
  // Criterion 7: No losses in last 5 years (approximated by positive EPS)
  hasPositiveEarnings: boolean;
  earningsStabilityPassed: boolean;
}

export interface GrahamAnalysis {
  ticker: string;
  name: string;
  price: number;
  currency: string;
  
  // Graham Number = √(22.5 × EPS × BVPS)
  grahamNumber: number | null;
  
  // Margin of Safety = (Intrinsic Value - Price) / Intrinsic Value
  marginOfSafety: number | null;
  
  // Score from 0-100 based on criteria met
  grahamScore: number;
  
  // Individual criteria
  criteria: GrahamCriteria;
  
  // Summary
  criteriaMetCount: number;
  totalCriteria: number;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid';
  
  // Analysis timestamp
  analyzedAt: number;
}

/**
 * Calculate Graham Number
 * Formula: √(22.5 × EPS × BVPS)
 * Where EPS = Earnings Per Share, BVPS = Book Value Per Share
 */
export function calculateGrahamNumber(eps: number | null, bvps: number | null): number | null {
  if (!eps || !bvps || eps <= 0 || bvps <= 0) return null;
  return Math.sqrt(22.5 * eps * bvps);
}

/**
 * Calculate Margin of Safety
 * Formula: (Intrinsic Value - Market Price) / Intrinsic Value × 100
 */
export function calculateMarginOfSafety(intrinsicValue: number | null, marketPrice: number): number | null {
  if (!intrinsicValue || intrinsicValue <= 0) return null;
  return ((intrinsicValue - marketPrice) / intrinsicValue) * 100;
}

/**
 * Analyze a stock using Graham's criteria
 */
export function analyzeGraham(
  ticker: string,
  name: string,
  price: number,
  currency: string,
  fundamentals: {
    pe?: number | null;
    pb?: number | null;
    dividendYield?: number | null;
    debtToEquity?: number | null;
    currentRatio?: number | null;
    eps?: number | null;
    bookValuePerShare?: number | null;
    earningsGrowth?: number | null;
    roe?: number | null;
  }
): GrahamAnalysis {
  const {
    pe,
    pb,
    dividendYield,
    debtToEquity,
    currentRatio,
    eps,
    bookValuePerShare,
    earningsGrowth,
    roe
  } = fundamentals;

  // Evaluate each criterion
  const criteria: GrahamCriteria = {
    // Criterion 1: P/E < 15
    peRatio: pe ?? null,
    peRatioPassed: pe !== null && pe !== undefined && pe > 0 && pe < 15,
    
    // Criterion 2: P/B < 1.5
    pbRatio: pb ?? null,
    pbRatioPassed: pb !== null && pb !== undefined && pb > 0 && pb < 1.5,
    
    // Criterion 3: Dividend Yield > 2.5%
    dividendYield: dividendYield ?? null,
    dividendYieldPassed: dividendYield !== null && dividendYield !== undefined && dividendYield > 2.5,
    
    // Criterion 4: D/E < 2
    debtToEquity: debtToEquity ?? null,
    debtToEquityPassed: debtToEquity !== null && debtToEquity !== undefined && debtToEquity < 2,
    
    // Criterion 5: Current Ratio > 2
    currentRatio: currentRatio ?? null,
    currentRatioPassed: currentRatio !== null && currentRatio !== undefined && currentRatio > 2,
    
    // Criterion 6: Positive earnings growth
    earningsGrowth: earningsGrowth ?? null,
    earningsGrowthPassed: earningsGrowth !== null && earningsGrowth !== undefined && earningsGrowth > 0,
    
    // Criterion 7: Positive earnings (no losses)
    hasPositiveEarnings: eps !== null && eps !== undefined && eps > 0,
    earningsStabilityPassed: eps !== null && eps !== undefined && eps > 0,
  };

  // Count criteria met
  const criteriaMet = [
    criteria.peRatioPassed,
    criteria.pbRatioPassed,
    criteria.dividendYieldPassed,
    criteria.debtToEquityPassed,
    criteria.currentRatioPassed,
    criteria.earningsGrowthPassed,
    criteria.earningsStabilityPassed,
  ].filter(Boolean).length;

  const totalCriteria = 7;

  // Calculate Graham Number
  const grahamNumber = calculateGrahamNumber(eps ?? null, bookValuePerShare ?? null);
  
  // Calculate Margin of Safety
  const marginOfSafety = calculateMarginOfSafety(grahamNumber, price);

  // Calculate Graham Score (0-100)
  // Base score from criteria (70% weight)
  const criteriaScore = (criteriaMet / totalCriteria) * 70;
  
  // Bonus from margin of safety (30% weight)
  let marginScore = 0;
  if (marginOfSafety !== null) {
    if (marginOfSafety >= 50) marginScore = 30;
    else if (marginOfSafety >= 30) marginScore = 25;
    else if (marginOfSafety >= 20) marginScore = 20;
    else if (marginOfSafety >= 10) marginScore = 15;
    else if (marginOfSafety >= 0) marginScore = 10;
    else marginScore = 0;
  }
  
  const grahamScore = Math.round(criteriaScore + marginScore);

  // Determine recommendation
  let recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid';
  if (grahamScore >= 80 && marginOfSafety !== null && marginOfSafety >= 30) {
    recommendation = 'strong_buy';
  } else if (grahamScore >= 60 && marginOfSafety !== null && marginOfSafety >= 10) {
    recommendation = 'buy';
  } else if (grahamScore >= 40) {
    recommendation = 'hold';
  } else {
    recommendation = 'avoid';
  }

  return {
    ticker,
    name,
    price,
    currency,
    grahamNumber,
    marginOfSafety,
    grahamScore,
    criteria,
    criteriaMetCount: criteriaMet,
    totalCriteria,
    recommendation,
    analyzedAt: Date.now(),
  };
}

/**
 * Get recommendation label in Portuguese
 */
export function getRecommendationLabel(recommendation: string): string {
  switch (recommendation) {
    case 'strong_buy': return 'Compra Forte';
    case 'buy': return 'Compra';
    case 'hold': return 'Manter';
    case 'avoid': return 'Evitar';
    default: return 'N/A';
  }
}

/**
 * Get recommendation color
 */
export function getRecommendationColor(recommendation: string): string {
  switch (recommendation) {
    case 'strong_buy': return 'emerald';
    case 'buy': return 'green';
    case 'hold': return 'amber';
    case 'avoid': return 'red';
    default: return 'gray';
  }
}
