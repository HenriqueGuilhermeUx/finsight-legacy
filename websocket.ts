/**
 * WebSocket Service para Dados em Tempo Real
 * Streaming de cotações e atualizações de mercado
 */

import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { getQuote, getMultipleQuotes, StockQuote } from "./openbb";

interface Client {
  ws: WebSocket;
  subscriptions: Set<string>;
  userId?: string;
}

interface WSMessage {
  type: "subscribe" | "unsubscribe" | "ping" | "get_quote";
  tickers?: string[];
  ticker?: string;
}

interface WSResponse {
  type: "quote" | "quotes" | "subscribed" | "unsubscribed" | "pong" | "error" | "connection";
  data?: any;
  ticker?: string;
  tickers?: string[];
  message?: string;
  timestamp: number;
}

class RealtimeDataService {
  private wss: WebSocketServer | null = null;
  private clients: Map<WebSocket, Client> = new Map();
  private tickerSubscribers: Map<string, Set<WebSocket>> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_INTERVAL_MS = 30000; // 30 segundos

  /**
   * Inicializar WebSocket Server
   */
  initialize(server: Server): void {
    this.wss = new WebSocketServer({ 
      server,
      path: "/ws"
    });

    this.wss.on("connection", (ws: WebSocket) => {
      this.handleConnection(ws);
    });

    // Iniciar loop de atualização
    this.startUpdateLoop();

    console.log("[WebSocket] Server initialized on /ws");
  }

  /**
   * Lidar com nova conexão
   */
  private handleConnection(ws: WebSocket): void {
    const client: Client = {
      ws,
      subscriptions: new Set(),
    };

    this.clients.set(ws, client);

    // Enviar mensagem de conexão
    this.send(ws, {
      type: "connection",
      message: "Connected to FinSight Realtime Data",
      timestamp: Date.now(),
    });

    // Lidar com mensagens
    ws.on("message", (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      } catch (error) {
        this.send(ws, {
          type: "error",
          message: "Invalid message format",
          timestamp: Date.now(),
        });
      }
    });

    // Lidar com desconexão
    ws.on("close", () => {
      this.handleDisconnection(ws);
    });

    // Lidar com erros
    ws.on("error", (error: Error) => {
      console.error("[WebSocket] Client error:", error);
      this.handleDisconnection(ws);
    });

