/**
 * F-Insight Mobile - Offline Support Service
 * Handles data caching and synchronization
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useOfflineCacheStore } from './store';
import api from './api';

// Cache keys
const CACHE_KEYS = {
  MARKET_DATA: 'cache_market_data',
  WATCHLIST: 'cache_watchlist',
  PORTFOLIO: 'cache_portfolio',
  ALERTS: 'cache_alerts',
  USER_PROFILE: 'cache_user_profile',
  LAST_SYNC: 'cache_last_sync',
  PENDING_ACTIONS: 'cache_pending_actions',
};

// Cache expiration times (in milliseconds)
const CACHE_EXPIRATION = {
  MARKET_DATA: 5 * 60 * 1000, // 5 minutes
  WATCHLIST: 30 * 60 * 1000, // 30 minutes
  PORTFOLIO: 60 * 60 * 1000, // 1 hour
  ALERTS: 60 * 60 * 1000, // 1 hour
  USER_PROFILE: 24 * 60 * 60 * 1000, // 24 hours
};

// Pending action types
interface PendingAction {
  id: string;
  type: 'create_alert' | 'delete_alert' | 'toggle_alert' | 'add_watchlist' | 'remove_watchlist' | 'add_position' | 'remove_position';
  data: Record<string, unknown>;
  timestamp: number;
  retries: number;
}

// Network state
let isOnline = true;
let networkUnsubscribe: (() => void) | null = null;

/**
 * Initialize offline support
 */
export async function initializeOfflineSupport(): Promise<void> {
  // Subscribe to network state changes
  networkUnsubscribe = NetInfo.addEventListener(handleNetworkChange);
  
  // Check initial network state
  const state = await NetInfo.fetch();
  isOnline = state.isConnected ?? true;
  
  // If online, sync pending actions
  if (isOnline) {
    await syncPendingActions();
  }
}

/**
 * Cleanup offline support
 */
export function cleanupOfflineSupport(): void {
  if (networkUnsubscribe) {
    networkUnsubscribe();
    networkUnsubscribe = null;
  }
}

/**
 * Handle network state changes
 */
async function handleNetworkChange(state: NetInfoState): Promise<void> {
  const wasOffline = !isOnline;
  isOnline = state.isConnected ?? true;
  
  console.log('Network state changed:', isOnline ? 'online' : 'offline');
  
  // If we just came back online, sync pending actions
  if (wasOffline && isOnline) {
    console.log('Back online, syncing pending actions...');
    await syncPendingActions();
  }
}

/**
 * Check if device is online
 */
export function getIsOnline(): boolean {
  return isOnline;
}

/**
 * Save data to cache
 */
export async function saveToCache<T>(key: string, data: T): Promise<void> {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

/**
 * Get data from cache
 */
export async function getFromCache<T>(key: string, maxAge?: number): Promise<T | null> {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    // Check if cache is expired
    if (maxAge && Date.now() - timestamp > maxAge) {
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Clear specific cache
 */
export async function clearCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  try {
    const keys = Object.values(CACHE_KEYS);
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error clearing all caches:', error);
  }
}

/**
 * Add pending action for offline sync
 */
export async function addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp' | 'retries'>): Promise<void> {
  try {
    const pendingActions = await getPendingActions();
    const newAction: PendingAction = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0,
    };
    pendingActions.push(newAction);
    await AsyncStorage.setItem(CACHE_KEYS.PENDING_ACTIONS, JSON.stringify(pendingActions));
  } catch (error) {
    console.error('Error adding pending action:', error);
  }
}

/**
 * Get pending actions
 */
export async function getPendingActions(): Promise<PendingAction[]> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.PENDING_ACTIONS);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('Error getting pending actions:', error);
    return [];
  }
}

/**
 * Remove pending action
 */
