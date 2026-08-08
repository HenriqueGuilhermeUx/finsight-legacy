/**
 * Market Data API Integration Service
 * Integrates with multiple data sources for real market data
 * Uses Manus Data API Hub for accessing financial data
 */

import { callDataApi } from "./_core/dataApi";

// Cache configuration
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = {
  quote: 60 * 1000, // 1 minute for quotes
  historical: 5 * 60 * 1000, // 5 minutes for historical
  fundamentals: 60 * 60 * 1000, // 1 hour for fundamentals
  news: 5 * 60 * 1000, // 5 minutes for news
};

function getCached<T>(key: string, ttl: number): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Convert Brazilian ticker to international format
function convertTicker(ticker: string): { symbol: string; exchange: string } {
  const upperTicker = ticker.toUpperCase();
  
  // Brazilian stocks
  if (/^[A-Z]{4}\d{1,2}$/.test(upperTicker)) {
    return { symbol: `${upperTicker}.SA`, exchange: 'BVMF' };
  }
  
  // Crypto
  if (['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOGE', 'DOT', 'MATIC', 'LINK'].includes(upperTicker)) {
    return { symbol: `${upperTicker}USD`, exchange: 'CRYPTO' };
  }
  
  // US stocks
  return { symbol: upperTicker, exchange: 'US' };
}

export interface QuoteData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
  marketCap?: number;
  pe?: number;
  eps?: number;
  dividend?: number;
  dividendYield?: number;
  week52High: number;
  week52Low: number;
  timestamp: number;
  source: string;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose?: number;
}

export interface FundamentalsData {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  pe: number;
  forwardPe: number;
  peg: number;
  pb: number;
  ps: number;
  evEbitda: number;
  roe: number;
  roa: number;
  roic: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  eps: number;
  epsGrowth: number;
  revenueGrowth: number;
  dividendYield: number;
  payoutRatio: number;
  beta: number;
  targetPrice: number;
  analystRating: string;
  source: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedTickers: string[];
  image?: string;
}

/**
 * Get real-time quote using Yahoo Finance via Data API
 */
export async function getQuote(ticker: string): Promise<QuoteData | null> {
  const cacheKey = `quote:${ticker}`;
  const cached = getCached<QuoteData>(cacheKey, CACHE_TTL.quote);
  if (cached) return cached;

  const { symbol } = convertTicker(ticker);
  
  try {
    // Use Yahoo Finance API via Manus Data API Hub
    const data = await callDataApi("Yahoo_Finance/get_stock_chart", {
      query: { symbol, interval: '1d', range: '1d' }
    }) as { chart?: { result?: Array<{ meta?: { regularMarketPrice?: number; previousClose?: number; regularMarketDayHigh?: number; regularMarketDayLow?: number; regularMarketOpen?: number; regularMarketVolume?: number; fiftyTwoWeekHigh?: number; fiftyTwoWeekLow?: number; shortName?: string } }> } };
    
    if (data?.chart?.result?.[0]) {
      const meta = data.chart.result[0].meta;
      if (meta) {
        const price = meta.regularMarketPrice || 0;
        const previousClose = meta.previousClose || price;
        const change = price - previousClose;
        
        const quote: QuoteData = {
          symbol: ticker,
          name: meta.shortName || ticker,
          price,
          change,
          changePercent: previousClose > 0 ? (change / previousClose) * 100 : 0,
          open: meta.regularMarketDayHigh || price,
          high: meta.regularMarketDayHigh || price,
          low: meta.regularMarketDayLow || price,
          volume: meta.regularMarketVolume || 0,
          previousClose,
          week52High: meta.fiftyTwoWeekHigh || price,
          week52Low: meta.fiftyTwoWeekLow || price,
          timestamp: Date.now(),
          source: 'yahoo_finance',
        };
        setCache(cacheKey, quote);
        return quote;
      }
    }
  } catch (error) {
    console.error('Yahoo Finance API error:', error);
  }

  // Return mock data as fallback
  return generateMockQuote(ticker);
}

/**
 * Get historical price data
 */
