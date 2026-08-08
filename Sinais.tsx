import { useState } from "react";
import { Link } from "wouter";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  TrendingUp, 
  TrendingDown, 
  Loader2, 
  RefreshCw, 
  Bell, 
  BellPlus, 
  Activity,
  Target,
  LineChart,
  Gauge,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

function getSignalDisplay(signal: string) {
  switch (signal) {
    case 'strong_buy':
      return { text: '🚀 Compra Forte', className: 'bg-emerald-500 text-white', color: 'emerald' };
    case 'buy':
      return { text: '⬆️ Compra', className: 'bg-emerald-500/70 text-white', color: 'emerald' };
    case 'strong_sell':
      return { text: '🚨 Venda Forte', className: 'bg-red-500 text-white', color: 'red' };
    case 'sell':
      return { text: '⬇️ Venda', className: 'bg-red-500/70 text-white', color: 'red' };
    default:
      return { text: '➖ Neutro', className: 'bg-slate-500 text-white', color: 'slate' };
  }
}

function SignalHistoryChart({ ticker }: { ticker: string }) {
  const { data: history, isLoading } = trpc.assets.getSignalHistory.useQuery(
    { ticker, days: 30 },
    { staleTime: 300000 }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Nenhum histórico disponível ainda</p>
        <p className="text-sm">Os sinais serão registrados diariamente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground border-b border-slate-700/50 pb-2">
        <div>Data</div>
        <div>Sinal</div>
        <div className="text-right">RSI</div>
        <div className="text-right">MACD</div>
        <div className="text-right">Preço</div>
      </div>
      {history.slice(0, 10).map((h, i) => {
        const display = getSignalDisplay(h.signal);
        return (
          <div key={i} className="grid grid-cols-5 gap-2 text-sm items-center">
            <div className="text-muted-foreground">
              {new Date(h.recordedAt).toLocaleDateString('pt-BR')}
            </div>
            <div>
              <Badge className={`text-xs ${display.className}`}>
                {display.text}
              </Badge>
            </div>
            <div className={`text-right ${h.rsi && h.rsi < 30 ? 'text-emerald-400' : h.rsi && h.rsi > 70 ? 'text-red-400' : ''}`}>
              {h.rsi?.toFixed(1) || '-'}
            </div>
            <div className={`text-right ${h.macd && h.macd > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {h.macd?.toFixed(2) || '-'}
            </div>
            <div className="text-right font-mono">
              {h.price?.toFixed(2) || '-'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreateAlertDialog({ ticker, assetName, assetType, onSuccess }: { 
  ticker: string; 
  assetName?: string; 
  assetType: "stock" | "etf" | "crypto";
  onSuccess: () => void;
}) {
  const [alertType, setAlertType] = useState<string>("any_change");
  const [open, setOpen] = useState(false);
  
  const createAlert = trpc.signalAlerts.create.useMutation({
    onSuccess: () => {
      toast.success("Alerta criado com sucesso!");
      setOpen(false);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BellPlus className="h-4 w-4" />
          Criar Alerta
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle>Criar Alerta de Sinal para {ticker}</DialogTitle>
          <DialogDescription>
            Receba notificações quando o sinal técnico mudar
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Tipo de Alerta</label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger className="bg-slate-800 border-slate-600">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="any_change">Qualquer mudança de sinal</SelectItem>
                <SelectItem value="to_buy">Quando mudar para Compra</SelectItem>
                <SelectItem value="to_strong_buy">Quando mudar para Compra Forte</SelectItem>
                <SelectItem value="to_sell">Quando mudar para Venda</SelectItem>
                <SelectItem value="to_strong_sell">Quando mudar para Venda Forte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full bg-cyan-600 hover:bg-cyan-700"
            onClick={() => createAlert.mutate({ ticker, assetName, assetType, alertType: alertType as any })}
            disabled={createAlert.isPending}
          >
            {createAlert.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Bell className="h-4 w-4 mr-2" />
            )}
            Criar Alerta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Sinais() {
  const [activeTab, setActiveTab] = useState<"all" | "buy" | "sell">("all");
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch signals for popular tickers
  const tickers = ["PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "WEGE3", "AAPL", "MSFT", "NVDA", "GOOGL", "BTC", "ETH"];
  
  const signalQueries = tickers.map(ticker => 
    trpc.assets.getSignal.useQuery({ ticker }, { staleTime: 60000 })
  );

  const isLoading = signalQueries.some(q => q.isLoading);
  const signals = signalQueries
    .map((q, i) => q.data ? { ...q.data, ticker: tickers[i] } : null)
    .filter(Boolean) as Array<{
      ticker: string;
      signal: string;
      price: number;
      rsi: number;
      macd: number;
      macdSignal: number;
      sma20: number;
      sma50: number;
    }>;

  // User's alerts
  const { data: userAlerts, refetch: refetchAlerts } = trpc.signalAlerts.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // User's notifications
  const { data: notifications } = trpc.signalAlerts.notifications.useQuery(
    { limit: 10 },
    { enabled: isAuthenticated }
  );

  const filteredSignals = signals.filter(s => {
    if (activeTab === "buy") return s.signal === "buy" || s.signal === "strong_buy";
    if (activeTab === "sell") return s.signal === "sell" || s.signal === "strong_sell";
    return true;
  });

  const buyCount = signals.filter(s => s.signal === "buy" || s.signal === "strong_buy").length;
  const sellCount = signals.filter(s => s.signal === "sell" || s.signal === "strong_sell").length;

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Activity className="h-8 w-8 text-cyan-400" />
              Sinais em Tempo Real
            </h1>
            <p className="text-muted-foreground mt-1">
              Análise técnica automatizada com 12 indicadores
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              {buyCount} Compra
            </Badge>
            <Badge variant="outline" className="border-red-500/50 text-red-400">
              <TrendingDown className="h-3 w-3 mr-1" />
              {sellCount} Venda
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => signalQueries.forEach(q => q.refetch())}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Signals Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Signal Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="bg-slate-900/50 border border-slate-700">
                <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                  Todos ({signals.length})
                </TabsTrigger>
                <TabsTrigger value="buy" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                  Compra ({buyCount})
                </TabsTrigger>
                <TabsTrigger value="sell" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                  Venda ({sellCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredSignals.map((signal) => {
                      const display = getSignalDisplay(signal.signal);
                      const hasAlert = userAlerts?.some(a => a.ticker === signal.ticker);
                      
                      return (
                        <Card 
                          key={signal.ticker} 
                          className={`bg-slate-900/50 border-slate-700/50 hover:border-${display.color}-500/30 transition-all cursor-pointer`}
                          onClick={() => setSelectedTicker(signal.ticker)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center font-bold text-sm font-mono text-cyan-400">
                                  {signal.ticker.slice(0, 2)}
                                </div>
                                <div>
                                  <div className="font-semibold font-mono">{signal.ticker}</div>
                                  <div className="text-sm text-muted-foreground">
                                    R$ {signal.price?.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {hasAlert && (
                                  <Bell className="h-4 w-4 text-cyan-400" />
                                )}
                                <Badge className={display.className}>
                                  {display.text}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 text-xs">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="p-2 rounded bg-slate-800/50">
                                      <div className="text-muted-foreground">RSI</div>
                                      <div className={`font-mono ${signal.rsi < 30 ? 'text-emerald-400' : signal.rsi > 70 ? 'text-red-400' : ''}`}>
                                        {signal.rsi?.toFixed(1)}
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {signal.rsi < 30 ? 'Sobrevendido' : signal.rsi > 70 ? 'Sobrecomprado' : 'Normal'}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <div className="p-2 rounded bg-slate-800/50">
                                <div className="text-muted-foreground">MACD</div>
                                <div className={`font-mono ${signal.macd > signal.macdSignal ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {signal.macd?.toFixed(2)}
                                </div>
                              </div>

                              <div className="p-2 rounded bg-slate-800/50">
                                <div className="text-muted-foreground">SMA20</div>
                                <div className={`font-mono ${signal.price > signal.sma20 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {signal.sma20?.toFixed(2)}
                                </div>
                              </div>

                              <div className="p-2 rounded bg-slate-800/50">
                                <div className="text-muted-foreground">SMA50</div>
                                <div className={`font-mono ${signal.price > signal.sma50 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {signal.sma50?.toFixed(2)}
                                </div>
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

            {/* Signal History Modal */}
            {selectedTicker && (
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader className="border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-cyan-400" />
                      Histórico de Sinais - {selectedTicker}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isAuthenticated && (
                        <CreateAlertDialog 
                          ticker={selectedTicker} 
                          assetType="stock"
                          onSuccess={() => refetchAlerts()}
                        />
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTicker(null)}>
                        Fechar
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Evolução do sinal técnico nos últimos 30 dias
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <SignalHistoryChart ticker={selectedTicker} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Alerts */}
            {isAuthenticated && (
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-5 w-5 text-cyan-400" />
                    Meus Alertas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {userAlerts && userAlerts.length > 0 ? (
                    <div className="space-y-3">
                      {userAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-2 rounded bg-slate-800/50">
                          <div>
                            <div className="font-mono font-semibold">{alert.ticker}</div>
                            <div className="text-xs text-muted-foreground">
                              {alert.alertType === "any_change" ? "Qualquer mudança" :
                               alert.alertType === "to_buy" ? "Quando compra" :
                               alert.alertType === "to_strong_buy" ? "Quando compra forte" :
                               alert.alertType === "to_sell" ? "Quando venda" : "Quando venda forte"}
                            </div>
                          </div>
                          {alert.lastSignal && (
                            <Badge className={getSignalDisplay(alert.lastSignal).className} variant="secondary">
                              {getSignalDisplay(alert.lastSignal).text}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum alerta configurado</p>
                      <p className="text-xs">Clique em um ativo para criar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            {isAuthenticated && notifications && notifications.length > 0 && (
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notif) => (
                      <div key={notif.id} className={`p-3 rounded ${notif.isRead ? 'bg-slate-800/30' : 'bg-cyan-500/10 border border-cyan-500/30'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-semibold">{notif.ticker}</span>
                          {!notif.isRead && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getSignalDisplay(notif.previousSignal).text} → {getSignalDisplay(notif.newSignal).text}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(notif.createdAt).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* How it works */}
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-cyan-400" />
                  Como Funciona
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Gauge className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">RSI (14)</div>
                    <div className="text-xs text-muted-foreground">
                      &lt;30 = Sobrevendido (compra)<br />
                      &gt;70 = Sobrecomprado (venda)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">MACD</div>
                    <div className="text-xs text-muted-foreground">
                      Cruzamento acima = Compra<br />
                      Cruzamento abaixo = Venda
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <LineChart className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Médias Móveis</div>
                    <div className="text-xs text-muted-foreground">
                      Preço &gt; SMA = Tendência de alta<br />
                      Preço &lt; SMA = Tendência de baixa
                    </div>
                  </div>
                </div>

                <Link href="/tecnica">
                  <Button variant="outline" className="w-full gap-2 mt-4">
                    Ver Análise Técnica Completa
                    <ArrowRight className="h-4 w-4" />
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