async function removePendingAction(id: string): Promise<void> {
  try {
    const pendingActions = await getPendingActions();
    const filtered = pendingActions.filter(a => a.id !== id);
    await AsyncStorage.setItem(CACHE_KEYS.PENDING_ACTIONS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing pending action:', error);
  }
}

/**
 * Sync pending actions with server
 */
export async function syncPendingActions(): Promise<void> {
  if (!isOnline) return;
  
  const pendingActions = await getPendingActions();
  if (pendingActions.length === 0) return;
  
  console.log(`Syncing ${pendingActions.length} pending actions...`);
  
  for (const action of pendingActions) {
    try {
      await executePendingAction(action);
      await removePendingAction(action.id);
      console.log(`Synced action: ${action.type}`);
    } catch (error) {
      console.error(`Error syncing action ${action.type}:`, error);
      
      // Increment retry count
      action.retries++;
      
      // Remove action if too many retries
      if (action.retries >= 3) {
        await removePendingAction(action.id);
        console.log(`Removed action after 3 retries: ${action.type}`);
      }
    }
  }
}

/**
 * Execute a pending action
 */
async function executePendingAction(action: PendingAction): Promise<void> {
  switch (action.type) {
    case 'create_alert':
      // await api.alerts.create(action.data);
      break;
    case 'delete_alert':
      // await api.alerts.delete(action.data.id);
      break;
    case 'toggle_alert':
      // await api.alerts.toggle(action.data.id);
      break;
    case 'add_watchlist':
      // await api.watchlist.add(action.data.ticker);
      break;
    case 'remove_watchlist':
      // await api.watchlist.remove(action.data.ticker);
      break;
    case 'add_position':
      // await api.portfolio.addPosition(action.data);
      break;
    case 'remove_position':
      // await api.portfolio.removePosition(action.data.id);
      break;
    default:
      console.warn(`Unknown action type: ${action.type}`);
  }
}

/**
 * Cache market data
 */
export async function cacheMarketData(data: unknown): Promise<void> {
  await saveToCache(CACHE_KEYS.MARKET_DATA, data);
}

/**
 * Get cached market data
 */
export async function getCachedMarketData<T>(): Promise<T | null> {
  return getFromCache<T>(CACHE_KEYS.MARKET_DATA, CACHE_EXPIRATION.MARKET_DATA);
}

/**
 * Cache watchlist
 */
export async function cacheWatchlist(data: unknown): Promise<void> {
  await saveToCache(CACHE_KEYS.WATCHLIST, data);
}

/**
 * Get cached watchlist
 */
export async function getCachedWatchlist<T>(): Promise<T | null> {
  return getFromCache<T>(CACHE_KEYS.WATCHLIST, CACHE_EXPIRATION.WATCHLIST);
}

/**
 * Cache portfolio
 */
export async function cachePortfolio(data: unknown): Promise<void> {
  await saveToCache(CACHE_KEYS.PORTFOLIO, data);
}

/**
 * Get cached portfolio
 */
export async function getCachedPortfolio<T>(): Promise<T | null> {
  return getFromCache<T>(CACHE_KEYS.PORTFOLIO, CACHE_EXPIRATION.PORTFOLIO);
}

/**
 * Cache alerts
 */
export async function cacheAlerts(data: unknown): Promise<void> {
  await saveToCache(CACHE_KEYS.ALERTS, data);
}

/**
 * Get cached alerts
 */
export async function getCachedAlerts<T>(): Promise<T | null> {
  return getFromCache<T>(CACHE_KEYS.ALERTS, CACHE_EXPIRATION.ALERTS);
}

/**
 * Get last sync timestamp
 */
export async function getLastSyncTime(): Promise<number | null> {
  const cached = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);
  return cached ? parseInt(cached, 10) : null;
}

/**
 * Update last sync timestamp
 */
export async function updateLastSyncTime(): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, String(Date.now()));
}

/**
 * Get cache size in bytes
 */
export async function getCacheSize(): Promise<number> {
  try {
    const keys = Object.values(CACHE_KEYS);
    let totalSize = 0;
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length * 2; // UTF-16 characters
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Error getting cache size:', error);
    return 0;
  }
}

/**
 * Format cache size for display
 */
export function formatCacheSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default {
  initializeOfflineSupport,
  cleanupOfflineSupport,
  getIsOnline,
  saveToCache,
  getFromCache,
  clearCache,
  clearAllCaches,
  addPendingAction,
  getPendingActions,
  syncPendingActions,
  cacheMarketData,
  getCachedMarketData,
  cacheWatchlist,
  getCachedWatchlist,
  cachePortfolio,
  getCachedPortfolio,
  cacheAlerts,
  getCachedAlerts,
  getLastSyncTime,
  updateLastSyncTime,
  getCacheSize,
  formatCacheSize,
};
