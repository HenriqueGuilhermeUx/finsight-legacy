import { describe, it, expect } from 'vitest';
import {
  createMarketReport,
  getReportsCount,
} from './db';

describe('Market Reports', () => {
  describe('Basic Operations', () => {
    it('should create a weekly market report', async () => {
      const timestamp = Date.now();
      const report = await createMarketReport({
        title: 'Relatório Semanal - Teste ' + timestamp,
        slug: 'relatorio-semanal-teste-' + timestamp,
        reportType: 'weekly',
        summary: 'Resumo do mercado para teste',
        ibovValue: 162500,
        ibovChange: 1.2,
        sp500Value: 6980,
        sp500Change: 0.5,
        dolarValue: 5.38,
        dolarChange: -0.3,
        btcValue: 96000,
        btcChange: 2.1,
      });

      expect(report).toBeDefined();
      // createMarketReport retorna apenas o insertId (number)
      expect(typeof report).toBe('number');
      expect(report).toBeGreaterThan(0);
    });

    it('should create a monthly market report', async () => {
      const timestamp = Date.now();
      const report = await createMarketReport({
        title: 'Relatório Mensal - Teste ' + timestamp,
        slug: 'relatorio-mensal-teste-' + timestamp,
        reportType: 'monthly',
        summary: 'Análise mensal para teste',
        ibovValue: 165000,
        ibovChange: 3.5,
        sp500Value: 7050,
        sp500Change: 2.1,
        dolarValue: 5.35,
        dolarChange: -1.2,
        btcValue: 98000,
        btcChange: 5.5,
      });

      expect(report).toBeDefined();
      // createMarketReport retorna apenas o insertId (number)
      expect(typeof report).toBe('number');
      expect(report).toBeGreaterThan(0);
    });

    it('should count reports', async () => {
      const count = await getReportsCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should count reports by type', async () => {
      const weeklyCount = await getReportsCount('weekly');
      const monthlyCount = await getReportsCount('monthly');
      
      expect(weeklyCount).toBeGreaterThanOrEqual(0);
      expect(monthlyCount).toBeGreaterThanOrEqual(0);
    });
  });
});