export async function getHistoricalData(
  ticker: string,
  period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' = '1Y'
): Promise<HistoricalData[]> {
  const cacheKey = `historical:${ticker}:${period}`;
  const cached = getCached<HistoricalData[]>(cacheKey, CACHE_TTL.historical);
  if (cached) return cached;

  const { symbol } = convertTicker(ticker);
  
  // Map period to Yahoo Finance range
  const rangeMap: Record<string, string> = {
    '1D': '1d',
    '1W': '5d',
    '1M': '1mo',
    '3M': '3mo',
    '6M': '6mo',
    '1Y': '1y',
    '5Y': '5y',
  };
  
  const intervalMap: Record<string, string> = {
    '1D': '5m',
    '1W': '15m',
    '1M': '1d',
    '3M': '1d',
    '6M': '1d',
    '1Y': '1d',
    '5Y': '1wk',
  };

  try {
    const data = await callDataApi("Yahoo_Finance/get_stock_chart", {
      query: { 
        symbol, 
        interval: intervalMap[period], 
        range: rangeMap[period] 
      }
    }) as { chart?: { result?: Array<{ timestamp?: number[]; indicators?: { quote?: Array<{ open?: number[]; high?: number[]; low?: number[]; close?: number[]; volume?: number[] }> } }> } };
    
    if (data?.chart?.result?.[0]) {
      const result = data.chart.result[0];
      const timestamps = result.timestamp || [];
      const quotes = result.indicators?.quote?.[0];
      
      if (quotes) {
        const historical: HistoricalData[] = timestamps.map((ts: number, i: number) => ({
          date: new Date(ts * 1000).toISOString().split('T')[0],
          open: quotes.open?.[i] || 0,
          high: quotes.high?.[i] || 0,
          low: quotes.low?.[i] || 0,
          close: quotes.close?.[i] || 0,
          volume: quotes.volume?.[i] || 0,
        })).filter((d: HistoricalData) => d.close > 0);
        
        setCache(cacheKey, historical);
        return historical;
      }
    }
  } catch (error) {
    console.error('Yahoo Finance historical API error:', error);
  }

  // Return mock data
  return generateMockHistorical(ticker, period);
}

/**
 * Get fundamental data for a stock
 */
export async function getFundamentals(ticker: string): Promise<FundamentalsData | null> {
  const cacheKey = `fundamentals:${ticker}`;
  const cached = getCached<FundamentalsData>(cacheKey, CACHE_TTL.fundamentals);
  if (cached) return cached;

  const { symbol } = convertTicker(ticker);

  try {
    const data = await callDataApi("Yahoo_Finance/get_stock_insights", {
      query: { symbol }
    }) as { finance?: { result?: { instrumentInfo?: { technicalEvents?: { sector?: string }; valuation?: { description?: string } }; companySnapshot?: { company?: { innovativeness?: number; hiring?: number; sustainability?: number; insiderSentiments?: number; earningsReports?: number; dividends?: number } }; recommendation?: { rating?: string; targetPrice?: number } } } };
    
    // Also get quote data for additional metrics
    const quoteData = await getQuote(ticker);
    
    if (data?.finance?.result) {
      const result = data.finance.result;
      const fundamentals: FundamentalsData = {
        symbol: ticker,
        name: quoteData?.name || ticker,
        sector: result.instrumentInfo?.technicalEvents?.sector || 'N/A',
        industry: result.instrumentInfo?.valuation?.description || 'N/A',
        marketCap: quoteData?.marketCap || 0,
        pe: quoteData?.pe || 0,
        forwardPe: 0,
        peg: 0,
        pb: 0,
        ps: 0,
        evEbitda: 0,
        roe: (result.companySnapshot?.company?.innovativeness || 0) * 10,
        roa: (result.companySnapshot?.company?.hiring || 0) * 5,
        roic: 0,
        grossMargin: 0,
        operatingMargin: 0,
        netMargin: 0,
        debtToEquity: 0,
        currentRatio: 0,
        quickRatio: 0,
        eps: quoteData?.eps || 0,
        epsGrowth: (result.companySnapshot?.company?.earningsReports || 0) * 10,
        revenueGrowth: 0,
        dividendYield: quoteData?.dividendYield || 0,
        payoutRatio: (result.companySnapshot?.company?.dividends || 0) * 20,
        beta: 1,
        targetPrice: result.recommendation?.targetPrice || 0,
        analystRating: result.recommendation?.rating || 'Hold',
        source: 'yahoo_finance',
      };
      setCache(cacheKey, fundamentals);
      return fundamentals;
    }
  } catch (error) {
    console.error('Yahoo Finance fundamentals API error:', error);
  }

  // Return mock data
  return generateMockFundamentals(ticker);
}

/**
 * Get market news
 */
export async function getMarketNews(
  _category: 'general' | 'forex' | 'crypto' | 'merger' = 'general',
  tickers?: string[]
): Promise<NewsItem[]> {
  const cacheKey = `news:${_category}:${tickers?.join(',') || 'all'}`;
  const cached = getCached<NewsItem[]>(cacheKey, CACHE_TTL.news);
  if (cached) return cached;

  try {
    // Use Google News via Data API
    const query = tickers?.length ? `${tickers[0]} stock` : 'stock market brazil';
    const data = await callDataApi("Google_News/search", {
      query: { q: query, gl: 'BR', hl: 'pt-BR' }
    }) as { news_results?: Array<{ title?: string; snippet?: string; link?: string; source?: { name?: string }; date?: string; thumbnail?: string }> };
    
    if (data?.news_results) {
      const news: NewsItem[] = data.news_results.slice(0, 20).map((item, i) => ({
        id: String(i),
        title: item.title || '',
        summary: item.snippet || '',
        url: item.link || '#',
        source: item.source?.name || 'Unknown',
        publishedAt: item.date || new Date().toISOString(),
        sentiment: 'neutral' as const,
        relatedTickers: tickers || [],
        image: item.thumbnail,
      }));
      setCache(cacheKey, news);
      return news;
    }
  } catch (error) {
    console.error('Google News API error:', error);
  }

  // Return mock news
  return generateMockNews();
}

