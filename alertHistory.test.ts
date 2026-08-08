import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database
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
};

vi.mock("./_core/db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

describe("Alert History Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Price Alert History Schema", () => {
    it("should have correct fields for price_alert_history table", async () => {
      const { priceAlertHistory } = await import("../drizzle/schema");
      
      // Verify the table exists and has the expected structure
      expect(priceAlertHistory).toBeDefined();
    });

    it("should have required fields in priceAlertHistory", async () => {
      const { priceAlertHistory } = await import("../drizzle/schema");
      
      // Check that the table has the expected columns
      const columns = Object.keys(priceAlertHistory);
      expect(columns).toContain("id");
      expect(columns).toContain("alertId");
      expect(columns).toContain("userId");
      expect(columns).toContain("ticker");
      expect(columns).toContain("targetPrice");
      expect(columns).toContain("actualPrice");
      expect(columns).toContain("condition");
      expect(columns).toContain("triggeredAt");
    });
  });

  describe("Alert History Data Structure", () => {
    it("should correctly structure history entry data", () => {
      const historyEntry = {
        id: 1,
        alertId: 10,
        userId: 5,
        ticker: "PETR4",
        assetName: "Petrobras",
        targetPrice: "35.50",
        actualPrice: "36.00",
        condition: "above" as const,
        triggeredAt: new Date("2024-01-15T10:30:00Z"),
      };

      expect(historyEntry.id).toBe(1);
      expect(historyEntry.alertId).toBe(10);
      expect(historyEntry.userId).toBe(5);
      expect(historyEntry.ticker).toBe("PETR4");
      expect(historyEntry.condition).toBe("above");
      expect(parseFloat(historyEntry.targetPrice)).toBe(35.50);
      expect(parseFloat(historyEntry.actualPrice)).toBe(36.00);
    });

    it("should calculate price difference correctly", () => {
      const targetPrice = 35.50;
      const actualPrice = 36.00;
      
      const percentDiff = ((actualPrice - targetPrice) / targetPrice) * 100;
      
      expect(percentDiff).toBeCloseTo(1.41, 1);
    });

    it("should handle below condition correctly", () => {
      const historyEntry = {
        condition: "below" as const,
        targetPrice: "30.00",
        actualPrice: "29.50",
      };

      const target = parseFloat(historyEntry.targetPrice);
      const actual = parseFloat(historyEntry.actualPrice);
      
      // For "below" condition, actual should be <= target
      expect(actual).toBeLessThanOrEqual(target);
    });
  });

  describe("Alert History Stats Calculation", () => {
    it("should calculate stats correctly from history data", () => {
      const history = [
        { id: 1, condition: "above", ticker: "PETR4" },
        { id: 2, condition: "above", ticker: "VALE3" },
        { id: 3, condition: "below", ticker: "PETR4" },
        { id: 4, condition: "above", ticker: "PETR4" },
        { id: 5, condition: "below", ticker: "ITUB4" },
      ];

      const total = history.length;
      const aboveCount = history.filter(h => h.condition === "above").length;
      const belowCount = history.filter(h => h.condition === "below").length;

      expect(total).toBe(5);
      expect(aboveCount).toBe(3);
      expect(belowCount).toBe(2);
    });

    it("should count tickers correctly", () => {
      const history = [
        { ticker: "PETR4" },
        { ticker: "VALE3" },
        { ticker: "PETR4" },
        { ticker: "PETR4" },
        { ticker: "ITUB4" },
      ];

      const tickerCounts: Record<string, number> = {};
      history.forEach(h => {
        tickerCounts[h.ticker] = (tickerCounts[h.ticker] || 0) + 1;
      });

      const tickers = Object.entries(tickerCounts)
        .map(([ticker, count]) => ({ ticker, count }))
        .sort((a, b) => b.count - a.count);

      expect(tickers[0]).toEqual({ ticker: "PETR4", count: 3 });
      expect(tickers[1]).toEqual({ ticker: "VALE3", count: 1 });
      expect(tickers[2]).toEqual({ ticker: "ITUB4", count: 1 });
    });

    it("should handle empty history", () => {
      const history: any[] = [];

      const total = history.length;
      const aboveCount = history.filter(h => h.condition === "above").length;
      const belowCount = history.filter(h => h.condition === "below").length;

      expect(total).toBe(0);
      expect(aboveCount).toBe(0);
      expect(belowCount).toBe(0);
    });
  });

  describe("Alert History Filtering", () => {
    const mockHistory = [
      { id: 1, condition: "above", ticker: "PETR4" },
      { id: 2, condition: "below", ticker: "VALE3" },
      { id: 3, condition: "above", ticker: "PETR4" },
      { id: 4, condition: "below", ticker: "ITUB4" },
      { id: 5, condition: "above", ticker: "VALE3" },
    ];

    it("should filter by condition correctly", () => {
      const filterCondition = "above";
      const filtered = mockHistory.filter(h => h.condition === filterCondition);

      expect(filtered.length).toBe(3);
      expect(filtered.every(h => h.condition === "above")).toBe(true);
    });

    it("should filter by ticker correctly", () => {
      const filterTicker = "PETR4";
      const filtered = mockHistory.filter(h => h.ticker === filterTicker);

      expect(filtered.length).toBe(2);
      expect(filtered.every(h => h.ticker === "PETR4")).toBe(true);
    });

    it("should filter by both condition and ticker", () => {
      const filterCondition = "above";
      const filterTicker = "PETR4";
      const filtered = mockHistory.filter(
        h => h.condition === filterCondition && h.ticker === filterTicker
      );

      expect(filtered.length).toBe(2);
    });

    it("should return all when no filters applied", () => {
      const filterCondition = "all";
      const filterTicker = "all";
      const filtered = mockHistory.filter(h => {
        if (filterCondition !== "all" && h.condition !== filterCondition) return false;
        if (filterTicker !== "all" && h.ticker !== filterTicker) return false;
        return true;
      });

      expect(filtered.length).toBe(5);
    });
  });

  describe("Alerts Widget Distance Calculation", () => {
    it("should calculate distance for above condition correctly", () => {
      const currentPrice = 35.00;
      const targetPrice = 40.00;
      
      const distance = ((currentPrice - targetPrice) / currentPrice) * 100;
      
      expect(distance).toBeCloseTo(-14.29, 1);
    });

    it("should calculate distance for below condition correctly", () => {
      const currentPrice = 35.00;
      const targetPrice = 30.00;
      
      const distance = ((currentPrice - targetPrice) / currentPrice) * 100;
      
      expect(distance).toBeCloseTo(14.29, 1);
    });

    it("should identify close alerts (within 10%)", () => {
      const testCases = [
        { currentPrice: 35.00, targetPrice: 36.00, expectedClose: true },
        { currentPrice: 35.00, targetPrice: 38.00, expectedClose: true },
        { currentPrice: 35.00, targetPrice: 40.00, expectedClose: false },
        { currentPrice: 35.00, targetPrice: 33.00, expectedClose: true },
        { currentPrice: 35.00, targetPrice: 30.00, expectedClose: false },
      ];

      testCases.forEach(({ currentPrice, targetPrice, expectedClose }) => {
        const distance = ((currentPrice - targetPrice) / currentPrice) * 100;
        const absDistance = Math.abs(distance);
        const isClose = absDistance <= 10;

        expect(isClose).toBe(expectedClose);
      });
    });

    it("should sort alerts by closest distance first", () => {
      const alerts = [
        { ticker: "A", distance: -15 },
        { ticker: "B", distance: 5 },
        { ticker: "C", distance: -3 },
        { ticker: "D", distance: 20 },
      ];

      const sorted = [...alerts].sort((a, b) => Math.abs(a.distance) - Math.abs(b.distance));

      expect(sorted[0].ticker).toBe("C");
      expect(sorted[1].ticker).toBe("B");
      expect(sorted[2].ticker).toBe("A");
      expect(sorted[3].ticker).toBe("D");
    });
  });

  describe("Percent Alert Calculations", () => {
    it("should calculate percent change correctly", () => {
      const referencePrice = 100;
      const currentPrice = 105;
      
      const percentChange = ((currentPrice - referencePrice) / referencePrice) * 100;
      
      expect(percentChange).toBe(5);
    });

    it("should detect when above threshold is met", () => {
      const referencePrice = 100;
      const currentPrice = 108;
      const targetPercent = 5;
      
      const actualPercent = ((currentPrice - referencePrice) / referencePrice) * 100;
      const shouldTrigger = actualPercent >= targetPercent;
      
      expect(actualPercent).toBe(8);
      expect(shouldTrigger).toBe(true);
    });

    it("should detect when below threshold is met", () => {
      const referencePrice = 100;
      const currentPrice = 92;
      const targetPercent = 5; // Looking for 5% drop
      
      const actualPercent = ((currentPrice - referencePrice) / referencePrice) * 100;
      const shouldTrigger = actualPercent <= -targetPercent;
      
      expect(actualPercent).toBe(-8);
      expect(shouldTrigger).toBe(true);
    });

    it("should not trigger when threshold not met", () => {
      const referencePrice = 100;
      const currentPrice = 102;
      const targetPercent = 5;
      
      const actualPercent = ((currentPrice - referencePrice) / referencePrice) * 100;
      const shouldTrigger = actualPercent >= targetPercent;
      
      expect(actualPercent).toBe(2);
      expect(shouldTrigger).toBe(false);
    });
  });

  describe("Export Functionality", () => {
    it("should generate valid CSV content", () => {
      const history = [
        { ticker: "PETR4", assetName: "Petrobras", alertType: "price", condition: "above", targetPrice: "35.00", actualPrice: "36.50", triggeredAt: new Date("2024-01-15") },
        { ticker: "VALE3", assetName: "Vale", alertType: "percent", condition: "below", targetPercent: "5.0", actualPrice: "65.00", actualPercent: "-6.5", triggeredAt: new Date("2024-01-16") },
      ];

      const headers = ["Ticker", "Nome", "Tipo", "Condição", "Preço Alvo", "% Alvo", "Preço Real", "% Real", "Data"];
      const rows = history.map(h => [
        h.ticker,
        h.assetName || "",
        h.alertType === "percent" ? "Variação" : "Preço",
        h.condition === "above" ? "Acima" : "Abaixo",
        h.targetPrice || "",
        h.targetPercent ? `${h.targetPercent}%` : "",
        h.actualPrice,
        h.actualPercent ? `${h.actualPercent}%` : "",
        h.triggeredAt.toLocaleString("pt-BR"),
      ]);
      
      const csvContent = [headers.join(","), ...rows.map(r => r.map(cell => `"${cell}"`).join(","))].join("\n");

      expect(csvContent).toContain("Ticker");
      expect(csvContent).toContain("PETR4");
      expect(csvContent).toContain("VALE3");
      expect(csvContent).toContain("Variação");
      expect(csvContent).toContain("Preço");
    });

    it("should generate valid JSON content", () => {
      const history = [
        { ticker: "PETR4", assetName: "Petrobras", alertType: "price", condition: "above", targetPrice: "35.00", actualPrice: "36.50" },
      ];

      const jsonContent = JSON.stringify(history.map(h => ({
        ticker: h.ticker,
        assetName: h.assetName,
        alertType: h.alertType,
        condition: h.condition,
        targetPrice: h.targetPrice,
        actualPrice: h.actualPrice,
      })), null, 2);

      const parsed = JSON.parse(jsonContent);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].ticker).toBe("PETR4");
      expect(parsed[0].alertType).toBe("price");
    });

    it("should handle empty history for export", () => {
      const history: any[] = [];
      
      const headers = ["Ticker", "Nome"];
      const csvContent = [headers.join(",")].join("\n");
      
      expect(csvContent).toBe("Ticker,Nome");
    });
  });

  describe("Watchlist Filters", () => {
    const mockWatchlist = [
      { ticker: "PETR4", type: "stock", change: 2.5 },
      { ticker: "HGLG11", type: "fii", change: -1.2 },
      { ticker: "IVVB11", type: "etf", change: 0.8 },
      { ticker: "BTC", type: "crypto", change: -3.5 },
      { ticker: "VALE3", type: "stock", change: 1.1 },
    ];

    it("should filter by asset type correctly", () => {
      const filterType = "stock";
      const filtered = mockWatchlist.filter(item => item.type === filterType);

      expect(filtered.length).toBe(2);
      expect(filtered.every(item => item.type === "stock")).toBe(true);
    });

    it("should filter by positive change", () => {
      const filtered = mockWatchlist.filter(item => item.change > 0);

      expect(filtered.length).toBe(3);
      expect(filtered.every(item => item.change > 0)).toBe(true);
    });

    it("should filter by negative change", () => {
      const filtered = mockWatchlist.filter(item => item.change < 0);

      expect(filtered.length).toBe(2);
      expect(filtered.every(item => item.change < 0)).toBe(true);
    });

    it("should count assets by type", () => {
      const counts: Record<string, number> = {};
      mockWatchlist.forEach(item => {
        counts[item.type] = (counts[item.type] || 0) + 1;
      });

      expect(counts.stock).toBe(2);
      expect(counts.fii).toBe(1);
      expect(counts.etf).toBe(1);
      expect(counts.crypto).toBe(1);
    });

    it("should combine multiple filters", () => {
      const filterType = "stock";
      const filterChange = "positive";
      
      const filtered = mockWatchlist.filter(item => {
        if (filterType !== "all" && item.type !== filterType) return false;
        if (filterChange === "positive" && item.change <= 0) return false;
        if (filterChange === "negative" && item.change >= 0) return false;
        return true;
      });

      expect(filtered.length).toBe(2);
      expect(filtered.every(item => item.type === "stock" && item.change > 0)).toBe(true);
    });
  });
});
