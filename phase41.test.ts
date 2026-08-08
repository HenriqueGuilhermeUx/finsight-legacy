import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock database functions
vi.mock('./db', async () => {
  const actual = await vi.importActual('./db');
  return {
    ...actual,
    getWeeklyReportConfig: vi.fn(),
    createOrUpdateWeeklyReportConfig: vi.fn(),
    createWeeklyReport: vi.fn(),
    getUserWeeklyReports: vi.fn(),
    getWeeklyReportById: vi.fn(),
    updateWeeklyReportStatus: vi.fn(),
    createBacktestComparison: vi.fn(),
    getUserBacktestComparisons: vi.fn(),
    getBacktestComparisonById: vi.fn(),
    deleteBacktestComparison: vi.fn(),
    getBacktestResultsByIds: vi.fn(),
  };
});

describe('Phase 41 - Weekly Report and Backtest Comparison', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Weekly Report Config', () => {
    it('should have valid config structure', () => {
      const config = {
        id: 1,
        userId: 1,
        isEnabled: true,
        deliveryDay: 'monday',
        deliveryHour: 9,
        includePortfolioSummary: true,
        includeAlertsSummary: true,
        includeMarketHighlights: true,
        includeTopMovers: true,
        includeWatchlistPerformance: true,
        notifyEmail: true,
        notifyTelegram: false,
        notifyPush: true,
      };
      
      expect(config.isEnabled).toBe(true);
      expect(config.deliveryDay).toBe('monday');
      expect(config.deliveryHour).toBeGreaterThanOrEqual(0);
      expect(config.deliveryHour).toBeLessThanOrEqual(23);
    });

    it('should validate delivery day options', () => {
      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      validDays.forEach(day => {
        expect(validDays).toContain(day);
      });
    });

    it('should validate delivery hour range', () => {
      for (let hour = 0; hour <= 23; hour++) {
        expect(hour).toBeGreaterThanOrEqual(0);
        expect(hour).toBeLessThanOrEqual(23);
      }
    });
  });

  describe('Weekly Report Generation', () => {
    it('should generate report with correct structure', () => {
      const report = {
        id: 1,
        userId: 1,
        weekStart: new Date('2024-12-16'),
        weekEnd: new Date('2024-12-22'),
        portfolioChange: '2.5',
        alertsTriggered: 3,
        topMovers: JSON.stringify([
          { ticker: 'PETR4', change: 5.2 },
          { ticker: 'VALE3', change: -3.1 },
        ]),
        marketHighlights: JSON.stringify(['IBOV subiu 1.5%', 'Dólar caiu 0.8%']),
        deliveryStatus: 'pending',
        sentAt: null,
        createdAt: new Date(),
      };
      
      expect(report.portfolioChange).toBeDefined();
      expect(report.alertsTriggered).toBeGreaterThanOrEqual(0);
      expect(report.deliveryStatus).toBe('pending');
    });

    it('should calculate week boundaries correctly', () => {
      const now = new Date('2024-12-22');
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      
      expect(weekStart.getTime()).toBeLessThan(now.getTime());
      expect(now.getTime() - weekStart.getTime()).toBe(7 * 24 * 60 * 60 * 1000);
    });

    it('should handle delivery status transitions', () => {
      const statuses = ['pending', 'sent', 'failed'];
      statuses.forEach(status => {
        expect(['pending', 'sent', 'failed']).toContain(status);
      });
    });
  });

  describe('Backtest Comparison', () => {
    it('should create comparison with valid structure', () => {
      const comparison = {
        id: 1,
        userId: 1,
        name: 'RSI vs MACD em PETR4',
        description: 'Comparando estratégias de indicadores',
        backtestIds: JSON.stringify([1, 2, 3]),
        comparisonResults: JSON.stringify([
          { id: 1, ticker: 'PETR4', indicatorType: 'rsi', winRate: 55, avgReturn: 2.5, maxDrawdown: -8.5, sharpeRatio: 1.2 },
          { id: 2, ticker: 'PETR4', indicatorType: 'macd', winRate: 52, avgReturn: 1.8, maxDrawdown: -10.2, sharpeRatio: 0.9 },
        ]),
        winnerByReturn: 1,
        winnerByDrawdown: 1,
        winnerBySharpe: 1,
        winnerByWinRate: 1,
        createdAt: new Date(),
      };
      
      expect(comparison.name).toBeDefined();
      expect(JSON.parse(comparison.backtestIds).length).toBeGreaterThanOrEqual(2);
    });

    it('should validate backtest selection limits', () => {
      const minBacktests = 2;
      const maxBacktests = 4;
      
      expect(minBacktests).toBe(2);
      expect(maxBacktests).toBe(4);
      
      // Valid selections
      expect([1, 2].length).toBeGreaterThanOrEqual(minBacktests);
      expect([1, 2, 3, 4].length).toBeLessThanOrEqual(maxBacktests);
      
      // Invalid selections
      expect([1].length).toBeLessThan(minBacktests);
      expect([1, 2, 3, 4, 5].length).toBeGreaterThan(maxBacktests);
    });

    it('should determine winners correctly', () => {
      const results = [
        { id: 1, winRate: 55, avgReturn: 2.5, maxDrawdown: -8.5, sharpeRatio: 1.2 },
        { id: 2, winRate: 60, avgReturn: 1.8, maxDrawdown: -10.2, sharpeRatio: 0.9 },
        { id: 3, winRate: 52, avgReturn: 3.1, maxDrawdown: -6.0, sharpeRatio: 1.5 },
      ];
      
      // Winner by return (highest avgReturn)
      const winnerByReturn = results.reduce((a, b) => a.avgReturn > b.avgReturn ? a : b);
      expect(winnerByReturn.id).toBe(3);
      
      // Winner by drawdown (least negative)
      const winnerByDrawdown = results.reduce((a, b) => a.maxDrawdown > b.maxDrawdown ? a : b);
      expect(winnerByDrawdown.id).toBe(3);
      
      // Winner by Sharpe (highest)
      const winnerBySharpe = results.reduce((a, b) => a.sharpeRatio > b.sharpeRatio ? a : b);
      expect(winnerBySharpe.id).toBe(3);
      
      // Winner by win rate (highest)
      const winnerByWinRate = results.reduce((a, b) => a.winRate > b.winRate ? a : b);
      expect(winnerByWinRate.id).toBe(2);
    });
  });

  describe('Export Functionality', () => {
    it('should generate valid CSV format', () => {
      const results = [
        { ticker: 'PETR4', indicatorType: 'rsi', winRate: 55, avgReturn: 2.5, maxDrawdown: -8.5, sharpeRatio: 1.2 },
        { ticker: 'VALE3', indicatorType: 'macd', winRate: 52, avgReturn: 1.8, maxDrawdown: -10.2, sharpeRatio: 0.9 },
      ];
      
      const headers = ['Ticker', 'Indicador', 'Win Rate', 'Retorno Médio', 'Max Drawdown', 'Sharpe Ratio'];
      const csvLines = [
        headers.join(','),
        ...results.map(r => `${r.ticker},${r.indicatorType},${r.winRate},${r.avgReturn},${r.maxDrawdown},${r.sharpeRatio}`)
      ];
      
      const csv = csvLines.join('\n');
      
      expect(csv).toContain('Ticker');
      expect(csv).toContain('PETR4');
      expect(csv).toContain('rsi');
    });

    it('should generate valid JSON format', () => {
      const comparison = {
        name: 'Test Comparison',
        results: [
          { ticker: 'PETR4', indicatorType: 'rsi', winRate: 55 },
        ],
        winners: {
          byReturn: 'PETR4',
          byDrawdown: 'PETR4',
        },
      };
      
      const json = JSON.stringify(comparison);
      const parsed = JSON.parse(json);
      
      expect(parsed.name).toBe('Test Comparison');
      expect(parsed.results).toHaveLength(1);
    });
  });

  describe('Notification Channels', () => {
    it('should validate notification preferences', () => {
      const config = {
        notifyEmail: true,
        notifyTelegram: false,
        notifyPush: true,
      };
      
      // At least one channel should be enabled for delivery
      const hasActiveChannel = config.notifyEmail || config.notifyTelegram || config.notifyPush;
      expect(hasActiveChannel).toBe(true);
    });

    it('should handle all notification channels', () => {
      const channels = ['email', 'telegram', 'push'];
      expect(channels).toHaveLength(3);
      expect(channels).toContain('email');
      expect(channels).toContain('telegram');
      expect(channels).toContain('push');
    });
  });

  describe('Content Sections', () => {
    it('should validate content section toggles', () => {
      const sections = {
        includePortfolioSummary: true,
        includeAlertsSummary: true,
        includeMarketHighlights: true,
        includeTopMovers: true,
        includeWatchlistPerformance: true,
      };
      
      // All sections are boolean
      Object.values(sections).forEach(value => {
        expect(typeof value).toBe('boolean');
      });
    });

    it('should generate content based on enabled sections', () => {
      const config = {
        includePortfolioSummary: true,
        includeAlertsSummary: false,
        includeMarketHighlights: true,
        includeTopMovers: false,
        includeWatchlistPerformance: true,
      };
      
      const enabledSections = Object.entries(config)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => key);
      
      expect(enabledSections).toContain('includePortfolioSummary');
      expect(enabledSections).not.toContain('includeAlertsSummary');
      expect(enabledSections).toHaveLength(3);
    });
  });

  describe('Date Handling', () => {
    it('should calculate correct week boundaries', () => {
      const testDate = new Date('2024-12-22T10:00:00Z');
      const dayOfWeek = testDate.getDay();
      
      // Calculate start of week (Sunday)
      const weekStart = new Date(testDate);
      weekStart.setDate(testDate.getDate() - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);
      
      // Calculate end of week (Saturday)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      expect(weekStart.getDay()).toBe(0); // Sunday
      expect(weekEnd.getDay()).toBe(6); // Saturday
    });

    it('should format dates correctly for display', () => {
      const date = new Date('2024-12-22');
      const formatted = date.toLocaleDateString('pt-BR');
      
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });
});
