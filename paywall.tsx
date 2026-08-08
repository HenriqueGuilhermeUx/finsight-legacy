/**
 * F-Insight Mobile - Paywall Screen
 * Display subscription plans and handle purchases
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PurchasesPackage } from 'react-native-purchases';
import { useSettingsStore, useAuthStore } from '@/lib/store';
import purchases, {
  getPackages,
  purchasePackage,
  restorePurchases,
  getSubscriptionStatus,
  SubscriptionPlan,
} from '@/lib/purchases';

const themes = {
  dark: {
    background: '#0a0f1a',
    card: '#111827',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    primary: '#14b8a6',
    primaryDark: '#0d9488',
    border: '#1f2937',
    success: '#10b981',
    gold: '#f59e0b',
  },
  light: {
    background: '#f9fafb',
    card: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    primary: '#0d9488',
    primaryDark: '#0f766e',
    border: '#e5e7eb',
    success: '#10b981',
    gold: '#d97706',
  },
};

interface PlanCardProps {
  pkg: PurchasesPackage;
  isSelected: boolean;
  onSelect: () => void;
  colors: typeof themes.dark;
  isPopular?: boolean;
}

function PlanCard({ pkg, isSelected, onSelect, colors, isPopular }: PlanCardProps) {
  const product = pkg.product;
  const isYearly = pkg.packageType === 'ANNUAL';
  const monthlyPrice = isYearly 
    ? (product.price / 12).toFixed(2) 
    : product.price.toFixed(2);

  return (
    <TouchableOpacity
      style={[
        styles.planCard,
        { 
          backgroundColor: colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {isPopular && (
        <View style={[styles.popularBadge, { backgroundColor: colors.gold }]}>
          <Text style={styles.popularText}>MAIS POPULAR</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <View style={styles.planInfo}>
          <Text style={[styles.planName, { color: colors.text }]}>
            {isYearly ? 'Anual' : 'Mensal'}
          </Text>
          {isYearly && (
            <View style={[styles.savingsBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.savingsText, { color: colors.success }]}>
                2 meses grátis
              </Text>
            </View>
          )}
        </View>
        
        <View style={[
          styles.radioOuter,
          { borderColor: isSelected ? colors.primary : colors.border }
        ]}>
          {isSelected && (
            <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
          )}
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: colors.text }]}>
          {product.priceString}
        </Text>
        <Text style={[styles.period, { color: colors.textSecondary }]}>
          /{isYearly ? 'ano' : 'mês'}
        </Text>
      </View>
      
      {isYearly && (
        <Text style={[styles.monthlyEquivalent, { color: colors.textSecondary }]}>
          Equivalente a R$ {monthlyPrice}/mês
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function PaywallScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { theme: themeSetting } = useSettingsStore();
  const { user } = useAuthStore();
  
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  
  const theme = themeSetting === 'system' 
    ? (colorScheme === 'dark' ? 'dark' : 'light')
    : themeSetting;
  
  const colors = themes[theme];

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const pkgs = await getPackages();
      setPackages(pkgs);
      
      // Select yearly by default
      const yearlyPkg = pkgs.find(p => p.packageType === 'ANNUAL');
      setSelectedPackage(yearlyPkg || pkgs[0]);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    setPurchasing(true);
    try {
      const result = await purchasePackage(selectedPackage);
      
      if (result.success) {
        Alert.alert(
          'Sucesso!',
          'Sua assinatura foi ativada. Aproveite todos os recursos premium!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else if (result.error !== 'Compra cancelada') {
        Alert.alert('Erro', result.error || 'Não foi possível processar a compra.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao processar a compra.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const result = await restorePurchases();
      
      if (result.success) {
        Alert.alert(
          'Compras Restauradas',
          'Suas compras anteriores foram restauradas com sucesso!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'Nenhuma Compra Encontrada',
          'Não encontramos compras anteriores associadas à sua conta.'
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível restaurar as compras.');
    } finally {
      setRestoring(false);
    }
  };

  const features = [
    { icon: 'notifications', text: 'Alertas ilimitados' },
    { icon: 'analytics', text: 'Backtesting avançado' },
    { icon: 'people', text: 'Copy trading' },
    { icon: 'document-text', text: 'Relatórios PDF' },
    { icon: 'trophy', text: 'Torneios exclusivos' },
    { icon: 'ban', text: 'Sem anúncios' },
  ];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[colors.primary + '30', 'transparent']}
            style={styles.heroGradient}
          />
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="diamond" size={40} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            F-Insight Premium
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Desbloqueie todo o potencial dos seus investimentos
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={feature.icon as any} size={20} color={colors.primary} />
              </View>
              <Text style={[styles.featureText, { color: colors.text }]}>
                {feature.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Escolha seu plano
          </Text>
          
          {packages.map((pkg, index) => (
            <PlanCard
              key={pkg.identifier}
              pkg={pkg}
              isSelected={selectedPackage?.identifier === pkg.identifier}
              onSelect={() => setSelectedPackage(pkg)}
              colors={colors}
              isPopular={pkg.packageType === 'ANNUAL'}
            />
          ))}
        </View>

        {/* Terms */}
        <Text style={[styles.terms, { color: colors.textSecondary }]}>
          A assinatura será renovada automaticamente. Você pode cancelar a qualquer momento 
          nas configurações da sua conta na App Store ou Google Play.
        </Text>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            { backgroundColor: colors.primary },
            purchasing && { opacity: 0.7 },
          ]}
          onPress={handlePurchase}
          disabled={purchasing || !selectedPackage}
        >
          {purchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.purchaseButtonText}>Assinar Agora</Text>
              {selectedPackage && (
                <Text style={styles.purchasePrice}>
                  {selectedPackage.product.priceString}
                </Text>
              )}
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={restoring}
        >
          {restoring ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.restoreText, { color: colors.primary }]}>
              Restaurar Compras
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 32,
    position: 'relative',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  plansSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  savingsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 16,
    marginLeft: 4,
  },
  monthlyEquivalent: {
    fontSize: 13,
    marginTop: 4,
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 18,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  purchasePrice: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  restoreButton: {
    alignItems: 'center',
    padding: 12,
  },
  restoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
