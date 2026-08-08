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
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, ArrowUp, ArrowDown, History, Percent, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function AlertasPreco() {
  const { user } = useAuth();
  const authLoading = !user;
  const [showForm, setShowForm] = useState(false);
  const [ticker, setTicker] = useState("");
  const [assetName, setAssetName] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [targetPercent, setTargetPercent] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [assetType, setAssetType] = useState<"stock" | "etf" | "crypto">("stock");
  const [alertType, setAlertType] = useState<"price" | "percent">("price");
  const [isRecurring, setIsRecurring] = useState(false);
  const [cooldownMinutes, setCooldownMinutes] = useState("60");

  const { data: alerts, refetch } = trpc.priceAlertsUser.list.useQuery(undefined, {
    enabled: !!user,
  });

  const createAlert = trpc.priceAlertsUser.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowForm(false);
      setTicker("");
      setAssetName("");
      setTargetPrice("");
      setTargetPercent("");
      setAlertType("price");
      setIsRecurring(false);
      setCooldownMinutes("60");
    },
  });

  const updateAlert = trpc.priceAlertsUser.update.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteAlert = trpc.priceAlertsUser.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;
    if (alertType === "price" && !targetPrice) return;
    if (alertType === "percent" && !targetPercent) return;

    createAlert.mutate({
      ticker: ticker.toUpperCase(),
      assetName: assetName || undefined,
      assetType,
      alertType,
      targetPrice: alertType === "price" ? parseFloat(targetPrice) : undefined,
      targetPercent: alertType === "percent" ? parseFloat(targetPercent) : undefined,
      condition,
      isRecurring,
      cooldownMinutes: parseInt(cooldownMinutes) || 60,
    });
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
        <div className="container py-16 text-center">
          <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Alertas de Preço</h1>
          <p className="text-muted-foreground mb-6">
            Faça login para criar alertas personalizados de preço.
          </p>
          <Button asChild>
            <a href={getLoginUrl()}>Fazer Login</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const activeAlerts = alerts?.filter(a => a.isActive && !a.isTriggered) || [];
  const triggeredAlerts = alerts?.filter(a => a.isTriggered) || [];
  const inactiveAlerts = alerts?.filter(a => !a.isActive && !a.isTriggered) || [];

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              Alertas de Preço
            </h1>
            <p className="text-muted-foreground mt-1">
              Receba notificações quando ativos atingirem seus preços-alvo
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/historico-alertas">
              <Button variant="outline" className="gap-2">
                <History className="h-4 w-4" />
                Histórico
              </Button>
            </Link>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Alerta
            </Button>
          </div>
        </div>

        {/* Create Alert Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Criar Novo Alerta</CardTitle>
              <CardDescription>
                Defina um ativo e o critério para receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Alert Type Tabs */}
                <Tabs value={alertType} onValueChange={(v) => setAlertType(v as "price" | "percent")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="price" className="gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Preço Absoluto
                    </TabsTrigger>
                    <TabsTrigger value="percent" className="gap-2">
                      <Percent className="h-4 w-4" />
                      Variação %
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticker">Ticker</Label>
                    <Input
                      id="ticker"
                      placeholder="Ex: PETR4, VALE3, AAPL"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assetName">Nome (opcional)</Label>
                    <Input
                      id="assetName"
                      placeholder="Ex: Petrobras"
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assetType">Tipo</Label>
                    <Select value={assetType} onValueChange={(v: any) => setAssetType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stock">Ação</SelectItem>
                        <SelectItem value="etf">ETF/FII</SelectItem>
                        <SelectItem value="crypto">Cripto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {alertType === "price" ? (
                    <div className="space-y-2">
                      <Label htmlFor="targetPrice">Preço-Alvo (R$)</Label>
                      <Input
                        id="targetPrice"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        required={alertType === "price"}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="targetPercent">Variação Alvo (%)</Label>
                      <Input
                        id="targetPercent"
                        type="number"
                        step="0.1"
                        placeholder="Ex: 5 para 5%"
                        value={targetPercent}
                        onChange={(e) => setTargetPercent(e.target.value)}
                        required={alertType === "percent"}
                      />
                    </div>
                  )}
                </div>

                {alertType === "percent" && (
                  <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                    <Percent className="h-4 w-4 inline mr-2" />
                    O alerta será disparado quando o ativo variar o percentual definido em relação ao preço atual.
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Label>Condição:</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={condition === "above" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCondition("above")}
                      className="gap-2"
                    >
                      <ArrowUp className="h-4 w-4" />
                      {alertType === "price" ? "Acima de" : "Subir"}
                    </Button>
                    <Button
                      type="button"
                      variant={condition === "below" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCondition("below")}
                      className="gap-2"
                    >
                      <ArrowDown className="h-4 w-4" />
                      {alertType === "price" ? "Abaixo de" : "Cair"}
                    </Button>
                  </div>
                </div>
                {/* Recurring Alert Option */}
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
                    Alertas recorrentes disparam múltiplas vezes, útil para day traders.
                  </p>
                  {isRecurring && (
                    <div className="space-y-2">
                      <Label htmlFor="cooldown">Intervalo mínimo entre disparos</Label>
                      <Select value={cooldownMinutes} onValueChange={setCooldownMinutes}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutos</SelectItem>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                          <SelectItem value="240">4 horas</SelectItem>
                          <SelectItem value="480">8 horas</SelectItem>
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
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Bell className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeAlerts.length}</p>
                  <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-amber-500" />
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
              <Bell className="h-5 w-5 text-green-500" />
              Alertas Ativos
            </h2>
            <div className="grid gap-4">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {alert.condition === "above" ? (
                            <TrendingUp className="h-6 w-6 text-green-500" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-red-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{alert.ticker}</span>
                            {alert.assetName && (
                              <span className="text-muted-foreground">({alert.assetName})</span>
                            )}
                            <Badge variant="outline">{alert.assetType}</Badge>
                            {alert.isRecurring && (
                              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Recorrente
                              </Badge>
                            )}
                            {alert.triggerCount > 0 && (
                              <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                                {alert.triggerCount}x disparado
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Alertar quando {alert.condition === "above" ? "subir acima" : "cair abaixo"} de{" "}
                            <span className="font-semibold text-foreground">
                              {alert.alertType === "percent" 
                                ? `${parseFloat(alert.targetPercent || "0").toFixed(1)}%`
                                : `R$ ${parseFloat(alert.targetPrice || "0").toFixed(2)}`}
                            </span>
                            {alert.isRecurring && alert.cooldownMinutes && (
                              <span className="text-slate-500"> (cooldown: {alert.cooldownMinutes >= 60 ? `${alert.cooldownMinutes / 60}h` : `${alert.cooldownMinutes}min`})</span>
                            )}
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
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-amber-500" />
              Alertas Disparados
            </h2>
            <div className="grid gap-4">
              {triggeredAlerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-amber-500 opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{alert.ticker}</span>
                            <Badge variant="secondary">Disparado</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {alert.alertType === "percent" 
                              ? `Variação alvo: ${parseFloat(alert.targetPercent || "0").toFixed(1)}%`
                              : `Preço-alvo: R$ ${parseFloat(alert.targetPrice || "0").toFixed(2)}`}
                            {alert.triggeredAt && (
                              <span className="ml-2">
                                • {new Date(alert.triggeredAt).toLocaleDateString("pt-BR")}
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
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {alerts?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum alerta criado</h3>
              <p className="text-muted-foreground mb-4">
                Crie alertas para ser notificado quando ativos atingirem seus preços-alvo.
              </p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeiro Alerta
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Como funcionam os alertas?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="p-2 bg-primary/10 rounded-lg h-fit">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">1. Crie o alerta</h4>
                  <p className="text-sm text-muted-foreground">
                    Defina o ticker, preço-alvo e se quer ser alertado quando subir ou cair.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 bg-primary/10 rounded-lg h-fit">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">2. Monitoramento</h4>
                  <p className="text-sm text-muted-foreground">
                    O sistema verifica os preços periodicamente e compara com seus alertas.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 bg-primary/10 rounded-lg h-fit">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">3. Notificação</h4>
                  <p className="text-sm text-muted-foreground">
                    Quando o preço atingir seu alvo, você recebe uma notificação.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
