/**
 * F-Insight Mobile - Portfolio Screen
 */

import { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, usePortfoliosStore, useSettingsStore } from '@/lib/store';

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

// Mock portfolio data
const mockPortfolio = {
  totalValue: 125432.50,
  totalReturn: 12543.25,
  totalReturnPercent: 11.12,
  positions: [
    { ticker: 'PETR4', name: 'Petrobras', quantity: 500, avgPrice: 35.20, currentPrice: 38.45, allocation: 15.3 },
    { ticker: 'VALE3', name: 'Vale', quantity: 200, avgPrice: 62.50, currentPrice: 67.89, allocation: 10.8 },
    { ticker: 'ITUB4', name: 'Itaú Unibanco', quantity: 800, avgPrice: 28.90, currentPrice: 32.15, allocation: 20.5 },
    { ticker: 'WEGE3', name: 'WEG', quantity: 150, avgPrice: 40.00, currentPrice: 45.67, allocation: 5.5 },
    { ticker: 'AAPL', name: 'Apple', quantity: 50, avgPrice: 165.00, currentPrice: 178.45, allocation: 7.1 },
    { ticker: 'BTC', name: 'Bitcoin', quantity: 0.5, avgPrice: 55000, currentPrice: 67432.50, allocation: 26.9 },
  ],
};

export default function PortfolioScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { theme: themeSetting } = useSettingsStore();
  const { isAuthenticated } = useAuthStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  const theme = themeSetting === 'system' 
    ? (colorScheme === 'dark' ? 'dark' : 'light')
    : themeSetting;
  
  const colors = themes[theme];

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const calculateReturn = (position: typeof mockPortfolio.positions[0]) => {
    const totalCost = position.quantity * position.avgPrice;
    const currentValue = position.quantity * position.currentPrice;
    const returnValue = currentValue - totalCost;
    const returnPercent = (returnValue / totalCost) * 100;
    return { returnValue, returnPercent, currentValue };
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    summaryCard: {
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
    },
    summaryReturn: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    summaryReturnValue: {
      fontSize: 16,
      fontWeight: '600',
    },
    summaryReturnPercent: {
      fontSize: 14,
      marginLeft: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    positive: {
      color: colors.success,
    },
    negative: {
      color: colors.danger,
    },
    positiveBg: {
      backgroundColor: colors.success + '20',
    },
    negativeBg: {
      backgroundColor: colors.danger + '20',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    positionCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    positionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    positionTicker: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    positionName: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    positionAllocation: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
    positionDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    positionDetail: {
      flex: 1,
    },
    positionDetailLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    positionDetailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
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
    metricsRow: {
      flexDirection: 'row',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    metric: {
      flex: 1,
      alignItems: 'center',
    },
    metricValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    metricLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
  });

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Ionicons name="briefcase" size={64} color={colors.primary} />
          <Text style={styles.loginTitle}>Seu Portfólio</Text>
          <Text style={styles.loginText}>
            Faça login para gerenciar seu portfólio virtual, acompanhar seus investimentos e analisar sua performance.
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

  const renderPosition = ({ item }: { item: typeof mockPortfolio.positions[0] }) => {
    const { returnValue, returnPercent, currentValue } = calculateReturn(item);
    const isCrypto = item.ticker === 'BTC';
    const isUS = item.ticker === 'AAPL';
    const currency = isCrypto || isUS ? '$' : 'R$ ';
    
    return (
      <TouchableOpacity 
        style={styles.positionCard}
        onPress={() => router.push(`/asset/${item.ticker}`)}
      >
        <View style={styles.positionHeader}>
          <View>
            <Text style={styles.positionTicker}>{item.ticker}</Text>
            <Text style={styles.positionName}>{item.name}</Text>
          </View>
          <Text style={styles.positionAllocation}>{item.allocation.toFixed(1)}%</Text>
        </View>
        
        <View style={styles.positionDetails}>
          <View style={styles.positionDetail}>
            <Text style={styles.positionDetailLabel}>Quantidade</Text>
            <Text style={styles.positionDetailValue}>
              {item.quantity.toLocaleString(isCrypto ? 'en-US' : 'pt-BR', { 
                maximumFractionDigits: isCrypto ? 4 : 0 
              })}
            </Text>
          </View>
          <View style={styles.positionDetail}>
            <Text style={styles.positionDetailLabel}>Preço Médio</Text>
            <Text style={styles.positionDetailValue}>
              {currency}{item.avgPrice.toLocaleString(isCrypto || isUS ? 'en-US' : 'pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </Text>
          </View>
          <View style={styles.positionDetail}>
            <Text style={styles.positionDetailLabel}>Valor Atual</Text>
            <Text style={styles.positionDetailValue}>
              {currency}{currentValue.toLocaleString(isCrypto || isUS ? 'en-US' : 'pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </Text>
          </View>
          <View style={styles.positionDetail}>
            <Text style={styles.positionDetailLabel}>Retorno</Text>
            <Text style={[styles.positionDetailValue, returnPercent >= 0 ? styles.positive : styles.negative]}>
              {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={mockPortfolio.positions}
      keyExtractor={(item) => item.ticker}
      renderItem={renderPosition}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        <>
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Patrimônio Total</Text>
            <Text style={styles.summaryValue}>
              R$ {mockPortfolio.totalValue.toLocaleString('pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </Text>
            <View style={styles.summaryReturn}>
              <Text style={[styles.summaryReturnValue, mockPortfolio.totalReturn >= 0 ? styles.positive : styles.negative]}>
                {mockPortfolio.totalReturn >= 0 ? '+' : ''}R$ {mockPortfolio.totalReturn.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </Text>
              <Text style={[
                styles.summaryReturnPercent, 
                mockPortfolio.totalReturnPercent >= 0 ? styles.positive : styles.negative,
                mockPortfolio.totalReturnPercent >= 0 ? styles.positiveBg : styles.negativeBg
              ]}>
                {mockPortfolio.totalReturnPercent >= 0 ? '+' : ''}{mockPortfolio.totalReturnPercent.toFixed(2)}%
              </Text>
            </View>
            
            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>1.45</Text>
                <Text style={styles.metricLabel}>Sharpe</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>-8.2%</Text>
                <Text style={styles.metricLabel}>Max DD</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>0.85</Text>
                <Text style={styles.metricLabel}>Beta</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>6</Text>
                <Text style={styles.metricLabel}>Ativos</Text>
              </View>
            </View>
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Posições</Text>
          </View>
        </>
      }
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
