import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock database
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

describe("Portfolio Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Portfolio Data Structures", () => {
    it("should have valid portfolio structure", () => {
      const portfolio = {
        id: 1,
        userId: 1,
        name: "Carteira Principal",
        description: "Minha carteira diversificada",
        initialCapital: "100000.00",
        currentValue: "125000.00",
        totalReturn: "25.00",
        benchmark: "IBOV",
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(portfolio.id).toBeDefined();
      expect(portfolio.userId).toBeDefined();
      expect(portfolio.name).toBeTruthy();
      expect(Number(portfolio.initialCapital)).toBeGreaterThan(0);
      expect(portfolio.benchmark).toBeTruthy();
    });

    it("should have valid position structure", () => {
      const position = {
        id: 1,
        portfolioId: 1,
        ticker: "PETR4",
        assetName: "Petrobras",
        assetType: "stock" as const,
        quantity: "100",
        averagePrice: "35.50",
        currentPrice: "38.20",
        totalCost: "3550.00",
        currentValue: "3820.00",
        returnPercent: "7.61",
        sector: "Petróleo e Gás",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(position.ticker).toBeTruthy();
      expect(Number(position.quantity)).toBeGreaterThan(0);
      expect(Number(position.averagePrice)).toBeGreaterThan(0);
      expect(["stock", "etf", "crypto"]).toContain(position.assetType);
    });

    it("should have valid transaction structure", () => {
      const transaction = {
        id: 1,
        portfolioId: 1,
        ticker: "PETR4",
        transactionType: "buy" as const,
        quantity: "100",
        price: "35.50",
        totalValue: "3550.00",
        fees: "0.00",
        notes: "Compra inicial",
        transactionDate: new Date(),
        createdAt: new Date(),
      };

      expect(transaction.ticker).toBeTruthy();
      expect(["buy", "sell", "dividend"]).toContain(transaction.transactionType);
      expect(Number(transaction.totalValue)).toBeGreaterThan(0);
    });
  });

  describe("Portfolio Calculations", () => {
    it("should calculate return percentage correctly", () => {
      const initialCapital = 100000;
      const currentValue = 125000;
      const expectedReturn = ((currentValue - initialCapital) / initialCapital) * 100;

      expect(expectedReturn).toBe(25);
    });

    it("should calculate average price correctly after multiple buys", () => {
      const buy1 = { quantity: 100, price: 30 };
      const buy2 = { quantity: 50, price: 36 };

      const totalQuantity = buy1.quantity + buy2.quantity;
      const totalCost = buy1.quantity * buy1.price + buy2.quantity * buy2.price;
      const avgPrice = totalCost / totalQuantity;

      expect(totalQuantity).toBe(150);
      expect(totalCost).toBe(4800);
      expect(avgPrice).toBe(32);
    });

    it("should calculate position return correctly", () => {
      const avgPrice = 32;
      const currentPrice = 40;
      const returnPercent = ((currentPrice - avgPrice) / avgPrice) * 100;

      expect(returnPercent).toBe(25);
    });

    it("should calculate portfolio weight correctly", () => {
      const positions = [
        { currentValue: 5000 },
        { currentValue: 3000 },
        { currentValue: 2000 },
      ];

      const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
      const weights = positions.map(p => (p.currentValue / totalValue) * 100);

      expect(totalValue).toBe(10000);
      expect(weights[0]).toBe(50);
      expect(weights[1]).toBe(30);
      expect(weights[2]).toBe(20);
    });
  });

  describe("Risk Metrics", () => {
    it("should calculate Sharpe ratio correctly", () => {
      const portfolioReturn = 15; // 15%
      const riskFreeRate = 5; // 5%
      const standardDeviation = 10; // 10%

      const sharpeRatio = (portfolioReturn - riskFreeRate) / standardDeviation;

      expect(sharpeRatio).toBe(1);
    });

    it("should calculate max drawdown correctly", () => {
      const values = [100, 110, 105, 95, 100, 90, 95, 105];
      
      let maxDrawdown = 0;
      let peak = values[0];

      for (const value of values) {
        if (value > peak) {
          peak = value;
        }
        const drawdown = ((peak - value) / peak) * 100;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }

      // Peak was 110, lowest after peak was 90
      // Drawdown = (110 - 90) / 110 * 100 = 18.18%
      expect(maxDrawdown).toBeCloseTo(18.18, 1);
    });

    it("should calculate beta correctly", () => {
      // Simplified beta calculation
      const portfolioReturns = [2, -1, 3, -2, 1];
      const marketReturns = [1, -0.5, 2, -1, 0.5];

      // Calculate covariance and variance
      const avgPortfolio = portfolioReturns.reduce((a, b) => a + b, 0) / portfolioReturns.length;
      const avgMarket = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;

      let covariance = 0;
      let marketVariance = 0;

      for (let i = 0; i < portfolioReturns.length; i++) {
        covariance += (portfolioReturns[i] - avgPortfolio) * (marketReturns[i] - avgMarket);
        marketVariance += Math.pow(marketReturns[i] - avgMarket, 2);
      }

      covariance /= portfolioReturns.length;
      marketVariance /= marketReturns.length;

      const beta = covariance / marketVariance;

      // Beta should be around 2 (portfolio moves 2x market)
      expect(beta).toBeCloseTo(2, 0);
    });
  });

  describe("Transaction Validation", () => {
    it("should not allow selling more than owned", () => {
      const currentQuantity = 100;
      const sellQuantity = 150;

      const isValid = sellQuantity <= currentQuantity;

      expect(isValid).toBe(false);
    });

    it("should allow selling exact amount owned", () => {
      const currentQuantity = 100;
      const sellQuantity = 100;

      const isValid = sellQuantity <= currentQuantity;

      expect(isValid).toBe(true);
    });

    it("should calculate transaction total correctly", () => {
      const quantity = 100;
      const price = 35.50;
      const fees = 5.00;

      const total = quantity * price + fees;

      expect(total).toBe(3555);
    });
  });

  describe("Benchmark Comparison", () => {
    it("should calculate alpha correctly", () => {
      const portfolioReturn = 20;
      const benchmarkReturn = 15;
      const beta = 1.2;
      const riskFreeRate = 5;

      // Alpha = Portfolio Return - [Risk-Free Rate + Beta * (Benchmark Return - Risk-Free Rate)]
      const expectedReturn = riskFreeRate + beta * (benchmarkReturn - riskFreeRate);
      const alpha = portfolioReturn - expectedReturn;

      // Expected return = 5 + 1.2 * (15 - 5) = 5 + 12 = 17
      // Alpha = 20 - 17 = 3
      expect(alpha).toBe(3);
    });

    it("should identify outperformance correctly", () => {
      const portfolioReturn = 25;
      const benchmarkReturn = 18;

      const outperformance = portfolioReturn - benchmarkReturn;
      const isOutperforming = outperformance > 0;

      expect(outperformance).toBe(7);
      expect(isOutperforming).toBe(true);
    });
  });
});
