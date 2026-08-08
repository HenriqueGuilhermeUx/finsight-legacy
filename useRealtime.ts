import { useState, useEffect, useCallback, useRef } from "react";

export interface RealtimeQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  currency: string;
  exchange: string;
  timestamp: number;
}

interface WSMessage {
  type: string;
  data?: any;
  ticker?: string;
  tickers?: string[];
  message?: string;
  timestamp: number;
}

interface UseRealtimeOptions {
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const {
    autoConnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 10,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [quotes, setQuotes] = useState<Map<string, RealtimeQuote>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscribedTickersRef = useRef<Set<string>>(new Set());
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Construir URL do WebSocket
  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/ws`;
  }, []);

  // Conectar ao WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const url = getWebSocketUrl();
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log("[Realtime] Connected");
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Re-inscrever em tickers anteriores
        if (subscribedTickersRef.current.size > 0) {
          const tickers = Array.from(subscribedTickersRef.current);
          wsRef.current?.send(JSON.stringify({
            type: "subscribe",
            tickers,
          }));
        }

        // Iniciar ping interval
        pingIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "ping" }));
          }
        }, 30000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (err) {
          console.error("[Realtime] Failed to parse message:", err);
        }
      };

      wsRef.current.onclose = () => {
        console.log("[Realtime] Disconnected");
        setIsConnected(false);

        // Limpar ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Tentar reconectar
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            console.log(`[Realtime] Reconnecting... (attempt ${reconnectAttemptsRef.current})`);
            connect();
          }, reconnectInterval);
        } else {
          setError("Failed to connect after multiple attempts");
        }
      };

      wsRef.current.onerror = (event) => {
        console.error("[Realtime] WebSocket error:", event);
        setError("WebSocket connection error");
      };
    } catch (err) {
      console.error("[Realtime] Failed to connect:", err);
      setError("Failed to establish connection");
    }
  }, [getWebSocketUrl, maxReconnectAttempts, reconnectInterval]);

  // Processar mensagens recebidas
  const handleMessage = useCallback((message: WSMessage) => {
    switch (message.type) {
      case "quote":
        if (message.data && message.ticker) {
          setQuotes((prev) => {
            const newMap = new Map(prev);
            newMap.set(message.ticker!, message.data);
            return newMap;
          });
          setLastUpdate(message.timestamp);
        }
        break;

      case "quotes":
        if (Array.isArray(message.data)) {
          setQuotes((prev) => {
            const newMap = new Map(prev);
            for (const quote of message.data) {
              newMap.set(quote.symbol, quote);
            }
            return newMap;
          });
          setLastUpdate(message.timestamp);
        }
        break;

      case "subscribed":
        console.log("[Realtime] Subscribed to:", message.tickers);
        break;

      case "unsubscribed":
        console.log("[Realtime] Unsubscribed from:", message.tickers);
        break;

      case "pong":
        // Heartbeat received
        break;

      case "error":
        console.error("[Realtime] Server error:", message.message);
        setError(message.message || "Unknown error");
        break;

      case "connection":
        console.log("[Realtime]", message.message);
        break;
    }
  }, []);

  // Desconectar
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // Inscrever em tickers
  const subscribe = useCallback((tickers: string[]) => {
    const upperTickers = tickers.map((t) => t.toUpperCase());
    
    for (const ticker of upperTickers) {
      subscribedTickersRef.current.add(ticker);
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "subscribe",
        tickers: upperTickers,
      }));
    }
  }, []);

  // Desinscrever de tickers
  const unsubscribe = useCallback((tickers: string[]) => {
    const upperTickers = tickers.map((t) => t.toUpperCase());
    
    for (const ticker of upperTickers) {
      subscribedTickersRef.current.delete(ticker);
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "unsubscribe",
        tickers: upperTickers,
      }));
    }

    // Remover do estado
    setQuotes((prev) => {
      const newMap = new Map(prev);
      for (const ticker of upperTickers) {
        newMap.delete(ticker);
      }
      return newMap;
    });
  }, []);

  // Buscar cotação única
  const getQuote = useCallback((ticker: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "get_quote",
        ticker: ticker.toUpperCase(),
      }));
    }
  }, []);

  // Auto-connect
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Obter cotação por ticker
  const getQuoteByTicker = useCallback((ticker: string): RealtimeQuote | undefined => {
    return quotes.get(ticker.toUpperCase());
  }, [quotes]);

  // Obter todas as cotações como array
  const getAllQuotes = useCallback((): RealtimeQuote[] => {
    return Array.from(quotes.values());
  }, [quotes]);

  return {
    isConnected,
    quotes,
    lastUpdate,
    error,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    getQuote,
    getQuoteByTicker,
    getAllQuotes,
  };
}
