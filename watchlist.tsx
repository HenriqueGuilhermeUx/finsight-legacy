/**
 * F-Insight Mobile - Watchlist Screen
 */

import { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useWatchlistStore, useSettingsStore } from '@/lib/store';

const themes = {
  dark: {
    background: '#0a0f1a',
    card: '#111827',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    primary: '#14b8a6',
    border: '#1f2937',
    success: '#10b981',
    danger: '#ef4444',
  },
  light: {
    background: '#f9fafb',
    card: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    primary: '#0d9488',
    border: '#e5e7eb',
    success: '#10b981',
    danger: '#ef4444',
  },
};

// Mock watchlist data
const mockWatchlist = [
  { id: 1, ticker: 'PETR4', name: 'Petrobras', price: 38.45, change: 2.34, changePercent: 2.34, addedAt: '2024-01-15' },
  { id: 2, ticker: 'VALE3', name: 'Vale', price: 67.89, change: -0.84, changePercent: -1.23, addedAt: '2024-01-14' },
  { id: 3, ticker: 'ITUB4', name: 'Itaú Unibanco', price: 32.15, change: 0.28, changePercent: 0.87, addedAt: '2024-01-13' },
  { id: 4, ticker: 'AAPL', name: 'Apple', price: 178.45, change: 1.63, changePercent: 0.92, addedAt: '2024-01-12' },
  { id: 5, ticker: 'BTC', name: 'Bitcoin', price: 67432.50, change: 1543.21, changePercent: 2.34, addedAt: '2024-01-11' },
];

export default function WatchlistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { theme: themeSetting } = useSettingsStore();
  const { isAuthenticated } = useAuthStore();
  const { items, removeItem } = useWatchlistStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  const theme = themeSetting === 'system' 
    ? (colorScheme === 'dark' ? 'dark' : 'light')
    : themeSetting;
  
  const colors = themes[theme];

  // Use mock data for demo
  const watchlistData = mockWatchlist;

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleRemove = (ticker: string) => {
    Alert.alert(
      'Remover da Watchlist',
      `Deseja remover ${ticker} da sua watchlist?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => removeItem(ticker)
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    assetCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    assetInfo: {
      flex: 1,
    },
    assetTicker: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    assetName: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    assetPriceContainer: {
      alignItems: 'flex-end',
      marginRight: 12,
    },
    assetPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    assetChange: {
      fontSize: 14,
      fontWeight: '600',
      marginTop: 2,
    },
    positive: {
      color: colors.success,
    },
    negative: {
      color: colors.danger,
    },
    removeButton: {
      padding: 8,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 20,
    },
    addButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    loginContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    loginTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    loginText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 20,
    },
    loginButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 14,
      borderRadius: 8,
    },
    loginButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    sparkline: {
      width: 60,
      height: 30,
      marginRight: 12,
    },
  });

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Ionicons name="star" size={64} color={colors.primary} />
          <Text style={styles.loginTitle}>Sua Watchlist</Text>
          <Text style={styles.loginText}>
            Faça login para criar sua watchlist personalizada e acompanhar seus ativos favoritos em tempo real.
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: typeof mockWatchlist[0] }) => (
    <TouchableOpacity 
      style={styles.assetCard}
      onPress={() => router.push(`/asset/${item.ticker}`)}
    >
      <View style={styles.assetInfo}>
        <Text style={styles.assetTicker}>{item.ticker}</Text>
        <Text style={styles.assetName}>{item.name}</Text>
      </View>
      
      {/* Mini sparkline placeholder */}
      <View style={styles.sparkline}>
        <Ionicons 
          name={item.changePercent >= 0 ? "trending-up" : "trending-down"} 
          size={24} 
          color={item.changePercent >= 0 ? colors.success : colors.danger} 
        />
      </View>
      
      <View style={styles.assetPriceContainer}>
        <Text style={styles.assetPrice}>
          {item.ticker === 'BTC' || item.ticker === 'AAPL' ? '$' : 'R$ '}
          {item.price.toLocaleString(item.ticker === 'BTC' || item.ticker === 'AAPL' ? 'en-US' : 'pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text>
        <Text style={[styles.assetChange, item.changePercent >= 0 ? styles.positive : styles.negative]}>
          {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemove(item.ticker)}
      >
        <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Watchlist</Text>
        <Text style={styles.headerSubtitle}>
          {watchlistData.length} {watchlistData.length === 1 ? 'ativo' : 'ativos'} monitorados
        </Text>
      </View>

      <FlatList
        data={watchlistData}
        keyExtractor={(item) => item.ticker}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={64} color={colors.textSecondary} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Watchlist vazia</Text>
            <Text style={styles.emptyText}>
              Adicione ativos à sua watchlist para acompanhar suas cotações em tempo real.
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/radar')}
            >
              <Text style={styles.addButtonText}>Explorar Ativos</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      />
    </View>
  );
}
