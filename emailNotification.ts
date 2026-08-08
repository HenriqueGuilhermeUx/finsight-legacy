/**
 * Email Notification Service for Signal Alerts
 * 
 * Uses the built-in notification system to send alerts to users
 * In production, this could be extended to use SendGrid, Mailgun, etc.
 */

import { notifyOwner } from "../_core/notification";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Signal display names
const signalNames: Record<string, string> = {
  strong_buy: "🚀 COMPRA FORTE",
  buy: "⬆️ Compra",
  neutral: "➖ Neutro",
  sell: "⬇️ Venda",
  strong_sell: "🚨 VENDA FORTE",
};

// Signal colors for HTML emails
const signalColors: Record<string, string> = {
  strong_buy: "#10b981",
  buy: "#34d399",
  neutral: "#6b7280",
  sell: "#f87171",
  strong_sell: "#ef4444",
};

export interface SignalAlertEmailData {
  userId: number;
  ticker: string;
  assetName?: string;
  previousSignal: string;
  newSignal: string;
  price?: number;
  rsi?: number;
  macd?: number;
}

/**
 * Send email notification for signal change
 * Currently uses notifyOwner to send to the app owner
 * In production, extend this to send to individual users via email service
 */
export async function sendSignalAlertEmail(data: SignalAlertEmailData): Promise<boolean> {
  const { ticker, assetName, previousSignal, newSignal, price, rsi, macd } = data;

  const prevDisplay = signalNames[previousSignal] || previousSignal;
  const newDisplay = signalNames[newSignal] || newSignal;

  // Build notification content
  const title = `📊 Alerta de Sinal: ${ticker} mudou para ${newDisplay}`;
  
  let content = `**${assetName || ticker}** (${ticker})\n\n`;
  content += `Sinal anterior: ${prevDisplay}\n`;
  content += `Novo sinal: ${newDisplay}\n\n`;
  
  if (price) {
    content += `Preço atual: R$ ${price.toFixed(2)}\n`;
  }
  if (rsi) {
    content += `RSI (14): ${rsi.toFixed(1)}`;
    if (rsi < 30) content += " (Sobrevendido)";
    else if (rsi > 70) content += " (Sobrecomprado)";
    content += "\n";
  }
  if (macd) {
    content += `MACD: ${macd.toFixed(2)}`;
    if (macd > 0) content += " (Bullish)";
    else content += " (Bearish)";
    content += "\n";
  }
  
  content += `\n---\n`;
  content += `Acesse https://f-insight.org/sinais para ver mais detalhes.`;

  try {
    // Send to owner (in production, send to user's email)
    const success = await notifyOwner({ title, content });
    
    if (success) {
      console.log(`[Email] Signal alert sent for ${ticker}: ${previousSignal} → ${newSignal}`);
    }
    
    return success;
  } catch (error) {
    console.error(`[Email] Failed to send signal alert for ${ticker}:`, error);
    return false;
  }
}

/**
 * Send batch notification summary
 */
export async function sendDailySignalSummary(signals: Array<{
  ticker: string;
  name: string;
  signal: string;
  score: number;
}>): Promise<boolean> {
  if (signals.length === 0) return true;

  const buySignals = signals.filter(s => s.signal === "strong_buy" || s.signal === "buy");
  const sellSignals = signals.filter(s => s.signal === "strong_sell" || s.signal === "sell");

  const title = `📈 F-Insight: Resumo Diário de Sinais`;
  
  let content = `**Resumo de Sinais Técnicos**\n\n`;
  
  if (buySignals.length > 0) {
    content += `🟢 **Sinais de Compra (${buySignals.length})**\n`;
    buySignals.slice(0, 5).forEach(s => {
      content += `• ${s.ticker} (${s.name}): ${signalNames[s.signal]} - Score: ${s.score}\n`;
    });
    content += "\n";
  }
  
  if (sellSignals.length > 0) {
    content += `🔴 **Sinais de Venda (${sellSignals.length})**\n`;
    sellSignals.slice(0, 5).forEach(s => {
      content += `• ${s.ticker} (${s.name}): ${signalNames[s.signal]} - Score: ${s.score}\n`;
    });
    content += "\n";
  }
  
  content += `\n---\n`;
  content += `Acesse https://f-insight.org/top-sinais para ver o ranking completo.`;

  try {
    return await notifyOwner({ title, content });
  } catch (error) {
    console.error("[Email] Failed to send daily summary:", error);
    return false;
  }
}

/**
 * Get user email by ID (for future email service integration)
 */
export async function getUserEmail(userId: number): Promise<string | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const result = await db.select({ email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0]?.email || null;
  } catch (error) {
    console.error("[Email] Failed to get user email:", error);
    return null;
  }
}
