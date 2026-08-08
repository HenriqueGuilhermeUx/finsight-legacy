/**
 * F-Insight Mobile API Client
 * Connects to the F-Insight backend API
 */

import * as SecureStore from 'expo-secure-store';

// API Configuration
const API_BASE_URL = 'https://f-insight.org/api';

// Token storage
const TOKEN_KEY = 'auth_token';

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// API Request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// tRPC-like client for the mobile app
export const api = {
  // Auth
  auth: {
    me: () => apiRequest<{ user: User | null }>('/trpc/auth.me'),
    logout: () => apiRequest('/trpc/auth.logout', { method: 'POST' }),
  },
  
  // Assets
  assets: {
    list: (params?: { sector?: string; region?: string }) => 
      apiRequest<{ assets: Asset[] }>(`/trpc/assets.list?input=${encodeURIComponent(JSON.stringify(params || {}))}`),
    get: (ticker: string) => 
      apiRequest<{ asset: Asset }>(`/trpc/assets.get?input=${encodeURIComponent(JSON.stringify({ ticker }))}`),
    search: (query: string) =>
      apiRequest<{ results: Asset[] }>(`/trpc/assets.search?input=${encodeURIComponent(JSON.stringify({ query }))}`),
  },
  
  // Quotes
  quotes: {
    get: (ticker: string) =>
      apiRequest<{ quote: Quote }>(`/trpc/quotes.get?input=${encodeURIComponent(JSON.stringify({ ticker }))}`),
    batch: (tickers: string[]) =>
      apiRequest<{ quotes: Quote[] }>(`/trpc/quotes.batch?input=${encodeURIComponent(JSON.stringify({ tickers }))}`),
  },
  
  // Watchlist
  watchlist: {
    get: () => apiRequest<{ items: WatchlistItem[] }>('/trpc/watchlist.get'),
    add: (ticker: string) =>
      apiRequest('/trpc/watchlist.add', {
        method: 'POST',
        body: JSON.stringify({ ticker }),
      }),
    remove: (ticker: string) =>
      apiRequest('/trpc/watchlist.remove', {
        method: 'POST',
        body: JSON.stringify({ ticker }),
      }),
  },
  
  // Alerts
  alerts: {
    list: () => apiRequest<{ alerts: Alert[] }>('/trpc/alerts.list'),
    create: (data: CreateAlertInput) =>
      apiRequest('/trpc/alerts.create', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiRequest('/trpc/alerts.delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
      }),
    toggle: (id: number) =>
      apiRequest('/trpc/alerts.toggle', {
        method: 'POST',
        body: JSON.stringify({ id }),
      }),
  },
  
  // Portfolios
  portfolios: {
    list: () => apiRequest<{ portfolios: Portfolio[] }>('/trpc/portfolios.list'),
    get: (id: number) =>
      apiRequest<{ portfolio: Portfolio }>(`/trpc/portfolios.get?input=${encodeURIComponent(JSON.stringify({ id }))}`),
    create: (data: CreatePortfolioInput) =>
      apiRequest('/trpc/portfolios.create', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  
  // News
  news: {
    list: (category?: string) =>
      apiRequest<{ news: NewsItem[] }>(`/trpc/news.list?input=${encodeURIComponent(JSON.stringify({ category }))}`),
  },
  
  // Macro
  macro: {
    indicators: () => apiRequest<{ indicators: MacroIndicator[] }>('/trpc/macro.indicators'),
  },
};

// Types
export interface User {
  id: number;
  openId: string;
  name: string;
  email?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isPremium: boolean;
}

export interface Asset {
  id: number;
  ticker: string;
  name: string;
  type: 'stock' | 'etf' | 'crypto' | 'fii';
  sector?: string;
  region: 'BR' | 'US' | 'CRYPTO';
  price?: number;
  change?: number;
  changePercent?: number;
}

export interface Quote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
  week52High: number;
  week52Low: number;
  timestamp: number;
}

export interface WatchlistItem {
  id: number;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  addedAt: string;
}

export interface Alert {
  id: number;
  ticker: string;
  type: 'price' | 'rsi' | 'macd' | 'volume';
  condition: 'above' | 'below' | 'crosses_above' | 'crosses_below';
  value: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface CreateAlertInput {
  ticker: string;
  type: 'price' | 'rsi' | 'macd' | 'volume';
  condition: 'above' | 'below' | 'crosses_above' | 'crosses_below';
  value: number;
}

export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  positions: Position[];
}

export interface Position {
  id: number;
  ticker: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  return: number;
  returnPercent: number;
}

export interface CreatePortfolioInput {
  name: string;
  description?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  image?: string;
}

export interface MacroIndicator {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  unit: string;
  country: string;
  updatedAt: string;
}

export default api;
