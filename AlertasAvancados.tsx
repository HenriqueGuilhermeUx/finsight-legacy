import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Smartphone,
  AlertTriangle,
  BarChart3,
  Target,
  Volume2,
} from "lucide-react";

// Alert types
const alertTypes = [
  { id: "price", name: "Preço", icon: DollarSign, description: "Alerta quando o preço atingir um valor" },
  { id: "rsi", name: "RSI", icon: Activity, description: "Alerta baseado no indicador RSI" },
  { id: "macd", name: "MACD", icon: BarChart3, description: "Alerta quando MACD cruzar o sinal" },
  { id: "volume", name: "Volume", icon: Volume2, description: "Alerta de volume anormal" },
  { id: "earnings", name: "Resultados", icon: Calendar, description: "Alerta de divulgação de resultados" },
  { id: "dividend", name: "Dividendos", icon: Target, description: "Alerta de pagamento de dividendos" },
];

// Conditions
const conditions = [
  { id: "above", name: "Acima de" },
  { id: "below", name: "Abaixo de" },
  { id: "crosses_above", name: "Cruza acima de" },
  { id: "crosses_below", name: "Cruza abaixo de" },
];

// Available tickers
const availableTickers = [
  { ticker: "PETR4", name: "Petrobras PN" },
  { ticker: "VALE3", name: "Vale ON" },
  { ticker: "ITUB4", name: "Itaú Unibanco PN" },
  { ticker: "BBDC4", name: "Bradesco PN" },
  { ticker: "WEGE3", name: "WEG ON" },
  { ticker: "ABEV3", name: "Ambev ON" },
  { ticker: "RENT3", name: "Localiza ON" },
  { ticker: "SUZB3", name: "Suzano ON" },
  { ticker: "ELET3", name: "Eletrobras ON" },
  { ticker: "BBAS3", name: "Banco do Brasil ON" },
  { ticker: "AAPL", name: "Apple Inc" },
  { ticker: "MSFT", name: "Microsoft Corp" },
  { ticker: "GOOGL", name: "Alphabet Inc" },
  { ticker: "AMZN", name: "Amazon.com Inc" },
  { ticker: "BTC", name: "Bitcoin" },
  { ticker: "ETH", name: "Ethereum" },
];

// Mock alerts data
const mockAlerts = [
  {
    id: 1,
    name: "PETR4 Suporte",
    ticker: "PETR4",
    assetName: "Petrobras PN",
    alertType: "price",
    condition: "below",
    targetValue: 30.00,
    currentValue: 31.01,
    isActive: true,
    isTriggered: false,
    notificationMethod: "both",
    createdAt: "2024-12-15T10:00:00Z",
  },
  {
    id: 2,
    name: "VALE3 RSI Sobrevendido",
    ticker: "VALE3",
    assetName: "Vale ON",
    alertType: "rsi",
    condition: "below",
    targetValue: 30,
    currentValue: 42.5,
    isActive: true,
    isTriggered: false,
    notificationMethod: "push",
    createdAt: "2024-12-14T14:30:00Z",
  },
  {
    id: 3,
    name: "ITUB4 Resistência",
    ticker: "ITUB4",
    assetName: "Itaú Unibanco PN",
    alertType: "price",
    condition: "above",
    targetValue: 35.00,
    currentValue: 32.45,
    isActive: true,
    isTriggered: false,
    notificationMethod: "email",
    createdAt: "2024-12-13T09:15:00Z",
  },
  {
    id: 4,
    name: "WEGE3 Volume Alto",
    ticker: "WEGE3",
    assetName: "WEG ON",
    alertType: "volume",
    condition: "above",
    targetValue: 10000000,
    currentValue: 5500000,
    isActive: false,
    isTriggered: true,
    triggeredAt: "2024-12-12T15:45:00Z",
    notificationMethod: "both",
    createdAt: "2024-12-10T11:00:00Z",
  },
  {
    id: 5,
    name: "AAPL MACD Bullish",
    ticker: "AAPL",
    assetName: "Apple Inc",
    alertType: "macd",
    condition: "crosses_above",
    targetValue: 0,
    currentValue: -0.5,
    isActive: true,
    isTriggered: false,
    notificationMethod: "push",
    createdAt: "2024-12-11T08:00:00Z",
  },
];

