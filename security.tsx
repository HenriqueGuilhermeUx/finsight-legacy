/**
 * F-Insight Mobile - Security Settings Screen
 * Configure biometric authentication and PIN
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore, useAuthStore } from '@/lib/store';
import biometrics, {
  BiometricStatus,
  checkBiometricAvailability,
  getBiometricTypeName,
  isBiometricEnabled,
  enableBiometricAuth,
  disableBiometricAuth,
  isPinSet,
  setPinCode,
  removePinCode,
} from '@/lib/biometrics';

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

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { theme: themeSetting } = useSettingsStore();
  const { user } = useAuthStore();
  
  const [biometricStatus, setBiometricStatus] = useState<BiometricStatus | null>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinStep, setPinStep] = useState<'enter' | 'confirm'>('enter');
  const [loading, setLoading] = useState(true);
  
  const theme = themeSetting === 'system' 
    ? (colorScheme === 'dark' ? 'dark' : 'light')
    : themeSetting;
  
  const colors = themes[theme];

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    setLoading(true);
    try {
      const status = await checkBiometricAvailability();
      setBiometricStatus(status);
      
      const bioEnabled = await isBiometricEnabled();
      setBiometricEnabled(bioEnabled);
      
      const pinSet = await isPinSet();
      setPinEnabled(pinSet);
    } catch (error) {
      console.error('Error loading security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      // Enable biometric
      if (!biometricStatus?.isEnrolled) {
        Alert.alert(
          'Biometria não configurada',
          'Configure a biometria nas configurações do seu dispositivo primeiro.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      if (!user) {
        Alert.alert('Erro', 'Você precisa estar logado para ativar a biometria.');
        return;
      }
      
      const success = await enableBiometricAuth({
        userId: user.id,
        token: 'user_token', // In production, get actual token
      });
      
      if (success) {
        setBiometricEnabled(true);
        Alert.alert('Sucesso', 'Biometria ativada com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível ativar a biometria.');
      }
    } else {
      // Disable biometric
      Alert.alert(
        'Desativar Biometria',
        'Tem certeza que deseja desativar a autenticação biométrica?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desativar',
            style: 'destructive',
            onPress: async () => {
              const success = await disableBiometricAuth();
              if (success) {
                setBiometricEnabled(false);
              }
            },
          },
        ]
      );
    }
  };

  const handlePinToggle = async (value: boolean) => {
    if (value) {
      // Show PIN setup modal
      setPin('');
      setConfirmPin('');
      setPinStep('enter');
      setShowPinModal(true);
    } else {
      // Disable PIN
      Alert.alert(
        'Desativar PIN',
        'Tem certeza que deseja remover o PIN?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: async () => {
              const success = await removePinCode();
              if (success) {
                setPinEnabled(false);
              }
            },
          },
        ]
      );
    }
  };

  const handlePinSubmit = async () => {
    if (pinStep === 'enter') {
      if (pin.length < 4) {
        Alert.alert('Erro', 'O PIN deve ter pelo menos 4 dígitos.');
        return;
      }
      setPinStep('confirm');
    } else {
      if (pin !== confirmPin) {
        Alert.alert('Erro', 'Os PINs não coincidem. Tente novamente.');
        setPin('');
        setConfirmPin('');
        setPinStep('enter');
        return;
      }
      
      const success = await setPinCode(pin);
      if (success) {
        setPinEnabled(true);
        setShowPinModal(false);
        Alert.alert('Sucesso', 'PIN configurado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível configurar o PIN.');
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingTop: 60,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 12,
      textTransform: 'uppercase',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingRowLast: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    settingDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    unavailableText: {
      fontSize: 12,
      color: colors.danger,
      marginTop: 4,
    },
    infoCard: {
      backgroundColor: colors.primary + '10',
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    infoText: {
      flex: 1,
      marginLeft: 12,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    // PIN Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: '85%',
      maxWidth: 320,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    pinInput: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      letterSpacing: 8,
      marginBottom: 24,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.border,
    },
    confirmButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: colors.text,
    },
    confirmButtonText: {
      color: '#fff',
    },
  });

  const biometricName = biometricStatus 
    ? getBiometricTypeName(biometricStatus.biometricType)
    : 'Biometria';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Segurança</Text>
      </View>

      {/* Biometric Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Autenticação Biométrica</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons 
                name={biometricStatus?.biometricType === 'facial' ? 'scan' : 'finger-print'} 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{biometricName}</Text>
              <Text style={styles.settingDescription}>
                Use {biometricName} para fazer login
              </Text>
              {biometricStatus && !biometricStatus.isAvailable && (
                <Text style={styles.unavailableText}>
                  Não disponível neste dispositivo
                </Text>
              )}
              {biometricStatus?.isAvailable && !biometricStatus.isEnrolled && (
                <Text style={styles.unavailableText}>
                  Configure nas configurações do dispositivo
                </Text>
              )}
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: colors.border, true: colors.primary + '50' }}
              thumbColor={biometricEnabled ? colors.primary : colors.textSecondary}
              disabled={!biometricStatus?.isAvailable || !biometricStatus?.isEnrolled}
            />
          </View>
        </View>
      </View>

      {/* PIN Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PIN de Segurança</Text>
        <View style={styles.card}>
          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={styles.settingIcon}>
              <Ionicons name="keypad" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>PIN de 4-6 dígitos</Text>
              <Text style={styles.settingDescription}>
                Use como alternativa à biometria
              </Text>
            </View>
            <Switch
              value={pinEnabled}
              onValueChange={handlePinToggle}
              trackColor={{ false: colors.border, true: colors.primary + '50' }}
              thumbColor={pinEnabled ? colors.primary : colors.textSecondary}
            />
          </View>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.section}>
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            Suas credenciais são armazenadas de forma segura no dispositivo usando criptografia de hardware. 
            Nunca compartilhamos seus dados de autenticação.
          </Text>
        </View>
      </View>

      {/* PIN Setup Modal */}
      <Modal
        visible={showPinModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {pinStep === 'enter' ? 'Criar PIN' : 'Confirmar PIN'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {pinStep === 'enter' 
                ? 'Digite um PIN de 4-6 dígitos'
                : 'Digite o PIN novamente para confirmar'
              }
            </Text>
            
            <TextInput
              style={styles.pinInput}
              value={pinStep === 'enter' ? pin : confirmPin}
              onChangeText={pinStep === 'enter' ? setPin : setConfirmPin}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              placeholder="••••"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPinModal(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handlePinSubmit}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  {pinStep === 'enter' ? 'Próximo' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
