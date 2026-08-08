import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Bell, BellOff, Plus, Trash2, TrendingUp, TrendingDown, AlertCircle, RefreshCw, RotateCcw } from "lucide-react";
import { getLoginUrl } from "@/const";
import MainLayout from "@/components/MainLayout";

export default function Alertas() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [newAlert, setNewAlert] = useState({
    ticker: "",
    assetName: "",
    assetType: "stock" as "stock" | "etf" | "crypto",
    targetPrice: "",
    condition: "above" as "above" | "below",
  });

  const { data: alerts, refetch } = trpc.alerts.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createAlert = trpc.alerts.create.useMutation({
    onSuccess: () => {
      toast.success("Alerta criado com sucesso!");
      setIsDialogOpen(false);
      setNewAlert({
        ticker: "",
        assetName: "",
        assetType: "stock",
        targetPrice: "",
        condition: "above",
      });
      refetch();
    },
    onError: () => {
      toast.error("Erro ao criar alerta");
    },
  });

  const deleteAlert = trpc.alerts.delete.useMutation({
    onSuccess: () => {
      toast.success("Alerta removido");
      refetch();
    },
  });

  const toggleAlert = trpc.alerts.toggle.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const checkAlerts = trpc.alerts.checkAndNotify.useMutation({
    onSuccess: (data) => {
      setIsChecking(false);
      if (data.triggered > 0) {
        toast.success(`${data.triggered} alerta(s) disparado(s)! Verifique suas notificações.`);
      } else {
        toast.info("Nenhum alerta atingiu o preço alvo ainda.");
      }
      refetch();
    },
    onError: () => {
      setIsChecking(false);
      toast.error("Erro ao verificar alertas");
    },
  });

  const resetAlert = trpc.alerts.reset.useMutation({
    onSuccess: () => {
      toast.success("Alerta resetado");
      refetch();
    },
  });

  const handleCreateAlert = () => {
    if (!newAlert.ticker || !newAlert.targetPrice) {
      toast.error("Preencha todos os campos");
      return;
    }
    createAlert.mutate({
      ticker: newAlert.ticker,
      assetName: newAlert.assetName || newAlert.ticker,
      assetType: newAlert.assetType,
      targetPrice: parseFloat(newAlert.targetPrice),
      condition: newAlert.condition,
    });
  };

  const handleCheckAlerts = () => {
    setIsChecking(true);
    checkAlerts.mutate();
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container py-12">
          <Card className="max-w-lg mx-auto bg-slate-800/50 border-slate-700">
            <CardContent className="pt-8 text-center">
              <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Login Necessário</h2>
              <p className="text-slate-400 mb-6">
                Faça login para criar alertas de preço e receber notificações quando seus ativos atingirem o valor desejado.
              </p>
              <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                <a href={getLoginUrl()}>Fazer Login</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const activeAlerts = alerts?.filter(a => !a.isTriggered) || [];
  const triggeredAlerts = alerts?.filter(a => a.isTriggered) || [];

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bell className="h-8 w-8 text-cyan-500" />
              Alertas de Preço
            </h1>
            <p className="text-slate-400 mt-2">
              Receba notificações quando seus ativos atingirem o preço desejado.
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleCheckAlerts} 
              disabled={isChecking || !alerts?.length}
              variant="outline"
              className="border-cyan-600 text-cyan-500 hover:bg-cyan-600/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Verificar Agora
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Alerta
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Criar Alerta de Preço</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Ticker do Ativo</label>
                    <Input
                      placeholder="Ex: PETR4, AAPL, BTC"
                      value={newAlert.ticker}
                      onChange={(e) => setNewAlert({ ...newAlert, ticker: e.target.value.toUpperCase() })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Nome do Ativo (opcional)</label>
                    <Input
                      placeholder="Ex: Petrobras"
                      value={newAlert.assetName}
                      onChange={(e) => setNewAlert({ ...newAlert, assetName: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Tipo de Ativo</label>
                    <Select
                      value={newAlert.assetType}
                      onValueChange={(v) => setNewAlert({ ...newAlert, assetType: v as any })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="stock">Ação</SelectItem>
                        <SelectItem value="etf">ETF</SelectItem>
                        <SelectItem value="crypto">Criptomoeda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Condição</label>
                    <Select
                      value={newAlert.condition}
                      onValueChange={(v) => setNewAlert({ ...newAlert, condition: v as any })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="above">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            Acima de
                          </div>
                        </SelectItem>
                        <SelectItem value="below">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            Abaixo de
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Preço Alvo</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 35.50"
                      value={newAlert.targetPrice}
                      onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleCreateAlert}
                    disabled={createAlert.isPending}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    {createAlert.isPending ? "Criando..." : "Criar Alerta"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Triggered Alerts Section */}
        {triggeredAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-amber-500 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alertas Disparados ({triggeredAlerts.length})
            </h2>
            <div className="grid gap-4">
              {triggeredAlerts.map((alert) => (
                <Card key={alert.id} className="bg-amber-500/10 border-amber-500/30">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${alert.condition === 'above' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                          {alert.condition === 'above' ? (
                            <TrendingUp className="h-6 w-6 text-emerald-500" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-red-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">{alert.ticker}</span>
                            <Badge className="bg-amber-500/20 text-amber-500">Disparado</Badge>
                          </div>
                          <p className="text-slate-400 text-sm">
                            {alert.assetName || alert.ticker}
                            {alert.triggeredAt && (
                              <span className="ml-2 text-amber-500/70">
                                • {new Date(alert.triggeredAt).toLocaleString('pt-BR')}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-slate-400">
                            {alert.condition === 'above' ? 'Acima de' : 'Abaixo de'}
                          </p>
                          <p className="text-xl font-bold text-white">
                            {alert.alertType === "percent" 
                              ? `${parseFloat(alert.targetPercent || "0").toFixed(1)}%`
                              : `R$ ${parseFloat(alert.targetPrice || "0").toFixed(2)}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resetAlert.mutate({ id: alert.id })}
                            className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reativar
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAlert.mutate({ id: alert.id })}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active Alerts Section */}
        {activeAlerts.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Alertas Ativos ({activeAlerts.length})
            </h2>
            <div className="grid gap-4">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className={`bg-slate-800/50 border-slate-700 ${!alert.isActive ? 'opacity-60' : ''}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${alert.condition === 'above' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                          {alert.condition === 'above' ? (
                            <TrendingUp className="h-6 w-6 text-emerald-500" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-red-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">{alert.ticker}</span>
                            <Badge variant="outline" className="text-xs">
                              {alert.assetType === 'stock' ? 'Ação' : alert.assetType === 'etf' ? 'ETF' : 'Cripto'}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm">
                            {alert.assetName || alert.ticker}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-slate-400">
                            {alert.condition === 'above' ? 'Acima de' : 'Abaixo de'}
                          </p>
                          <p className="text-xl font-bold text-white">
                            {alert.alertType === "percent" 
                              ? `${parseFloat(alert.targetPercent || "0").toFixed(1)}%`
                              : `R$ ${parseFloat(alert.targetPrice || "0").toFixed(2)}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={alert.isActive}
                            onCheckedChange={(checked) => toggleAlert.mutate({ id: alert.id, isActive: checked })}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAlert.mutate({ id: alert.id })}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : !triggeredAlerts.length && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center">
              <BellOff className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum alerta configurado</h3>
              <p className="text-slate-400 mb-6">
                Crie alertas para ser notificado quando seus ativos atingirem o preço desejado.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Alerta
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-slate-800/30 border-slate-700">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-cyan-500 mt-0.5" />
              <div className="text-sm text-slate-400">
                <p className="font-medium text-slate-300 mb-1">Como funcionam os alertas?</p>
                <p>
                  Clique em "Verificar Agora" para checar se algum alerta atingiu o preço alvo. 
                  Quando um alerta é disparado, você recebe uma notificação e o alerta é marcado como "Disparado". 
                  Você pode reativar alertas disparados para monitorar novamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
