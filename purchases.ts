/**
 * F-Insight Mobile - In-App Purchases Service
 * Handles subscriptions using RevenueCat
 */

import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesOffering,
  PurchasesEntitlementInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import Constants from 'expo-constants';

// RevenueCat API Keys (from app.config.js)
const REVENUECAT_API_KEY_IOS = Constants.expoConfig?.extra?.revenueCatApiKeyIOS || '';
const REVENUECAT_API_KEY_ANDROID = Constants.expoConfig?.extra?.revenueCatApiKeyAndroid || '';

// Entitlement identifiers
export const ENTITLEMENTS = {
  PREMIUM: 'premium',
  PRO: 'pro',
} as const;

// Product identifiers
export const PRODUCTS = {
  PREMIUM_MONTHLY: 'finsight_premium_monthly',
  PREMIUM_YEARLY: 'finsight_premium_yearly',
  PRO_MONTHLY: 'finsight_pro_monthly',
  PRO_YEARLY: 'finsight_pro_yearly',
} as const;

// Subscription plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  pricePerMonth: string;
  period: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  savings?: string;
}

// Customer subscription status
export interface SubscriptionStatus {
  isActive: boolean;
  isPremium: boolean;
  isPro: boolean;
  expirationDate: Date | null;
  willRenew: boolean;
  productId: string | null;
}

let isInitialized = false;

/**
 * Initialize RevenueCat SDK
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (isInitialized) {
    return;
  }

  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

    if (!apiKey) {
      console.warn('RevenueCat API key not configured');
      return;
    }

    // Configure RevenueCat
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    
    if (userId) {
      await Purchases.configure({ apiKey, appUserID: userId });
    } else {
      await Purchases.configure({ apiKey });
    }

    isInitialized = true;
    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('Error initializing RevenueCat:', error);
  }
}

/**
 * Login user to RevenueCat
 */
export async function loginUser(userId: string): Promise<CustomerInfo | null> {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    return customerInfo;
  } catch (error) {
    console.error('Error logging in to RevenueCat:', error);
    return null;
  }
}

/**
 * Logout user from RevenueCat
 */
export async function logoutUser(): Promise<void> {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('Error logging out from RevenueCat:', error);
  }
}

/**
 * Get available offerings (subscription packages)
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('Error getting offerings:', error);
    return null;
  }
}

/**
 * Get all available packages
 */
export async function getPackages(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages || [];
  } catch (error) {
    console.error('Error getting packages:', error);
    return [];
  }
}

/**
 * Purchase a package
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    
    // Check if purchase was successful
    const isPremium = customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM] !== undefined;
    const isPro = customerInfo.entitlements.active[ENTITLEMENTS.PRO] !== undefined;
    
    if (isPremium || isPro) {
      return { success: true, customerInfo };
    }
    
    return { success: false, error: 'Compra não processada' };
  } catch (error: any) {
    // Handle user cancellation
    if (error.userCancelled) {
      return { success: false, error: 'Compra cancelada' };
    }
    
    console.error('Error purchasing package:', error);
    return { success: false, error: error.message || 'Erro ao processar compra' };
  }
}

/**
 * Restore purchases
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    
    const hasActiveSubscription = Object.keys(customerInfo.entitlements.active).length > 0;
    
    if (hasActiveSubscription) {
      return { success: true, customerInfo };
    }
    
    return { success: false, error: 'Nenhuma assinatura encontrada' };
  } catch (error: any) {
    console.error('Error restoring purchases:', error);
    return { success: false, error: error.message || 'Erro ao restaurar compras' };
  }
}

/**
 * Get current customer info
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('Error getting customer info:', error);
    return null;
  }
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    
    const premiumEntitlement = customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];
    const proEntitlement = customerInfo.entitlements.active[ENTITLEMENTS.PRO];
    
    const activeEntitlement = proEntitlement || premiumEntitlement;
    
    return {
      isActive: !!activeEntitlement,
      isPremium: !!premiumEntitlement,
      isPro: !!proEntitlement,
      expirationDate: activeEntitlement?.expirationDate 
        ? new Date(activeEntitlement.expirationDate) 
        : null,
      willRenew: activeEntitlement?.willRenew || false,
      productId: activeEntitlement?.productIdentifier || null,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      isActive: false,
      isPremium: false,
      isPro: false,
      expirationDate: null,
      willRenew: false,
      productId: null,
    };
  }
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const status = await getSubscriptionStatus();
  return status.isActive;
}

/**
 * Check if user has specific entitlement
 */
