import { useEffect, useRef, memo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  height?: number;
  autosize?: boolean;
  showToolbar?: boolean;
  showDrawingTools?: boolean;
  studies?: string[];
}

function TradingViewChartComponent({
  symbol,
  interval = "D",
  height = 500,
  autosize = true,
  showToolbar = true,
  showDrawingTools = true,
  studies = [],
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const { theme } = useTheme();

  // Convert symbol to TradingView format
  const getTradingViewSymbol = (ticker: string): string => {
    // Brazilian stocks
    if (ticker.endsWith(".SA") || /^[A-Z]{4}[0-9]+$/.test(ticker)) {
      const cleanTicker = ticker.replace(".SA", "");
      return `BMFBOVESPA:${cleanTicker}`;
    }
    // Crypto
    if (ticker.includes("-USD") || ticker.includes("USDT")) {
      const cleanTicker = ticker.replace("-USD", "").replace("USDT", "");
      return `BINANCE:${cleanTicker}USDT`;
    }
    // US stocks (default)
    return `NASDAQ:${ticker}`;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Wait for TradingView library to load
    const initWidget = () => {
      if (!window.TradingView) {
        setTimeout(initWidget, 100);
        return;
      }

      // Clear previous widget
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      const tvSymbol = getTradingViewSymbol(symbol);

      widgetRef.current = new window.TradingView.widget({
        container_id: containerRef.current?.id,
        symbol: tvSymbol,
        interval: interval,
        timezone: "America/Sao_Paulo",
        theme: theme === "dark" ? "dark" : "light",
        style: "1", // Candlestick
        locale: "br",
        toolbar_bg: theme === "dark" ? "#1e293b" : "#f8fafc",
        enable_publishing: false,
        hide_top_toolbar: !showToolbar,
        hide_legend: false,
        save_image: true,
        allow_symbol_change: true,
        details: true,
        hotlist: false,
        calendar: false,
        show_popup_button: true,
        popup_width: "1000",
        popup_height: "650",
        withdateranges: true,
        hide_side_toolbar: !showDrawingTools,
        studies: studies.length > 0 ? studies : [
          "MASimple@tv-basicstudies",
          "RSI@tv-basicstudies",
          "MACD@tv-basicstudies",
        ],
        autosize: autosize,
        height: autosize ? "100%" : height,
        width: "100%",
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#22c55e",
          "mainSeriesProperties.candleStyle.downColor": "#ef4444",
          "mainSeriesProperties.candleStyle.borderUpColor": "#22c55e",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
          "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
        },
      });
    };

    initWidget();

    return () => {
      if (widgetRef.current) {
        widgetRef.current = null;
      }
    };
  }, [symbol, interval, theme, showToolbar, showDrawingTools, autosize, height]);

  return (
    <div
      id={`tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, "_")}`}
      ref={containerRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: autosize ? "100%" : height }}
    />
  );
}

export const TradingViewChart = memo(TradingViewChartComponent);

// Advanced Chart with multiple features
interface AdvancedChartProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
}

export function AdvancedTradingViewChart({ symbol, onSymbolChange }: AdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // Convert symbol to TradingView format
    const getTVSymbol = (ticker: string): string => {
      if (ticker.endsWith(".SA") || /^[A-Z]{4}[0-9]+$/.test(ticker)) {
        return `BMFBOVESPA:${ticker.replace(".SA", "")}`;
      }
      if (ticker.includes("-USD") || ticker.includes("USDT")) {
        return `BINANCE:${ticker.replace("-USD", "").replace("USDT", "")}USDT`;
      }
      return ticker;
    };

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: getTVSymbol(symbol),
      interval: "D",
      timezone: "America/Sao_Paulo",
      theme: theme === "dark" ? "dark" : "light",
      style: "1",
      locale: "br",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      studies: [
        "STD;Bollinger_Bands",
        "STD;RSI",
        "STD;MACD",
      ],
    });

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme]);

  return (
    <div className="tradingview-widget-container h-full" ref={containerRef}>
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  );
}

// Mini Chart Widget
interface MiniChartProps {
  symbol: string;
  width?: number | string;
  height?: number;
}

export function TradingViewMiniChart({ symbol, width = "100%", height = 220 }: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    const getTVSymbol = (ticker: string): string => {
      if (ticker.endsWith(".SA") || /^[A-Z]{4}[0-9]+$/.test(ticker)) {
        return `BMFBOVESPA:${ticker.replace(".SA", "")}`;
      }
      if (ticker.includes("-USD") || ticker.includes("USDT")) {
        return `BINANCE:${ticker.replace("-USD", "").replace("USDT", "")}USDT`;
      }
      return ticker;
    };

    script.innerHTML = JSON.stringify({
      symbol: getTVSymbol(symbol),
      width: width,
      height: height,
      locale: "br",
      dateRange: "12M",
      colorTheme: theme === "dark" ? "dark" : "light",
      isTransparent: true,
      autosize: false,
      largeChartUrl: "",
    });

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme, width, height]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

// Ticker Tape Widget
export function TradingViewTickerTape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "BMFBOVESPA:PETR4", title: "PETR4" },
        { proName: "BMFBOVESPA:VALE3", title: "VALE3" },
        { proName: "BMFBOVESPA:ITUB4", title: "ITUB4" },
        { proName: "BMFBOVESPA:BBDC4", title: "BBDC4" },
        { proName: "BMFBOVESPA:ABEV3", title: "ABEV3" },
        { proName: "NASDAQ:AAPL", title: "AAPL" },
        { proName: "NASDAQ:MSFT", title: "MSFT" },
        { proName: "NASDAQ:GOOGL", title: "GOOGL" },
        { proName: "BINANCE:BTCUSDT", title: "BTC" },
        { proName: "BINANCE:ETHUSDT", title: "ETH" },
      ],
      showSymbolLogo: true,
      colorTheme: theme === "dark" ? "dark" : "light",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "br",
    });

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [theme]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default TradingViewChart;
