/**
 * F-Insight Mobile - Biometric Authentication Service
 * Handles Face ID, Touch ID, and Fingerprint authentication
 */

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform, Alert } from 'react-native';

// Secure storage keys
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';
const PIN_CODE_KEY = 'pin_code';
const LAST_AUTH_TIME_KEY = 'last_auth_time';

// Auth timeout (5 minutes)
const AUTH_TIMEOUT = 5 * 60 * 1000;

// Biometric types
export type BiometricType = 'fingerprint' | 'facial' | 'iris' | 'none';

export interface BiometricStatus {
  isAvailable: boolean;
  isEnrolled: boolean;
  biometricType: BiometricType;
  securityLevel: 'none' | 'weak' | 'strong';
}

export interface AuthResult {
  success: boolean;
  error?: string;
  method?: 'biometric' | 'pin' | 'password';
}

/**
 * Check if biometric authentication is available on the device
 */
export async function checkBiometricAvailability(): Promise<BiometricStatus> {
  try {
    // Check if hardware is available
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    
    if (!hasHardware) {
      return {
        isAvailable: false,
        isEnrolled: false,
        biometricType: 'none',
        securityLevel: 'none',
      };
    }
    
    // Check if biometrics are enrolled
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    // Get supported authentication types
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    // Determine biometric type
    let biometricType: BiometricType = 'none';
    let securityLevel: 'none' | 'weak' | 'strong' = 'none';
    
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      biometricType = 'facial';
      securityLevel = 'strong';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      biometricType = 'fingerprint';
      securityLevel = 'strong';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      biometricType = 'iris';
      securityLevel = 'strong';
    }
    
    return {
      isAvailable: hasHardware,
      isEnrolled,
      biometricType,
      securityLevel,
    };
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return {
      isAvailable: false,
      isEnrolled: false,
      biometricType: 'none',
      securityLevel: 'none',
    };
  }
}

/**
 * Get human-readable biometric type name
 */
export function getBiometricTypeName(type: BiometricType): string {
  switch (type) {
    case 'facial':
      return Platform.OS === 'ios' ? 'Face ID' : 'Reconhecimento Facial';
    case 'fingerprint':
      return Platform.OS === 'ios' ? 'Touch ID' : 'Impressão Digital';
    case 'iris':
      return 'Reconhecimento de Íris';
    default:
      return 'Biometria';
  }
}

/**
 * Authenticate using biometrics
 */
export async function authenticateWithBiometrics(
  promptMessage?: string
): Promise<AuthResult> {
  try {
    const status = await checkBiometricAvailability();
    
    if (!status.isAvailable || !status.isEnrolled) {
      return {
        success: false,
        error: 'Biometria não disponível ou não configurada',
      };
    }
    
    const biometricName = getBiometricTypeName(status.biometricType);
    
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: promptMessage || `Autentique com ${biometricName}`,
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar PIN',
      disableDeviceFallback: false,
    });
    
    if (result.success) {
      await updateLastAuthTime();
      return {
        success: true,
        method: 'biometric',
      };
    }
    
    // Handle different error types
    if (result.error === 'user_cancel') {
      return {
        success: false,
        error: 'Autenticação cancelada',
      };
    }
    
    if (result.error === 'user_fallback') {
      return {
        success: false,
        error: 'fallback_requested',
      };
    }
    
    if (result.error === 'lockout') {
      return {
        success: false,
        error: 'Muitas tentativas. Tente novamente mais tarde.',
      };
    }
    
    return {
      success: false,
      error: 'Falha na autenticação biométrica',
    };
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return {
      success: false,
      error: 'Erro ao autenticar',
    };
  }
}

/**
 * Check if biometric authentication is enabled for the app
 */
export async function isBiometricEnabled(): Promise<boolean> {
  try {
    const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking biometric enabled status:', error);
    return false;
  }
}

/**
 * Enable biometric authentication
 */
export async function enableBiometricAuth(credentials: {
  userId: string;
  token: string;
}): Promise<boolean> {
  try {
    // First, verify biometrics work
    const authResult = await authenticateWithBiometrics(
      'Confirme sua identidade para ativar a biometria'
    );
    
    if (!authResult.success) {
      return false;
    }
    
    // Store credentials securely
    await SecureStore.setItemAsync(
      BIOMETRIC_CREDENTIALS_KEY,
      JSON.stringify(credentials)
    );
    
    // Mark biometric as enabled
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
    
    return true;
  } catch (error) {
    console.error('Error enabling biometric auth:', error);
    return false;
  }
}

/**
 * Disable biometric authentication
 */
export async function disableBiometricAuth(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
    await SecureStore.deleteItemAsync(BIOMETRIC_CREDENTIALS_KEY);
    return true;
  } catch (error) {
    console.error('Error disabling biometric auth:', error);
    return false;
  }
}

/**
 * Get stored credentials after biometric auth
 */
export async function getStoredCredentials(): Promise<{
  userId: string;
  token: string;
} | null> {
  try {
    const credentials = await SecureStore.getItemAsync(BIOMETRIC_CREDENTIALS_KEY);
    if (credentials) {
      return JSON.parse(credentials);
    }
    return null;
  } catch (error) {
    console.error('Error getting stored credentials:', error);
    return null;
  }
}