    console.log(`[WebSocket] Client connected. Total clients: ${this.clients.size}`);
  }

  /**
   * Lidar com mensagens do cliente
   */
  private async handleMessage(ws: WebSocket, message: WSMessage): Promise<void> {
    const client = this.clients.get(ws);
    if (!client) return;

    switch (message.type) {
      case "subscribe":
        if (message.tickers && Array.isArray(message.tickers)) {
          for (const ticker of message.tickers) {
            this.subscribeTicker(ws, ticker.toUpperCase());
          }
          this.send(ws, {
            type: "subscribed",
            tickers: message.tickers.map(t => t.toUpperCase()),
            timestamp: Date.now(),
          });

          // Enviar cotações iniciais
          const quotes = await getMultipleQuotes(message.tickers);
          const quotesArray = Array.from(quotes.values());
          if (quotesArray.length > 0) {
            this.send(ws, {
              type: "quotes",
              data: quotesArray,
              timestamp: Date.now(),
            });
          }
        }
        break;

      case "unsubscribe":
        if (message.tickers && Array.isArray(message.tickers)) {
          for (const ticker of message.tickers) {
            this.unsubscribeTicker(ws, ticker.toUpperCase());
          }
          this.send(ws, {
            type: "unsubscribed",
            tickers: message.tickers.map(t => t.toUpperCase()),
            timestamp: Date.now(),
          });
        }
        break;

      case "get_quote":
        if (message.ticker) {
          const quote = await getQuote(message.ticker);
          if (quote) {
            this.send(ws, {
              type: "quote",
              ticker: message.ticker.toUpperCase(),
              data: quote,
              timestamp: Date.now(),
            });
          } else {
            this.send(ws, {
              type: "error",
              message: `Quote not found for ${message.ticker}`,
              timestamp: Date.now(),
            });
          }
        }
        break;

      case "ping":
        this.send(ws, {
          type: "pong",
          timestamp: Date.now(),
        });
        break;

      default:
        this.send(ws, {
          type: "error",
          message: "Unknown message type",
          timestamp: Date.now(),
        });
    }
  }

  /**
   * Inscrever cliente em um ticker
   */
  private subscribeTicker(ws: WebSocket, ticker: string): void {
    const client = this.clients.get(ws);
    if (!client) return;

    client.subscriptions.add(ticker);

    if (!this.tickerSubscribers.has(ticker)) {
      this.tickerSubscribers.set(ticker, new Set());
    }
    this.tickerSubscribers.get(ticker)!.add(ws);

    console.log(`[WebSocket] Client subscribed to ${ticker}. Total subscribers: ${this.tickerSubscribers.get(ticker)!.size}`);
  }

  /**
   * Desinscrever cliente de um ticker
   */
  private unsubscribeTicker(ws: WebSocket, ticker: string): void {
    const client = this.clients.get(ws);
    if (!client) return;

    client.subscriptions.delete(ticker);

    const subscribers = this.tickerSubscribers.get(ticker);
    if (subscribers) {
      subscribers.delete(ws);
      if (subscribers.size === 0) {
        this.tickerSubscribers.delete(ticker);
      }
    }

    console.log(`[WebSocket] Client unsubscribed from ${ticker}`);
  }

  /**
   * Lidar com desconexão
   */
  private handleDisconnection(ws: WebSocket): void {
    const client = this.clients.get(ws);
    if (client) {
      // Remover de todas as inscrições
      for (const ticker of Array.from(client.subscriptions)) {
        const subscribers = this.tickerSubscribers.get(ticker);
        if (subscribers) {
          subscribers.delete(ws);
          if (subscribers.size === 0) {
            this.tickerSubscribers.delete(ticker);
          }
        }
      }
    }

    this.clients.delete(ws);
    console.log(`[WebSocket] Client disconnected. Total clients: ${this.clients.size}`);
  }

  /**
   * Enviar mensagem para cliente
   */
  private send(ws: WebSocket, response: WSResponse): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(response));
    }
  }

  /**
   * Broadcast para todos os inscritos de um ticker
   */
  private broadcastToTicker(ticker: string, quote: StockQuote): void {
    const subscribers = this.tickerSubscribers.get(ticker);
    if (!subscribers) return;

    const response: WSResponse = {
      type: "quote",
      ticker,
      data: quote,
      timestamp: Date.now(),
    };

    const message = JSON.stringify(response);
    for (const ws of Array.from(subscribers)) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    }
  }

  /**
   * Iniciar loop de atualização
   */
  private startUpdateLoop(): void {
    this.updateInterval = setInterval(async () => {
      await this.updateAllTickers();
    }, this.UPDATE_INTERVAL_MS);
  }

  /**
   * Atualizar todos os tickers com inscritos
   */
  private async updateAllTickers(): Promise<void> {
    const tickers = Array.from(this.tickerSubscribers.keys());
    if (tickers.length === 0) return;

    console.log(`[WebSocket] Updating ${tickers.length} tickers...`);

    try {
      const quotes = await getMultipleQuotes(tickers);
      
      for (const [ticker, quote] of Array.from(quotes.entries())) {
        this.broadcastToTicker(ticker, quote);
      }

      console.log(`[WebSocket] Updated ${quotes.size} quotes`);
    } catch (error) {
      console.error("[WebSocket] Error updating tickers:", error);
    }
  }

  /**
   * Obter estatísticas
   */
  getStats(): { clients: number; tickers: number; subscriptions: number } {
    let totalSubscriptions = 0;
    for (const subscribers of Array.from(this.tickerSubscribers.values())) {
      totalSubscriptions += subscribers.size;
    }

    return {
      clients: this.clients.size,
      tickers: this.tickerSubscribers.size,
      subscriptions: totalSubscriptions,
    };
  }

  /**
   * Fechar servidor
   */
  close(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    if (this.wss) {
      this.wss.close();
    }

    this.clients.clear();
    this.tickerSubscribers.clear();
  }
}

// Singleton
export const realtimeService = new RealtimeDataService();
