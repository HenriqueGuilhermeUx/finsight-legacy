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
  Layers, Plus, Trash2, CheckCircle, AlertCircle, RefreshCw,
  TrendingUp, Activity, BarChart3, LineChart, Waves, DollarSign
} from "lucide-react";
import { Link } from "wouter";
import { useAnalysisLimit } from "@/hooks/useAnalysisLimit";
import { RegisterModal } from "@/components/RegisterModal";
import { AnalysisLimitBadge } from "@/components/AnalysisLimitBadge";
import { Disclaimer } from "@/components/Disclaimer";

type ConditionType = "price" | "rsi" | "macd" | "sma" | "ema" | "bb";

interface Condition {
  type: ConditionType;
  params: Record<string, any>;
}

const conditionIcons: Record<ConditionType, any> = {
  price: DollarSign,
  rsi: Activity,
  macd: BarChart3,
  sma: LineChart,
  ema: LineChart,
  bb: Waves,
};

export default function AlertasCombinados() {
  const { user } = useAuth();
  
  // Analysis limit system
  const { incrementCount, canAnalyze, showRegisterModal, setShowRegisterModal } = useAnalysisLimit();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [assetType, setAssetType] = useState<"stock" | "etf" | "crypto">("stock");
  const [operator, setOperator] = useState<"and" | "or">("and");
  const [isRecurring, setIsRecurring] = useState(false);
  const [cooldownMinutes, setCooldownMinutes] = useState("60");
  const [conditions, setConditions] = useState<Condition[]>([
    { type: "price", params: { direction: "above", targetPrice: "" } },
    { type: "rsi", params: { condition: "below", threshold: "30" } },
  ]);

  const { data: alerts, refetch } = trpc.combinedAlerts.list.useQuery(undefined, {
    enabled: !!user,
  });

  const createAlert = trpc.combinedAlerts.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowForm(false);
      resetForm();
    },
  });

  const updateAlert = trpc.combinedAlerts.update.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteAlert = trpc.combinedAlerts.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const resetForm = () => {
    setName("");
    setTicker("");
    setOperator("and");
    setIsRecurring(false);
    setConditions([
      { type: "price", params: { direction: "above", targetPrice: "" } },
      { type: "rsi", params: { condition: "below", threshold: "30" } },
    ]);
  };

  const addCondition = () => {
    if (conditions.length >= 5) return;
    setConditions([...conditions, { type: "price", params: { direction: "above", targetPrice: "" } }]);
  };

  const removeCondition = (index: number) => {
    if (conditions.length <= 2) return;
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setConditions(newConditions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !name || conditions.length < 2) return;
    if (!canAnalyze()) return;
    incrementCount();

    createAlert.mutate({
      name,
      ticker: ticker.toUpperCase(),
      assetType,
      conditions,
      operator,
      isRecurring,
      cooldownMinutes: parseInt(cooldownMinutes),
    });
  };

  const getConditionDescription = (condition: Condition): string => {
    const { type, params } = condition;
    switch (type) {
      case "price":
        return `Preço ${params.direction === "above" ? "acima de" : "abaixo de"} R$ ${params.targetPrice}`;
      case "rsi":
        return `RSI ${params.condition === "above" ? "acima de" : "abaixo de"} ${params.threshold}`;
      case "macd":
        return `MACD ${params.condition === "bullish_cross" ? "cruzamento de alta" : "cruzamento de baixa"}`;
      case "sma":
      case "ema":
        return `${type.toUpperCase()}(${params.period}) ${params.condition === "price_above" ? "preço acima" : "preço abaixo"}`;
      case "bb":
        return `Bollinger ${params.condition === "below_lower" ? "abaixo da banda inferior" : "acima da banda superior"}`;
      default:
        return type;
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Alertas Combinados
              </CardTitle>
              <CardDescription>
                Crie alertas com múltiplas condições usando lógica AND/OR.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Faça login para criar alertas combinados.
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
  const triggeredAlerts = alerts?.filter(a => a.isTriggered) || [];

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Layers className="h-8 w-8 text-indigo-500" />
              Alertas Combinados
            </h1>
            <p className="text-muted-foreground mt-2">
              Alertas com múltiplas condições (AND/OR)
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/alertas-preco">
                <TrendingUp className="h-4 w-4 mr-2" />
                Alertas de Preço
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/alertas-tecnicos">
                <Activity className="h-4 w-4 mr-2" />
                Alertas Técnicos
              </Link>
            </Button>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Alerta
            </Button>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <Card className="mb-8 border-indigo-500/30">
            <CardHeader>
              <CardTitle>Criar Alerta Combinado</CardTitle>
              <CardDescription>
                Configure múltiplas condições que devem ser atendidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Alerta *</Label>
                    <Input
                      placeholder="Ex: PETR4 Sobrevendido + Suporte"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ticker *</Label>
                    <Input
                      placeholder="PETR4, AAPL, BTC..."
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      required
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

                {/* Operator */}
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <Label className="mb-3 block">Operador Lógico</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={operator === "and" ? "default" : "outline"}
                      onClick={() => setOperator("and")}
                      className="flex-1"
                    >
                      AND - Todas as condições
                    </Button>
                    <Button
                      type="button"
                      variant={operator === "or" ? "default" : "outline"}
                      onClick={() => setOperator("or")}
                      className="flex-1"
                    >
                      OR - Qualquer condição
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {operator === "and" 
                      ? "O alerta dispara quando TODAS as condições forem verdadeiras"
                      : "O alerta dispara quando QUALQUER condição for verdadeira"}
                  </p>
                </div>

                {/* Conditions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Condições ({conditions.length}/5)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCondition}
                      disabled={conditions.length >= 5}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>

                  {conditions.map((condition, index) => {
                    const Icon = conditionIcons[condition.type];
                    return (
                      <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-indigo-400" />
                            <span className="font-medium">Condição {index + 1}</span>
                          </div>
                          {conditions.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCondition(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select
                              value={condition.type}
                              onValueChange={(v: ConditionType) => {
                                const defaultParams: Record<ConditionType, any> = {
                                  price: { direction: "above", targetPrice: "" },
                                  rsi: { condition: "below", threshold: "30" },
                                  macd: { condition: "bullish_cross" },
                                  sma: { period: "20", condition: "price_above" },
                                  ema: { period: "20", condition: "price_above" },
                                  bb: { condition: "below_lower" },
                                };
                                updateCondition(index, { type: v, params: defaultParams[v] });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="price">Preço</SelectItem>
                                <SelectItem value="rsi">RSI</SelectItem>
                                <SelectItem value="macd">MACD</SelectItem>
                                <SelectItem value="sma">SMA</SelectItem>
                                <SelectItem value="ema">EMA</SelectItem>
                                <SelectItem value="bb">Bollinger</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Dynamic params based on type */}
                          {condition.type === "price" && (
                            <>
                              <div className="space-y-2">
                                <Label>Direção</Label>
                                <Select
                                  value={condition.params.direction}
                                  onValueChange={(v) => updateCondition(index, { 
                                    params: { ...condition.params, direction: v } 
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="above">Acima de</SelectItem>
                                    <SelectItem value="below">Abaixo de</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Preço Alvo</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="R$ 35.00"
                                  value={condition.params.targetPrice}
                                  onChange={(e) => updateCondition(index, {
                                    params: { ...condition.params, targetPrice: e.target.value }
                                  })}
                                />
                              </div>
                            </>
                          )}

                          {condition.type === "rsi" && (
                            <>
                              <div className="space-y-2">
                                <Label>Condição</Label>
                                <Select
                                  value={condition.params.condition}
                                  onValueChange={(v) => updateCondition(index, {
                                    params: { ...condition.params, condition: v }
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="below">Abaixo de (Sobrevenda)</SelectItem>
                                    <SelectItem value="above">Acima de (Sobrecompra)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Nível</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={condition.params.threshold}
                                  onChange={(e) => updateCondition(index, {
                                    params: { ...condition.params, threshold: e.target.value }
                                  })}
                                />
                              </div>
                            </>
                          )}

                          {condition.type === "macd" && (
                            <div className="space-y-2 md:col-span-2">
                              <Label>Condição</Label>
                              <Select
                                value={condition.params.condition}
                                onValueChange={(v) => updateCondition(index, {
                                  params: { ...condition.params, condition: v }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bullish_cross">Cruzamento de Alta</SelectItem>
                                  <SelectItem value="bearish_cross">Cruzamento de Baixa</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {(condition.type === "sma" || condition.type === "ema") && (
                            <>
                              <div className="space-y-2">
                                <Label>Período</Label>
                                <Select
                                  value={condition.params.period}
                                  onValueChange={(v) => updateCondition(index, {
                                    params: { ...condition.params, period: v }
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="9">9</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="200">200</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Condição</Label>
                                <Select
                                  value={condition.params.condition}
                                  onValueChange={(v) => updateCondition(index, {
                                    params: { ...condition.params, condition: v }
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="price_above">Preço acima</SelectItem>
                                    <SelectItem value="price_below">Preço abaixo</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}

                          {condition.type === "bb" && (
                            <div className="space-y-2 md:col-span-2">
                              <Label>Condição</Label>
                              <Select
                                value={condition.params.condition}
                                onValueChange={(v) => updateCondition(index, {
                                  params: { ...condition.params, condition: v }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="below_lower">Abaixo da banda inferior</SelectItem>
                                  <SelectItem value="above_upper">Acima da banda superior</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recurring */}
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-cyan-500" />
                      <Label>Alerta Recorrente</Label>
                    </div>
                    <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
                  </div>
                  {isRecurring && (
                    <div className="space-y-2">
                      <Label>Intervalo mínimo</Label>
                      <Select value={cooldownMinutes} onValueChange={setCooldownMinutes}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-full">
                  <Layers className="h-6 w-6 text-indigo-500" />
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
        </div>

        {/* Alerts List */}
        {activeAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Alertas Ativos</h2>
            <div className="grid gap-4">
              {activeAlerts.map((alert: any) => (
                <Card key={alert.id} className="border-l-4 border-l-indigo-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-lg">{alert.name}</span>
                          <Badge variant="outline">{alert.ticker}</Badge>
                          <Badge variant="secondary" className="bg-indigo-500/20">
                            {alert.operator.toUpperCase()}
                          </Badge>
                          {alert.isRecurring && (
                            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Recorrente
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {alert.conditions.map((cond: Condition, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {getConditionDescription(cond)}
                            </Badge>
                          ))}
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
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!alerts || alerts.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <Layers className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum alerta combinado</h3>
              <p className="text-muted-foreground mb-4">
                Crie alertas com múltiplas condições para estratégias mais sofisticadas.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Alerta
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <Disclaimer variant="compact" className="mt-6" />
      </div>

      {/* Register Modal */}
      <RegisterModal open={showRegisterModal} onOpenChange={setShowRegisterModal} />
    </MainLayout>
  );
}
