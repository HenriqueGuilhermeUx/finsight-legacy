import { useState } from "react";
import { Link } from "wouter";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, 
  BellOff, 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  History,
  Settings,
  Zap,
  Mail,
  Crown
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const POPULAR_TICKERS = [
  { value: "PETR4", label: "PETR4 - Petrobras" },
  { value: "VALE3", label: "VALE3 - Vale" },
  { value: "ITUB4", label: "ITUB4 - Itaú" },
  { value: "BBDC4", label: "BBDC4 - Bradesco" },
  { value: "ABEV3", label: "ABEV3 - Ambev" },
  { value: "WEGE3", label: "WEGE3 - WEG" },
  { value: "AAPL", label: "AAPL - Apple" },
  { value: "MSFT", label: "MSFT - Microsoft" },
  { value: "GOOGL", label: "GOOGL - Google" },
  { value: "AMZN", label: "AMZN - Amazon" },
  { value: "BTC", label: "BTC - Bitcoin" },
  { value: "ETH", label: "ETH - Ethereum" },
];

function getSignalDisplay(signal: string) {
  switch (signal) {
    case 'strong_buy':
      return { text: 'Compra Forte', className: 'bg-emerald-500 text-white', icon: TrendingUp };
    case 'buy':
      return { text: 'Compra', className: 'bg-emerald-500/70 text-white', icon: TrendingUp };
    case 'strong_sell':
      return { text: 'Venda Forte', className: 'bg-red-500 text-white', icon: TrendingDown };
    case 'sell':
      return { text: 'Venda', className: 'bg-red-500/70 text-white', icon: TrendingDown };
    default:
      return { text: 'Neutro', className: 'bg-slate-500 text-white', icon: Activity };
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function MeusAlertas() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"alerts" | "history">("alerts");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAlertTicker, setNewAlertTicker] = useState("");
  const [newAlertTargetSignal, setNewAlertTargetSignal] = useState("strong_buy");
  const [customTicker, setCustomTicker] = useState("");

  const utils = trpc.useUtils();

  // Queries
  const { data: alerts, isLoading: alertsLoading, refetch: refetchAlerts } = trpc.signalAlerts.list.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: notifications, isLoading: notificationsLoading } = trpc.signalAlerts.notifications.useQuery(
    { limit: 50 },
    { enabled: !!user }
  );

  // Mutations
  const createAlert = trpc.signalAlerts.create.useMutation({
    onSuccess: () => {
      toast.success("Alerta criado com sucesso!");
      setIsCreateDialogOpen(false);
      setNewAlertTicker("");
      setCustomTicker("");
      utils.signalAlerts.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar alerta");
    },
  });

  const toggleAlert = trpc.signalAlerts.toggle.useMutation({
    onSuccess: () => {
      toast.success("Alerta atualizado!");
      utils.signalAlerts.list.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar alerta");
    },
  });

  const deleteAlert = trpc.signalAlerts.delete.useMutation({
    onSuccess: () => {
      toast.success("Alerta removido!");
      utils.signalAlerts.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover alerta");
    },
  });

  const handleCreateAlert = () => {
    const ticker = customTicker || newAlertTicker;
    if (!ticker) {
      toast.error("Selecione ou digite um ticker");
      return;
    }
    createAlert.mutate({
      ticker: ticker.toUpperCase(),
      assetType: ticker.match(/^[A-Z]{4}[0-9]+$/) ? "stock" : ticker.match(/^(BTC|ETH|SOL|ADA|XRP|DOGE)$/) ? "crypto" : "stock",
      alertType: newAlertTargetSignal === "any" ? "any_change" : `to_${newAlertTargetSignal}` as any,
    });
  };

  // Not logged in
  if (!authLoading && !user) {
    return (
      <MainLayout>
        <div className="container py-12">
          <Card className="max-w-lg mx-auto bg-slate-900/50 border-slate-700/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-amber-400" />
              </div>
              <CardTitle className="text-2xl">Meus Alertas</CardTitle>
              <CardDescription>
                Faça login para gerenciar seus alertas de sinal e receber notificações quando os ativos mudarem de tendência.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <a href={getLoginUrl()}>
                <Button className="bg-cyan-600 hover:bg-cyan-700 gap-2">
                  <Zap className="h-4 w-4" />
                  Fazer Login
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const activeAlerts = alerts?.filter(a => a.isActive) || [];
  const inactiveAlerts = alerts?.filter(a => !a.isActive) || [];

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="h-8 w-8 text-amber-400" />
              Meus Alertas
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus alertas de sinal e veja o histórico de notificações
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {activeAlerts.length} Ativos
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetchAlerts()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700 gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Alerta
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle>Criar Novo Alerta</DialogTitle>
                  <DialogDescription>
                    Configure um alerta para ser notificado quando o sinal técnico de um ativo mudar.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Selecione um ativo popular</Label>
                    <Select value={newAlertTicker} onValueChange={(v) => { setNewAlertTicker(v); setCustomTicker(""); }}>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Escolha um ativo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {POPULAR_TICKERS.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-slate-700" />
                    <span className="text-xs text-muted-foreground">ou</span>
                    <div className="h-px flex-1 bg-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Digite um ticker personalizado</Label>
                    <Input
                      placeholder="Ex: MGLU3, NVDA, SOL..."
                      value={customTicker}
                      onChange={(e) => { setCustomTicker(e.target.value.toUpperCase()); setNewAlertTicker(""); }}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notificar quando o sinal for</Label>
                    <Select value={newAlertTargetSignal} onValueChange={setNewAlertTargetSignal}>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strong_buy">
                          <span className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                            Compra Forte
                          </span>
                        </SelectItem>
                        <SelectItem value="buy">
                          <span className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400/70" />
                            Compra
                          </span>
                        </SelectItem>
                        <SelectItem value="sell">
                          <span className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-400/70" />
                            Venda
                          </span>
                        </SelectItem>
                        <SelectItem value="strong_sell">
                          <span className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-400" />
                            Venda Forte
                          </span>
                        </SelectItem>
                        <SelectItem value="any">
                          <span className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-amber-400" />
                            Qualquer Mudança
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    className="bg-cyan-600 hover:bg-cyan-700"
                    onClick={handleCreateAlert}
                    disabled={createAlert.isPending}
                  >
                    {createAlert.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Criar Alerta"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="bg-slate-900/50 border border-slate-700 mb-6">
                <TabsTrigger 
                  value="alerts" 
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 gap-2"
                >
                  <Bell className="h-4 w-4" />
                  Alertas ({alerts?.length || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 gap-2"
                >
                  <History className="h-4 w-4" />
                  Histórico ({notifications?.length || 0})
                </TabsTrigger>
              </TabsList>

              {/* Alerts Tab */}
              <TabsContent value="alerts" className="space-y-4">
                {alertsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="bg-slate-900/50 border-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-5 w-24 mb-2" />
                              <Skeleton className="h-4 w-40" />
                            </div>
                            <Skeleton className="h-8 w-20" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : alerts?.length === 0 ? (
                  <Card className="bg-slate-900/50 border-slate-700/50">
                    <CardContent className="py-12 text-center">
                      <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mb-2">Nenhum alerta configurado</h3>
                      <p className="text-muted-foreground mb-4">
                        Crie seu primeiro alerta para ser notificado quando um ativo mudar de sinal.
                      </p>
                      <Button 
                        className="bg-cyan-600 hover:bg-cyan-700 gap-2"
                        onClick={() => setIsCreateDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Criar Primeiro Alerta
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {alerts?.map((alert) => {
                      const targetDisplay = getSignalDisplay(alert.alertType.replace('to_', '').replace('any_change', 'any'));
                      const currentDisplay = alert.lastSignal ? getSignalDisplay(alert.lastSignal) : null;

                      return (
                        <Card 
                          key={alert.id} 
                          className={cn(
                            "bg-slate-900/50 border-slate-700/50 transition-all",
                            !alert.isActive && "opacity-60"
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Ticker */}
                              <Link href={`/radar/${alert.ticker}`}>
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
                                  <span className="font-mono font-bold text-sm">{alert.ticker.slice(0, 4)}</span>
                                </div>
                              </Link>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Link href={`/radar/${alert.ticker}`}>
                                    <span className="font-mono font-bold hover:text-cyan-400 cursor-pointer">
                                      {alert.ticker}
                                    </span>
                                  </Link>
                                  {alert.isActive ? (
                                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-xs">
                                      Ativo
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="border-slate-500/50 text-slate-400 text-xs">
                                      Pausado
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>Notificar quando:</span>
                                  <Badge className={cn("text-xs", targetDisplay.className)}>
                                    {alert.alertType === "any_change" ? "Qualquer Mudança" : targetDisplay.text}
                                  </Badge>
                                </div>
                                {currentDisplay && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <span>Sinal atual:</span>
                                    <Badge variant="outline" className="text-xs">
                                      {currentDisplay.text}
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={alert.isActive}
                                  onCheckedChange={() => toggleAlert.mutate({ id: alert.id })}
                                  disabled={toggleAlert.isPending}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  onClick={() => deleteAlert.mutate({ id: alert.id })}
                                  disabled={deleteAlert.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-4">
                {notificationsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="bg-slate-900/50 border-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-5 w-32 mb-2" />
                              <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : notifications?.length === 0 ? (
                  <Card className="bg-slate-900/50 border-slate-700/50">
                    <CardContent className="py-12 text-center">
                      <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mb-2">Nenhuma notificação ainda</h3>
                      <p className="text-muted-foreground">
                        Quando seus alertas forem disparados, as notificações aparecerão aqui.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {notifications?.map((notification) => {
                      const oldDisplay = getSignalDisplay(notification.previousSignal);
                      const newDisplay = getSignalDisplay(notification.newSignal);

                      return (
                        <Card key={notification.id} className="bg-slate-900/50 border-slate-700/50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Icon */}
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                notification.newSignal.includes("buy") ? "bg-emerald-500/20" : "bg-red-500/20"
                              )}>
                                {notification.newSignal.includes("buy") ? (
                                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                                ) : (
                                  <TrendingDown className="h-5 w-5 text-red-400" />
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Link href={`/radar/${notification.ticker}`}>
                                    <span className="font-mono font-bold hover:text-cyan-400 cursor-pointer">
                                      {notification.ticker}
                                    </span>
                                  </Link>
                                  <span className="text-muted-foreground">mudou de sinal</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline" className="text-xs">
                                    {oldDisplay.text}
                                  </Badge>
                                  <span className="text-muted-foreground">→</span>
                                  <Badge className={cn("text-xs", newDisplay.className)}>
                                    {newDisplay.text}
                                  </Badge>
                                </div>
                              </div>

                              {/* Time */}
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(notification.createdAt.toString())}
                                </div>
                                {notification.isRead && (
                                  <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
                                    <Mail className="h-3 w-3" />
                                    Lido
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Alertas ativos</span>
                  <span className="font-bold text-emerald-400">{activeAlerts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Alertas pausados</span>
                  <span className="font-bold text-slate-400">{inactiveAlerts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Notificações enviadas</span>
                  <span className="font-bold text-amber-400">{notifications?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-400" />
                  Como Funciona
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-cyan-400">1</span>
                  </div>
                  <p>Crie um alerta escolhendo o ativo e o sinal desejado</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-cyan-400">2</span>
                  </div>
                  <p>Nosso sistema monitora os indicadores técnicos a cada hora</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-cyan-400">3</span>
                  </div>
                  <p>Quando o sinal mudar, você recebe uma notificação por email</p>
                </div>
              </CardContent>
            </Card>

            {/* Premium CTA */}
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="h-8 w-8 text-amber-400" />
                  <div>
                    <h3 className="font-bold">Premium</h3>
                    <p className="text-sm text-muted-foreground">Alertas ilimitados</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Usuários gratuitos podem criar até 3 alertas. Assine o Premium para alertas ilimitados e notificações prioritárias.
                </p>
                <Link href="/premium">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Ver Planos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