/**
 * Login with biometrics
 */
export async function loginWithBiometrics(): Promise<{
  success: boolean;
  credentials?: { userId: string; token: string };
  error?: string;
}> {
  try {
    // Check if biometric is enabled
    const enabled = await isBiometricEnabled();
    if (!enabled) {
      return {
        success: false,
        error: 'Biometria não está ativada',
      };
    }
    
    // Authenticate
    const authResult = await authenticateWithBiometrics('Entre com biometria');
    
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error,
      };
    }
    
    // Get stored credentials
    const credentials = await getStoredCredentials();
    
    if (!credentials) {
      return {
        success: false,
        error: 'Credenciais não encontradas',
      };
    }
    
    return {
      success: true,
      credentials,
    };
  } catch (error) {
    console.error('Error logging in with biometrics:', error);
    return {
      success: false,
      error: 'Erro ao fazer login',
    };
  }
}

/**
 * Set PIN code as fallback
 */
export async function setPinCode(pin: string): Promise<boolean> {
  try {
    if (pin.length < 4 || pin.length > 6) {
      throw new Error('PIN deve ter entre 4 e 6 dígitos');
    }
    
    // Hash the PIN (in production, use a proper hashing algorithm)
    const hashedPin = await hashPin(pin);
    await SecureStore.setItemAsync(PIN_CODE_KEY, hashedPin);
    
    return true;
  } catch (error) {
    console.error('Error setting PIN code:', error);
    return false;
  }
}

/**
 * Verify PIN code
 */
export async function verifyPinCode(pin: string): Promise<AuthResult> {
  try {
    const storedPin = await SecureStore.getItemAsync(PIN_CODE_KEY);
    
    if (!storedPin) {
      return {
        success: false,
        error: 'PIN não configurado',
      };
    }
    
    const hashedPin = await hashPin(pin);
    
    if (hashedPin === storedPin) {
      await updateLastAuthTime();
      return {
        success: true,
        method: 'pin',
      };
    }
    
    return {
      success: false,
      error: 'PIN incorreto',
    };
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return {
      success: false,
      error: 'Erro ao verificar PIN',
    };
  }
}

/**
 * Check if PIN is set
 */
export async function isPinSet(): Promise<boolean> {
  try {
    const pin = await SecureStore.getItemAsync(PIN_CODE_KEY);
    return !!pin;
  } catch (error) {
    return false;
  }
}

/**
 * Remove PIN code
 */
export async function removePinCode(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(PIN_CODE_KEY);
    return true;
  } catch (error) {
    console.error('Error removing PIN code:', error);
    return false;
  }
}

/**
 * Update last authentication time
 */
async function updateLastAuthTime(): Promise<void> {
  try {
    await SecureStore.setItemAsync(LAST_AUTH_TIME_KEY, String(Date.now()));
  } catch (error) {
    console.error('Error updating last auth time:', error);
  }
}

/**
 * Check if authentication is still valid (within timeout)
 */
export async function isAuthValid(): Promise<boolean> {
  try {
    const lastAuthTime = await SecureStore.getItemAsync(LAST_AUTH_TIME_KEY);
    
    if (!lastAuthTime) {
      return false;
    }
    
    const elapsed = Date.now() - parseInt(lastAuthTime, 10);
    return elapsed < AUTH_TIMEOUT;
  } catch (error) {
    return false;
  }
}

/**
 * Clear authentication session
 */
export async function clearAuthSession(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(LAST_AUTH_TIME_KEY);
  } catch (error) {
    console.error('Error clearing auth session:', error);
  }
}

/**
 * Simple hash function for PIN (use bcrypt or similar in production)
 */
async function hashPin(pin: string): Promise<string> {
  // Simple hash for demo - in production, use a proper hashing library
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `pin_${Math.abs(hash).toString(16)}`;
}

/**
 * Show biometric prompt with fallback options
 */
export async function authenticateUser(): Promise<AuthResult> {
  const biometricEnabled = await isBiometricEnabled();
  const pinSet = await isPinSet();
  
  // Check if auth is still valid
  const authValid = await isAuthValid();
  if (authValid) {
    return { success: true };
  }
  
  // Try biometric first if enabled
  if (biometricEnabled) {
    const result = await authenticateWithBiometrics();
    
    if (result.success) {
      return result;
    }
    
    // If user requested fallback and PIN is set
    if (result.error === 'fallback_requested' && pinSet) {
      return { success: false, error: 'pin_required' };
    }
  }
  
  // If only PIN is set
  if (pinSet) {
    return { success: false, error: 'pin_required' };
  }
  
  // No authentication method configured
  return { success: false, error: 'no_auth_configured' };
}

export default {
  checkBiometricAvailability,
  getBiometricTypeName,
  authenticateWithBiometrics,
  isBiometricEnabled,
  enableBiometricAuth,
  disableBiometricAuth,
  getStoredCredentials,
  loginWithBiometrics,
  setPinCode,
  verifyPinCode,
  isPinSet,
  removePinCode,
  isAuthValid,
  clearAuthSession,
  authenticateUser,
};
