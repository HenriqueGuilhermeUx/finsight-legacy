import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Activity, 
  Plus, 
  Trash2, 
  Bell, 
  BellOff, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown,
  Clock,
  History,
  AlertTriangle,
  Zap,
  Info,
  Building2,
  Factory
} from "lucide-react";
import { Link } from "wouter";

export default function AlertasVolatilidade() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("criar");
  
  // Form state
  const [ticker, setTicker] = useState("");
  const [thresholdPercent, setThresholdPercent] = useState("5");
  const [timeWindowMinutes, setTimeWindowMinutes] = useState("60");
  const [direction, setDirection] = useState<"up" | "down" | "both">("both");
  const [cooldownMinutes, setCooldownMinutes] = useState("30");
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  
  // Test volatility state
  const [testTicker, setTestTicker] = useState("");
  const [testWindow, setTestWindow] = useState("60");
  
  // Sector alert form state
  const [selectedSector, setSelectedSector] = useState("");
  const [sectorThreshold, setSectorThreshold] = useState("3");
  const [sectorDirection, setSectorDirection] = useState<"up" | "down" | "both">("both");
  const [sectorCooldown, setSectorCooldown] = useState("60");
  const [sectorNotifyPush, setSectorNotifyPush] = useState(true);
  
  // Test sector state
  const [testSector, setTestSector] = useState("");
  
  // Divergence alert form state
  const [divTicker, setDivTicker] = useState("");
  const [divSector, setDivSector] = useState("");
  const [divThreshold, setDivThreshold] = useState("5");
  const [divDirection, setDivDirection] = useState<"ticker_up_sector_down" | "ticker_down_sector_up" | "both">("both");
  const [divCooldown, setDivCooldown] = useState("60");
  const [divNotifyPush, setDivNotifyPush] = useState(true);
  
  // Test divergence state
  const [testDivTicker, setTestDivTicker] = useState("");
  const [testDivSector, setTestDivSector] = useState("");
  
  const utils = trpc.useUtils();
  
  // Queries
  const { data: alerts, isLoading: alertsLoading } = trpc.volatilityAlerts.list.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: history, isLoading: historyLoading } = trpc.volatilityAlerts.history.useQuery(
    { limit: 50 },
    { enabled: !!user && activeTab === "historico" }
  );
  
  const { data: stats } = trpc.volatilityAlerts.stats.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: volatilityCheck, isLoading: checkingVolatility, refetch: checkVolatility } = 
    trpc.volatilityAlerts.checkVolatility.useQuery(
      { ticker: testTicker, timeWindowMinutes: parseInt(testWindow) },
      { enabled: false }
    );
  
  // Sector queries
  const { data: sectorAlerts, isLoading: sectorAlertsLoading } = trpc.sectorVolatilityAlerts.list.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: availableSectors } = trpc.sectorVolatilityAlerts.availableSectors.useQuery();
  
  const { data: sectorHistory, isLoading: sectorHistoryLoading } = trpc.sectorVolatilityAlerts.history.useQuery(
    { limit: 50 },
    { enabled: !!user && activeTab === "historico" }
  );
  
  const { data: sectorVolatilityCheck, isLoading: checkingSectorVolatility, refetch: checkSectorVolatility } = 
    trpc.sectorVolatilityAlerts.checkSectorVolatility.useQuery(
      { sector: testSector },
      { enabled: false }
    );
  
  // Divergence queries
  const { data: divergenceAlerts, isLoading: divergenceAlertsLoading } = trpc.divergenceAlerts.list.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: divergenceHistory, isLoading: divergenceHistoryLoading } = trpc.divergenceAlerts.history.useQuery(
    { limit: 50 },
    { enabled: !!user && activeTab === "historico" }
  );
  
  const { data: divergenceCheck, isLoading: checkingDivergence, refetch: checkDivergence } = 
    trpc.divergenceAlerts.checkDivergence.useQuery(
      { ticker: testDivTicker, sector: testDivSector },
      { enabled: false }
    );
  
  // Mutations
  const createMutation = trpc.volatilityAlerts.create.useMutation({
    onSuccess: () => {
      toast.success("Alerta de volatilidade criado!");
      utils.volatilityAlerts.list.invalidate();
      setTicker("");
      setThresholdPercent("5");
      setTimeWindowMinutes("60");
      setDirection("both");
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  const updateMutation = trpc.volatilityAlerts.update.useMutation({
    onSuccess: () => {
      toast.success("Alerta atualizado!");
      utils.volatilityAlerts.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  const checkAndTriggerMutation = trpc.volatilityAlerts.checkAndTriggerAlerts.useMutation({
    onSuccess: (data) => {
      if (data.triggered > 0) {
        toast.success(`${data.triggered} alerta(s) disparado(s)! Verifique suas notificações.`);
        data.alerts.forEach(alert => {
          toast.info(`${alert.ticker}: ${alert.direction === "up" ? "+" : ""}${alert.percentChange}%`);
        });
      } else {
        toast.info(`${data.checked} alerta(s) verificado(s). Nenhum threshold atingido.`);
      }
      utils.volatilityAlerts.list.invalidate();
      utils.volatilityAlerts.history.invalidate();
      utils.volatilityAlerts.stats.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao verificar alertas: ${error.message}`);
    },
  });
  
  const deleteMutation = trpc.volatilityAlerts.delete.useMutation({
    onSuccess: () => {
      toast.success("Alerta removido!");
      utils.volatilityAlerts.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  // Sector mutations
  const createSectorMutation = trpc.sectorVolatilityAlerts.create.useMutation({
    onSuccess: () => {
      toast.success("Alerta de setor criado!");
      utils.sectorVolatilityAlerts.list.invalidate();
      setSelectedSector("");
      setSectorThreshold("3");
      setSectorDirection("both");
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  const updateSectorMutation = trpc.sectorVolatilityAlerts.update.useMutation({
    onSuccess: () => {
      toast.success("Alerta de setor atualizado!");
      utils.sectorVolatilityAlerts.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  const deleteSectorMutation = trpc.sectorVolatilityAlerts.delete.useMutation({
    onSuccess: () => {
      toast.success("Alerta de setor removido!");
      utils.sectorVolatilityAlerts.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  const checkSectorAlertsMutation = trpc.sectorVolatilityAlerts.checkAndTriggerAlerts.useMutation({
    onSuccess: (data) => {
      if (data.triggered > 0) {
        toast.success(`${data.triggered} alerta(s) de setor disparado(s)!`);
        data.alerts.forEach(alert => {
          toast.info(`${alert.sector}: ${alert.direction === "up" ? "+" : ""}${alert.avgChange}%`);
        });
      } else {
        toast.info(`${data.checked} alerta(s) de setor verificado(s). Nenhum threshold atingido.`);
      }
      utils.sectorVolatilityAlerts.list.invalidate();
      utils.sectorVolatilityAlerts.history.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao verificar alertas de setor: ${error.message}`);
    },
  });
  
  // Divergence mutations
  const createDivergenceMutation = trpc.divergenceAlerts.create.useMutation({
    onSuccess: () => {
      toast.success("Alerta de divergência criado!");
      utils.divergenceAlerts.list.invalidate();
      setDivTicker("");
      setDivSector("");
      setDivThreshold("5");
      setDivDirection("both");
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  const updateDivergenceMutation = trpc.divergenceAlerts.update.useMutation({
    onSuccess: () => {
      toast.success("Alerta de divergência atualizado!");
      utils.divergenceAlerts.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  const deleteDivergenceMutation = trpc.divergenceAlerts.delete.useMutation({
    onSuccess: () => {
      toast.success("Alerta de divergência removido!");
      utils.divergenceAlerts.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  const checkDivergenceAlertsMutation = trpc.divergenceAlerts.checkAndTriggerAlerts.useMutation({
    onSuccess: (data) => {
      if (data.triggered > 0) {
        toast.success(`${data.triggered} alerta(s) de divergência disparado(s)!`);
        data.alerts.forEach(alert => {
          toast.info(`${alert.ticker} vs ${alert.sector}: divergência de ${alert.divergence >= 0 ? "+" : ""}${alert.divergence}%`);
        });
      } else {
        toast.info(`${data.checked} alerta(s) de divergência verificado(s). Nenhum threshold atingido.`);
      }
      utils.divergenceAlerts.list.invalidate();
      utils.divergenceAlerts.history.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao verificar alertas de divergência: ${error.message}`);
    },
  });
  
  const handleCreate = () => {
    if (!ticker.trim()) {
      toast.error("Digite o ticker do ativo");
      return;
    }
    
    createMutation.mutate({
      ticker: ticker.trim().toUpperCase(),
      thresholdPercent: parseFloat(thresholdPercent),
      timeWindowMinutes: parseInt(timeWindowMinutes),
      direction,
      cooldownMinutes: parseInt(cooldownMinutes),
      notifyPush,
      notifyEmail,
    });
  };
  
  const handleToggleActive = (id: number, currentActive: boolean) => {
    updateMutation.mutate({ id, isActive: !currentActive });
  };
  
  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este alerta?")) {
      deleteMutation.mutate({ id });
    }
  };
  
  const handleCheckVolatility = () => {
    if (!testTicker.trim()) {
      toast.error("Digite o ticker do ativo");
      return;
    }
    checkVolatility();
  };
  
  const handleCreateSectorAlert = () => {
    if (!selectedSector) {
      toast.error("Selecione um setor");
      return;
    }
    
    createSectorMutation.mutate({
      sector: selectedSector,
      thresholdPercent: parseFloat(sectorThreshold),
      timeWindowMinutes: 60, // Fixed to 1 hour for sectors
      direction: sectorDirection,
      cooldownMinutes: parseInt(sectorCooldown),
      notifyPush: sectorNotifyPush,
      notifyEmail: false,
    });
  };
  
  const handleToggleSectorActive = (id: number, currentActive: boolean) => {
    updateSectorMutation.mutate({ id, isActive: !currentActive });
  };
  
  const handleDeleteSectorAlert = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este alerta de setor?")) {
      deleteSectorMutation.mutate({ id });
    }
  };
  
  const handleCheckSectorVolatility = () => {
    if (!testSector) {
      toast.error("Selecione um setor");
      return;
    }
    checkSectorVolatility();
  };
  
  const handleCreateDivergenceAlert = () => {
    if (!divTicker.trim()) {
      toast.error("Digite o ticker do ativo");
      return;
    }
    if (!divSector) {
      toast.error("Selecione um setor");
      return;
    }
    
    createDivergenceMutation.mutate({
      ticker: divTicker.toUpperCase(),
      sector: divSector,
      divergenceThreshold: parseFloat(divThreshold),
      direction: divDirection,
      cooldownMinutes: parseInt(divCooldown),
      notifyPush: divNotifyPush,
    });
  };
  
  const handleToggleDivergenceActive = (id: number, currentActive: boolean) => {
    updateDivergenceMutation.mutate({ id, isActive: !currentActive });
  };
  
  const handleDeleteDivergenceAlert = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este alerta de divergência?")) {
      deleteDivergenceMutation.mutate({ id });
    }
  };
  
  const handleCheckDivergence = () => {
    if (!testDivTicker.trim()) {
      toast.error("Digite o ticker do ativo");
      return;
    }
    if (!testDivSector) {
      toast.error("Selecione um setor");
      return;
    }
    checkDivergence();
  };
  
  const getDivergenceDirectionLabel = (dir: string) => {
    switch (dir) {
      case "ticker_up_sector_down": return "Ativo ↑ Setor ↓";
      case "ticker_down_sector_up": return "Ativo ↓ Setor ↑";
      default: return "Ambos";
    }
  };
  
  const formatTimeWindow = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    if (minutes === 60) return "1 hora";
    if (minutes < 1440) return `${Math.floor(minutes / 60)} horas`;
    return "24 horas";
  };
  
  const getDirectionLabel = (dir: string) => {
    switch (dir) {
      case "up": return "Alta";
      case "down": return "Baixa";
      default: return "Ambos";
    }
  };
  
  const getDirectionIcon = (dir: string) => {
    switch (dir) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <ArrowUpDown className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  if (authLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container py-8">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Alertas de Volatilidade
            </CardTitle>
            <CardDescription>
              Receba notificações quando um ativo tiver variação acima de X% em um curto período.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Faça login para criar alertas de volatilidade personalizados.
            </p>
            <Button asChild>
              <a href={getLoginUrl()}>Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Alertas de Volatilidade
          </h1>
          <p className="text-muted-foreground mt-1">
            Seja notificado quando um ativo tiver grande variação em curto período
          </p>
        </div>
        
        {stats && (
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{alerts?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Alertas Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{stats.upCount}</div>
              <div className="text-xs text-muted-foreground">Altas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{stats.downCount}</div>
              <div className="text-xs text-muted-foreground">Baixas</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Info Banner */}
      <Card className="mb-6 bg-blue-500/10 border-blue-500/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-500">Como funciona?</p>
              <p className="text-sm text-muted-foreground">
                Alertas de volatilidade monitoram a variação percentual de um ativo dentro de uma janela de tempo. 
                Por exemplo: "Avisar quando PETR4 variar mais de 5% em 1 hora". Ideal para day traders e swing traders 
                que querem capturar movimentos bruscos do mercado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="criar" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Criar Alerta
          </TabsTrigger>
          <TabsTrigger value="meus" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Meus Alertas ({alerts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="testar" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Testar
          </TabsTrigger>
          <TabsTrigger value="setores" className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
            Por Setor ({sectorAlerts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="divergencia" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Divergência ({divergenceAlerts?.length || 0})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="criar">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Novo Alerta de Volatilidade</CardTitle>
                <CardDescription>
                  Configure quando você quer ser notificado sobre movimentos bruscos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticker">Ticker do Ativo</Label>
                  <Input
                    id="ticker"
                    placeholder="Ex: PETR4, AAPL, BTC"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Variação Mínima (%)</Label>
                    <Input
                      id="threshold"
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      value={thresholdPercent}
                      onChange={(e) => setThresholdPercent(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="window">Janela de Tempo</Label>
                    <Select value={timeWindowMinutes} onValueChange={setTimeWindowMinutes}>
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
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="direction">Direção</Label>
                    <Select value={direction} onValueChange={(v) => setDirection(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Ambos (Alta e Baixa)</SelectItem>
                        <SelectItem value="up">Apenas Alta</SelectItem>
                        <SelectItem value="down">Apenas Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cooldown">Cooldown</Label>
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificação Push</Label>
                      <p className="text-xs text-muted-foreground">Receber no navegador/app</p>
                    </div>
                    <Switch checked={notifyPush} onCheckedChange={setNotifyPush} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificação por Email</Label>
                      <p className="text-xs text-muted-foreground">Receber no email cadastrado</p>
                    </div>
                    <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Criando..." : "Criar Alerta"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Exemplos de Uso</CardTitle>
                <CardDescription>
                  Cenários comuns para alertas de volatilidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Day Trade - Scalping</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    PETR4 variando 2% em 15 minutos. Ideal para capturar movimentos rápidos 
                    durante o pregão.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Swing Trade - Breakout</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    VALE3 subindo 5% em 1 hora. Pode indicar rompimento de resistência 
                    ou notícia relevante.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Proteção - Stop Loss</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    BTC caindo 10% em 4 horas. Alerta de queda acentuada para 
                    proteger posições ou identificar oportunidades.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpDown className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Alta Volatilidade</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    MGLU3 variando 8% em qualquer direção em 2 horas. Útil para 
                    ativos com alta volatilidade histórica.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="meus">
          {/* Botão de verificar alertas */}
          {alerts && alerts.length > 0 && (
            <div className="mb-4 flex justify-end">
              <Button
                onClick={() => checkAndTriggerMutation.mutate()}
                disabled={checkAndTriggerMutation.isPending}
                variant="outline"
                className="gap-2"
              >
                {checkAndTriggerMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Verificar Alertas Agora
              </Button>
            </div>
          )}
          
          {alertsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !alerts?.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Nenhum alerta configurado</h3>
                <p className="text-muted-foreground mb-4">
                  Crie seu primeiro alerta de volatilidade para ser notificado sobre movimentos bruscos.
                </p>
                <Button onClick={() => setActiveTab("criar")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Alerta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {alerts.map((alert) => (
                <Card key={alert.id} className={!alert.isActive ? "opacity-60" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {alert.ticker}
                        {getDirectionIcon(alert.direction)}
                      </CardTitle>
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => handleToggleActive(alert.id, alert.isActive)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Variação mínima:</span>
                        <Badge variant="outline">{alert.thresholdPercent}%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Janela de tempo:</span>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeWindow(alert.timeWindowMinutes)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Direção:</span>
                        <Badge variant="secondary">{getDirectionLabel(alert.direction)}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Cooldown:</span>
                        <span>{formatTimeWindow(alert.cooldownMinutes)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Disparos:</span>
                        <span>{alert.triggerCount}x</span>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        {alert.notifyPush && (
                          <Badge variant="outline" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            Push
                          </Badge>
                        )}
                        {alert.notifyEmail && (
                          <Badge variant="outline" className="text-xs">
                            Email
                          </Badge>
                        )}
                      </div>
                      
                      {alert.lastTriggeredAt && (
                        <p className="text-xs text-muted-foreground">
                          Último disparo: {new Date(alert.lastTriggeredAt).toLocaleString("pt-BR")}
                        </p>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleDelete(alert.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="historico">
          {historyLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !history?.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Nenhum alerta disparado ainda</h3>
                <p className="text-muted-foreground">
                  Quando seus alertas de volatilidade forem acionados, eles aparecerão aqui.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Alertas Disparados</CardTitle>
                <CardDescription>
                  Últimos {history.length} alertas de volatilidade acionados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        {item.direction === "up" ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium">{item.ticker}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatTimeWindow(item.timeWindowMinutes)} • Limite: {item.thresholdPercent}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          item.direction === "up" ? "text-green-500" : "text-red-500"
                        }`}>
                          {item.direction === "up" ? "+" : ""}{item.actualPercent}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.triggeredAt).toLocaleString("pt-BR")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="testar">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Verificar Volatilidade Atual</CardTitle>
                <CardDescription>
                  Teste a volatilidade de um ativo antes de criar um alerta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testTicker">Ticker do Ativo</Label>
                  <Input
                    id="testTicker"
                    placeholder="Ex: PETR4, AAPL, BTC"
                    value={testTicker}
                    onChange={(e) => setTestTicker(e.target.value.toUpperCase())}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="testWindow">Janela de Tempo</Label>
                  <Select value={testWindow} onValueChange={setTestWindow}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="240">4 horas</SelectItem>
                      <SelectItem value="480">8 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleCheckVolatility}
                  disabled={checkingVolatility}
                >
                  {checkingVolatility ? "Verificando..." : "Verificar Volatilidade"}
                </Button>
              </CardContent>
            </Card>
            
            {volatilityCheck && !("error" in volatilityCheck) && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultado: {volatilityCheck.ticker}</CardTitle>
                  <CardDescription>
                    Volatilidade nos últimos {formatTimeWindow(volatilityCheck.timeWindowMinutes)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <div className="text-sm text-muted-foreground">Preço Inicial</div>
                        <div className="text-lg font-bold">
                          R$ {volatilityCheck.startPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <div className="text-sm text-muted-foreground">Preço Atual</div>
                        <div className="text-lg font-bold">
                          R$ {volatilityCheck.currentPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm text-muted-foreground mb-1">Variação no Período</div>
                      <div className={`text-3xl font-bold ${
                        volatilityCheck.percentChange >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {volatilityCheck.percentChange >= 0 ? "+" : ""}{volatilityCheck.percentChange}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-green-500/10 text-center">
                        <div className="text-sm text-muted-foreground">Máxima Alta</div>
                        <div className="text-lg font-bold text-green-500">
                          +{volatilityCheck.maxUp}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          R$ {volatilityCheck.highPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-red-500/10 text-center">
                        <div className="text-sm text-muted-foreground">Máxima Baixa</div>
                        <div className="text-lg font-bold text-red-500">
                          {volatilityCheck.maxDown}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          R$ {volatilityCheck.lowPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Baseado em {volatilityCheck.dataPoints} pontos de dados
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {volatilityCheck && "error" in volatilityCheck && (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                  <h3 className="text-lg font-medium mb-2">Erro ao verificar</h3>
                  <p className="text-muted-foreground">{volatilityCheck.error}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="setores">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Criar alerta de setor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Novo Alerta por Setor
                </CardTitle>
                <CardDescription>
                  Receba alertas quando um setor inteiro variar acima do threshold
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSectors?.map((sector) => (
                        <SelectItem key={sector.id} value={sector.name}>
                          {sector.name} ({sector.tickers.length} ativos)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedSector && availableSectors && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-2">Ativos do setor:</p>
                    <div className="flex flex-wrap gap-1">
                      {availableSectors.find(s => s.name === selectedSector)?.tickers.map(ticker => (
                        <Badge key={ticker} variant="outline" className="text-xs">{ticker}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Variação Mínima (%)</Label>
                    <Input
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      value={sectorThreshold}
                      onChange={(e) => setSectorThreshold(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cooldown</Label>
                    <Select value={sectorCooldown} onValueChange={setSectorCooldown}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                        <SelectItem value="240">4 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Direção</Label>
                  <Select value={sectorDirection} onValueChange={(v) => setSectorDirection(v as "up" | "down" | "both")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Ambos (Alta ou Baixa)</SelectItem>
                      <SelectItem value="up">Apenas Alta</SelectItem>
                      <SelectItem value="down">Apenas Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Notificação Push</Label>
                  <Switch checked={sectorNotifyPush} onCheckedChange={setSectorNotifyPush} />
                </div>
                
                <Button 
                  onClick={handleCreateSectorAlert} 
                  disabled={createSectorMutation.isPending || !selectedSector}
                  className="w-full"
                >
                  {createSectorMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Criar Alerta de Setor
                </Button>
              </CardContent>
            </Card>
            
            {/* Testar volatilidade do setor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Testar Volatilidade do Setor
                </CardTitle>
                <CardDescription>
                  Veja a volatilidade atual de um setor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Select value={testSector} onValueChange={setTestSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSectors?.map((sector) => (
                        <SelectItem key={sector.id} value={sector.name}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleCheckSectorVolatility} 
                  disabled={checkingSectorVolatility || !testSector}
                  className="w-full"
                >
                  {checkingSectorVolatility ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Verificar Setor
                </Button>
                
                {sectorVolatilityCheck && !("error" in sectorVolatilityCheck) && (
                  <div className="space-y-4 mt-4">
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm text-muted-foreground mb-1">Variação Média do Setor</div>
                      <div className={`text-3xl font-bold ${
                        sectorVolatilityCheck.avgChange >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {sectorVolatilityCheck.avgChange >= 0 ? "+" : ""}{sectorVolatilityCheck.avgChange}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {sectorVolatilityCheck.tickerCount} ativos analisados
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-green-500/10">
                        <p className="text-xs text-muted-foreground mb-2">Maiores Altas</p>
                        {sectorVolatilityCheck.topGainers.map((t: any) => (
                          <div key={t.ticker} className="flex justify-between text-sm">
                            <span className="font-mono">{t.ticker}</span>
                            <span className="text-green-500">+{t.change}%</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 rounded-lg bg-red-500/10">
                        <p className="text-xs text-muted-foreground mb-2">Maiores Baixas</p>
                        {sectorVolatilityCheck.topLosers.map((t: any) => (
                          <div key={t.ticker} className="flex justify-between text-sm">
                            <span className="font-mono">{t.ticker}</span>
                            <span className="text-red-500">{t.change}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {sectorVolatilityCheck && "error" in sectorVolatilityCheck && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 text-center">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm text-muted-foreground">{sectorVolatilityCheck.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Lista de alertas de setor */}
          {sectorAlerts && sectorAlerts.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Meus Alertas de Setor</h3>
                <Button
                  onClick={() => checkSectorAlertsMutation.mutate()}
                  disabled={checkSectorAlertsMutation.isPending}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {checkSectorAlertsMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  Verificar Alertas
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sectorAlerts.map((alert) => (
                  <Card key={alert.id} className={!alert.isActive ? "opacity-60" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Factory className="h-4 w-4" />
                          {alert.sector}
                        </CardTitle>
                        <Switch
                          checked={alert.isActive}
                          onCheckedChange={() => handleToggleSectorActive(alert.id, alert.isActive)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Variação mínima:</span>
                          <Badge variant="outline">{alert.thresholdPercent}%</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Direção:</span>
                          <div className="flex items-center gap-1">
                            {getDirectionIcon(alert.direction)}
                            <span>{getDirectionLabel(alert.direction)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Disparos:</span>
                          <Badge variant="secondary">{alert.triggerCount || 0}</Badge>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDeleteSectorAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="divergencia">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Create Divergence Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5" />
                  Criar Alerta de Divergência
                </CardTitle>
                <CardDescription>
                  Seja notificado quando um ativo divergir do comportamento do seu setor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Ticker do Ativo</Label>
                  <Input
                    placeholder="Ex: PETR4"
                    value={divTicker}
                    onChange={(e) => setDivTicker(e.target.value.toUpperCase())}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Setor de Referência</Label>
                  <Select value={divSector} onValueChange={setDivSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSectors?.map((sector) => (
                        <SelectItem key={sector.id} value={sector.name}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Threshold de Divergência (%)</Label>
                  <Select value={divThreshold} onValueChange={setDivThreshold}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="7">7%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Alertar quando a diferença entre ativo e setor for maior que este valor
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo de Divergência</Label>
                  <Select value={divDirection} onValueChange={(v) => setDivDirection(v as typeof divDirection)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Qualquer Divergência</SelectItem>
                      <SelectItem value="ticker_up_sector_down">Ativo ↑ enquanto Setor ↓</SelectItem>
                      <SelectItem value="ticker_down_sector_up">Ativo ↓ enquanto Setor ↑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Cooldown</Label>
                  <Select value={divCooldown} onValueChange={setDivCooldown}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="240">4 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Notificação Push</Label>
                  <Switch checked={divNotifyPush} onCheckedChange={setDivNotifyPush} />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleCreateDivergenceAlert}
                  disabled={createDivergenceMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Alerta de Divergência
                </Button>
              </CardContent>
            </Card>
            
            {/* Test Divergence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Testar Divergência
                </CardTitle>
                <CardDescription>
                  Verifique a divergência atual entre um ativo e seu setor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Ticker</Label>
                  <Input
                    placeholder="Ex: VALE3"
                    value={testDivTicker}
                    onChange={(e) => setTestDivTicker(e.target.value.toUpperCase())}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Select value={testDivSector} onValueChange={setTestDivSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSectors?.map((sector) => (
                        <SelectItem key={sector.id} value={sector.name}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleCheckDivergence}
                  disabled={checkingDivergence}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Verificar Divergência
                </Button>
                
                {divergenceCheck && !('error' in divergenceCheck) && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{divergenceCheck.ticker}</span>
                      <Badge className={divergenceCheck.tickerChange >= 0 ? "bg-green-500" : "bg-red-500"}>
                        {divergenceCheck.tickerChange >= 0 ? "+" : ""}{divergenceCheck.tickerChange}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{divergenceCheck.sector}</span>
                      <Badge variant="outline" className={divergenceCheck.sectorChange >= 0 ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}>
                        {divergenceCheck.sectorChange >= 0 ? "+" : ""}{divergenceCheck.sectorChange}%
                      </Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Divergência:</span>
                        <Badge className={Math.abs(divergenceCheck.divergence) >= 5 ? "bg-yellow-500" : "bg-gray-500"}>
                          {divergenceCheck.divergence >= 0 ? "+" : ""}{divergenceCheck.divergence}%
                        </Badge>
                      </div>
                      {divergenceCheck.isDiverging && (
                        <p className="text-xs text-yellow-500 mt-2">
                          ⚠️ Divergência significativa detectada!
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {divergenceCheck && 'error' in divergenceCheck && (
                  <div className="mt-4 p-4 rounded-lg bg-red-500/10 text-red-500">
                    {divergenceCheck.error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Divergence Alerts List */}
          {divergenceAlerts && divergenceAlerts.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Meus Alertas de Divergência</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => checkDivergenceAlertsMutation.mutate()}
                  disabled={checkDivergenceAlertsMutation.isPending}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Verificar Todos
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {divergenceAlerts.map((alert) => (
                  <Card key={alert.id} className={!alert.isActive ? "opacity-60" : ""}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">{alert.ticker}</Badge>
                          <span className="text-muted-foreground">vs</span>
                          <Badge variant="secondary">{alert.sector}</Badge>
                        </div>
                        <Switch
                          checked={alert.isActive}
                          onCheckedChange={() => handleToggleDivergenceActive(alert.id, alert.isActive)}
                        />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Threshold:</span>
                          <span>±{alert.divergenceThreshold}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span>{getDivergenceDirectionLabel(alert.direction)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cooldown:</span>
                          <span>{formatTimeWindow(alert.cooldownMinutes)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Disparos:</span>
                          <Badge variant="secondary">{alert.triggerCount || 0}</Badge>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDeleteDivergenceAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Divergence History */}
          {divergenceHistory && divergenceHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Histórico de Divergências</h3>
              <div className="space-y-2">
                {divergenceHistory.slice(0, 10).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">{item.ticker}</Badge>
                      <span className="text-muted-foreground">vs</span>
                      <span>{item.sector}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <div className={parseFloat(item.tickerChange) >= 0 ? "text-green-500" : "text-red-500"}>
                          Ativo: {parseFloat(item.tickerChange) >= 0 ? "+" : ""}{item.tickerChange}%
                        </div>
                        <div className={parseFloat(item.sectorChange) >= 0 ? "text-green-500" : "text-red-500"}>
                          Setor: {parseFloat(item.sectorChange) >= 0 ? "+" : ""}{item.sectorChange}%
                        </div>
                      </div>
                      <Badge className="bg-yellow-500">
                        Div: {parseFloat(item.divergence) >= 0 ? "+" : ""}{item.divergence}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.triggeredAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Link to Correlation Page */}
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">Análise de Correlação</p>
                    <p className="text-sm text-muted-foreground">
                      Veja como os setores se correlacionam entre si para entender melhor as divergências.
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href="/correlacao-setores">Ver Correlações</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Disclaimer */}
      <Card className="mt-8 bg-yellow-500/10 border-yellow-500/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-500">Aviso Legal</p>
              <p className="text-sm text-muted-foreground">
                Os alertas de volatilidade são ferramentas informativas e não constituem recomendação de investimento. 
                Decisões de compra e venda devem ser tomadas com base em análise própria e/ou consultoria profissional. 
                O FinSight não se responsabiliza por perdas decorrentes do uso desta ferramenta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
