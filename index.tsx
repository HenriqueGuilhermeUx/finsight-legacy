/**
 * F-Insight Mobile - Home Screen
 */

import { useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore, useWatchlistStore, useSettingsStore } from '@/lib/store';
import api from '@/lib/api';

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

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { theme: themeSetting } = useSettingsStore();
  const { user, isAuthenticated } = useAuthStore();
  const { items: watchlistItems } = useWatchlistStore();
  
  const theme = themeSetting === 'system' 
    ? (colorScheme === 'dark' ? 'dark' : 'light')
    : themeSetting;
  
  const colors = themes[theme];

  // Fetch market summary
  const { data: marketData, isLoading, refetch } = useQuery({
    queryKey: ['market-summary'],
    queryFn: async () => {
      // Mock market data for now
      return {
        ibov: { value: 127543.21, change: 0.87 },
        sp500: { value: 5234.18, change: 0.42 },
        nasdaq: { value: 16432.87, change: 0.65 },
        btc: { value: 67432.50, change: 2.34 },
        usd: { value: 4.92, change: -0.15 },
      };
    },
    staleTime: 60000,
  });

  // Top movers mock data
  const topMovers = [
    { ticker: 'MGLU3', name: 'Magazine Luiza', change: 8.45 },
    { ticker: 'PETR4', name: 'Petrobras', change: 3.21 },
    { ticker: 'VALE3', name: 'Vale', change: -2.15 },
    { ticker: 'ITUB4', name: 'Itaú Unibanco', change: 1.87 },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    greeting: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      marginTop: 16,
    },
    searchText: {
      marginLeft: 8,
      color: colors.textSecondary,
      flex: 1,
    },
    section: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    marketGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    marketCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      width: '48%',
      borderWidth: 1,
      borderColor: colors.border,
    },
    marketLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    marketValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    marketChange: {
      fontSize: 14,
      fontWeight: '600',
      marginTop: 4,
    },
    positive: {
      color: colors.success,
    },
    negative: {
      color: colors.danger,
    },
    moverCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.border,
    },
    moverInfo: {
      flex: 1,
    },
    moverTicker: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    moverName: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    moverChange: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 8,
    },
    quickAction: {
      alignItems: 'center',
      padding: 16,
    },
    quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    quickActionText: {
      fontSize: 12,
      color: colors.text,
      fontWeight: '600',
    },
    loginBanner: {
      backgroundColor: colors.primary + '20',
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 20,
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    loginBannerText: {
      flex: 1,
      marginLeft: 12,
    },
    loginBannerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    loginBannerSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    loginButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    loginButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
  });

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite'}
        </Text>
        <Text style={styles.userName}>
          {isAuthenticated ? user?.name || 'Investidor' : 'Bem-vindo ao F-Insight'}
        </Text>
        
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <Text style={styles.searchText}>Buscar ações, ETFs ou criptos...</Text>
        </TouchableOpacity>
      </View>

      {/* Login Banner (if not authenticated) */}
      {!isAuthenticated && (
        <TouchableOpacity 
          style={styles.loginBanner}
          onPress={() => router.push('/login')}
        >
          <Ionicons name="person-circle" size={40} color={colors.primary} />
          <View style={styles.loginBannerText}>
            <Text style={styles.loginBannerTitle}>Faça login para mais recursos</Text>
            <Text style={styles.loginBannerSubtitle}>Watchlist, alertas e portfólios</Text>
          </View>
          <View style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/radar')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="trending-up" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Radar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/watchlist')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="star" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Watchlist</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/alerts')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="notifications" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Alertas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="settings" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Config</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Market Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo do Mercado</Text>
        <View style={styles.marketGrid}>
          <View style={styles.marketCard}>
            <Text style={styles.marketLabel}>IBOVESPA</Text>
            <Text style={styles.marketValue}>
              {marketData?.ibov.value.toLocaleString('pt-BR')}
            </Text>
            <Text style={[styles.marketChange, marketData?.ibov.change >= 0 ? styles.positive : styles.negative]}>
              {marketData?.ibov.change >= 0 ? '+' : ''}{marketData?.ibov.change.toFixed(2)}%
            </Text>
          </View>
          
          <View style={styles.marketCard}>
            <Text style={styles.marketLabel}>S&P 500</Text>
            <Text style={styles.marketValue}>
              {marketData?.sp500.value.toLocaleString('en-US')}
            </Text>
            <Text style={[styles.marketChange, marketData?.sp500.change >= 0 ? styles.positive : styles.negative]}>
              {marketData?.sp500.change >= 0 ? '+' : ''}{marketData?.sp500.change.toFixed(2)}%
            </Text>
          </View>
          
          <View style={styles.marketCard}>
            <Text style={styles.marketLabel}>Bitcoin</Text>
            <Text style={styles.marketValue}>
              ${marketData?.btc.value.toLocaleString('en-US')}
            </Text>
            <Text style={[styles.marketChange, marketData?.btc.change >= 0 ? styles.positive : styles.negative]}>
              {marketData?.btc.change >= 0 ? '+' : ''}{marketData?.btc.change.toFixed(2)}%
            </Text>
          </View>
          
          <View style={styles.marketCard}>
            <Text style={styles.marketLabel}>Dólar</Text>
            <Text style={styles.marketValue}>
              R$ {marketData?.usd.value.toFixed(2)}
            </Text>
            <Text style={[styles.marketChange, marketData?.usd.change >= 0 ? styles.positive : styles.negative]}>
              {marketData?.usd.change >= 0 ? '+' : ''}{marketData?.usd.change.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Top Movers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Maiores Movimentações</Text>
        {topMovers.map((mover) => (
          <TouchableOpacity 
            key={mover.ticker}
            style={styles.moverCard}
            onPress={() => router.push(`/asset/${mover.ticker}`)}
          >
            <View style={styles.moverInfo}>
              <Text style={styles.moverTicker}>{mover.ticker}</Text>
              <Text style={styles.moverName}>{mover.name}</Text>
            </View>
            <Text style={[styles.moverChange, mover.change >= 0 ? styles.positive : styles.negative]}>
              {mover.change >= 0 ? '+' : ''}{mover.change.toFixed(2)}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
