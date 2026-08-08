/**
 * F-Insight Free Data APIs Service
 * 
 * Integra múltiplas APIs gratuitas com fallback automático:
 * - Finnhub Free: 60 req/min, US stocks
 * - Yahoo Finance: Ilimitado (não oficial), global
 * - Alpha Vantage Free: 25 req/dia, global
 */

import { callDataApi } from "./_core/dataApi";

// Cache para otimizar requisições
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = {
  quote: 30 * 1000,        // 30 segundos para cotações
  historical: 5 * 60 * 1000, // 5 minutos para histórico
  fundamentals: 60 * 60 * 1000, // 1 hora para fundamentalistas
  news: 5 * 60 * 1000,     // 5 minutos para notícias
};

// Rate limiting
const rateLimits = {
  finnhub: { requests: 0, resetTime: Date.now(), limit: 60, window: 60000 },
  alphaVantage: { requests: 0, resetTime: Date.now(), limit: 25, window: 86400000 },
  yahoo: { requests: 0, resetTime: Date.now(), limit: 2000, window: 3600000 },
};

function checkRateLimit(api: keyof typeof rateLimits): boolean {
  const limit = rateLimits[api];
  const now = Date.now();
  
  if (now > limit.resetTime + limit.window) {
    limit.requests = 0;
    limit.resetTime = now;
  }
  
  if (limit.requests >= limit.limit) {
    return false;
  }
  
  limit.requests++;
  return true;
}

function getCached<T>(key: string, ttl: number): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
  
  // Limpar cache antigo (máximo 1000 entradas)
  if (cache.size > 1000) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
}

// Converter ticker para formato de cada API
function formatTicker(ticker: string, api: 'finnhub' | 'yahoo' | 'alphaVantage'): string {
  const upperTicker = ticker.toUpperCase();
  
  // Ações brasileiras
  if (upperTicker.match(/^\d+$/) || upperTicker.endsWith('.SA')) {
    if (api === 'yahoo') return upperTicker.endsWith('.SA') ? upperTicker : `${upperTicker}.SA`;
    if (api === 'finnhub') return upperTicker.replace('.SA', '');
    if (api === 'alphaVantage') return upperTicker.replace('.SA', '.SAO');
  }
  
  // Criptomoedas
  if (['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOGE', 'DOT', 'MATIC'].includes(upperTicker)) {
    if (api === 'yahoo') return `${upperTicker}-USD`;
    if (api === 'finnhub') return `BINANCE:${upperTicker}USDT`;
    if (api === 'alphaVantage') return upperTicker;
  }
  
  return upperTicker;
}

// ============================================
// FINNHUB API (60 req/min gratuito)
// ============================================

interface FinnhubQuoteResponse {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // high
  l: number; // low
  o: number; // open
  pc: number; // previous close
  t: number; // timestamp
}

interface FinnhubCandleResponse {
  s: string;
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  t: number[];
  v: number[];
}

interface FinnhubProfileResponse {
  name: string;
  country: string;
  currency: string;
  exchange: string;
  finnhubIndustry: string;
  logo: string;
  marketCapitalization: number;
  shareOutstanding: number;
  weburl: string;
}

interface FinnhubNewsItem {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  related: string;
  category: string;
}

async function finnhubQuote(ticker: string): Promise<QuoteData | null> {
  if (!checkRateLimit('finnhub')) {
    return null;
  }
  
  try {
    const response = await callDataApi('Finnhub/quote', {
      query: { symbol: formatTicker(ticker, 'finnhub') },
    }) as FinnhubQuoteResponse | null;
    
    if (response && response.c) {
      return {
        symbol: ticker,
        price: response.c,
        change: response.d,
        changePercent: response.dp,
        high: response.h,
        low: response.l,
        open: response.o,
        previousClose: response.pc,
        timestamp: response.t * 1000,
        source: 'finnhub',
      };
    }
    return null;
  } catch (error) {
    console.error('Finnhub quote error:', error);
    return null;
  }
}

