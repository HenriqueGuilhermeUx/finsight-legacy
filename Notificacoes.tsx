import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  BellRing, 
  BellOff, 
  Smartphone, 
  Mail, 
  TrendingUp, 
  TrendingDown,
  Trophy,
  MessageSquare,
  Copy,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Volume2,
  Zap,
  LogIn
} from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  push: boolean;
  email: boolean;
  category: 'trading' | 'social' | 'system';
}

export default function Notificacoes() {
  const { user } = useAuth() as any;
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);

  // tRPC queries and mutations
  const { data: isSubscribed, refetch: refetchSubscription } = trpc.push.isSubscribed.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: dbPreferences, refetch: refetchPreferences } = trpc.push.getPreferences.useQuery(
    undefined,
    { enabled: !!user }
  );

  const subscribe = trpc.push.subscribe.useMutation({
    onSuccess: () => refetchSubscription(),
  });

  const unsubscribe = trpc.push.unsubscribe.useMutation({
    onSuccess: () => refetchSubscription(),
  });

  const updateDbPreferences = trpc.push.updatePreferences.useMutation({
    onSuccess: () => refetchPreferences(),
  });
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'price_alert',
      label: 'Alertas de Preço',
      description: 'Quando um ativo atingir o preço definido',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      push: true,
      email: true,
      category: 'trading'
    },
    {
      id: 'stop_loss',
      label: 'Stop Loss Atingido',
      description: 'Quando um stop loss for acionado',
      icon: <TrendingDown className="h-5 w-5 text-red-500" />,
      push: true,
      email: true,
      category: 'trading'
    },
    {
      id: 'rsi_alert',
      label: 'Alertas de RSI',
      description: 'Quando RSI entrar em zona de sobrecompra/sobrevenda',
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      push: true,
      email: false,
      category: 'trading'
    },
    {
      id: 'earnings',
      label: 'Resultados Trimestrais',
      description: 'Quando uma empresa da watchlist divulgar resultados',
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      push: true,
      email: true,
      category: 'trading'
    },
    {
      id: 'dividends',
      label: 'Dividendos',
      description: 'Datas ex-dividendo e pagamentos',
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
      push: true,
      email: true,
      category: 'trading'
    },
    {
      id: 'copy_trade',
      label: 'Copy Trading',
      description: 'Quando uma operação for copiada automaticamente',
      icon: <Copy className="h-5 w-5 text-purple-500" />,
      push: true,
      email: false,
      category: 'trading'
    },
    {
      id: 'new_follower',
      label: 'Novo Seguidor',
      description: 'Quando alguém começar a seguir seu portfólio',
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      push: true,
      email: false,
      category: 'social'
    },
    {
      id: 'new_message',
      label: 'Novas Mensagens',
      description: 'Quando receber uma mensagem no chat',
      icon: <MessageSquare className="h-5 w-5 text-cyan-500" />,
      push: true,
      email: false,
      category: 'social'
    },
    {
      id: 'achievement',
      label: 'Conquistas',
      description: 'Quando desbloquear uma nova conquista',
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      push: true,
      email: false,
      category: 'social'
    },
    {
      id: 'leaderboard',
      label: 'Ranking',
      description: 'Mudanças na sua posição no leaderboard',
      icon: <Trophy className="h-5 w-5 text-orange-500" />,
      push: false,
      email: false,
      category: 'social'
    },
    {
      id: 'system_update',
      label: 'Atualizações do Sistema',
      description: 'Novos recursos e melhorias na plataforma',
      icon: <Settings className="h-5 w-5 text-gray-500" />,
      push: false,
      email: true,
      category: 'system'
    },
    {
      id: 'security',
      label: 'Segurança',
      description: 'Alertas de login e atividades suspeitas',
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      push: true,
      email: true,
      category: 'system'
    },
  ]);

  useEffect(() => {
    // Check if push notifications are supported
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
      
      // Check if already subscribed
      if (Notification.permission === 'granted') {
        checkSubscription();
      }
    }
  }, []);

  const checkSubscription = async () => {
    // Subscription is now checked via tRPC
  };

  const requestPermission = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Request permission
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Create subscription in database
        const mockSubscription = {
          endpoint: `https://push.finsight.com/${user.id}/${Date.now()}`,
          p256dh: btoa(Array.from(crypto.getRandomValues(new Uint8Array(65))).map(b => String.fromCharCode(b)).join('')),
          auth: btoa(Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => String.fromCharCode(b)).join('')),
          userAgent: navigator.userAgent,
        };
        
        await subscribe.mutateAsync(mockSubscription);
        
        // Show test notification
        new Notification('F-Insight', {
          body: 'Notificações push ativadas com sucesso! 🎉',
          icon: '/favicon.ico',
        });
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('F-Insight - Teste', {
        body: 'Esta é uma notificação de teste! Tudo funcionando perfeitamente.',
        icon: '/favicon.png',
        tag: 'test-notification',
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  const togglePreference = (id: string, type: 'push' | 'email') => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { ...pref, [type]: !pref[type] } : pref
    ));
  };

  const getPreferencesByCategory = (category: 'trading' | 'social' | 'system') => {
    return preferences.filter(p => p.category === category);
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Notificações</h1>
            <p className="text-muted-foreground">Gerencie suas preferências de notificação</p>
          </div>
        </div>

        {/* Status Card */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Status das Notificações Push
            </CardTitle>
            <CardDescription>
              Receba alertas em tempo real diretamente no seu dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSupported ? (
              <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-yellow-500">Não Suportado</p>
                  <p className="text-sm text-muted-foreground">
                    Seu navegador não suporta notificações push. Tente usar Chrome, Firefox ou Edge.
                  </p>
                </div>
              </div>
            ) : permission === 'denied' ? (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <BellOff className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-500">Bloqueado</p>
                  <p className="text-sm text-muted-foreground">
                    Você bloqueou as notificações. Para ativar, acesse as configurações do navegador.
                  </p>
                </div>
              </div>
            ) : permission === 'granted' && isSubscribed ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-green-500">Ativado</p>
                    <p className="text-sm text-muted-foreground">
                      Você receberá notificações push neste dispositivo
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={sendTestNotification}>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Testar
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <BellRing className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Desativado</p>
                    <p className="text-sm text-muted-foreground">
                      Ative para receber alertas em tempo real
                    </p>
                  </div>
                </div>
                <Button onClick={requestPermission} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Ativando...
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Ativar Notificações
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Tabs defaultValue="trading" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trading" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          {(['trading', 'social', 'system'] as const).map(category => (
            <TabsContent key={category} value={category}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">
                    Notificações de {category === 'trading' ? 'Trading' : category === 'social' ? 'Social' : 'Sistema'}
                  </CardTitle>
                  <CardDescription>
                    Configure quais notificações você deseja receber
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {getPreferencesByCategory(category).map((pref) => (
                    <div key={pref.id} className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {pref.icon}
                        </div>
                        <div>
                          <p className="font-medium">{pref.label}</p>
                          <p className="text-sm text-muted-foreground">{pref.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`${pref.id}-push`}
                            checked={pref.push}
                            onCheckedChange={() => togglePreference(pref.id, 'push')}
                            disabled={!isSubscribed}
                          />
                          <Label htmlFor={`${pref.id}-push`} className="text-sm flex items-center gap-1">
                            <Smartphone className="h-3 w-3" />
                            Push
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`${pref.id}-email`}
                            checked={pref.email}
                            onCheckedChange={() => togglePreference(pref.id, 'email')}
                          />
                          <Label htmlFor={`${pref.id}-email`} className="text-sm flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            Email
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={() => setPreferences(prev => prev.map(p => ({ ...p, push: true })))}
              disabled={!isSubscribed}
            >
              Ativar Todos Push
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setPreferences(prev => prev.map(p => ({ ...p, push: false })))}
            >
              Desativar Todos Push
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setPreferences(prev => prev.map(p => ({ ...p, email: true })))}
            >
              Ativar Todos Email
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setPreferences(prev => prev.map(p => ({ ...p, email: false })))}
            >
              Desativar Todos Email
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
