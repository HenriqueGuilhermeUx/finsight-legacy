import { useState, useEffect, useCallback } from 'react';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission | 'default';
  subscription: PushSubscription | null;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    permission: 'default',
    subscription: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    
    if (isSupported) {
      setState(prev => ({
        ...prev,
        isSupported: true,
        permission: Notification.permission,
      }));

      // Check existing subscription
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      setState(prev => ({
        ...prev,
        isSubscribed: !!subscription,
        subscription,
      }));
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  };

  const subscribe = useCallback(async () => {
    if (!state.isSupported) {
      throw new Error('Push notifications not supported');
    }

    setIsLoading(true);

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      setState(prev => ({ ...prev, permission }));

      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Register service worker
      await registerServiceWorker();
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push - using a placeholder VAPID key
      const vapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription,
      }));

      // Send subscription to server
      await saveSubscription(subscription);

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [state.isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!state.subscription) return;

    setIsLoading(true);

    try {
      await state.subscription.unsubscribe();
      
      setState(prev => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
      }));

      // Remove subscription from server
      await removeSubscription();
    } catch (error) {
      console.error('Error unsubscribing:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [state.subscription]);

  const sendTestNotification = useCallback(async () => {
    if (!state.isSubscribed) {
      throw new Error('Not subscribed to push notifications');
    }

    // Show a local notification for testing
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification('F-Insight', {
      body: 'Notificações push estão funcionando! 🎉',
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'test-notification',
    } as NotificationOptions);
  }, [state.isSubscribed]);

  return {
    ...state,
    isLoading,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Save subscription to server
async function saveSubscription(subscription: PushSubscription) {
  try {
    // In a real app, send this to your server
    localStorage.setItem('pushSubscription', JSON.stringify(subscription.toJSON()));
    console.log('Subscription saved:', subscription);
  } catch (error) {
    console.error('Error saving subscription:', error);
  }
}

// Remove subscription from server
async function removeSubscription() {
  try {
    localStorage.removeItem('pushSubscription');
    console.log('Subscription removed');
  } catch (error) {
    console.error('Error removing subscription:', error);
  }
}

export default usePushNotifications;