async function finnhubCandles(ticker: string, from: number, to: number, resolution: string = 'D'): Promise<HistoricalData[] | null> {
  if (!checkRateLimit('finnhub')) {
    return null;
  }
  
  try {
    const response = await callDataApi('Finnhub/stock_candles', {
      query: {
        symbol: formatTicker(ticker, 'finnhub'),
        resolution,
        from: Math.floor(from / 1000),
        to: Math.floor(to / 1000),
      },
    }) as FinnhubCandleResponse | null;
    
    if (response && response.s === 'ok' && response.c) {
      return response.t.map((time: number, i: number) => ({
        date: new Date(time * 1000).toISOString().split('T')[0],
        open: response.o[i],
        high: response.h[i],
        low: response.l[i],
        close: response.c[i],
        volume: response.v[i],
      }));
    }
    return null;
  } catch (error) {
    console.error('Finnhub candles error:', error);
    return null;
  }
}

async function finnhubCompanyProfile(ticker: string): Promise<CompanyProfile | null> {
  if (!checkRateLimit('finnhub')) {
    return null;
  }
  
  try {
    const response = await callDataApi('Finnhub/company_profile2', {
      query: { symbol: formatTicker(ticker, 'finnhub') },
    }) as FinnhubProfileResponse | null;
    
    if (response && response.name) {
      return {
        symbol: ticker,
        name: response.name,
        country: response.country,
        currency: response.currency,
        exchange: response.exchange,
        industry: response.finnhubIndustry,
        logo: response.logo,
        marketCap: response.marketCapitalization * 1000000,
        shareOutstanding: response.shareOutstanding,
        weburl: response.weburl,
        source: 'finnhub',
      };
    }
    return null;
  } catch (error) {
    console.error('Finnhub profile error:', error);
    return null;
  }
}

async function finnhubNews(ticker?: string): Promise<NewsData[]> {
  if (!checkRateLimit('finnhub')) {
    return [];
  }
  
  try {
    const apiId = ticker ? 'Finnhub/company_news' : 'Finnhub/general_news';
    const query = ticker 
      ? { 
          symbol: formatTicker(ticker, 'finnhub'),
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0],
        }
      : { category: 'general' };
    
    const response = await callDataApi(apiId, { query }) as FinnhubNewsItem[] | null;
    
    if (Array.isArray(response)) {
      return response.slice(0, 20).map((news) => ({
        id: String(news.id),
        headline: news.headline,
        summary: news.summary,
        source: news.source,
        url: news.url,
        image: news.image,
        datetime: new Date(news.datetime * 1000).toISOString(),
        related: news.related,
        category: news.category,
        dataSource: 'finnhub',
      }));
    }
    return [];
  } catch (error) {
    console.error('Finnhub news error:', error);
    return [];
  }
}

// ============================================
// YAHOO FINANCE (via Data API)
// ============================================

interface YahooQuoteResponse {
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketOpen: number;
  regularMarketPreviousClose: number;
  regularMarketVolume: number;
  marketCap: number;
  trailingPE: number;
  trailingEps: number;
  dividendYield: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

interface YahooHistoricalItem {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

async function yahooQuote(ticker: string): Promise<QuoteData | null> {
  if (!checkRateLimit('yahoo')) {
    return null;
  }
  
  try {
    const response = await callDataApi('Yahoo_Finance/get_stock_chart', {
      query: { 
        symbol: formatTicker(ticker, 'yahoo'),
        interval: '1d',
        range: '1d',
      },
    }) as YahooQuoteResponse | null;
    
    if (response && response.regularMarketPrice) {
      return {
        symbol: ticker,
        price: response.regularMarketPrice,
        change: response.regularMarketChange,
        changePercent: response.regularMarketChangePercent,
        high: response.regularMarketDayHigh,
        low: response.regularMarketDayLow,
        open: response.regularMarketOpen,
        previousClose: response.regularMarketPreviousClose,
        volume: response.regularMarketVolume,
        marketCap: response.marketCap,
        pe: response.trailingPE,
        eps: response.trailingEps,
        dividend: response.dividendYield,
        fiftyTwoWeekHigh: response.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: response.fiftyTwoWeekLow,
        timestamp: Date.now(),
        source: 'yahoo',
      };
    }
    return null;
  } catch (error) {
    console.error('Yahoo quote error:', error);
    return null;
  }
}

async function yahooHistorical(ticker: string, period: string = '1y'): Promise<HistoricalData[]> {
  if (!checkRateLimit('yahoo')) {
    return [];
  }
  
  try {
    const response = await callDataApi('Yahoo_Finance/get_stock_chart', {
      query: { 
        symbol: formatTicker(ticker, 'yahoo'),
        interval: '1d',
        range: period,
      },
    }) as YahooHistoricalItem[] | null;
    
    if (Array.isArray(response)) {
      return response.map((item) => ({
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
        adjClose: item.adjClose,
      }));
    }
    return [];
  } catch (error) {
    console.error('Yahoo historical error:', error);
    return [];
  }
}

// ============================================
// ALPHA VANTAGE (25 req/dia gratuito)
// ============================================

interface AlphaVantageQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

async function alphaVantageQuote(ticker: string): Promise<QuoteData | null> {
  if (!checkRateLimit('alphaVantage')) {
    return null;
  }
  
  try {
    const response = await callDataApi('Alpha_Vantage/global_quote', {
      query: { symbol: formatTicker(ticker, 'alphaVantage') },
    }) as AlphaVantageQuoteResponse | null;
    
    const quote = response?.['Global Quote'];
    if (quote) {
      return {
        symbol: ticker,
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '')),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        volume: parseInt(quote['06. volume']),
        timestamp: Date.now(),
        source: 'alphaVantage',
      };
    }
    return null;
  } catch (error) {
    console.error('Alpha Vantage quote error:', error);
    return null;
  }
}

