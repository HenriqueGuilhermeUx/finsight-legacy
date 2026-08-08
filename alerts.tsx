/**
 * F-Insight Mobile - Alerts Screen
 */

import { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Switch,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useAlertsStore, useSettingsStore } from '@/lib/store';

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
    warning: '#f59e0b',
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
    warning: '#f59e0b',
  },
};

// Mock alerts data
const mockAlerts = [
  { id: 1, ticker: 'PETR4', type: 'price', condition: 'above', value: 40, isActive: true, createdAt: '2024-01-15' },
  { id: 2, ticker: 'VALE3', type: 'price', condition: 'below', value: 65, isActive: true, createdAt: '2024-01-14' },
  { id: 3, ticker: 'ITUB4', type: 'rsi', condition: 'below', value: 30, isActive: false, createdAt: '2024-01-13' },
  { id: 4, ticker: 'BTC', type: 'price', condition: 'above', value: 70000, isActive: true, createdAt: '2024-01-12' },
  { id: 5, ticker: 'AAPL', type: 'macd', condition: 'crosses_above', value: 0, isActive: true, createdAt: '2024-01-11' },
];

const alertTypeLabels: Record<string, string> = {
  price: 'Preço',
  rsi: 'RSI',
  macd: 'MACD',
  volume: 'Volume',
};

const conditionLabels: Record<string, string> = {
  above: 'Acima de',
  below: 'Abaixo de',
  crosses_above: 'Cruza acima de',
  crosses_below: 'Cruza abaixo de',
};

export default function AlertsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { theme: themeSetting } = useSettingsStore();
  const { isAuthenticated } = useAuthStore();
  const { alerts, toggleAlert, removeAlert } = useAlertsStore();
  
  const theme = themeSetting === 'system' 
    ? (colorScheme === 'dark' ? 'dark' : 'light')
    : themeSetting;
  
  const colors = themes[theme];

  // Use mock data for demo
  const alertsData = mockAlerts;

  const handleToggle = (id: number) => {
    toggleAlert(id);
  };

  const handleDelete = (id: number, ticker: string) => {
    Alert.alert(
      'Excluir Alerta',
      `Deseja excluir o alerta de ${ticker}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => removeAlert(id)
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flex: 1,
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
    addButton: {
      backgroundColor: colors.primary,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    alertCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    alertHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    alertTicker: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    alertType: {
      fontSize: 12,
      color: colors.primary,
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginLeft: 8,
    },
    alertCondition: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    alertValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 4,
    },
    alertFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    alertStatus: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    alertStatusText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 8,
    },
    deleteButton: {
      padding: 8,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    createButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 20,
    },
    createButtonText: {
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
    activeIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    activeIndicatorOn: {
      backgroundColor: colors.success,
    },
    activeIndicatorOff: {
      backgroundColor: colors.textSecondary,
    },
  });

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Ionicons name="notifications" size={64} color={colors.primary} />
          <Text style={styles.loginTitle}>Alertas de Preço</Text>
          <Text style={styles.loginText}>
            Faça login para criar alertas personalizados e receber notificações quando seus ativos atingirem os valores definidos.
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

  const renderAlert = ({ item }: { item: typeof mockAlerts[0] }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.alertTicker}>{item.ticker}</Text>
          <Text style={styles.alertType}>{alertTypeLabels[item.type]}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[
            styles.activeIndicator,
            item.isActive ? styles.activeIndicatorOn : styles.activeIndicatorOff
          ]} />
          <Text style={{ color: item.isActive ? colors.success : colors.textSecondary, fontSize: 12 }}>
            {item.isActive ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.alertCondition}>{conditionLabels[item.condition]}</Text>
      <Text style={styles.alertValue}>
        {item.type === 'price' ? (
          item.ticker === 'BTC' || item.ticker === 'AAPL' 
            ? `$${item.value.toLocaleString('en-US')}` 
            : `R$ ${item.value.toLocaleString('pt-BR')}`
        ) : (
          item.value
        )}
      </Text>
      
      <View style={styles.alertFooter}>
        <View style={styles.alertStatus}>
          <Text style={styles.alertStatusText}>Status</Text>
          <Switch
            value={item.isActive}
            onValueChange={() => handleToggle(item.id)}
            trackColor={{ false: colors.border, true: colors.primary + '50' }}
            thumbColor={item.isActive ? colors.primary : colors.textSecondary}
          />
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.ticker)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Alertas</Text>
          <Text style={styles.headerSubtitle}>
            {alertsData.filter(a => a.isActive).length} alertas ativos
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert('Criar Alerta', 'Funcionalidade em desenvolvimento')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={alertsData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAlert}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Nenhum alerta criado</Text>
            <Text style={styles.emptyText}>
              Crie alertas para ser notificado quando seus ativos atingirem valores específicos.
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => Alert.alert('Criar Alerta', 'Funcionalidade em desenvolvimento')}
            >
              <Text style={styles.createButtonText}>Criar Alerta</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      />
    </View>
  );
}
