/**
 * F-Insight Mobile - Root Layout
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSettingsStore } from '@/lib/store';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// Theme colors
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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme: themeSetting } = useSettingsStore();
  
  const theme = themeSetting === 'system' 
    ? (colorScheme === 'dark' ? 'dark' : 'light')
    : themeSetting;
  
  const colors = themes[theme];

  useEffect(() => {
    // Hide splash screen after app is ready
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="asset/[ticker]" 
          options={{ 
            title: 'Detalhes do Ativo',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="search" 
          options={{ 
            title: 'Buscar',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Configurações',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Entrar',
            presentation: 'modal',
            headerShown: false,
          }} 
        />
      </Stack>
    </QueryClientProvider>
  );
}

async function registerForPushNotifications() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return;
    }
    
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'finsight-mobile',
    });
    
    console.log('Push token:', token.data);
    
    // TODO: Send token to backend
  } catch (error) {
    console.error('Error registering for push notifications:', error);
  }
}