// ============================================
// TIPOS EXPORTADOS
// ============================================

export interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  volume?: number;
  marketCap?: number;
  pe?: number;
  eps?: number;
  dividend?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
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
  adjClose?: number;
}

export interface NewsData {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image?: string;
  datetime: string;
  related?: string;
  category?: string;
  dataSource: string;
}

export interface CompanyProfile {
  symbol: string;
  name: string;
  country?: string;
  currency?: string;
  exchange?: string;
  industry?: string;
  logo?: string;
  marketCap?: number;
  shareOutstanding?: number;
  weburl?: string;
  source: string;
}

// ============================================
// SERVIÇO UNIFICADO COM FALLBACK
// ============================================

/**
 * Obtém cotação com fallback automático entre APIs
 */
export async function getQuote(ticker: string): Promise<QuoteData | null> {
  const cacheKey = `quote:${ticker}`;
  const cached = getCached<QuoteData>(cacheKey, CACHE_TTL.quote);
  if (cached) return cached;
  
  // Tentar Yahoo primeiro (mais completo e sem limite rígido)
  let quote = await yahooQuote(ticker);
  if (quote) {
    setCache(cacheKey, quote);
    return quote;
  }
  
  // Fallback para Finnhub
  quote = await finnhubQuote(ticker);
  if (quote) {
    setCache(cacheKey, quote);
    return quote;
  }
  
  // Último recurso: Alpha Vantage (limite diário baixo)
  quote = await alphaVantageQuote(ticker);
  if (quote) {
    setCache(cacheKey, quote);
    return quote;
  }
  
  return null;
}

/**
 * Obtém múltiplas cotações de uma vez
 */
export async function getQuotes(tickers: string[]): Promise<Map<string, QuoteData>> {
  const results = new Map<string, QuoteData>();
  
  // Processar em paralelo com limite de concorrência
  const batchSize = 5;
  for (let i = 0; i < tickers.length; i += batchSize) {
    const batch = tickers.slice(i, i + batchSize);
    const promises = batch.map(ticker => getQuote(ticker));
    const quotes = await Promise.all(promises);
    
    quotes.forEach((quote, index) => {
      if (quote) {
        results.set(batch[index], quote);
      }
    });
  }
  
  return results;
}

/**
 * Obtém dados históricos com fallback
 */
export async function getHistoricalData(
  ticker: string, 
  period: string = '1y'
): Promise<HistoricalData[]> {
  const cacheKey = `historical:${ticker}:${period}`;
  const cached = getCached<HistoricalData[]>(cacheKey, CACHE_TTL.historical);
  if (cached) return cached;
  
  // Tentar Yahoo primeiro
  let data = await yahooHistorical(ticker, period);
  if (data && data.length > 0) {
    setCache(cacheKey, data);
    return data;
  }
  
  // Fallback para Finnhub
  const periodDays: Record<string, number> = {
    '1d': 1, '5d': 5, '1mo': 30, '3mo': 90, '6mo': 180, '1y': 365, '2y': 730, '5y': 1825
  };
  const days = periodDays[period] || 365;
  const to = Date.now();
  const from = to - days * 24 * 60 * 60 * 1000;
  
  const finnhubData = await finnhubCandles(ticker, from, to);
  if (finnhubData && finnhubData.length > 0) {
    data = finnhubData;
    setCache(cacheKey, data);
    return data;
  }
  
  return [];
}

