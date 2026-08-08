import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, Plus, Trash2, TrendingUp, TrendingDown, AlertCircle, 
  CheckCircle, Clock, RefreshCw, BarChart3, LineChart, Waves
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

type IndicatorType = "rsi" | "macd" | "sma" | "ema" | "bb";

const indicatorInfo: Record<IndicatorType, { name: string; description: string; icon: any; color: string }> = {
  rsi: { 
    name: "RSI", 
    description: "Índice de Força Relativa - identifica sobrecompra/sobrevenda",
    icon: Activity,
    color: "text-purple-500"
  },
  macd: { 
    name: "MACD", 
    description: "Convergência/Divergência de Médias Móveis - sinais de tendência",
    icon: BarChart3,
    color: "text-blue-500"
  },
  sma: { 
    name: "SMA", 
    description: "Média Móvel Simples - suporte e resistência dinâmicos",
    icon: LineChart,
    color: "text-green-500"
  },
  ema: { 
    name: "EMA", 
    description: "Média Móvel Exponencial - mais sensível a mudanças recentes",
    icon: LineChart,
    color: "text-cyan-500"
  },
  bb: { 
    name: "Bollinger Bands", 
    description: "Bandas de Bollinger - volatilidade e reversões",
    icon: Waves,
    color: "text-amber-500"
  },
};

