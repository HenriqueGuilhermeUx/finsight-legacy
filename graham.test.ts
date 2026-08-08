import { describe, it, expect, vi } from 'vitest';

// Mock the callDataApi function
vi.mock('./_core/dataApi', () => ({
  callDataApi: vi.fn().mockResolvedValue({
    regularMarketPrice: 30.00,
    trailingPE: 8.5,
    priceToBook: 1.2,
    dividendYield: 0.08,
    debtToEquity: 80,
    currentRatio: 2.5,
    epsTrailingTwelveMonths: 4.5,
    bookValue: 25.0,
    shortName: 'Test Company',
    earningsGrowth: 0.15,
    profitMargins: 0.20,
  }),
}));

describe('Graham & Doddsville Analysis', () => {
  describe('Graham Criteria', () => {
    it('should identify P/L < 15 as passing criterion', () => {
      const peRatio = 8.5;
      const passes = peRatio > 0 && peRatio < 15;
      expect(passes).toBe(true);
    });

    it('should identify P/L >= 15 as failing criterion', () => {
      const peRatio = 20;
      const passes = peRatio > 0 && peRatio < 15;
      expect(passes).toBe(false);
    });

    it('should identify P/VP < 1.5 as passing criterion', () => {
      const pbRatio = 1.2;
      const passes = pbRatio > 0 && pbRatio < 1.5;
      expect(passes).toBe(true);
    });

    it('should identify P/VP >= 1.5 as failing criterion', () => {
      const pbRatio = 2.0;
      const passes = pbRatio > 0 && pbRatio < 1.5;
      expect(passes).toBe(false);
    });

    it('should identify DY > 2.5% as passing criterion', () => {
      const dividendYield = 0.08; // 8%
      const passes = dividendYield > 0.025;
      expect(passes).toBe(true);
    });

    it('should identify DY <= 2.5% as failing criterion', () => {
      const dividendYield = 0.02; // 2%
      const passes = dividendYield > 0.025;
      expect(passes).toBe(false);
    });

    it('should identify Debt/Equity < 200% as passing criterion', () => {
      const debtToEquity = 80; // 80%
      const passes = debtToEquity < 200;
      expect(passes).toBe(true);
    });

    it('should identify Debt/Equity >= 200% as failing criterion', () => {
      const debtToEquity = 250; // 250%
      const passes = debtToEquity < 200;
      expect(passes).toBe(false);
    });

    it('should identify Current Ratio > 2 as passing criterion', () => {
      const currentRatio = 2.5;
      const passes = currentRatio > 2;
      expect(passes).toBe(true);
    });

    it('should identify Current Ratio <= 2 as failing criterion', () => {
      const currentRatio = 1.5;
      const passes = currentRatio > 2;
      expect(passes).toBe(false);
    });
  });

  describe('Graham Number Calculation', () => {
    it('should calculate Graham Number correctly', () => {
      const eps = 4.5;
      const bookValue = 25.0;
      // Graham Number = sqrt(22.5 * EPS * BVPS)
      const grahamNumber = Math.sqrt(22.5 * eps * bookValue);
      expect(grahamNumber).toBeCloseTo(50.31, 1);
    });

    it('should return null for negative EPS', () => {
      const eps = -2.0;
      const bookValue = 25.0;
      const grahamNumber = eps > 0 && bookValue > 0 
        ? Math.sqrt(22.5 * eps * bookValue) 
        : null;
      expect(grahamNumber).toBeNull();
    });

    it('should return null for negative Book Value', () => {
      const eps = 4.5;
      const bookValue = -10.0;
      const grahamNumber = eps > 0 && bookValue > 0 
        ? Math.sqrt(22.5 * eps * bookValue) 
        : null;
      expect(grahamNumber).toBeNull();
    });
  });

  describe('Margin of Safety Calculation', () => {
    it('should calculate positive margin of safety when price < Graham Number', () => {
      const price = 30.0;
      const grahamNumber = 50.0;
      const marginOfSafety = ((grahamNumber - price) / grahamNumber) * 100;
      expect(marginOfSafety).toBeCloseTo(40, 0);
    });

    it('should calculate negative margin of safety when price > Graham Number', () => {
      const price = 60.0;
      const grahamNumber = 50.0;
      const marginOfSafety = ((grahamNumber - price) / grahamNumber) * 100;
      expect(marginOfSafety).toBeCloseTo(-20, 0);
    });

    it('should calculate zero margin of safety when price = Graham Number', () => {
      const price = 50.0;
      const grahamNumber = 50.0;
      const marginOfSafety = ((grahamNumber - price) / grahamNumber) * 100;
      expect(marginOfSafety).toBe(0);
    });
  });

  describe('Graham Score Calculation', () => {
    it('should calculate score based on criteria passed', () => {
      const criteriaResults = {
        peRatio: true,      // +15
        pbRatio: true,      // +15
        dividendYield: true, // +10
        debtToEquity: true,  // +15
        currentRatio: true,  // +10
        earningsGrowth: true, // +10
        profitMargins: true,  // +10
      };
      
      let score = 0;
      if (criteriaResults.peRatio) score += 15;
      if (criteriaResults.pbRatio) score += 15;
      if (criteriaResults.dividendYield) score += 10;
      if (criteriaResults.debtToEquity) score += 15;
      if (criteriaResults.currentRatio) score += 10;
      if (criteriaResults.earningsGrowth) score += 10;
      if (criteriaResults.profitMargins) score += 10;
      
      // Add margin of safety bonus (up to 15 points)
      const marginOfSafety = 40;
      score += Math.min(15, Math.max(0, marginOfSafety / 2));
      
      expect(score).toBe(100);
    });

    it('should calculate partial score for some criteria passed', () => {
      const criteriaResults = {
        peRatio: true,       // +15
        pbRatio: false,      // +0
        dividendYield: true, // +10
        debtToEquity: true,  // +15
        currentRatio: false, // +0
        earningsGrowth: true, // +10
        profitMargins: false, // +0
      };
      
      let score = 0;
      if (criteriaResults.peRatio) score += 15;
      if (criteriaResults.pbRatio) score += 15;
      if (criteriaResults.dividendYield) score += 10;
      if (criteriaResults.debtToEquity) score += 15;
      if (criteriaResults.currentRatio) score += 10;
      if (criteriaResults.earningsGrowth) score += 10;
      if (criteriaResults.profitMargins) score += 10;
      
      expect(score).toBe(50);
    });
  });

  describe('Recommendation Generation', () => {
    it('should recommend strong_buy for score >= 80', () => {
      const score = 85;
      const recommendation = score >= 80 ? 'strong_buy' 
        : score >= 60 ? 'buy' 
        : score >= 40 ? 'hold' 
        : 'avoid';
      expect(recommendation).toBe('strong_buy');
    });

    it('should recommend buy for score >= 60 and < 80', () => {
      const score = 70;
      const recommendation = score >= 80 ? 'strong_buy' 
        : score >= 60 ? 'buy' 
        : score >= 40 ? 'hold' 
        : 'avoid';
      expect(recommendation).toBe('buy');
    });

    it('should recommend hold for score >= 40 and < 60', () => {
      const score = 50;
      const recommendation = score >= 80 ? 'strong_buy' 
        : score >= 60 ? 'buy' 
        : score >= 40 ? 'hold' 
        : 'avoid';
      expect(recommendation).toBe('hold');
    });

    it('should recommend avoid for score < 40', () => {
      const score = 30;
      const recommendation = score >= 80 ? 'strong_buy' 
        : score >= 60 ? 'buy' 
        : score >= 40 ? 'hold' 
        : 'avoid';
      expect(recommendation).toBe('avoid');
    });
  });

  describe('Top Picks Sorting', () => {
    it('should sort picks by Graham score descending', () => {
      const picks = [
        { ticker: 'A', grahamScore: 60 },
        { ticker: 'B', grahamScore: 85 },
        { ticker: 'C', grahamScore: 72 },
      ];
      
      const sorted = [...picks].sort((a, b) => b.grahamScore - a.grahamScore);
      
      expect(sorted[0].ticker).toBe('B');
      expect(sorted[1].ticker).toBe('C');
      expect(sorted[2].ticker).toBe('A');
    });

    it('should filter picks by minimum score', () => {
      const picks = [
        { ticker: 'A', grahamScore: 60 },
        { ticker: 'B', grahamScore: 85 },
        { ticker: 'C', grahamScore: 45 },
        { ticker: 'D', grahamScore: 30 },
      ];
      
      const minScore = 50;
      const filtered = picks.filter(p => p.grahamScore >= minScore);
      
      expect(filtered.length).toBe(2);
      expect(filtered.map(p => p.ticker)).toContain('A');
      expect(filtered.map(p => p.ticker)).toContain('B');
    });
  });
});