/**
 * Obtém perfil da empresa com fallback
 */
export async function getCompanyProfile(ticker: string): Promise<CompanyProfile | null> {
  const cacheKey = `profile:${ticker}`;
  const cached = getCached<CompanyProfile>(cacheKey, CACHE_TTL.fundamentals);
  if (cached) return cached;
  
  // Tentar Finnhub primeiro (mais detalhado)
  const profile = await finnhubCompanyProfile(ticker);
  if (profile) {
    setCache(cacheKey, profile);
    return profile;
  }
  
  return null;
}

/**
 * Obtém notícias com fallback
 */
export async function getNews(ticker?: string): Promise<NewsData[]> {
  const cacheKey = `news:${ticker || 'general'}`;
  const cached = getCached<NewsData[]>(cacheKey, CACHE_TTL.news);
  if (cached) return cached;
  
  const news = await finnhubNews(ticker);
  if (news && news.length > 0) {
    setCache(cacheKey, news);
    return news;
  }
  
  return [];
}

/**
 * Obtém indicadores técnicos calculados
 */
export function calculateIndicators(data: HistoricalData[]): {
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
  ema12: number | null;
  ema26: number | null;
  rsi14: number | null;
  macd: { macd: number; signal: number; histogram: number } | null;
  bollingerBands: { upper: number; middle: number; lower: number } | null;
} {
  if (!data || data.length < 20) {
    return {
      sma20: null, sma50: null, sma200: null,
      ema12: null, ema26: null, rsi14: null,
      macd: null, bollingerBands: null,
    };
  }
  
  const closes = data.map(d => d.close);
  
  // SMA
  const sma = (period: number) => {
    if (closes.length < period) return null;
    const slice = closes.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
  };
  
  // EMA
  const ema = (period: number) => {
    if (closes.length < period) return null;
    const k = 2 / (period + 1);
    let emaValue = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = period; i < closes.length; i++) {
      emaValue = closes[i] * k + emaValue * (1 - k);
    }
    return emaValue;
  };
  
  // RSI
  const rsi = (period: number) => {
    if (closes.length < period + 1) return null;
    let gains = 0, losses = 0;
    for (let i = closes.length - period; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };
  
  // MACD
  const ema12Val = ema(12);
  const ema26Val = ema(26);
  const macdLine = ema12Val && ema26Val ? ema12Val - ema26Val : null;
  
  // Bollinger Bands
  const sma20Val = sma(20);
  let stdDev = 0;
  if (sma20Val && closes.length >= 20) {
    const slice = closes.slice(-20);
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - sma20Val, 2), 0) / 20;
    stdDev = Math.sqrt(variance);
  }
  
  return {
    sma20: sma(20),
    sma50: sma(50),
    sma200: sma(200),
    ema12: ema12Val,
    ema26: ema26Val,
    rsi14: rsi(14),
    macd: macdLine !== null ? {
      macd: macdLine,
      signal: macdLine * 0.9, // Simplificado
      histogram: macdLine * 0.1,
    } : null,
    bollingerBands: sma20Val ? {
      upper: sma20Val + 2 * stdDev,
      middle: sma20Val,
      lower: sma20Val - 2 * stdDev,
    } : null,
  };
}

/**
 * Obtém estatísticas de uso das APIs
 */
export function getApiStats() {
  return {
    finnhub: {
      used: rateLimits.finnhub.requests,
      limit: rateLimits.finnhub.limit,
      resetIn: Math.max(0, rateLimits.finnhub.resetTime + rateLimits.finnhub.window - Date.now()),
    },
    alphaVantage: {
      used: rateLimits.alphaVantage.requests,
      limit: rateLimits.alphaVantage.limit,
      resetIn: Math.max(0, rateLimits.alphaVantage.resetTime + rateLimits.alphaVantage.window - Date.now()),
    },
    yahoo: {
      used: rateLimits.yahoo.requests,
      limit: rateLimits.yahoo.limit,
      resetIn: Math.max(0, rateLimits.yahoo.resetTime + rateLimits.yahoo.window - Date.now()),
    },
    cacheSize: cache.size,
  };
}

/**
 * Limpa o cache
 */
export function clearCache(): void {
  cache.clear();
}