export default function AlertasTecnicos() {
  const { user } = useAuth();
  const authLoading = !user;
  const [showForm, setShowForm] = useState(false);
  const [ticker, setTicker] = useState("");
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState<"stock" | "etf" | "crypto">("stock");
  const [indicatorType, setIndicatorType] = useState<IndicatorType>("rsi");
  
  // RSI settings
  const [rsiThreshold, setRsiThreshold] = useState("30");
  const [rsiCondition, setRsiCondition] = useState<"above" | "below">("below");
  
  // MACD settings
  const [macdCondition, setMacdCondition] = useState<"bullish_cross" | "bearish_cross">("bullish_cross");
  
  // MA settings
  const [maPeriod, setMaPeriod] = useState("20");
  const [maSecondPeriod, setMaSecondPeriod] = useState("200");
  const [maCondition, setMaCondition] = useState<"price_above" | "price_below" | "golden_cross" | "death_cross">("price_above");
  
  // BB settings
  const [bbCondition, setBbCondition] = useState<"above_upper" | "below_lower">("below_lower");
  
  // Recurring settings
  const [isRecurring, setIsRecurring] = useState(false);
  const [cooldownMinutes, setCooldownMinutes] = useState("60");

  const { data: alerts, refetch } = trpc.technicalAlerts.list.useQuery(undefined, {
    enabled: !!user,
  });

  const createAlert = trpc.technicalAlerts.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowForm(false);
      resetForm();
    },
  });

  const updateAlert = trpc.technicalAlerts.update.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteAlert = trpc.technicalAlerts.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const resetForm = () => {
    setTicker("");
    setAssetName("");
    setIndicatorType("rsi");
    setRsiThreshold("30");
    setRsiCondition("below");
    setMacdCondition("bullish_cross");
    setMaPeriod("20");
    setMaSecondPeriod("200");
    setMaCondition("price_above");
    setBbCondition("below_lower");
    setIsRecurring(false);
    setCooldownMinutes("60");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;

    const baseData = {
      ticker: ticker.toUpperCase(),
      assetName: assetName || undefined,
      assetType,
      indicatorType,
      isRecurring,
      cooldownMinutes: parseInt(cooldownMinutes) || 60,
    };

    let specificData: any = {};
    
    if (indicatorType === "rsi") {
      specificData = {
        rsiThreshold: parseInt(rsiThreshold),
        rsiCondition,
      };
    } else if (indicatorType === "macd") {
      specificData = {
        macdCondition,
      };
    } else if (indicatorType === "sma" || indicatorType === "ema") {
      specificData = {
        maPeriod: parseInt(maPeriod),
        maSecondPeriod: maCondition.includes("cross") ? parseInt(maSecondPeriod) : undefined,
        maCondition,
      };
    } else if (indicatorType === "bb") {
      specificData = {
        bbCondition,
      };
    }

    createAlert.mutate({ ...baseData, ...specificData });
  };

  const getAlertDescription = (alert: any) => {
    if (alert.indicatorType === "rsi") {
      const condText = alert.rsiCondition === "above" ? "acima de" : "abaixo de";
      return `RSI ${condText} ${alert.rsiThreshold}`;
    } else if (alert.indicatorType === "macd") {
      const condText = {
        bullish_cross: "Cruzamento de alta",
        bearish_cross: "Cruzamento de baixa",
        histogram_positive: "Histograma positivo",
        histogram_negative: "Histograma negativo",
      }[alert.macdCondition as string] || alert.macdCondition;
      return `MACD: ${condText}`;
    } else if (alert.indicatorType === "sma" || alert.indicatorType === "ema") {
      const type = alert.indicatorType.toUpperCase();
      const condText = {
        price_above: `Preço acima da ${type}(${alert.maPeriod})`,
        price_below: `Preço abaixo da ${type}(${alert.maPeriod})`,
        golden_cross: `Golden Cross: ${type}(${alert.maPeriod}) > ${type}(${alert.maSecondPeriod})`,
        death_cross: `Death Cross: ${type}(${alert.maPeriod}) < ${type}(${alert.maSecondPeriod})`,
      }[alert.maCondition as string] || alert.maCondition;
      return condText;
    } else if (alert.indicatorType === "bb") {
      const condText = {
        above_upper: "Rompimento da banda superior",
        below_lower: "Rompimento da banda inferior",
        squeeze: "Squeeze (compressão)",
      }[alert.bbCondition as string] || alert.bbCondition;
      return `Bollinger: ${condText}`;
    }
    return alert.indicatorType;
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Alertas Técnicos
              </CardTitle>
              <CardDescription>
                Crie alertas baseados em indicadores técnicos como RSI, MACD e Médias Móveis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Faça login para criar e gerenciar seus alertas técnicos.
              </p>
              <Button asChild className="w-full">
                <a href={getLoginUrl()}>Fazer Login</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const activeAlerts = alerts?.filter(a => a.isActive && !a.isTriggered) || [];
  const triggeredAlerts = alerts?.filter(a => a.isTriggered && !a.isRecurring) || [];
  const inactiveAlerts = alerts?.filter(a => !a.isActive) || [];

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-500" />
              Alertas Técnicos
            </h1>
            <p className="text-muted-foreground mt-2">
              Alertas baseados em RSI, MACD, Médias Móveis e Bollinger Bands
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/alertas-preco">
                <TrendingUp className="h-4 w-4 mr-2" />
                Alertas de Preço
              </Link>
            </Button>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Alerta
            </Button>
          </div>
        </div>

        {/* Create Alert Form */}
        {showForm && (
          <Card className="mb-8 border-purple-500/30">
            <CardHeader>
              <CardTitle>Criar Alerta Técnico</CardTitle>
              <CardDescription>
                Configure um alerta baseado em indicadores técnicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Asset Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticker">Ticker *</Label>
                    <Input
                      id="ticker"
                      placeholder="PETR4, AAPL, BTC..."
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assetName">Nome (opcional)</Label>
                    <Input
                      id="assetName"
                      placeholder="Petrobras"
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Ativo</Label>
                    <Select value={assetType} onValueChange={(v: any) => setAssetType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stock">Ação</SelectItem>
                        <SelectItem value="etf">ETF</SelectItem>
                        <SelectItem value="crypto">Cripto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Indicator Selection */}
                <div className="space-y-3">
                  <Label>Indicador Técnico</Label>
                  <Tabs value={indicatorType} onValueChange={(v: any) => setIndicatorType(v)}>
                    <TabsList className="grid grid-cols-5 w-full">
                      {(Object.keys(indicatorInfo) as IndicatorType[]).map((key) => {
                        const info = indicatorInfo[key];
                        const Icon = info.icon;
                        return (
                          <TabsTrigger key={key} value={key} className="gap-2">
                            <Icon className={`h-4 w-4 ${info.color}`} />
                            {info.name}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {/* RSI Settings */}
                    <TabsContent value="rsi" className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        {indicatorInfo.rsi.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nível RSI</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={rsiThreshold}
                            onChange={(e) => setRsiThreshold(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Comum: 30 (sobrevenda), 70 (sobrecompra)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Condição</Label>
                          <Select value={rsiCondition} onValueChange={(v: any) => setRsiCondition(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below">Abaixo de (Sobrevenda)</SelectItem>
                              <SelectItem value="above">Acima de (Sobrecompra)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    {/* MACD Settings */}
                    <TabsContent value="macd" className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        {indicatorInfo.macd.description}
                      </p>
                      <div className="space-y-2">
                        <Label>Condição</Label>
                        <Select value={macdCondition} onValueChange={(v: any) => setMacdCondition(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bullish_cross">Cruzamento de Alta (Compra)</SelectItem>
                            <SelectItem value="bearish_cross">Cruzamento de Baixa (Venda)</SelectItem>
                            <SelectItem value="histogram_positive">Histograma Positivo</SelectItem>
                            <SelectItem value="histogram_negative">Histograma Negativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    {/* SMA Settings */}
                    <TabsContent value="sma" className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        {indicatorInfo.sma.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Período Principal</Label>
                          <Select value={maPeriod} onValueChange={setMaPeriod}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9">9 períodos</SelectItem>
                              <SelectItem value="20">20 períodos</SelectItem>
                              <SelectItem value="50">50 períodos</SelectItem>
                              <SelectItem value="100">100 períodos</SelectItem>
                              <SelectItem value="200">200 períodos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Condição</Label>
                          <Select value={maCondition} onValueChange={(v: any) => setMaCondition(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="price_above">Preço acima da média</SelectItem>
                              <SelectItem value="price_below">Preço abaixo da média</SelectItem>
                              <SelectItem value="golden_cross">Golden Cross</SelectItem>
                              <SelectItem value="death_cross">Death Cross</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {(maCondition === "golden_cross" || maCondition === "death_cross") && (
                        <div className="mt-4 space-y-2">
                          <Label>Período Secundário (para cruzamento)</Label>
                          <Select value={maSecondPeriod} onValueChange={setMaSecondPeriod}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="50">50 períodos</SelectItem>
                              <SelectItem value="100">100 períodos</SelectItem>
                              <SelectItem value="200">200 períodos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </TabsContent>

                    {/* EMA Settings */}
                    <TabsContent value="ema" className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        {indicatorInfo.ema.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Período Principal</Label>
                          <Select value={maPeriod} onValueChange={setMaPeriod}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9">9 períodos</SelectItem>
                              <SelectItem value="12">12 períodos</SelectItem>
                              <SelectItem value="20">20 períodos</SelectItem>
                              <SelectItem value="26">26 períodos</SelectItem>
                              <SelectItem value="50">50 períodos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Condição</Label>
                          <Select value={maCondition} onValueChange={(v: any) => setMaCondition(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="price_above">Preço acima da média</SelectItem>
                              <SelectItem value="price_below">Preço abaixo da média</SelectItem>
                              <SelectItem value="golden_cross">Golden Cross</SelectItem>
                              <SelectItem value="death_cross">Death Cross</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {(maCondition === "golden_cross" || maCondition === "death_cross") && (
                        <div className="mt-4 space-y-2">
                          <Label>Período Secundário (para cruzamento)</Label>
                          <Select value={maSecondPeriod} onValueChange={setMaSecondPeriod}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="26">26 períodos</SelectItem>
                              <SelectItem value="50">50 períodos</SelectItem>
                              <SelectItem value="100">100 períodos</SelectItem>
                              <SelectItem value="200">200 períodos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </TabsContent>

                    {/* Bollinger Bands Settings */}
                    <TabsContent value="bb" className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        {indicatorInfo.bb.description}
                      </p>
                      <div className="space-y-2">
                        <Label>Condição</Label>
                        <Select value={bbCondition} onValueChange={(v: any) => setBbCondition(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="above_upper">Rompimento da Banda Superior</SelectItem>
                            <SelectItem value="below_lower">Rompimento da Banda Inferior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Recurring Settings */}
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-cyan-500" />
                      <Label htmlFor="isRecurring" className="font-medium">Alerta Recorrente</Label>
                    </div>
                    <Switch
                      id="isRecurring"
                      checked={isRecurring}
                      onCheckedChange={setIsRecurring}
                    />
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    Alertas recorrentes disparam múltiplas vezes quando a condição é atendida.
                  </p>
                  {isRecurring && (
                    <div className="space-y-2">
                      <Label>Intervalo mínimo entre disparos</Label>
                      <Select value={cooldownMinutes} onValueChange={setCooldownMinutes}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutos</SelectItem>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="240">4 horas</SelectItem>
                          <SelectItem value="1440">24 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createAlert.isPending}>
                    {createAlert.isPending ? "Criando..." : "Criar Alerta"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <Activity className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{alerts?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeAlerts.length}</p>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{triggeredAlerts.length}</p>
                  <p className="text-sm text-muted-foreground">Disparados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-500/10 rounded-full">
                  <Clock className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inactiveAlerts.length}</p>
                  <p className="text-sm text-muted-foreground">Pausados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Alertas Ativos
            </h2>
            <div className="grid gap-4">
              {activeAlerts.map((alert) => {
                const info = indicatorInfo[alert.indicatorType as IndicatorType];
                const Icon = info?.icon || Activity;
                return (
                  <Card key={alert.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 bg-primary/10 rounded-lg`}>
                            <Icon className={`h-6 w-6 ${info?.color || 'text-purple-500'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-lg">{alert.ticker}</span>
                              {alert.assetName && (
                                <span className="text-muted-foreground">({alert.assetName})</span>
                              )}
                              <Badge variant="outline">{alert.assetType}</Badge>
                              <Badge variant="secondary" className={`${info?.color || ''} bg-opacity-20`}>
                                {info?.name || alert.indicatorType}
                              </Badge>
                              {alert.isRecurring && (
                                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Recorrente
                                </Badge>
                              )}
                              {alert.triggerCount > 0 && (
                                <Badge variant="outline" className="text-amber-400">
                                  {alert.triggerCount}x disparado
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {getAlertDescription(alert)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={alert.isActive}
                            onCheckedChange={(checked) =>
                              updateAlert.mutate({ id: alert.id, isActive: checked })
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAlert.mutate({ id: alert.id })}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Alertas Disparados
            </h2>
            <div className="grid gap-4">
              {triggeredAlerts.map((alert) => {
                const info = indicatorInfo[alert.indicatorType as IndicatorType];
                const Icon = info?.icon || Activity;
                return (
                  <Card key={alert.id} className="border-l-4 border-l-amber-500 opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Icon className="h-6 w-6 text-amber-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">{alert.ticker}</span>
                              <Badge variant="outline">{info?.name || alert.indicatorType}</Badge>
                              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                                Disparado
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {getAlertDescription(alert)}
                              {alert.triggeredAt && (
                                <span className="ml-2">
                                  • {new Date(alert.triggeredAt).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAlert.mutate({ id: alert.id })}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!alerts || alerts.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum alerta técnico</h3>
              <p className="text-muted-foreground mb-4">
                Crie alertas baseados em indicadores técnicos para ser notificado de oportunidades.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Alerta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
