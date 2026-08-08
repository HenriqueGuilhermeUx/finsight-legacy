/**
 * Cron Job: Process Signal Alerts
 * 
 * This script should be called periodically (e.g., every hour) to:
 * 1. Check all active signal alerts
 * 2. Compare current signals with last recorded signals
 * 3. Send notifications when signals change
 * 4. Save current signals to history
 */

import { getDb, getActiveSignalAlerts, updateSignalAlertLastSignal, createSignalNotification, saveSignalHistory } from "../db";
import * as openbb from "../openbb";
import { notifyOwner } from "../_core/notification";
import { sendSignalAlertEmail, sendDailySignalSummary } from "../services/emailNotification";

// Signal display names for notifications
const signalNames: Record<string, string> = {
  strong_buy: "🚀 Compra Forte",
  buy: "⬆️ Compra",
  neutral: "➖ Neutro",
  sell: "⬇️ Venda",
  strong_sell: "🚨 Venda Forte",
};

// Get asset type from ticker
function getAssetType(ticker: string): "stock" | "etf" | "crypto" {
  if (ticker.includes("BTC") || ticker.includes("ETH") || ticker.includes("SOL") || ticker.includes("XRP") || ticker.includes("ADA") || ticker.includes("DOGE") || ticker.includes("BNB")) {
    return "crypto";
  }
  return "stock";
}

export async function processSignalAlerts(): Promise<{
  processed: number;
  notified: number;
  errors: number;
}> {
  const results = {
    processed: 0,
    notified: 0,
    errors: 0,
  };

  try {
    const alerts = await getActiveSignalAlerts();
    console.log(`[Cron] Processing ${alerts.length} active signal alerts...`);

    for (const alert of alerts) {
      try {
        // Get current technical indicators
        const indicators = await openbb.getTechnicalIndicators(alert.ticker);
        if (!indicators) {
          console.log(`[Cron] No indicators for ${alert.ticker}, skipping...`);
          continue;
        }

        const newSignal = indicators.signal;
        const oldSignal = alert.lastSignal;

        results.processed++;

        // Check if signal changed
        if (newSignal !== oldSignal) {
          let shouldNotify = false;

          switch (alert.alertType) {
            case "any_change":
              shouldNotify = true;
              break;
            case "to_buy":
              shouldNotify = newSignal === "buy" || newSignal === "strong_buy";
              break;
            case "to_sell":
              shouldNotify = newSignal === "sell" || newSignal === "strong_sell";
              break;
            case "to_strong_buy":
              shouldNotify = newSignal === "strong_buy";
              break;
            case "to_strong_sell":
              shouldNotify = newSignal === "strong_sell";
              break;
          }

          if (shouldNotify && oldSignal) {
            // Create notification in database
            await createSignalNotification({
              alertId: alert.id,
              userId: alert.userId,
              ticker: alert.ticker,
              previousSignal: oldSignal as any,
              newSignal: newSignal as any,
            });

            // Send email notification
            await sendSignalAlertEmail({
              userId: alert.userId,
              ticker: alert.ticker,
              assetName: alert.assetName || undefined,
              previousSignal: oldSignal,
              newSignal,
              price: indicators.price,
              rsi: indicators.rsi14,
              macd: indicators.macdHistogram,
            });

            // Update alert with new signal
            await updateSignalAlertLastSignal(alert.id, newSignal);

            results.notified++;
            console.log(`[Cron] Signal changed for ${alert.ticker}: ${oldSignal} → ${newSignal}`);
          } else if (!oldSignal) {
            // First time, just update the signal
            await updateSignalAlertLastSignal(alert.id, newSignal);
          }
        }

        // Save to signal history (once per day per ticker)
        // Calculate score
        let score = 0;
        if (indicators.rsi14 < 30) score += 2;
        else if (indicators.rsi14 < 40) score += 1;
        else if (indicators.rsi14 > 70) score -= 2;
        else if (indicators.rsi14 > 60) score -= 1;
        
        if (indicators.macdHistogram > 0) score += 2;
        else if (indicators.macdHistogram < 0) score -= 2;
        
        if (indicators.price > indicators.sma20) score += 1;
        else score -= 1;
        
        if (indicators.price > indicators.sma50) score += 1;
        else score -= 1;

        await saveSignalHistory({
          ticker: alert.ticker,
          assetType: getAssetType(alert.ticker),
          signal: newSignal as any,
          score,
          rsi: indicators.rsi14?.toString(),
          macd: indicators.macd?.toString(),
          macdSignal: indicators.macdSignal?.toString(),
          sma20: indicators.sma20?.toString(),
          sma50: indicators.sma50?.toString(),
          sma200: indicators.sma200?.toString(),
          price: indicators.price?.toString(),
        });

      } catch (error) {
        console.error(`[Cron] Error processing alert for ${alert.ticker}:`, error);
        results.errors++;
      }
    }

    // Notify owner with summary if there were notifications
    if (results.notified > 0) {
      await notifyOwner({
        title: `📊 F-Insight: ${results.notified} alertas de sinal disparados`,
        content: `Processados: ${results.processed} alertas\nNotificações enviadas: ${results.notified}\nErros: ${results.errors}`,
      });
    }

    console.log(`[Cron] Completed. Processed: ${results.processed}, Notified: ${results.notified}, Errors: ${results.errors}`);
    return results;

  } catch (error) {
    console.error("[Cron] Fatal error processing signal alerts:", error);
    throw error;
  }
}

// Also save signals for popular tickers (even without alerts)
export async function savePopularSignals(): Promise<number> {
  const popularTickers = [
    "PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "WEGE3", "RENT3", "BBAS3", "MGLU3", "LREN3",
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA",
    "BTC", "ETH", "SOL"
  ];

  let saved = 0;

  for (const ticker of popularTickers) {
    try {
      const indicators = await openbb.getTechnicalIndicators(ticker);
      if (!indicators) continue;

      // Calculate score
      let score = 0;
      if (indicators.rsi14 < 30) score += 2;
      else if (indicators.rsi14 < 40) score += 1;
      else if (indicators.rsi14 > 70) score -= 2;
      else if (indicators.rsi14 > 60) score -= 1;
      
      if (indicators.macdHistogram > 0) score += 2;
      else if (indicators.macdHistogram < 0) score -= 2;
      
      if (indicators.price > indicators.sma20) score += 1;
      else score -= 1;
      
      if (indicators.price > indicators.sma50) score += 1;
      else score -= 1;

      await saveSignalHistory({
        ticker: ticker.toUpperCase(),
        assetType: getAssetType(ticker),
        signal: indicators.signal as any,
        score,
        rsi: indicators.rsi14?.toString(),
        macd: indicators.macd?.toString(),
        macdSignal: indicators.macdSignal?.toString(),
        sma20: indicators.sma20?.toString(),
        sma50: indicators.sma50?.toString(),
        sma200: indicators.sma200?.toString(),
        price: indicators.price?.toString(),
      });

      saved++;
    } catch (error) {
      console.error(`[Cron] Error saving signal for ${ticker}:`, error);
    }
  }

  console.log(`[Cron] Saved ${saved} popular signals to history`);
  return saved;
}