export async function hasEntitlement(entitlementId: string): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[entitlementId] !== undefined;
  } catch (error) {
    console.error('Error checking entitlement:', error);
    return false;
  }
}

/**
 * Get subscription plans with pricing
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const offerings = await Purchases.getOfferings();
    const packages = offerings.current?.availablePackages || [];
    
    const plans: SubscriptionPlan[] = [];
    
    for (const pkg of packages) {
      const product = pkg.product;
      const isYearly = pkg.packageType === 'ANNUAL';
      const isPro = product.identifier.includes('pro');
      
      const monthlyPrice = isYearly 
        ? (product.price / 12).toFixed(2) 
        : product.price.toFixed(2);
      
      plans.push({
        id: product.identifier,
        name: isPro ? 'Pro' : 'Premium',
        description: isPro 
          ? 'Acesso completo a todos os recursos'
          : 'Recursos avançados para investidores',
        price: product.priceString,
        pricePerMonth: `R$ ${monthlyPrice}/mês`,
        period: isYearly ? 'yearly' : 'monthly',
        features: isPro 
          ? [
              'Alertas ilimitados',
              'Backtesting avançado',
              'Copy trading',
              'Relatórios PDF',
              'Suporte prioritário',
              'Sem anúncios',
            ]
          : [
              'Alertas ilimitados',
              'Backtesting básico',
              'Watchlist expandida',
              'Sem anúncios',
            ],
        popular: isYearly && isPro,
        savings: isYearly ? '2 meses grátis' : undefined,
      });
    }
    
    return plans;
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    return [];
  }
}

/**
 * Add listener for customer info updates
 */
export function addCustomerInfoUpdateListener(
  listener: (customerInfo: CustomerInfo) => void
): () => void {
  Purchases.addCustomerInfoUpdateListener(listener);
  
  // Return cleanup function
  return () => {
    Purchases.removeCustomerInfoUpdateListener(listener);
  };
}

/**
 * Sync purchases with backend
 */
export async function syncWithBackend(apiUrl: string, token: string): Promise<void> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const status = await getSubscriptionStatus();
    
    // Send subscription status to backend
    await fetch(`${apiUrl}/trpc/subscription.sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        revenueCatId: customerInfo.originalAppUserId,
        isActive: status.isActive,
        isPremium: status.isPremium,
        isPro: status.isPro,
        expirationDate: status.expirationDate?.toISOString(),
        productId: status.productId,
      }),
    });
  } catch (error) {
    console.error('Error syncing with backend:', error);
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Get trial info if available
 */
export async function getTrialInfo(): Promise<{
  hasTrialAvailable: boolean;
  trialDays: number;
} | null> {
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    
    if (pkg?.product.introPrice) {
      return {
        hasTrialAvailable: true,
        trialDays: pkg.product.introPrice.periodNumberOfUnits,
      };
    }
    
    return { hasTrialAvailable: false, trialDays: 0 };
  } catch (error) {
    console.error('Error getting trial info:', error);
    return null;
  }
}

export default {
  initializePurchases,
  loginUser,
  logoutUser,
  getOfferings,
  getPackages,
  purchasePackage,
  restorePurchases,
  getCustomerInfo,
  getSubscriptionStatus,
  hasActiveSubscription,
  hasEntitlement,
  getSubscriptionPlans,
  addCustomerInfoUpdateListener,
  syncWithBackend,
  formatPrice,
  getTrialInfo,
  ENTITLEMENTS,
  PRODUCTS,
};
