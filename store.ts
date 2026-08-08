/**
 * F-Insight Mobile State Management
 * Using Zustand for global state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Asset, Quote, WatchlistItem, Alert, Portfolio } from './api';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Watchlist Store
interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;
  setItems: (items: WatchlistItem[]) => void;
  addItem: (item: WatchlistItem) => void;
  removeItem: (ticker: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      items: [],
      isLoading: false,
      setItems: (items) => set({ items }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (ticker) => set((state) => ({ 
        items: state.items.filter(i => i.ticker !== ticker) 
      })),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'watchlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Quotes Store (real-time data, not persisted)
interface QuotesState {
  quotes: Record<string, Quote>;
  setQuote: (ticker: string, quote: Quote) => void;
  setQuotes: (quotes: Record<string, Quote>) => void;
  clearQuotes: () => void;
}

export const useQuotesStore = create<QuotesState>()((set) => ({
  quotes: {},
  setQuote: (ticker, quote) => set((state) => ({ 
    quotes: { ...state.quotes, [ticker]: quote } 
  })),
  setQuotes: (quotes) => set({ quotes }),
  clearQuotes: () => set({ quotes: {} }),
}));

// Alerts Store
interface AlertsState {
  alerts: Alert[];
  isLoading: boolean;
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: number) => void;
  toggleAlert: (id: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set) => ({
      alerts: [],
      isLoading: false,
      setAlerts: (alerts) => set({ alerts }),
      addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
      removeAlert: (id) => set((state) => ({ 
        alerts: state.alerts.filter(a => a.id !== id) 
      })),
      toggleAlert: (id) => set((state) => ({
        alerts: state.alerts.map(a => 
          a.id === id ? { ...a, isActive: !a.isActive } : a
        )
      })),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'alerts-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Portfolios Store
interface PortfoliosState {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  isLoading: boolean;
  setPortfolios: (portfolios: Portfolio[]) => void;
  setSelectedPortfolio: (portfolio: Portfolio | null) => void;
  setLoading: (loading: boolean) => void;
}

export const usePortfoliosStore = create<PortfoliosState>()(
  persist(
    (set) => ({
      portfolios: [],
      selectedPortfolio: null,
      isLoading: false,
      setPortfolios: (portfolios) => set({ portfolios }),
      setSelectedPortfolio: (selectedPortfolio) => set({ selectedPortfolio }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'portfolios-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Search History Store
interface SearchHistoryState {
  history: string[];
  addSearch: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      addSearch: (query) => set((state) => ({
        history: [query, ...state.history.filter(q => q !== query)].slice(0, 10)
      })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'search-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Settings Store
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  biometricAuth: boolean;
  currency: 'BRL' | 'USD';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotifications: (enabled: boolean) => void;
  setBiometricAuth: (enabled: boolean) => void;
  setCurrency: (currency: 'BRL' | 'USD') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      notifications: true,
      biometricAuth: false,
      currency: 'BRL',
      setTheme: (theme) => set({ theme }),
      setNotifications: (notifications) => set({ notifications }),
      setBiometricAuth: (biometricAuth) => set({ biometricAuth }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Offline Cache Store
interface OfflineCacheState {
  assets: Asset[];
  lastSync: number | null;
  setAssets: (assets: Asset[]) => void;
  setLastSync: (timestamp: number) => void;
}

export const useOfflineCacheStore = create<OfflineCacheState>()(
  persist(
    (set) => ({
      assets: [],
      lastSync: null,
      setAssets: (assets) => set({ assets }),
      setLastSync: (lastSync) => set({ lastSync }),
    }),
    {
      name: 'offline-cache-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
