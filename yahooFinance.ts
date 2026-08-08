/**
 * Yahoo Finance API Integration Service
 * Provides real-time and historical market data
 */

// Yahoo Finance API Integration

// Cache configuration
const CACHE_TTL = 60 * 1000; // 1 minute for real-time data
const HISTORICAL_CACHE_TTL = 5 * 60 * 1000; // 5 minutes for historical data

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

function getCached<T>(key: string, ttl: number): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttl) {
    return entry.data as T;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Yahoo Finance API base URL (using RapidAPI proxy)
const YAHOO_API_BASE = "https://query1.finance.yahoo.com/v8/finance";
const YAHOO_CHART_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

// Convert Brazilian ticker to Yahoo format
function formatTicker(ticker: string): string {
  // Brazilian stocks need .SA suffix
  if (/^[A-Z]{4}[0-9]{1,2}$/.test(ticker)) {
    return `${ticker}.SA`;
  }
  // US stocks don't need suffix
  return ticker;
}

// Quote data interface
export interface QuoteData {
  ticker: string;
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
  peRatio: number | null;
  pbRatio: number | null;
  dividendYield: number | null;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  averageVolume: number;
  currency: string;
  exchange: string;
  sector: string | null;
  industry: string | null;
}

// Historical data interface
export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

// Fetch quote data for a single ticker
export async function getQuote(ticker: string): Promise<QuoteData | null> {
  const cacheKey = `quote:${ticker}`;
  const cached = getCached<QuoteData>(cacheKey, CACHE_TTL);
  if (cached) return cached;

  try {
    const formattedTicker = formatTicker(ticker);
    const url = `${YAHOO_API_BASE}/quote?symbols=${formattedTicker}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.error(`Yahoo Finance API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const result = data?.quoteResponse?.result?.[0];
    
    if (!result) {
      return null;
    }

    const quote: QuoteData = {
      ticker: ticker,
      name: result.shortName || result.longName || ticker,
      price: result.regularMarketPrice || 0,
      change: result.regularMarketChange || 0,
      changePercent: result.regularMarketChangePercent || 0,
      open: result.regularMarketOpen || 0,
      high: result.regularMarketDayHigh || 0,
      low: result.regularMarketDayLow || 0,
      previousClose: result.regularMarketPreviousClose || 0,
      volume: result.regularMarketVolume || 0,
      marketCap: result.marketCap || 0,
      peRatio: result.trailingPE || null,
      pbRatio: result.priceToBook || null,
      dividendYield: result.dividendYield ? result.dividendYield * 100 : null,
      fiftyTwoWeekHigh: result.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: result.fiftyTwoWeekLow || 0,
      averageVolume: result.averageDailyVolume3Month || 0,
      currency: result.currency || "BRL",
      exchange: result.exchange || "",
      sector: result.sector || null,
      industry: result.industry || null,
    };

    setCache(cacheKey, quote);
    return quote;
  } catch (error) {
    console.error(`Error fetching quote for ${ticker}:`, error);
    return null;
  }
}

// Fetch quotes for multiple tickers
export async function getQuotes(tickers: string[]): Promise<QuoteData[]> {
  const results = await Promise.all(tickers.map(ticker => getQuote(ticker)));
  return results.filter((q): q is QuoteData => q !== null);
}

// Fetch historical data
export async function getHistoricalData(
  ticker: string,
  period: "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y" | "max" = "1y",
  interval: "1m" | "5m" | "15m" | "1h" | "1d" | "1wk" | "1mo" = "1d"
): Promise<HistoricalDataPoint[]> {
  const cacheKey = `historical:${ticker}:${period}:${interval}`;
  const cached = getCached<HistoricalDataPoint[]>(cacheKey, HISTORICAL_CACHE_TTL);
  if (cached) return cached;

  try {
    const formattedTicker = formatTicker(ticker);
    const url = `${YAHOO_CHART_BASE}/${formattedTicker}?range=${period}&interval=${interval}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.error(`Yahoo Finance Chart API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    
    if (!result || !result.timestamp) {
      return [];
    }

    const timestamps = result.timestamp;
    const quotes = result.indicators?.quote?.[0];
    const adjClose = result.indicators?.adjclose?.[0]?.adjclose;

    if (!quotes) {
      return [];
    }

    const historicalData: HistoricalDataPoint[] = timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split("T")[0],
      open: quotes.open?.[i] || 0,
      high: quotes.high?.[i] || 0,
      low: quotes.low?.[i] || 0,
      close: quotes.close?.[i] || 0,
      volume: quotes.volume?.[i] || 0,
      adjClose: adjClose?.[i] || quotes.close?.[i] || 0,
    })).filter((d: HistoricalDataPoint) => d.close > 0);

    setCache(cacheKey, historicalData);
    return historicalData;
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker}:`, error);
    return [];
  }
}

// Search for tickers
export async function searchTickers(query: string): Promise<{ ticker: string; name: string; type: string; exchange: string }[]> {
  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const quotes = data?.quotes || [];

    return quotes.map((q: any) => ({
      ticker: q.symbol?.replace(".SA", "") || "",
      name: q.shortname || q.longname || "",
      type: q.quoteType || "",
      exchange: q.exchange || "",
    }));
  } catch (error) {
    console.error("Error searching tickers:", error);
    return [];
  }
}

// Calculate technical indicators from historical data
export function calculateIndicators(data: HistoricalDataPoint[]) {
  if (data.length < 26) {
    return null;
  }

  const closes = data.map(d => d.close);
  
  // RSI (14 periods)
  const rsi = calculateRSI(closes, 14);
  
  // MACD (12, 26, 9)
  const macd = calculateMACD(closes, 12, 26, 9);
  
  // SMA (20, 50, 200)
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const sma200 = calculateSMA(closes, 200);
  
  // Bollinger Bands (20, 2)
  const bollinger = calculateBollingerBands(closes, 20, 2);

  return {
    rsi: rsi[rsi.length - 1],
    macd: {
      macd: macd.macd[macd.macd.length - 1],
      signal: macd.signal[macd.signal.length - 1],
      histogram: macd.histogram[macd.histogram.length - 1],
    },
    sma20: sma20[sma20.length - 1],
    sma50: sma50[sma50.length - 1],
    sma200: sma200.length > 0 ? sma200[sma200.length - 1] : null,
    bollinger: {
      upper: bollinger.upper[bollinger.upper.length - 1],
      middle: bollinger.middle[bollinger.middle.length - 1],
      lower: bollinger.lower[bollinger.lower.length - 1],
    },
  };
}

// RSI calculation
function calculateRSI(prices: number[], period: number): number[] {
  const rsi: number[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  rsi.push(100 - (100 / (1 + avgGain / avgLoss)));

  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    const gain = change >= 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rsi.push(100 - (100 / (1 + avgGain / avgLoss)));
  }

  return rsi;
}

// MACD calculation
function calculateMACD(prices: number[], fast: number, slow: number, signal: number) {
  const emaFast = calculateEMA(prices, fast);
  const emaSlow = calculateEMA(prices, slow);
  
  const macdLine = emaFast.map((v, i) => v - emaSlow[i]);
  const signalLine = calculateEMA(macdLine, signal);
  const histogram = macdLine.map((v, i) => v - signalLine[i]);

  return { macd: macdLine, signal: signalLine, histogram };
}

// EMA calculation
function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  ema.push(sum / period);

  for (let i = period; i < prices.length; i++) {
    ema.push((prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]);
  }

  return ema;
}

// SMA calculation
function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = [];
  
  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j];
    }
    sma.push(sum / period);
  }

  return sma;
}

// Bollinger Bands calculation
function calculateBollingerBands(prices: number[], period: number, stdDev: number) {
  const sma = calculateSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += Math.pow(prices[i - j] - sma[i - period + 1], 2);
    }
    const std = Math.sqrt(sum / period);
    upper.push(sma[i - period + 1] + stdDev * std);
    lower.push(sma[i - period + 1] - stdDev * std);
  }

  return { upper, middle: sma, lower };
}

// Get fundamental data
export async function getFundamentals(ticker: string) {
  const cacheKey = `fundamentals:${ticker}`;
  const cached = getCached<any>(cacheKey, HISTORICAL_CACHE_TTL);
  if (cached) return cached;

  try {
    const formattedTicker = formatTicker(ticker);
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${formattedTicker}?modules=financialData,defaultKeyStatistics,summaryDetail,earnings`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const result = data?.quoteSummary?.result?.[0];
    
    if (!result) {
      return null;
    }

    const financialData = result.financialData || {};
    const keyStats = result.defaultKeyStatistics || {};
    const summaryDetail = result.summaryDetail || {};

    const fundamentals = {
      // Valuation
      peRatio: summaryDetail.trailingPE?.raw || null,
      forwardPE: summaryDetail.forwardPE?.raw || null,
      pbRatio: keyStats.priceToBook?.raw || null,
      psRatio: summaryDetail.priceToSalesTrailing12Months?.raw || null,
      evToEbitda: keyStats.enterpriseToEbitda?.raw || null,
      
      // Profitability
      profitMargin: financialData.profitMargins?.raw || null,
      operatingMargin: financialData.operatingMargins?.raw || null,
      grossMargin: financialData.grossMargins?.raw || null,
      roe: financialData.returnOnEquity?.raw || null,
      roa: financialData.returnOnAssets?.raw || null,
      
      // Growth
      revenueGrowth: financialData.revenueGrowth?.raw || null,
      earningsGrowth: financialData.earningsGrowth?.raw || null,
      
      // Financial Health
      currentRatio: financialData.currentRatio?.raw || null,
      debtToEquity: financialData.debtToEquity?.raw || null,
      
      // Dividends
      dividendYield: summaryDetail.dividendYield?.raw || null,
      payoutRatio: summaryDetail.payoutRatio?.raw || null,
      
      // Other
      beta: summaryDetail.beta?.raw || null,
      targetPrice: financialData.targetMeanPrice?.raw || null,
      recommendation: financialData.recommendationKey || null,
    };

    setCache(cacheKey, fundamentals);
    return fundamentals;
  } catch (error) {
    console.error(`Error fetching fundamentals for ${ticker}:`, error);
    return null;
  }
}
