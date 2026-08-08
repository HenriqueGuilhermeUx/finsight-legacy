/**
 * F-Insight Mobile - Push Notifications Service
 * Handles native push notifications for iOS and Android
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Notification types
export type NotificationType = 
  | 'price_alert'
  | 'rsi_alert'
  | 'macd_alert'
  | 'volume_alert'
  | 'earnings'
  | 'dividend'
  | 'tournament'
  | 'achievement'
  | 'copy_trade'
  | 'message';

export interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

// Store for push token
let pushToken: string | null = null;

/**
 * Register for push notifications
 * Returns the Expo push token
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Check if running on physical device
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission not granted');
    return null;
  }

  // Get Expo push token
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: projectId || 'finsight-mobile',
    });
    
    pushToken = token.data;
    console.log('Push token:', pushToken);
    
    // Register token with backend
    await registerTokenWithBackend(pushToken);
    
    return pushToken;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

/**
 * Register push token with backend
 */
async function registerTokenWithBackend(token: string): Promise<void> {
  try {
    // TODO: Implement API call to register token
    console.log('Registering token with backend:', token);
  } catch (error) {
    console.error('Error registering token with backend:', error);
  }
}

/**
 * Configure Android notification channel
 */
export async function configureAndroidChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    // Price alerts channel
    await Notifications.setNotificationChannelAsync('price-alerts', {
      name: 'Alertas de Preço',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#14b8a6',
      sound: 'default',
    });

    // Technical alerts channel
    await Notifications.setNotificationChannelAsync('technical-alerts', {
      name: 'Alertas Técnicos',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#f59e0b',
      sound: 'default',
    });

    // Events channel
    await Notifications.setNotificationChannelAsync('events', {
      name: 'Eventos',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });

    // Social channel
    await Notifications.setNotificationChannelAsync('social', {
      name: 'Social',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });

    // Tournaments channel
    await Notifications.setNotificationChannelAsync('tournaments', {
      name: 'Torneios',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#8b5cf6',
      sound: 'default',
    });
  }
}

/**
 * Get notification channel for type
 */
function getChannelForType(type: NotificationType): string {
  switch (type) {
    case 'price_alert':
    case 'volume_alert':
      return 'price-alerts';
    case 'rsi_alert':
    case 'macd_alert':
      return 'technical-alerts';
    case 'earnings':
    case 'dividend':
      return 'events';
    case 'message':
    case 'copy_trade':
      return 'social';
    case 'tournament':
    case 'achievement':
      return 'tournaments';
    default:
      return 'default';
  }
}

/**
 * Schedule a local notification
 */
export async function scheduleLocalNotification(
  notification: Omit<PushNotification, 'id' | 'timestamp'>
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: notification.data,
      sound: 'default',
    },
    trigger: null, // Immediate
  });

  return id;
}

/**
 * Schedule a notification for a specific time
 */
export async function scheduleNotificationAt(
  notification: Omit<PushNotification, 'id' | 'timestamp'>,
  date: Date
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: notification.data,
      sound: 'default',
    },
    trigger: {
      date,
    },
  });

  return id;
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Set badge count (iOS)
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Get badge count (iOS)
 */
export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}

/**
 * Add notification received listener
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add notification response listener (when user taps notification)
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Get last notification response (for deep linking)
 */
export async function getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
  return await Notifications.getLastNotificationResponseAsync();
}

/**
 * Format notification for display
 */
export function formatNotification(type: NotificationType, data: Record<string, unknown>): { title: string; body: string } {
  switch (type) {
    case 'price_alert':
      return {
        title: `🔔 Alerta de Preço - ${data.ticker}`,
        body: `${data.ticker} ${data.condition === 'above' ? 'subiu acima de' : 'caiu abaixo de'} ${data.currency}${data.value}`,
      };
    case 'rsi_alert':
      return {
        title: `📊 Alerta RSI - ${data.ticker}`,
        body: `RSI de ${data.ticker} está em ${data.value} (${data.condition === 'above' ? 'sobrecompra' : 'sobrevenda'})`,
      };
    case 'macd_alert':
      return {
        title: `📈 Alerta MACD - ${data.ticker}`,
        body: `MACD de ${data.ticker} ${data.condition === 'crosses_above' ? 'cruzou acima' : 'cruzou abaixo'} da linha de sinal`,
      };
    case 'volume_alert':
      return {
        title: `📊 Volume Anormal - ${data.ticker}`,
        body: `Volume de ${data.ticker} está ${data.multiplier}x acima da média`,
      };
    case 'earnings':
      return {
        title: `📅 Resultados - ${data.ticker}`,
        body: `${data.company} divulga resultados ${data.when}`,
      };
    case 'dividend':
      return {
        title: `💰 Dividendo - ${data.ticker}`,
        body: `${data.ticker} paga ${data.currency}${data.value} por ação em ${data.date}`,
      };
    case 'tournament':
      return {
        title: `🏆 Torneio`,
        body: String(data.message),
      };
    case 'achievement':
      return {
        title: `🎖️ Nova Conquista!`,
        body: `Você desbloqueou: ${data.badge}`,
      };
    case 'copy_trade':
      return {
        title: `📋 Copy Trading`,
        body: `${data.trader} ${data.action} ${data.quantity} ${data.ticker}`,
      };
    case 'message':
      return {
        title: `💬 Nova Mensagem`,
        body: `${data.sender}: ${data.preview}`,
      };
    default:
      return {
        title: 'F-Insight',
        body: String(data.message || 'Nova notificação'),
      };
  }
}

export default {
  registerForPushNotifications,
  configureAndroidChannel,
  scheduleLocalNotification,
  scheduleNotificationAt,
  cancelNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  setBadgeCount,
  getBadgeCount,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  getLastNotificationResponse,
  formatNotification,
};
