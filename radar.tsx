/**
 * F-Insight Mobile - Radar Screen
 */

import { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '@/lib/store';

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

// Mock assets data
const mockAssets = [
  { ticker: 'PETR4', name: 'Petrobras', sector: 'Petróleo', price: 38.45, change: 2.34, region: 'BR' },
  { ticker: 'VALE3', name: 'Vale', sector: 'Mineração', price: 67.89, change: -1.23, region: 'BR' },
  { ticker: 'ITUB4', name: 'Itaú Unibanco', sector: 'Financeiro', price: 32.15, change: 0.87, region: 'BR' },
  { ticker: 'BBDC4', name: 'Bradesco', sector: 'Financeiro', price: 14.23, change: -0.45, region: 'BR' },
  { ticker: 'WEGE3', name: 'WEG', sector: 'Industrial', price: 45.67, change: 1.56, region: 'BR' },
  { ticker: 'MGLU3', name: 'Magazine Luiza', sector: 'Varejo', price: 2.34, change: 8.45, region: 'BR' },
  { ticker: 'AAPL', name: 'Apple', sector: 'Tecnologia', price: 178.45, change: 0.92, region: 'US' },
  { ticker: 'GOOGL', name: 'Alphabet', sector: 'Tecnologia', price: 142.67, change: 1.34, region: 'US' },
  { ticker: 'MSFT', name: 'Microsoft', sector: 'Tecnologia', price: 378.91, change: 0.67, region: 'US' },
  { ticker: 'BTC', name: 'Bitcoin', sector: 'Crypto', price: 67432.50, change: 2.34, region: 'CRYPTO' },
  { ticker: 'ETH', name: 'Ethereum', sector: 'Crypto', price: 3456.78, change: 3.12, region: 'CRYPTO' },
];

const sectors = ['Todos', 'Financeiro', 'Petróleo', 'Mineração', 'Tecnologia', 'Varejo', 'Industrial', 'Crypto'];
const regions = ['Todos', 'BR', 'US', 'CRYPTO'];

export default function RadarScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { theme: themeSetting } = useSettingsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('Todos');
  const [selectedRegion, setSelectedRegion] = useState('Todos');
  
  const theme = themeSetting === 'system' 
    ? (colorScheme === 'dark' ? 'dark' : 'light')
    : themeSetting;
  
  const colors = themes[theme];

  // Filter assets
  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'Todos' || asset.sector === selectedSector;
    const matchesRegion = selectedRegion === 'Todos' || asset.region === selectedRegion;
    return matchesSearch && matchesSector && matchesRegion;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchInput: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      paddingLeft: 40,
      color: colors.text,
      fontSize: 16,
    },
    searchIcon: {
      position: 'absolute',
      left: 28,
      top: 28,
    },
    filtersContainer: {
      padding: 16,
      paddingTop: 8,
    },
    filterLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
      fontWeight: '600',
    },
    filterScroll: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    filterChipTextActive: {
      color: '#fff',
      fontWeight: '600',
    },
    assetCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 12,
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
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    assetName: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    assetSector: {
      fontSize: 11,
      color: colors.primary,
      marginTop: 4,
    },
    assetPriceContainer: {
      alignItems: 'flex-end',
    },
    assetPrice: {
      fontSize: 16,
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
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    regionBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: 8,
    },
    regionBR: {
      backgroundColor: '#22c55e20',
    },
    regionUS: {
      backgroundColor: '#3b82f620',
    },
    regionCRYPTO: {
      backgroundColor: '#f59e0b20',
    },
    regionText: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    regionTextBR: {
      color: '#22c55e',
    },
    regionTextUS: {
      color: '#3b82f6',
    },
    regionTextCRYPTO: {
      color: '#f59e0b',
    },
  });

  const renderAsset = ({ item }: { item: typeof mockAssets[0] }) => (
    <TouchableOpacity 
      style={styles.assetCard}
      onPress={() => router.push(`/asset/${item.ticker}`)}
    >
      <View style={styles.assetInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.assetTicker}>{item.ticker}</Text>
          <View style={[
            styles.regionBadge,
            item.region === 'BR' ? styles.regionBR : 
            item.region === 'US' ? styles.regionUS : styles.regionCRYPTO
          ]}>
            <Text style={[
              styles.regionText,
              item.region === 'BR' ? styles.regionTextBR :
              item.region === 'US' ? styles.regionTextUS : styles.regionTextCRYPTO
            ]}>
              {item.region}
            </Text>
          </View>
        </View>
        <Text style={styles.assetName}>{item.name}</Text>
        <Text style={styles.assetSector}>{item.sector}</Text>
      </View>
      <View style={styles.assetPriceContainer}>
        <Text style={styles.assetPrice}>
          {item.region === 'CRYPTO' ? '$' : item.region === 'US' ? '$' : 'R$ '}
          {item.price.toLocaleString(item.region === 'BR' ? 'pt-BR' : 'en-US', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
        </Text>
        <Text style={[styles.assetChange, item.change >= 0 ? styles.positive : styles.negative]}>
          {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color={colors.textSecondary} 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por ticker ou nome..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>REGIÃO</Text>
        <View style={styles.filterScroll}>
          {regions.map(region => (
            <TouchableOpacity
              key={region}
              style={[
                styles.filterChip,
                selectedRegion === region && styles.filterChipActive
              ]}
              onPress={() => setSelectedRegion(region)}
            >
              <Text style={[
                styles.filterChipText,
                selectedRegion === region && styles.filterChipTextActive
              ]}>
                {region === 'Todos' ? 'Todos' : region}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.filterLabel}>SETOR</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={sectors}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedSector === item && styles.filterChipActive,
                { marginRight: 8 }
              ]}
              onPress={() => setSelectedSector(item)}
            >
              <Text style={[
                styles.filterChipText,
                selectedSector === item && styles.filterChipTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Assets List */}
      <FlatList
        data={filteredAssets}
        keyExtractor={(item) => item.ticker}
        renderItem={renderAsset}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              Nenhum ativo encontrado com os filtros selecionados
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
