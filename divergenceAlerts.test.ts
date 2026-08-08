import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getDb } from "./db";
import { divergenceAlerts, divergenceAlertHistory, weeklyAlertReports, weeklyAlertReportConfig } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

describe("Divergence Alerts", () => {
  const testUserId = 999998; // Using int for userId
  let createdAlertId: number | null = null;
  
  afterEach(async () => {
    const db = await getDb();
    if (!db) return;
    
    // Cleanup test data
    if (createdAlertId) {
      await db.delete(divergenceAlerts).where(eq(divergenceAlerts.id, createdAlertId));
      createdAlertId = null;
    }
    await db.delete(divergenceAlerts).where(eq(divergenceAlerts.userId, testUserId));
    await db.delete(divergenceAlertHistory).where(eq(divergenceAlertHistory.userId, testUserId));
  });
  
  describe("CRUD Operations", () => {
    it("should create a divergence alert", async () => {
      const db = await getDb();
      if (!db) {
        console.log("Skipping test - no database connection");
        return;
      }
      
      const [result] = await db.insert(divergenceAlerts).values({
        userId: testUserId,
        ticker: "PETR4",
        sector: "Petróleo",
        divergenceThreshold: 5,
        direction: "both",
        cooldownMinutes: 60,
        notifyPush: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      createdAlertId = result.insertId;
      expect(createdAlertId).toBeGreaterThan(0);
    });
    
    it("should list divergence alerts for a user", async () => {
      const db = await getDb();
      if (!db) {
        console.log("Skipping test - no database connection");
        return;
      }
      
      // Create test alert
      const [result] = await db.insert(divergenceAlerts).values({
        userId: testUserId,
        ticker: "VALE3",
        sector: "Mineração",
        divergenceThreshold: 7,
        direction: "ticker_up_sector_down",
        cooldownMinutes: 30,
        notifyPush: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      createdAlertId = result.insertId;
      
      // List alerts
      const alerts = await db.select()
        .from(divergenceAlerts)
        .where(eq(divergenceAlerts.userId, testUserId));
      
      expect(alerts.length).toBeGreaterThanOrEqual(1);
      expect(alerts[0].ticker).toBe("VALE3");
      expect(alerts[0].sector).toBe("Mineração");
    });
    
    it("should update a divergence alert", async () => {
      const db = await getDb();
      if (!db) {
        console.log("Skipping test - no database connection");
        return;
      }
      
      // Create test alert
      const [result] = await db.insert(divergenceAlerts).values({
        userId: testUserId,
        ticker: "ITUB4",
        sector: "Bancos",
        divergenceThreshold: 3,
        direction: "both",
        cooldownMinutes: 60,
        notifyPush: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      createdAlertId = result.insertId;
      
      // Update alert
      await db.update(divergenceAlerts)
        .set({ isActive: false, divergenceThreshold: 10 })
        .where(eq(divergenceAlerts.id, createdAlertId));
      
      // Verify update
      const [updated] = await db.select()
        .from(divergenceAlerts)
        .where(eq(divergenceAlerts.id, createdAlertId));
      
      expect(updated.isActive).toBe(false);
      expect(parseFloat(String(updated.divergenceThreshold))).toBe(10);
    });
    
    it("should delete a divergence alert", async () => {
      const db = await getDb();
      if (!db) {
        console.log("Skipping test - no database connection");
        return;
      }
      
      // Create test alert
      const [result] = await db.insert(divergenceAlerts).values({
        userId: testUserId,
        ticker: "BBDC4",
        sector: "Bancos",
        divergenceThreshold: 5,
        direction: "ticker_down_sector_up",
        cooldownMinutes: 60,
        notifyPush: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const alertId = result.insertId;
      
      // Delete alert
      await db.delete(divergenceAlerts).where(eq(divergenceAlerts.id, alertId));
      
      // Verify deletion
      const alerts = await db.select()
        .from(divergenceAlerts)
        .where(eq(divergenceAlerts.id, alertId));
      
      expect(alerts.length).toBe(0);
    });
  });
  
  describe("Divergence Alert History", () => {
    it("should record divergence alert trigger", async () => {
      const db = await getDb();
      if (!db) {
        console.log("Skipping test - no database connection");
        return;
      }
      
      // Create test alert
      const [alertResult] = await db.insert(divergenceAlerts).values({
        userId: testUserId,
        ticker: "MGLU3",
        sector: "Varejo",
        divergenceThreshold: 5,
        direction: "both",
        cooldownMinutes: 60,
        notifyPush: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      createdAlertId = alertResult.insertId;
      
      // Record trigger
      await db.insert(divergenceAlertHistory).values({
        alertId: createdAlertId,
        userId: testUserId,
        ticker: "MGLU3",
        sector: "Varejo",
        tickerChange: "8.5",
        sectorChange: "-2.3",
        divergence: "10.8",
        direction: "ticker_up_sector_down",
        triggeredAt: new Date(),
      });
      
      // Verify history
      const history = await db.select()
        .from(divergenceAlertHistory)
        .where(eq(divergenceAlertHistory.userId, testUserId));
      
      expect(history.length).toBe(1);
      expect(history[0].ticker).toBe("MGLU3");
      expect(parseFloat(history[0].divergence)).toBeCloseTo(10.8, 1);
    });
  });
});

describe("Weekly Alert Reports", () => {
  const testUserId = 999999; // Using int for userId
  let createdReportId: number | null = null;
  
  afterEach(async () => {
    const db = await getDb();
    if (!db) return;
    
    // Cleanup test data
    if (createdReportId) {
      await db.delete(weeklyAlertReports).where(eq(weeklyAlertReports.id, createdReportId));
      createdReportId = null;
    }
    await db.delete(weeklyAlertReports).where(eq(weeklyAlertReports.userId, testUserId));
    await db.delete(weeklyAlertReportConfig).where(eq(weeklyAlertReportConfig.userId, testUserId));
  });
  
  describe("Report Configuration", () => {
    it("should create report config", async () => {
      const db = await getDb();
      if (!db) {
        console.log("Skipping test - no database connection");
        return;
      }
      
      await db.insert(weeklyAlertReportConfig).values({
        userId: testUserId,
        isEnabled: true,
        sendEmail: true,
        sendPush: false,
        dayOfWeek: 1,
        includeVolatilityAlerts: true,
        includeSectorAlerts: true,
        includeDivergenceAlerts: true,
        includePriceAlerts: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const [config] = await db.select()
        .from(weeklyAlertReportConfig)
        .where(eq(weeklyAlertReportConfig.userId, testUserId));
      
      expect(config).toBeDefined();
      expect(config.isEnabled).toBe(true);
      expect(config.dayOfWeek).toBe(1);
    });
    
    it("should update report config", async () => {
      const db = await getDb();
      if (!db) {
        console.log("Skipping test - no database connection");
        return;
      }
      
      // Create config
      await db.insert(weeklyAlertReportConfig).values({
        userId: testUserId,
        isEnabled: true,
        sendEmail: true,
        sendPush: false,
        dayOfWeek: 1,
        includeVolatilityAlerts: true,
        includeSectorAlerts: true,
        includeDivergenceAlerts: true,
        includePriceAlerts: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Update config
      await db.update(weeklyAlertReportConfig)
        .set({ dayOfWeek: 5, sendPush: true })
        .where(eq(weeklyAlertReportConfig.userId, testUserId));
      
      // Verify update
      const [updated] = await db.select()
        .from(weeklyAlertReportConfig)
        .where(eq(weeklyAlertReportConfig.userId, testUserId));
      
      expect(updated.dayOfWeek).toBe(5);
      expect(updated.sendPush).toBe(true);
    });
  });
  
  describe("Report Generation", () => {
    it("should create a weekly report", async () => {
      const db = await getDb();
      if (!db) {
        console.log("Skipping test - no database connection");
        return;
      }
      
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weekEnd = new Date();
      
      const [result] = await db.insert(weeklyAlertReports).values({
        userId: testUserId,
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        totalAlerts: 15,
        volatilityAlerts: 5,
        sectorAlerts: 4,
        divergenceAlerts: 3,
        priceAlerts: 3,
        topTickers: JSON.stringify([{ ticker: "PETR4", count: 5 }, { ticker: "VALE3", count: 3 }]),
        topSectors: JSON.stringify([{ sector: "Petróleo", count: 4 }]),
        reportData: JSON.stringify({ summary: "Test report" }),
        sentAt: new Date(),
        createdAt: new Date(),
      });
      
      createdReportId = result.insertId;
      expect(createdReportId).toBeGreaterThan(0);
    });
    
    it("should list user reports", async () => {
      const db = await getDb();
      if (!db) {
        console.log("Skipping test - no database connection");
        return;
      }
      
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weekEnd = new Date();
      
      // Create test report
      const [result] = await db.insert(weeklyAlertReports).values({
        userId: testUserId,
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        totalAlerts: 10,
        volatilityAlerts: 3,
        sectorAlerts: 3,
        divergenceAlerts: 2,
        priceAlerts: 2,
        topTickers: JSON.stringify([]),
        topSectors: JSON.stringify([]),
        reportData: JSON.stringify({}),
        sentAt: new Date(),
        createdAt: new Date(),
      });
      
      createdReportId = result.insertId;
      
      // List reports
      const reports = await db.select()
        .from(weeklyAlertReports)
        .where(eq(weeklyAlertReports.userId, testUserId));
      
      expect(reports.length).toBeGreaterThanOrEqual(1);
      expect(reports[0].totalAlerts).toBe(10);
    });
  });
});