// Mock triggered alerts history
const triggeredHistory = [
  {
    id: 101,
    name: "PETR4 Meta Atingida",
    ticker: "PETR4",
    alertType: "price",
    condition: "above",
    targetValue: 32.00,
    triggeredValue: 32.15,
    triggeredAt: "2024-12-18T14:30:00Z",
  },
  {
    id: 102,
    name: "BTC Suporte Rompido",
    ticker: "BTC",
    alertType: "price",
    condition: "below",
    targetValue: 100000,
    triggeredValue: 99850,
    triggeredAt: "2024-12-17T10:15:00Z",
  },
  {
    id: 103,
    name: "VALE3 RSI Sobrecomprado",
    ticker: "VALE3",
    alertType: "rsi",
    condition: "above",
    targetValue: 70,
    triggeredValue: 72.3,
    triggeredAt: "2024-12-16T16:45:00Z",
  },
];

export default function AlertasAvancados() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState(mockAlerts);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("active");
  
  // Form state
  const [newAlert, setNewAlert] = useState({
    name: "",
    ticker: "PETR4",
    alertType: "price",
    condition: "above",
    targetValue: "",
    notificationMethod: "push",
  });
  
  // Get alert type info
  const getAlertTypeInfo = (typeId: string) => alertTypes.find(t => t.id === typeId);
  
  // Format value based on alert type
  const formatValue = (type: string, value: number) => {
    switch (type) {
      case "price":
        return `R$ ${value.toFixed(2)}`;
      case "rsi":
        return value.toFixed(1);
      case "volume":
        return value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`;
      case "macd":
        return value.toFixed(2);
      default:
        return value.toString();
    }
  };
  
  // Handle create alert
  const handleCreateAlert = () => {
    const ticker = availableTickers.find(t => t.ticker === newAlert.ticker);
    const newAlertData = {
      id: Date.now(),
      name: newAlert.name || `${newAlert.ticker} ${getAlertTypeInfo(newAlert.alertType)?.name}`,
      ticker: newAlert.ticker,
      assetName: ticker?.name || newAlert.ticker,
      alertType: newAlert.alertType,
      condition: newAlert.condition,
      targetValue: parseFloat(newAlert.targetValue) || 0,
      currentValue: 0,
      isActive: true,
      isTriggered: false,
      notificationMethod: newAlert.notificationMethod,
      createdAt: new Date().toISOString(),
    };
    
    setAlerts(prev => [newAlertData, ...prev]);
    setIsCreateOpen(false);
    setNewAlert({
      name: "",
      ticker: "PETR4",
      alertType: "price",
      condition: "above",
      targetValue: "",
      notificationMethod: "push",
    });
  };
  
  // Toggle alert active state
  const toggleAlert = (id: number) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };
  
  // Delete alert
  const deleteAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };
  
  // Filter alerts
  const activeAlerts = alerts.filter(a => a.isActive && !a.isTriggered);
  const triggeredAlerts = alerts.filter(a => a.isTriggered);
  const inactiveAlerts = alerts.filter(a => !a.isActive);

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Faça login para criar alertas</h2>
          <p className="text-muted-foreground mb-4">
            Crie alertas personalizados para acompanhar seus ativos favoritos
          </p>
          <Button asChild>
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BellRing className="h-8 w-8 text-primary" />
              Alertas Avançados
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure alertas de preço, indicadores técnicos e eventos
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Alerta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Alerta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome do Alerta (opcional)</Label>
                  <Input
                    placeholder="Ex: PETR4 Suporte"
                    value={newAlert.name}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Ativo</Label>
                  <Select 
                    value={newAlert.ticker} 
                    onValueChange={(v) => setNewAlert(prev => ({ ...prev, ticker: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTickers.map(t => (
                        <SelectItem key={t.ticker} value={t.ticker}>
                          {t.ticker} - {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo de Alerta</Label>
                  <Select 
                    value={newAlert.alertType} 
                    onValueChange={(v) => setNewAlert(prev => ({ ...prev, alertType: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {alertTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {type.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {getAlertTypeInfo(newAlert.alertType)?.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Condição</Label>
                    <Select 
                      value={newAlert.condition} 
                      onValueChange={(v) => setNewAlert(prev => ({ ...prev, condition: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Valor Alvo</Label>
                    <Input
                      type="number"
                      placeholder={newAlert.alertType === "price" ? "30.00" : "70"}
                      value={newAlert.targetValue}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, targetValue: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Notificação</Label>
                  <Select 
                    value={newAlert.notificationMethod} 
                    onValueChange={(v) => setNewAlert(prev => ({ ...prev, notificationMethod: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Push Notification
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="both">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Ambos
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateAlert} disabled={!newAlert.targetValue}>
                  Criar Alerta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                  <p className="text-2xl font-bold">{activeAlerts.length}</p>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disparados Hoje</p>
                  <p className="text-2xl font-bold text-emerald-500">2</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Próximo a Disparar</p>
                  <p className="text-2xl font-bold text-amber-500">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Histórico</p>
                  <p className="text-2xl font-bold">{triggeredHistory.length}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Ativos ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="triggered" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Disparados ({triggeredAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* Active Alerts */}
          <TabsContent value="active">
            <div className="space-y-4">
              {activeAlerts.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Nenhum alerta ativo</h3>
                    <p className="text-muted-foreground mb-4">
                      Crie seu primeiro alerta para começar a monitorar seus ativos
                    </p>
                    <Button onClick={() => setIsCreateOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Alerta
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                activeAlerts.map(alert => {
                  const typeInfo = getAlertTypeInfo(alert.alertType);
                  const Icon = typeInfo?.icon || Bell;
                  const conditionInfo = conditions.find(c => c.id === alert.condition);
                  const progress = alert.alertType === "price" 
                    ? Math.abs((alert.currentValue - alert.targetValue) / alert.targetValue * 100)
                    : 0;
                  
                  return (
                    <Card key={alert.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{alert.name}</h3>
                                <Badge variant="outline">{alert.ticker}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {typeInfo?.name}: {conditionInfo?.name} {formatValue(alert.alertType, alert.targetValue)}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="text-muted-foreground">
                                  Atual: <span className="font-medium text-foreground">{formatValue(alert.alertType, alert.currentValue)}</span>
                                </span>
                                {alert.alertType === "price" && (
                                  <span className={progress < 5 ? "text-amber-500" : "text-muted-foreground"}>
                                    {progress < 5 ? "⚠ Próximo do alvo" : `${progress.toFixed(1)}% do alvo`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {alert.notificationMethod === "push" && <Smartphone className="h-3 w-3" />}
                              {alert.notificationMethod === "email" && <Mail className="h-3 w-3" />}
                              {alert.notificationMethod === "both" && <Bell className="h-3 w-3" />}
                              {alert.notificationMethod === "push" ? "Push" : alert.notificationMethod === "email" ? "Email" : "Ambos"}
                            </Badge>
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={() => toggleAlert(alert.id)}
                            />
                            <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Triggered Alerts */}
          <TabsContent value="triggered">
            <div className="space-y-4">
              {triggeredAlerts.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Nenhum alerta disparado</h3>
                    <p className="text-muted-foreground">
                      Os alertas disparados aparecerão aqui
                    </p>
                  </CardContent>
                </Card>
              ) : (
                triggeredAlerts.map(alert => {
                  const typeInfo = getAlertTypeInfo(alert.alertType);
                  const Icon = typeInfo?.icon || Bell;
                  
                  return (
                    <Card key={alert.id} className="border-emerald-500/50">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{alert.name}</h3>
                                <Badge variant="outline">{alert.ticker}</Badge>
                                <Badge className="bg-emerald-500">Disparado</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Alvo: {formatValue(alert.alertType, alert.targetValue)}
                              </p>
                              <p className="text-sm text-emerald-500 mt-1">
                                Disparado em {new Date(alert.triggeredAt!).toLocaleString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => toggleAlert(alert.id)}>
                            Reativar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Alertas Disparados</CardTitle>
                <CardDescription>
                  Últimos alertas que foram acionados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {triggeredHistory.map(alert => {
                    const typeInfo = getAlertTypeInfo(alert.alertType);
                    const conditionInfo = conditions.find(c => c.id === alert.condition);
                    
                    return (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{alert.name}</span>
                              <Badge variant="outline">{alert.ticker}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {typeInfo?.name} {conditionInfo?.name} {formatValue(alert.alertType, alert.targetValue)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-emerald-500">
                            {formatValue(alert.alertType, alert.triggeredValue)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(alert.triggeredAt).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