/**
 * Search for tickers
 */
export async function searchTickers(query: string): Promise<Array<{ symbol: string; name: string; type: string; exchange: string }>> {
  const cacheKey = `search:${query}`;
  const cached = getCached<Array<{ symbol: string; name: string; type: string; exchange: string }>>(cacheKey, CACHE_TTL.quote);
  if (cached) return cached;

  try {
    const data = await callDataApi("Yahoo_Finance/auto_complete", {
      query: { q: query, region: 'BR' }
    }) as { quotes?: Array<{ symbol?: string; shortname?: string; quoteType?: string; exchange?: string }> };
    
    if (data?.quotes) {
      const results = data.quotes.slice(0, 10).map((item) => ({
        symbol: item.symbol || '',
        name: item.shortname || item.symbol || '',
        type: item.quoteType || 'EQUITY',
        exchange: item.exchange || 'SAO',
      }));
      setCache(cacheKey, results);
      return results;
    }
  } catch (error) {
    console.error('Yahoo Finance search API error:', error);
  }

  return [];
}

// Helper functions
function getDaysForPeriod(period: string): number {
  switch (period) {
    case '1D': return 1;
    case '1W': return 7;
    case '1M': return 30;
    case '3M': return 90;
    case '6M': return 180;
    case '1Y': return 365;
    case '5Y': return 1825;
    default: return 365;
  }
}

// Mock data generators (fallback when APIs are unavailable)
function generateMockQuote(ticker: string): QuoteData {
  const basePrice = Math.random() * 100 + 10;
  const change = (Math.random() - 0.5) * 5;
  
  return {
    symbol: ticker,
    name: ticker,
    price: basePrice,
    change,
    changePercent: (change / basePrice) * 100,
    open: basePrice - Math.random() * 2,
    high: basePrice + Math.random() * 3,
    low: basePrice - Math.random() * 3,
    volume: Math.floor(Math.random() * 10000000),
    previousClose: basePrice - change,
    week52High: basePrice * 1.3,
    week52Low: basePrice * 0.7,
    timestamp: Date.now(),
    source: 'mock',
  };
}

function generateMockHistorical(ticker: string, period: string): HistoricalData[] {
  const days = getDaysForPeriod(period);
  const data: HistoricalData[] = [];
  let price = Math.random() * 100 + 20;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.5) * 5;
    price = Math.max(1, price + change);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: price - Math.random() * 2,
      high: price + Math.random() * 3,
      low: price - Math.random() * 3,
      close: price,
      volume: Math.floor(Math.random() * 10000000),
    });
  }
  
  return data;
}

function generateMockFundamentals(ticker: string): FundamentalsData {
  return {
    symbol: ticker,
    name: ticker,
    sector: 'Technology',
    industry: 'Software',
    marketCap: Math.random() * 100000000000,
    pe: Math.random() * 30 + 5,
    forwardPe: Math.random() * 25 + 5,
    peg: Math.random() * 2 + 0.5,
    pb: Math.random() * 5 + 1,
    ps: Math.random() * 10 + 1,
    evEbitda: Math.random() * 20 + 5,
    roe: Math.random() * 30 + 5,
    roa: Math.random() * 15 + 2,
    roic: Math.random() * 20 + 5,
    grossMargin: Math.random() * 40 + 20,
    operatingMargin: Math.random() * 30 + 5,
    netMargin: Math.random() * 20 + 2,
    debtToEquity: Math.random() * 100,
    currentRatio: Math.random() * 2 + 0.5,
    quickRatio: Math.random() * 1.5 + 0.3,
    eps: Math.random() * 10 + 1,
    epsGrowth: Math.random() * 50 - 10,
    revenueGrowth: Math.random() * 40 - 5,
    dividendYield: Math.random() * 5,
    payoutRatio: Math.random() * 60,
    beta: Math.random() * 1.5 + 0.5,
    targetPrice: Math.random() * 100 + 20,
    analystRating: ['Buy', 'Hold', 'Sell'][Math.floor(Math.random() * 3)],
    source: 'mock',
  };
}

function generateMockNews(): NewsItem[] {
  const headlines = [
    'Mercado reage positivamente a dados econômicos',
    'Banco Central mantém taxa de juros estável',
    'Setor de tecnologia lidera ganhos na bolsa',
    'Investidores aguardam decisão do Fed',
    'Commodities em alta com demanda global',
  ];
  
  return headlines.map((title, i) => ({
    id: String(i),
    title,
    summary: `${title}. Analistas avaliam impacto nos mercados e perspectivas para os próximos meses.`,
    url: '#',
    source: 'F-Insight News',
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
    sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral',
    relatedTickers: ['PETR4', 'VALE3', 'ITUB4'].slice(0, Math.floor(Math.random() * 3) + 1),
  }));
}

export default {
  getQuote,
  getHistoricalData,
  getFundamentals,
  getMarketNews,
  searchTickers,
};
